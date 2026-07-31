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

/*
  Controls are selected by data attribute, not by accessible name.

  Selecting on `name: /switch to french/i` only works while that label is English, which is the
  same assumption that let "Data Saver" and "Dark" ship untranslated in the mobile menu. On a
  bilingual site a test that reads English labels cannot check the French build.
*/
const langToggle = (page) => page.locator('[data-lang-toggle]:visible').first();
const themeToggle = (page) => page.locator('[data-theme-toggle]:visible').first();
const bandwidthToggle = (page) => page.locator('[data-bandwidth-toggle]:visible').first();
const menuToggle = (page) => page.locator('[data-menu-toggle]').first();

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
  await themeToggle(page).click();
  await page.waitForTimeout(250);
}
const lightBg = await bgOf();
await themeToggle(page).click();
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
await themeToggle(page).click();
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
await langToggle(page).click();
await page.waitForTimeout(250);
const htmlLang = await page.evaluate(() => document.documentElement.lang);
const heroFr = await page.locator('h1').first().innerText();
check('language toggle sets <html lang>', htmlLang === 'fr', `lang=${htmlLang}`);
check('hero heading translated', /aider/i.test(heroFr), heroFr);
await langToggle(page).click();
await page.waitForTimeout(200);

// 6. FOCUS TRAP in the "Before you start" checklist.
// The dialog is the one place on the page a keyboard user can be stranded: tabbing past the last
// control would land back in the page behind an overlay they cannot see. Fifty presses in both
// directions is well past the number of focusable elements it contains.
await page.selectOption('#task-select', 'checklist_business');
await page.waitForTimeout(400);
check('checklist dialog opens', await page.locator('[role="dialog"]').isVisible());

const focusInsideDialog = () =>
  page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    return dlg ? dlg.contains(document.activeElement) : false;
  });
check('focus moves into dialog on open', await focusInsideDialog());

let escaped = false;
for (let i = 0; i < 25; i++) {
  await page.keyboard.press('Tab');
  if (!(await focusInsideDialog())) {
    escaped = true;
    break;
  }
}
check('focus trap holds over 25 Tabs', !escaped);

for (let i = 0; i < 25; i++) {
  await page.keyboard.press('Shift+Tab');
  if (!(await focusInsideDialog())) {
    escaped = true;
    break;
  }
}
check('focus trap holds over 25 Shift+Tabs', !escaped);

// The checklist must end somewhere real — it replaced a wizard whose final button closed the
// dialog and did nothing, which was the last dead control on the page.
const checklistCta = await page.evaluate(() => {
  const a = document.querySelector('[role="dialog"] a[href^="http"]');
  return a ? { href: a.getAttribute('href'), rel: a.getAttribute('rel') } : null;
});
check(
  "checklist hands off to the City's real page",
  Boolean(checklistCta?.href?.includes('northbay.ca')) &&
    (checklistCta?.rel || '').includes('noopener'),
  JSON.stringify(checklistCta),
);

// And it says plainly that its contents are illustrative rather than municipal guidance.
const caveat = await page.evaluate(
  () => document.querySelector('[role="dialog"]')?.innerText.toLowerCase() ?? '',
);
check(
  'checklist states that it is illustrative',
  /illustrative|indicatif/.test(caveat),
  caveat.includes('illustrative') ? 'present' : 'MISSING',
);

await page.screenshot({ path: `${SHOTS}/desktop-checklist.png` });

