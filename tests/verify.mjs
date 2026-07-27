import { chromium } from 'playwright';

const APP_URL = process.env.NB_URL ?? 'http://localhost:5173/North-Bay/';
const SHOTS = process.env.NB_SHOTS ?? new URL('./screenshots', import.meta.url).pathname;

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium
  .launch(process.env.NB_CHROMIUM ? {} : { channel: 'chrome' })
  .catch(() => chromium.launch());

// ---------- Desktop ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(String(e)));

await page.goto(APP_URL, { waitUntil: 'networkidle' });

// 1. Page renders
check(
  'page renders h1',
  (await page.locator('h1').count()) > 0,
  await page.locator('h1').first().innerText(),
);

// 2. DARK MODE — the headline fix
// The themed surface is #root's first child (the element carrying bg-zinc-100 dark:bg-zinc-950).
// #root itself has no background, so measuring it would report transparent in both themes and
// the assertion would pass or fail for the wrong reason.
const bgOf = () =>
  page.evaluate(
    () => getComputedStyle(document.getElementById('root').firstElementChild).backgroundColor,
  );
const htmlHasDark = () => page.evaluate(() => document.documentElement.classList.contains('dark'));

const startedDark = await htmlHasDark();
if (startedDark) {
  await page.getByRole('button', { name: /switch to light mode/i }).click();
  await page.waitForTimeout(250);
}
const lightBg = await bgOf();
await page.getByRole('button', { name: /switch to dark mode/i }).click();
await page.waitForTimeout(250);
const darkOn = await htmlHasDark();
const darkBg = await bgOf();
check('dark toggle sets .dark on <html>', darkOn === true, `html.dark=${darkOn}`);
check(
  'dark mode actually repaints background',
  lightBg !== darkBg,
  `light=${lightBg} dark=${darkBg}`,
);
await page.screenshot({ path: `${SHOTS}/desktop-dark.png`, fullPage: false });

// 3. Dark mode persists across reload (localStorage + anti-FOUC script)
await page.reload({ waitUntil: 'networkidle' });
check('dark mode persists after reload', (await htmlHasDark()) === true);

// back to light for the light screenshot
await page.getByRole('button', { name: /switch to light mode/i }).click();
await page.waitForTimeout(250);
await page.screenshot({ path: `${SHOTS}/desktop-light.png`, fullPage: false });

// 4. Search combobox + arrow keys
const search = page.locator('#\\:r0\\:-input, input[role="combobox"]').first();
await search.click();
await search.fill('park');
await page.waitForTimeout(300);
const optionCount = await page.locator('[role="option"]').count();
check('search returns results', optionCount > 0, `${optionCount} options`);

await search.press('ArrowDown');
await page.waitForTimeout(120);
const activeDesc = await search.getAttribute('aria-activedescendant');
check('ArrowDown sets aria-activedescendant', Boolean(activeDesc), String(activeDesc));
const selectedCount = await page.locator('[role="option"][aria-selected="true"]').count();
check('exactly one option aria-selected', selectedCount === 1, `${selectedCount}`);

// ArrowUp from first should wrap to last
await search.press('ArrowUp');
await page.waitForTimeout(120);
const afterUp = await search.getAttribute('aria-activedescendant');
check('ArrowUp wraps from first to last', afterUp !== activeDesc, `${activeDesc} -> ${afterUp}`);

await search.press('Escape');
await page.waitForTimeout(150);
check('Escape closes listbox', (await page.locator('[role="listbox"]').count()) === 0);

// 5. Language toggle
await page.getByRole('button', { name: /switch to french/i }).click();
await page.waitForTimeout(250);
const htmlLang = await page.evaluate(() => document.documentElement.lang);
const heroFr = await page.locator('h1').first().innerText();
check('language toggle sets <html lang>', htmlLang === 'fr', `lang=${htmlLang}`);
check('hero heading translated', /aider/i.test(heroFr), heroFr);
await page.getByRole('button', { name: /switch to english/i }).click();
await page.waitForTimeout(200);

// 6. FOCUS TRAP in the wizard
await page.selectOption('#task-select', 'wizard_business');
await page.waitForTimeout(400);
const dialogVisible = await page.locator('[role="dialog"]').isVisible();
check('wizard dialog opens', dialogVisible);

const focusInsideDialog = () =>
  page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    return dlg ? dlg.contains(document.activeElement) : false;
  });
check('focus moves into dialog on open', await focusInsideDialog());

// Tab 25 times — focus must never escape the dialog
let escaped = false;
for (let i = 0; i < 25; i++) {
  await page.keyboard.press('Tab');
  if (!(await focusInsideDialog())) {
    escaped = true;
    break;
  }
}
check('focus trap holds over 25 Tabs', !escaped);

// Shift+Tab backwards too
for (let i = 0; i < 25; i++) {
  await page.keyboard.press('Shift+Tab');
  if (!(await focusInsideDialog())) {
    escaped = true;
    break;
  }
}
check('focus trap holds over 25 Shift+Tabs', !escaped);
await page.screenshot({ path: `${SHOTS}/desktop-wizard.png` });

