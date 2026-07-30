import { chromium } from 'playwright';
import { PNG } from 'pngjs';

/*
  Relative luminance and contrast ratio, per WCAG 2.x. Used to measure text legibility over the
  hero photograph from real rendered pixels rather than from the colour values in the source —
  the whole risk with a photographic background is that the composited result differs from what
  the stylesheet appears to say.
*/
const srgb = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const contrastVsWhite = (l) => 1.05 / (l + 0.05);

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
// Scoped to <main>: the header now carries its own combobox that appears on scroll, and it sits
// earlier in the DOM, so an unscoped `.first()` would target the hidden one.
const search = page.locator('main input[role="combobox"]').first();
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

// 7b. NO HORIZONTAL OVERFLOW AT DESKTOP WIDTHS, IN BOTH LANGUAGES.
// French labels run roughly 40% longer than their English equivalents, and a header sized around
// English lengths overflowed the viewport and forced the whole page to scroll sideways the moment
// the language was switched. Checking only English — which is what the earlier suite did — cannot
// catch that, so both languages are asserted at every desktop width.
for (const width of [1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  for (const lang of ['en', 'fr']) {
    const target = lang === 'fr' ? /switch to french/i : /switch to english/i;
    const current = await page.evaluate(() => document.documentElement.lang);
    if (current !== lang) {
      await page.getByRole('button', { name: target }).click();
      await page.waitForTimeout(250);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    // Measuring the header ROW is not enough, and that gap is how the collision shipped: a
    // `min-w-0` nav shrinks its own box while `whitespace-nowrap` children keep their width and
    // spill out of it. The row reports no overflow while the nav visibly sits on top of the
    // search field beside it. So measure the nav's own overflow, and the real gap between the
    // last nav item and the search.
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(350);
    const layout = await page.evaluate(() => {
      const nav = document.querySelector('header nav[aria-label="Main"]');
      const btns = [...nav.querySelectorAll('button')];
      const last = btns[btns.length - 1].getBoundingClientRect();
      const wrap = document
        .querySelector('header input[role="combobox"]')
        ?.closest('[aria-hidden]');
      const searchShown = wrap && getComputedStyle(wrap).display !== 'none';
      return {
        navOverflow: nav.scrollWidth - nav.clientWidth,
        gap: searchShown ? Math.round(wrap.getBoundingClientRect().left - last.right) : null,
      };
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    check(
      `header fits without collision at ${width}px (${lang})`,
      overflow <= 1 && layout.navOverflow <= 0 && (layout.gap === null || layout.gap >= 4),
      `page=${overflow}px navOverflow=${layout.navOverflow}px gap=${layout.gap}`,
    );
  }
}
// Back to English at the standard width for everything that follows.
if ((await page.evaluate(() => document.documentElement.lang)) !== 'en') {
  await page.getByRole('button', { name: /switch to english/i }).click();
  await page.waitForTimeout(250);
}
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(200);

// 7c. The hero's search results must escape the hero section and paint above what follows.
// An `overflow-hidden` on that section (added to contain the background photograph) sheared the
// suggestions off at the section edge — the list rendered, was announced, and was half invisible.
{
  const heroSearch = page.locator('main input[role="combobox"]').first();
  await heroSearch.click();
  await heroSearch.fill('build');
  await page.waitForTimeout(400);
  const dropdown = await page.evaluate(() => {
    const lb = document.querySelector('[role="listbox"]');
    if (!lb) return null;
    const sec = document.querySelector('main section');
    const box = lb.getBoundingClientRect();
    return {
      clipped: getComputedStyle(sec).overflow === 'hidden',
      // Hit-test the bottom of the list: if something else is painted there, it is obscured.
      onTop: lb.contains(document.elementFromPoint(box.left + box.width / 2, box.bottom - 8)),
    };
  });
  check(
    'hero search results are neither clipped nor painted under the next section',
    Boolean(dropdown && !dropdown.clipped && dropdown.onTop),
    JSON.stringify(dropdown),
  );
  await heroSearch.press('Escape');
  await heroSearch.fill('');
  await page.waitForTimeout(200);
}

// 7d. INTERACTION STATES MUST ACTUALLY FIRE.
// Every one of these changed a property that a base Tailwind utility silently outranked, so the
// control looked interactive and did nothing — and the meeting buttons went white-on-white,
// disappearing into the page entirely. Assert both that hover changes something and that the
// result stays readable.
for (const [label, selector, prop] of [
  ['feedback Yes button', 'button:has-text("Yes")', 'backgroundColor'],
  ['meeting Agenda link', 'a:has-text("Agenda")', 'backgroundColor'],
  ['meeting Watch Live link', 'a:has-text("Watch Live")', 'backgroundColor'],
  ['news card', 'a:has(h3)', 'borderColor'],
]) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const before = await el.evaluate((n, prop) => getComputedStyle(n)[prop], prop);
  await el.hover();
  await page.waitForTimeout(300);
  const state = await el.evaluate((n, prop) => {
    const cs = getComputedStyle(n);
    return { after: cs[prop], bg: cs.backgroundColor, fg: cs.color };
  }, prop);
  check(
    `${label} has a working hover state`,
    before !== state.after && state.bg !== state.fg,
    `${prop} ${before} → ${state.after}; bg=${state.bg} fg=${state.fg}`,
  );
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(250);

// 8a. HERO PHOTOGRAPH — white text over a photo is the classic municipal accessibility failure.
// Measure the actual composited backdrop: hide the hero's own text, screenshot the section, and
// find the LIGHTEST pixel in it — the worst case for white text anywhere in that band. The
// contrast of white against that pixel has to clear 4.5:1 (SC 1.4.3). Sampling with the text
// visible would measure antialiased glyph edges instead of the backdrop and report nonsense.
const heroContrast = async () => {
  const band = await page.evaluate(() => {
    const r = document.querySelector('main section').getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('main section h1, main section .flex')) {
      el.style.visibility = 'hidden';
    }
  });
  await page.waitForTimeout(200);
  const png = PNG.sync.read(await page.screenshot({ clip: band }));
  let lightest = -1;
  let rgb = null;
  for (let i = 0; i < png.data.length; i += 4) {
    const l = luminance(png.data[i], png.data[i + 1], png.data[i + 2]);
    if (l > lightest) {
      lightest = l;
      rgb = [png.data[i], png.data[i + 1], png.data[i + 2]];
    }
  }
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('main section h1, main section .flex')) {
      el.style.visibility = '';
    }
  });
  await page.waitForTimeout(150);
  return { ratio: contrastVsWhite(lightest), rgb };
};

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
const heroLight = await heroContrast();
check(
  'hero text clears 4.5:1 over the photograph (light)',
  heroLight.ratio >= 4.5,
  `worst backdrop rgb(${heroLight.rgb}) → ${heroLight.ratio.toFixed(2)}:1`,
);