// 7. Escape closes dialog and restores focus
await page.keyboard.press('Escape');
await page.waitForTimeout(350);
check('Escape closes the checklist', (await page.locator('[role="dialog"]').count()) === 0);

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
  await langToggle(page).click();
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
  // Sample the HEADING's own box, not the whole hero section.
  //
  // The requirement (SC 1.4.3) is about the contrast between text and what is directly behind
  // it. Measuring the entire section swept in large areas of photograph that no text ever
  // overlaps, so the worst pixel found was usually somewhere nothing was written — which forced
  // the scrim far darker than legibility actually required and buried the photo for nothing.
  const band = await page.evaluate(() => {
    const h1 = document.querySelector('main section h1');
    const r = h1.getBoundingClientRect();
    // A few pixels of margin so antialiasing at the glyph edges is not mistaken for backdrop.
    return { x: r.x - 4, y: r.y - 4, width: r.width + 8, height: r.height + 8 };
  });
  await page.evaluate(() => {
    document.querySelector('main section h1').style.visibility = 'hidden';
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
    document.querySelector('main section h1').style.visibility = '';
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

// 8b. PERSISTENT HEADER SEARCH — now a toggle, not an always-open field.
// An always-visible field could not survive translation: sized for the English nav it left no
// room for the French one, and sized for French it was too narrow to type into. The toggle is a
// fixed 40px square in every language. Assert the whole interaction, including focus handling,
// because a search control that has to be clicked twice is slower than the field it replaced.
const searchToggle = () => page.locator('header [data-search-toggle]');

// The toggle occupies its space from the start and fades in, rather than mounting on scroll.
// Mounting it inserted a 40px button into the flex row and shoved the whole navigation 24px
// sideways at exactly the moment a visitor is most likely to be reading it. Assert both halves:
// the hidden state has to be genuinely hidden (not merely transparent-but-clickable), and the
// row must not move between the two states.
const toggleState = () =>
  page.evaluate(() => {
    const el = document.querySelector('header [data-search-toggle]');
    if (!el) return null;
    return {
      opacity: getComputedStyle(el).opacity,
      pointerEvents: getComputedStyle(el).pointerEvents,
      tabIndex: el.tabIndex,
      ariaHidden: el.getAttribute('aria-hidden'),
    };
  });
const navBox = () =>
  page.evaluate(() => {
    const r = document.querySelector('header nav[aria-label="Main"]').getBoundingClientRect();
    return { left: Math.round(r.left), right: Math.round(r.right) };
  });

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
const hidden = await toggleState();
const navAtTop = await navBox();
check(
  'search toggle is fully hidden at top of page',
  hidden?.opacity === '0' &&
    hidden?.pointerEvents === 'none' &&
    hidden?.tabIndex === -1 &&
    hidden?.ariaHidden === 'true',
  JSON.stringify(hidden),
);

await page.evaluate(() => window.scrollTo(0, 1400));
await page.waitForTimeout(700);
const shown = await toggleState();
const navScrolled = await navBox();
check(
  'search toggle becomes visible and tabbable on scroll',
  shown?.opacity === '1' && shown?.tabIndex === 0 && shown?.ariaHidden === 'false',
  JSON.stringify(shown),
);
check(
  'navigation does not shift when the toggle appears',
  navAtTop.left === navScrolled.left && navAtTop.right === navScrolled.right,
  `top=${JSON.stringify(navAtTop)} scrolled=${JSON.stringify(navScrolled)}`,
);

await searchToggle().click();
await page.waitForTimeout(400);
const expanded = await page.evaluate(() => {
  const input = document.querySelector('header input[role="combobox"]');
  return {
    present: Boolean(input),
    focused: document.activeElement === input,
    width: input ? Math.round(input.getBoundingClientRect().width) : 0,
  };
});
check('toggle opens the search field', expanded.present, JSON.stringify(expanded));
check('field receives focus on open', expanded.focused);
check('opened field is wide enough to type in', expanded.width >= 200, `${expanded.width}px`);

await page.keyboard.press('Escape');
await page.waitForTimeout(350);
const afterEscape = await page.evaluate(() => ({
  closed: !document.querySelector('header input[role="combobox"]'),
  focusOnToggle: document.activeElement?.hasAttribute('data-search-toggle') === true,
}));
check(
  'Escape closes the field and restores focus to the toggle',
  afterEscape.closed && afterEscape.focusOnToggle,
  JSON.stringify(afterEscape),
);

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

// 8b-2. FRENCH COVERAGE.
// The site previously translated its chrome and left everything else in English: a francophone
// resident got French navigation labels over English menu contents, English news headlines,
// English table headers and an English search index. Rather than assert a handful of strings,
// scan the whole rendered page for known English-only markers — anything that survives the
// switch is by definition untranslated.
await langToggle(page).click();
await page.waitForTimeout(400);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);

// Open each mega menu so its contents are in the DOM to be checked.
const frenchLeaks = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const seen = new Set();
  const collect = () => {
    for (const el of document.querySelectorAll('main *, header *, footer *')) {
      if (el.children.length === 0 && el.textContent.trim()) seen.add(el.textContent.trim());
    }
  };
  collect();
  for (const btn of document.querySelectorAll('header nav[aria-label="Main"] button')) {
    btn.click();
    await sleep(150);
    collect();
  }
  // Markers that should never appear once the interface is in French. Proper nouns are excluded
  // deliberately — "North Bay", "Film North Bay" and "Marina" are names, not translatable copy.
  const markers = [
    'Bid Opportunities',
    'Economic Development',
    'Real Estate',
    'Grow your business',
    'Births, Marriages & Deaths',
    'Garbage & Recycling',
    'Property Taxes',
    'Parking',
    'Water & Wastewater',
    'Report a Problem',
    'Mayor & Council',
    'By-Laws',
    'Careers',
    'Departments',
    'Media Room',
    'Organization Chart',
    'About North Bay',
    'Immigration',
    'Sports Facilities',
    'Recreational Activities',
    'Housing in North Bay',
    'Date & Time',
    'Meeting Type',
    'Agenda Published',
    'Notice Issued',
    'City Council',
    'Committee',
    'Public Meeting',
    'All Meetings',
    'Watch Live',
    'Road Closure',
    'Sidewalk Improvements',
    'Building Faster Fund',
    'Recreation Centre',
    'Directory',
    'Information about',
    'Access information about',
  ];
  return markers.filter((m) => [...seen].some((txt) => txt.includes(m)));
});
// The desktop scan cannot see the mobile menu, because it is not rendered at this width. That
// blind spot is how "Data Saver" and "Dark" stayed English through a pass that reported clean.
const mobileFrenchLeaks = await (async () => {
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mp = await mctx.newPage();
  await mp.goto(APP_URL, { waitUntil: 'networkidle' });
  await menuToggle(mp).click();
  await mp.waitForTimeout(400);
  await langToggle(mp).click();
  await mp.waitForTimeout(500);
  // Expand a category so its contents are in the DOM too.
  await mp.locator('#mobile-menu-panel nav button').first().click();
  await mp.waitForTimeout(350);
  const text = await mp.locator('#mobile-menu-panel').innerText();
  await mctx.close();
  return ['Data Saver', 'Standard', 'Dark', 'Light', 'Garbage', 'Property Taxes', 'Parking'].filter(
    (m) => text.includes(m),
  );
})();
check(
  'no English content leaks through in the French mobile menu',
  mobileFrenchLeaks.length === 0,
  mobileFrenchLeaks.length ? `untranslated: ${mobileFrenchLeaks.join(' | ')}` : 'clean',
);