// 7. Escape closes dialog and restores focus
await page.keyboard.press('Escape');
await page.waitForTimeout(350);
check('Escape closes wizard', (await page.locator('[role="dialog"]').count()) === 0);

// 8. Skip link is reachable and visible on focus.
// Reload first: focus was restored to the wizard's trigger when the dialog closed, so tabbing
// from there would start mid-page and never reach the skip link. The claim under test is "first
// tab stop on a freshly loaded page", so the page has to actually be freshly loaded.
await page.reload({ waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, 0));
await page.keyboard.press('Tab');
const skipVisible = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || !/skip/i.test(el.textContent || '')) return null;
  const r = el.getBoundingClientRect();
  const z = getComputedStyle(el).zIndex;
  return { w: r.width, h: r.height, z };
});
check(
  'skip link is first tab stop and visible',
  Boolean(skipVisible && skipVisible.w > 0 && skipVisible.h > 0),
  JSON.stringify(skipVisible),
);

// 9. Accessibility statement dialog from footer
await page.getByRole('button', { name: /Accessibilit/i }).click();
await page.waitForTimeout(400);
check('accessibility statement opens', await page.locator('[role="dialog"]').isVisible());
check('a11y dialog focus trapped', await focusInsideDialog());
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// 10. CSV export produces a file
const [download] = await Promise.all([
  page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
  page.getByRole('button', { name: /^CSV$/ }).click(),
]);
check(
  'CSV export downloads',
  download !== null,
  download ? await download.suggestedFilename() : 'no download event',
);

// 11. Landmarks
const landmarks = await page.evaluate(() => ({
  header: document.querySelectorAll('header').length,
  nav: document.querySelectorAll('nav').length,
  main: document.querySelectorAll('main').length,
  footer: document.querySelectorAll('footer').length,
  h1: document.querySelectorAll('h1').length,
}));
check(
  'landmark structure present',
  landmarks.header >= 1 && landmarks.nav >= 1 && landmarks.main === 1 && landmarks.footer >= 1,
  JSON.stringify(landmarks),
);
check('exactly one h1', landmarks.h1 === 1, `${landmarks.h1}`);

// 12. Heading order has no skipped levels
const headingOrder = await page.evaluate(() => {
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);
  let ok = true;
  for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) ok = false;
  return { ok, levels: hs.join(',') };
});
check('no skipped heading levels', headingOrder.ok, headingOrder.levels);

await ctx.close();

// ---------- Mobile ----------
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
});
const mp = await mctx.newPage();
mp.on('pageerror', (e) => consoleErrors.push('mobile: ' + String(e)));
await mp.goto(APP_URL, { waitUntil: 'networkidle' });

// no horizontal overflow
const overflow = await mp.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
check('no horizontal overflow on 390px', overflow <= 1, `${overflow}px`);
await mp.screenshot({ path: `${SHOTS}/mobile-home.png`, fullPage: false });

// open the mobile menu
await mp.getByRole('button', { name: /toggle menu/i }).click();
await mp.waitForTimeout(400);
const panelVisible = await mp.locator('#mobile-menu-panel').isVisible();
check('mobile menu opens', panelVisible);

// panel must fit the visible viewport (the 100dvh fix)
const panelBox = await mp.locator('#mobile-menu-panel').boundingBox();
check(
  'mobile panel fits viewport height',
  panelBox !== null && panelBox.height <= 844 - 80 + 2,
  panelBox ? `h=${Math.round(panelBox.height)}` : 'none',
);

// mobile search is wired (was previously an inert input)
const mSearch = mp.locator('#mobile-menu-panel input[role="combobox"]');
check('mobile search is a real combobox', (await mSearch.count()) === 1);
await mSearch.fill('taxes');
await mp.waitForTimeout(350);
const mOpts = await mp.locator('#mobile-menu-panel [role="option"]').count();
check('mobile search returns results', mOpts > 0, `${mOpts} options`);
await mp.screenshot({ path: `${SHOTS}/mobile-menu.png`, fullPage: false });

// accordion expands in place
await mSearch.fill('');
await mp.waitForTimeout(200);
const catBtn = mp.locator('#mobile-menu-panel nav button').first();
await catBtn.click();
await mp.waitForTimeout(350);
check('accordion expands in place', (await catBtn.getAttribute('aria-expanded')) === 'true');

// dark mode on mobile
await mp
  .getByRole('button', { name: /^Light$|^Dark$/ })
  .first()
  .click();
await mp.waitForTimeout(300);
check(
  'mobile theme toggle works',
  await mp.evaluate(() => document.documentElement.classList.contains('dark')),
);
await mp.screenshot({ path: `${SHOTS}/mobile-dark.png`, fullPage: false });

await mctx.close();
await browser.close();

check('no console/page errors', consoleErrors.length === 0, consoleErrors.slice(0, 4).join(' | '));

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('\nFAILURES:');
  for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
  process.exit(1);
}