// 8b. PERSISTENT HEADER SEARCH — hidden at the top, revealed once the hero search scrolls away,
// and never a tab stop while it is invisible.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
const headerSearchState = () =>
  page.evaluate(() => {
    const input = document.querySelector('header input[role="combobox"]');
    if (!input) return null;
    const wrap = input.closest('[aria-hidden]');
    return {
      opacity: getComputedStyle(wrap).opacity,
      ariaHidden: wrap.getAttribute('aria-hidden'),
      tabIndex: input.tabIndex,
    };
  });
const atTop = await headerSearchState();
check('header search hidden at top of page', atTop?.opacity === '0', JSON.stringify(atTop));
check(
  'hidden header search is not tabbable',
  atTop?.tabIndex === -1,
  `tabIndex=${atTop?.tabIndex}`,
);

await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(500);
const scrolled = await headerSearchState();
check('header search appears on scroll', scrolled?.opacity === '1', JSON.stringify(scrolled));
check(
  'revealed header search is tabbable',
  scrolled?.tabIndex !== -1,
  `tabIndex=${scrolled?.tabIndex}`,
);

// 8c. City Services quick actions
const cityServiceLinks = await page.evaluate(() =>
  [...document.querySelectorAll('section[aria-label] a')]
    .map((a) => a.textContent.trim())
    .filter(Boolean),
);
check(
  'City Services exposes four quick actions',
  cityServiceLinks.length >= 4,
  cityServiceLinks.slice(0, 4).join(' | '),
);