check(
  'no English content leaks through in French mode',
  frenchLeaks.length === 0,
  frenchLeaks.length ? `untranslated: ${frenchLeaks.slice(0, 8).join(' | ')}` : 'clean',
);

// 8b-3. Search must find French terms, including without accents.
const frSearch = page.locator('main input[role="combobox"]').first();
for (const [term, expect] of [
  ['ordures', /ordures/i],
  ['impots', /impôts/i],
  ['garbage', /ordures/i],
]) {
  await frSearch.fill('');
  await page.waitForTimeout(150);
  await frSearch.fill(term);
  await page.waitForTimeout(350);
  const first = await page
    .locator('[role="option"]')
    .first()
    .textContent()
    .catch(() => '');
  check(
    `French search matches "${term}"`,
    expect.test(first || ''),
    (first || 'no results').slice(0, 60),
  );
}
await frSearch.fill('');
await frSearch.press('Escape');
await langToggle(page).click();
await page.waitForTimeout(300);

// 8b-4. EVERY OUTBOUND LINK RESOLVES, AND IS SAFELY TARGETED.
// The navigation points at the City's real pages, which means a link can rot without anything in
// this repo changing. Generating a plausible URL is not the same as it existing, so the URLs are
// derived from labels and then checked against the live site. `noopener` is asserted alongside:
// a `target="_blank"` without it hands the opened page a reference back through `window.opener`.
{
  const collect = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => h?.startsWith('http')),
    );
  const found = new Set(await collect());
  // Click, not hover: the mega menus open on activation now (see the note in Header.tsx on the
  // disclosure pattern), so a test that hovers would silently collect nothing.
  const navButtons = page.locator('header nav[aria-label="Main"] button');
  const navCount = await navButtons.count();
  for (let i = 0; i < navCount; i++) {
    await navButtons.nth(i).click();
    await page.waitForTimeout(300);
    for (const h of await collect()) found.add(h);
  }
  // Move the pointer off the nav and close the menu it opened. Hovering another element would
  // fail here: the open mega menu covers most of the page and intercepts the pointer.
  await page.mouse.move(0, 600);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  const urls = [...found];
  const results = [];
  for (let i = 0; i < urls.length; i += 6) {
    results.push(
      ...(await Promise.all(
        urls.slice(i, i + 6).map(async (u) => {
          try {
            const r = await fetch(u, { redirect: 'follow' });
            return { u, ok: r.status === 200, status: r.status };
          } catch {
            return { u, ok: false, status: 'ERR' };
          }
        }),
      )),
    );
  }
  const broken = results.filter((r) => !r.ok);
  check(
    'every outbound link resolves on northbay.ca',
    urls.length > 50 && broken.length === 0,
    broken.length
      ? `${broken.length} broken: ${broken
          .slice(0, 3)
          .map((b) => `${b.status} ${b.u}`)
          .join(' | ')}`
      : `${urls.length} links, all 200`,
  );

  const unsafe = await page.evaluate(
    () =>
      [...document.querySelectorAll('a[href^="http"]')].filter(
        (a) => a.target === '_blank' && !(a.rel || '').includes('noopener'),
      ).length,
  );
  check('every new-tab link carries rel=noopener', unsafe === 0, `${unsafe} unsafe`);
}

// 8b-5. SEARCH RESULTS GO SOMEWHERE, AND WHERE THEY GO RESOLVES.
// Selecting a result used to write its title into the input and close the panel — a search that
// finds the page and then declines to open it. Drive a spread of queries, collect every
// destination surfaced, and check them all against the live site.
{
  const searchField = page.locator('main input[role="combobox"]').first();
  const destinations = new Set();
  for (const q of [
    'taxes',
    'garbage',
    'permit',
    'transit',
    'council',
    'business',
    'parks',
    'marina',
    'fire',
    'housing',
    'election',
    'waste',
  ]) {
    await searchField.fill('');
    await page.waitForTimeout(120);
    await searchField.fill(q);
    await page.waitForTimeout(280);
    for (const h of await page.evaluate(() =>
      [...document.querySelectorAll('[role="option"][data-href]')].map((o) => o.dataset.href),
    )) {
      destinations.add(h);
    }
  }
  await searchField.fill('');
  await searchField.press('Escape');
  await page.waitForTimeout(200);

  const list = [...destinations];
  const checked = [];
  for (let i = 0; i < list.length; i += 6) {
    checked.push(
      ...(await Promise.all(
        list.slice(i, i + 6).map(async (u) => {
          try {
            const r = await fetch(u, { redirect: 'follow' });
            return { u, ok: r.status === 200 };
          } catch {
            return { u, ok: false };
          }
        }),
      )),
    );
  }
  const broken = checked.filter((c) => !c.ok);
  check(
    'every search result has a destination that resolves',
    list.length >= 20 && list.every((u) => u.startsWith('http')) && broken.length === 0,
    broken.length
      ? `${broken.length} broken: ${broken[0].u}`
      : `${list.length} destinations, all 200`,
  );

  // And selecting one actually opens it.
  await searchField.fill('property tax');
  await page.waitForTimeout(300);
  const expected = await page.evaluate(
    () => document.querySelector('[role="option"][data-href]')?.dataset.href,
  );
  const [popup] = await Promise.all([
    ctx.waitForEvent('page', { timeout: 6000 }).catch(() => null),
    page.locator('[role="option"]').first().click(),
  ]);
  check(
    'selecting a search result opens the City page',
    Boolean(popup) && popup.url().replace(/\/$/, '') === (expected ?? '').replace(/\/$/, ''),
    popup ? `${popup.url()} (expected ${expected})` : 'no new tab opened',
  );
  if (popup) await popup.close();
  await searchField.fill('');
  await searchField.press('Escape');
  await page.waitForTimeout(200);
}

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
// Scoped by domain, not by `target="_blank"`: the footer's City links now open in a new tab too,
// so the old selector matched eleven links and counted them all as social accounts.
const socials = await page.evaluate(() =>
  [...document.querySelectorAll('footer a[target="_blank"]')]
    .filter((a) => /facebook|twitter|instagram|youtube/i.test(a.href))
    .map((a) => ({
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

/*
  8g-ii. THE OPEN NAV TAB must be readable.

  This assertion exists because the suite had 74 checks and none of them caught the active tab
  rendering white text on a white background — 1.00:1, invisible, in both themes. The checks
  around the mega menu tested that it opened and that `aria-expanded` flipped: behaviour, never
  appearance. A control can be perfectly operable and still unreadable.

  Measured as a ratio rather than `fg !== bg`. The neighbouring event-tile check compares the two
  colour strings for inequality, which catches only the exact-match case — navy on near-navy
  passes it while failing a human. Anything that claims to be a contrast check should compute
  the contrast.
*/
const activeNavTabContrast = async (label) => {
  const trigger = page.locator('nav[aria-label="Main"] button').first();
  await trigger.click();
  await page.waitForTimeout(350);
  const c = await trigger.evaluate((el) => {
    /*
      Colours go through a 1×1 canvas rather than a regex.

      Tailwind v4 emits `oklch()`, and scraping digits out of `oklch(0.21 0.006 285.885)` yields
      rgb(0, 21, 0) — a colour that does not exist on the page. The first version of this
      assertion did exactly that and passed, having measured a fiction. The canvas makes the
      browser do the conversion, so every colour space resolves to real sRGB bytes.
    */
    const ctx = document.createElement('canvas').getContext('2d');
    const rgb = (css) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    // Walk up for the first non-transparent ancestor: the button's own background is
    // `transparent` until it is the open one, and a ratio against nothing is meaningless.
    let node = el;
    let bg = getComputedStyle(node).backgroundColor;
    while (bg === 'rgba(0, 0, 0, 0)' && node.parentElement) {
      node = node.parentElement;
      bg = getComputedStyle(node).backgroundColor;
    }
    return { fg: rgb(getComputedStyle(el).color), bg: rgb(bg) };
  });
  const [hi, lo] = [luminance(...c.fg), luminance(...c.bg)].sort((a, b) => b - a);
  const ratio = (hi + 0.05) / (lo + 0.05);
  check(
    `open nav tab clears 4.5:1 (${label})`,
    ratio >= 4.5,
    `rgb(${c.fg}) on rgb(${c.bg}) → ${ratio.toFixed(2)}:1`,
  );
  // Continuous with the panel it opened, not a block floating above a differently-coloured one.
  const panelBg = await page
    .locator('nav[aria-label="Main"] ~ div, header > div')
    .last()
    .evaluate(() => {
      const panel = document.querySelector('header .absolute.top-full');
      return panel ? getComputedStyle(panel).backgroundColor : null;
    });
  const tabBg = await trigger.evaluate((el) => getComputedStyle(el).backgroundColor);
  check(
    `open nav tab matches the panel background (${label})`,
    panelBg !== null && tabBg === panelBg,
    `tab=${tabBg} panel=${panelBg}`,
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
};
await activeNavTabContrast('light');

/*
  8g-iii. THE PANEL MUST BE ONE TAB STOP FROM THE BUTTON THAT OPENS IT.

  This counts stops rather than asserting a mechanism, because the mechanism may reasonably
  change — the panel could be reparented, or focus moved on open — and the thing that actually
  matters to a keyboard user survives all of those: after opening a menu, how many times must
  they press Tab before reaching what they opened?

  It was six on the deployed site. Every existing check around the mega menu passed at the time:
  they tested that it opened and that aria-expanded flipped, which is behaviour, not reach.
*/
const trigger = page.locator('nav[aria-label="Main"] button').first();
await trigger.click();
await page.waitForTimeout(300);

const controls = await trigger.getAttribute('aria-controls');
const target = controls ? await page.locator(`#${controls}`).count() : 0;
check(
  'open nav trigger names the panel it controls',
  Boolean(controls) && target === 1,
  `aria-controls=${controls ?? '(none)'} → ${target} matching element(s)`,
);

const panelRole = await page.evaluate((id) => {
  const el = id && document.getElementById(id);
  return el ? { role: el.getAttribute('role'), name: el.getAttribute('aria-label') } : null;
}, controls);
check(
  'panel is a named region',
  panelRole?.role === 'region' && Boolean(panelRole?.name),
  JSON.stringify(panelRole),
);

let stops = 0;
let reached = false;
for (let i = 1; i <= 10 && !reached; i++) {
  await page.keyboard.press('Tab');
  stops = i;
  /*
    Panel membership is detected structurally as well as by id.

    Keying only off `aria-controls` made this unable to count at all when the attribute was
    missing — it reported "never reached" for a panel that was in fact seven stops away, which is
    a different defect with a different fix. A check that cannot measure the broken case cannot
    tell you how broken it is.
  */
  reached = await page.evaluate((id) => {
    const el = document.activeElement;
    if (!el) return false;
    return Boolean(
      (id && el.closest(`#${id}`)) ||
        el.closest('header .absolute.top-full, header [role="region"]'),
    );
  }, controls);
}
check(
  'panel content is one Tab from its trigger',
  reached && stops === 1,
  reached ? `${stops} stop(s)` : 'never reached within 10 stops',
);

// And back: Shift+Tab off the first link returns to the trigger rather than stranding focus.
await page.keyboard.press('Shift+Tab');
await page.waitForTimeout(150);
const backOnTrigger = await page.evaluate(
  () => document.activeElement?.getAttribute('aria-expanded') === 'true',
);
check('Shift+Tab from the first link returns to the trigger', backOnTrigger);
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

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
await themeToggle(page).click();
await page.waitForTimeout(400);
const darkNeedle = await needleColor();
check(
  'gauge needle changes colour between themes',
  Boolean(lightNeedle && darkNeedle && lightNeedle !== darkNeedle),
  `light=${lightNeedle} dark=${darkNeedle}`,
);
await eventHoverContrast('dark');
await activeNavTabContrast('dark');

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
const heroDark = await heroContrast();
check(
  'hero text clears 4.5:1 over the photograph (dark)',
  heroDark.ratio >= 4.5,
  `worst backdrop rgb(${heroDark.rgb}) → ${heroDark.ratio.toFixed(2)}:1`,
);

await themeToggle(page).click();
await page.waitForTimeout(300);

// 10c. Data-saver drops the hero photograph — it is the heaviest asset on the page, and the
// point of the mode is that someone on a metered connection should not pay for atmosphere.
const heroImgsBefore = await page.evaluate(
  () => document.querySelectorAll('main section img').length,
);
await bandwidthToggle(page).click();
await page.waitForTimeout(400);
const heroImgsAfter = await page.evaluate(
  () => document.querySelectorAll('main section img').length,
);
check(
  'data-saver mode drops all hero/section imagery',
  heroImgsBefore > 0 && heroImgsAfter === 0,
  `${heroImgsBefore} -> ${heroImgsAfter}`,
);
await bandwidthToggle(page).click();
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
await menuToggle(mp).click();
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
await themeToggle(mp).click();
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