// 8d. Municipal Dashboard
check(
  'municipal dashboard section present',
  (await page.locator('#municipal-dashboard-heading').count()) === 1,
);

// 8e. Social links open safely and are individually named
const socials = await page.evaluate(() =>
  [...document.querySelectorAll('footer a[target="_blank"]')].map((a) => ({
    href: a.getAttribute('href'),
    rel: a.getAttribute('rel'),
    name: a.textContent.trim(),
  })),
);
check('four social links in footer', socials.length === 4, socials.map((s) => s.name).join(', '));
check(
  'every social link is rel=noopener noreferrer',
  socials.every((s) => (s.rel || '').includes('noopener') && (s.rel || '').includes('noreferrer')),
  socials.map((s) => s.rel).join(' | '),
);
check(
  'social links point at the City accounts',
  socials.every((s) => /northbay|cityofnbay|thecityofnorthbay/i.test(s.href || '')),
  socials.map((s) => s.href).join(' '),
);

// 8f. Author name must not appear anywhere in the rendered page
const bodyText = await page.evaluate(() => document.body.innerText);
check('author name not rendered on the page', !/calarco/i.test(bodyText));

// 8g. EVENT DATE TILE — the hover bug in both themes. Text must not match its own background.
const eventHoverContrast = async (label) => {
  await page.evaluate(() =>
    document.querySelector('.nb-event-date')?.scrollIntoView({ block: 'center' }),
  );
  await page.waitForTimeout(250);
  await page.locator('a:has(.nb-event-date)').first().hover();
  await page.waitForTimeout(350);
  const c = await page.evaluate(() => {
    const tile = document.querySelector('.nb-event-date');
    return {
      bg: getComputedStyle(tile).backgroundColor,
      month: getComputedStyle(tile.querySelector('.nb-event-month')).color,
      day: getComputedStyle(tile.querySelector('.nb-event-day')).color,
    };
  });
  check(
    `event date tile readable on hover (${label})`,
    c.day !== c.bg && c.month !== c.bg && c.day === 'rgb(255, 255, 255)',
    JSON.stringify(c),
  );
};
await eventHoverContrast('light');

// 8h. Fire gauge needle must contrast with its card in both themes
const needleColor = () =>
  page.evaluate(() => {
    const svg = [...document.querySelectorAll('svg')].find(
      (s) => s.querySelector('title')?.textContent === 'Fire danger gauge',
    );
    return svg ? getComputedStyle(svg.querySelector('line')).stroke : null;
  });
const lightNeedle = await needleColor();

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

// 10b. Dark-theme checks that only make sense with the theme actually on.
await page.getByRole('button', { name: /switch to dark mode/i }).click();
await page.waitForTimeout(400);
const darkNeedle = await needleColor();
check(
  'gauge needle changes colour between themes',
  Boolean(lightNeedle && darkNeedle && lightNeedle !== darkNeedle),
  `light=${lightNeedle} dark=${darkNeedle}`,
);
await eventHoverContrast('dark');

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
const heroDark = await heroContrast();
check(
  'hero text clears 4.5:1 over the photograph (dark)',
  heroDark.ratio >= 4.5,
  `worst backdrop rgb(${heroDark.rgb}) → ${heroDark.ratio.toFixed(2)}:1`,
);

await page.getByRole('button', { name: /switch to light mode/i }).click();
await page.waitForTimeout(300);

// 10c. Data-saver drops the hero photograph — it is the heaviest asset on the page, and the
// point of the mode is that someone on a metered connection should not pay for atmosphere.
const heroImgsBefore = await page.evaluate(
  () => document.querySelectorAll('main section img').length,
);
await page.getByRole('button', { name: /data saver/i }).click();
await page.waitForTimeout(400);
const heroImgsAfter = await page.evaluate(
  () => document.querySelectorAll('main section img').length,
);
check(
  'data-saver mode drops all hero/section imagery',
  heroImgsBefore > 0 && heroImgsAfter === 0,
  `${heroImgsBefore} -> ${heroImgsAfter}`,
);
await page.getByRole('button', { name: /standard mode/i }).click();
await page.waitForTimeout(300);

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
