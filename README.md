# City of North Bay — Redesign Concept

**Live demo → [fevra-dev.github.io/North-Bay](https://fevra-dev.github.io/North-Bay/)**

> **This is an unofficial concept, not the City's website.** It is an independent redesign study
> built by Mac Calarco as part of an application for the Web Content Specialist (Communications)
> position. It is not affiliated with, authorized by, or endorsed by the Corporation of the City
> of North Bay. The City's wordmark and public content appear here for the purpose of
> illustrating a redesign proposal, and all municipal branding remains the property of the City.
> Nothing here is a live municipal service — no form submits, no payment processes, and no
> contact route reaches City staff.

---

## What this is

A working front-end concept for northbay.ca, built to demonstrate what a task-oriented,
accessible, genuinely bilingual municipal site could look like. Every interaction on the page is
real: the search works, the dialogs trap focus, the language toggle switches the document, the
theme toggle persists. It is a prototype in the sense that the content is mock and the links do
not lead anywhere, not in the sense that the behaviour is faked.

## The decisions, and why

### Information architecture organized around what residents came to do

The site is built around an **"I want to…"** task selector rather than the City's org chart. That
replaces a fifth "Life Events" navigation tab which duplicated this same logic — the original
layout put life-stage journeys and municipal departments side by side as though they were the
same kind of thing, leaving the visitor to work out which mental model applied to which tab
before they could click anything.

NYC.gov's 2025 relaunch made the same bet: surface the handful of things people actually arrive
to do, ahead of the structure of the organization that does them.

### Accessibility targeted one level above the legal floor

Ontario's Integrated Accessibility Standards Regulation (O. Reg. 191/11) has required municipal
sites to meet **WCAG 2.0 Level AA** since January 2021. This concept treats that as the floor and
targets **WCAG 2.2 Level AA** instead:

- Skip link that is genuinely visible when focused, not just present in the DOM
- A true focus trap in every dialog, with focus returned to the trigger on close
- Live search built to the WAI-ARIA combobox pattern — `aria-activedescendant`, arrow-key
  navigation, Home/End, and a polite live region announcing the result count
- Reduced-motion support honouring the OS setting
- Colour is never the only carrier of meaning: alert severity, urgency, and status each pair
  their colour with a text label
- A real accessibility statement in the site itself, naming the conformance target, what has
  been verified, **and what is still open**

### Bilingual by structure, not by afterthought

Full English/French parity across **everything**, not just the chrome: navigation contents, mega
menu descriptions, news headlines, event listings, meeting types and statuses, table headers, the
task wizard, and the accessibility statement itself. Consistent with Ontario's French Language
Services Act. `<html lang>` updates with the toggle so screen readers switch pronunciation rules,
and individual out-of-language words carry their own `lang` attribute.

An earlier pass translated only the chrome, on the reasoning that nav items and news are CMS
content rather than template strings. The reasoning was sound and the result was still a French
page with thirteen English links under "Services et paiements". Content now carries its own
`{ en, fr }` pair, which is how a localized CMS field actually behaves.

**Search matches both languages at once.** A francophone typing "ordures" finds the garbage page;
someone typing "garbage" while the interface is in French finds it too. Bilingual residents mix
languages constantly and often know a municipal term in only one of them, so matching only the
active language would penalise exactly the people the French interface exists for. Queries are
also accent-folded — "impots" finds "Impôts fonciers", because otherwise French search is only as
good as the visitor's keyboard.

A test scans the fully-rendered French page for English-only markers, so an untranslated string
cannot quietly reappear. The French strings have **not** had a fluent review pass — that is stated
in the accessibility statement's known-issues section rather than quietly omitted.

### A specific land acknowledgment

Given its own section at the base of the footer, in both languages. The wording names the
**Robinson-Huron Treaty of 1850** and the Anishinaabeg peoples, specifically **Nipissing First
Nation**, and extends respect to Métis, Inuit, and all First Peoples. A generic acknowledgment
that could apply to any municipality in Canada is not really an acknowledgment of anywhere.

### Benchmarked against published redesign research

Interaction and layout decisions were checked against what other governments published about
their own redesigns, rather than derived from assumption:

| Source | What it informed |
| --- | --- |
| **GOV.UK** | Research on step-by-step service flows cautions against running multi-step processes inside a modal — people lose track of where they are. Shaped how the task wizard is scoped and why it states "Step 2 of 3" in text. |
| **NYC.gov** (2025 relaunch) | Surfacing residents' most common tasks front and centre — the bet the "I want to…" selector makes. |
| **sf.gov** | Accordion mobile navigation, for the same reason adopted here. Their case studies on small features becoming load-bearing under real demand shaped the alert severity model. |
| **Tokyo's multilingual resident portal** | How clearly it labels machine-translated content as such rather than presenting it as official text. |

### Two horizontal bars instead of three

The original layout stacked three full-width bars before any content appeared. The utility
controls (language, theme, data saver) fold into the header itself on desktop and into the menu
panel on mobile, recovering roughly a screen and a half of vertical space above the fold on a
phone.

### A photograph behind the hero, without the usual accessibility failure

The hero sits over an aerial of the North Bay waterfront. A hero image is where municipal sites
most often quietly fail WCAG: white text is dropped onto a photo, it looks fine against the one
region someone checked, and it becomes unreadable over a bright patch elsewhere — a cloud, a
sunlit building, open water. The requirement (SC 1.4.3, 4.5:1) applies to the text against
*whatever pixel is actually behind it*, not the average.

So the photograph never sits directly behind text. A navy scrim covers it at a fixed opacity,
putting a known colour behind every character regardless of what the image does underneath. And
the result is measured rather than assumed: the test suite hides the hero text, screenshots the
band, finds the **lightest pixel in it** — the worst case for white text anywhere — and computes
the real contrast. Currently **5.1:1 in light mode and 10.4:1 in dark**, against a 4.5:1 floor.
A future change to the photo or the scrim cannot silently break legibility.

Data-saver mode drops the photograph entirely. It is the heaviest asset on the page, and the
point of that mode is that someone on a metered connection should not pay for atmosphere.

### Search that stays reachable

The hero carries the primary search. Once it scrolls out of view a search **toggle** appears in
the sticky header, opening a full-width field over the header row.

A toggle rather than an always-open field, because an always-open field cannot survive
translation: sized to fit the English nav it left no room for the French one, and sized to fit
French it was too narrow to type into. Making it flexible only moved the failure — it collapsed to
an unusable sliver at exactly the widths where French needs the space. The button is a fixed 40px
square in every language. Focus moves into the field on open and returns to the toggle on Escape.

### Two ways in, for two kinds of traffic

**City Services** surfaces the four highest-frequency transactions as permanent one-click targets
— the same four the City promotes on its own homepage. The **"I want to…"** selector beside it
covers the long tail of resident intents. They sit side by side with the fire-danger reading
because all of it answers "what do I need to do or know right now", and stacking it would push
half of it below the fold for no gain.

### Language toggle that says what it does

`FR` / `EN`, not a globe icon. A globe says "language settings are somewhere in here" and needs a
hover to reveal which language it switches to. Two letters say exactly what happens, and on a
bilingual municipal site they are what a francophone resident is scanning for.

### Details that only show up on a real device

- Mobile navigation is a true accordion that expands in place, not a drill-down into a separate
  screen
- The menu panel is sized in `dvh`, not `vh`, so its last item is not hidden behind mobile
  Safari's address bar
- `:active` accompanies `:hover` on tap targets, because hover on a touchscreen is inconsistent
  between browsers while `:active` fires reliably everywhere
- Scroll lock measures the scrollbar's real width and pads for it, so opening a menu does not
  shift the page sideways

### Navigation that actually goes somewhere

Every navigation item, quick action, footer link and "I want to…" task opens the City's real page
on northbay.ca. A concept whose navigation goes nowhere demonstrates a layout; one whose
navigation works demonstrates an information architecture, and a reviewer can check any claim
made about it in a click.

URLs are derived from the English label rather than stored per item, because the City's own slugs
are exactly that transformation — so a nav item cannot be added with a forgotten link. Five pages
live on other paths or domains and are listed as overrides. All 61 were checked against the live
site and the test suite re-checks them, because a link can rot without anything in this repo
changing.

They open in a new tab, which is a deliberate exception to the usual rule: these cross from a
redesign proposal to the live municipal site, the two look similar enough to confuse, and a new
tab keeps the concept open to come back to. Screen readers are told the destination.

## Verifying it, rather than asserting it

`tests/verify.mjs` drives a real browser (Playwright) through **68 assertions** across desktop
and mobile viewports — the theme toggle repainting, dark mode surviving a reload, the focus trap
holding across 50 Tab presses in both directions, combobox arrow-key wrapping, `<html lang>`
switching, landmark structure, heading order, CSV export, zero horizontal overflow at 390px, the
header search appearing on scroll and staying out of the tab order while hidden, social links
carrying `rel="noopener noreferrer"`, and text-on-background contrast for the two elements whose
hover states were previously unreadable.

```bash
npm run dev          # in one terminal
npm run verify       # in another
```

It found real bugs. The mobile horizontal-overflow assertion caught a 330px page-wide scroll
caused by absolutely-positioned screen-reader text escaping a scroll container that was not its
containing block — not something visible by looking at the page.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173/North-Bay/
npm run build      # typecheck + production build to dist/
npm run verify     # browser assertions (dev server must be running)
```

Requires Node 20+. `npm run verify` uses your installed Chrome; set `NB_CHROMIUM=1` to use
Playwright's own build instead.

## How it is organized

```
src/
  App.tsx              composition root — only state that spans regions
  components/          one file per region of the page
  hooks/               useTheme, useTranslation, useFocusTrap, useSiteSearch, useScrollLock
  data/                content and copy: i18n, navigation, feeds, alerts, conditions
  lib/                 pure helpers: gauge geometry, CSV, placeholder images
  styles/index.css     Tailwind entry, dark-mode variant, brand tokens
tests/verify.mjs       browser assertions
adr/                   architecture decision records
```

## Decisions, and the tests that hold them

`adr/` records the calls that were not obvious — each with the alternatives that lost, and **the
assertion that fails if the decision is violated**. An ADR without enforcement is a comment, not a
control.

Four of the six exist because a plausible-looking change broke something silently: dark mode that
toggled a class and repainted nothing, brand tokens that produced white-on-white buttons, a French
interface over English content, and a contrast measurement that was averaging a region no text
occupied. Each record says what went wrong, not just what was chosen.

This began as a single 1,464-line `.tsx` file. Splitting it was not tidying for its own sake: the
dark-mode bug below was invisible inside a monolith and obvious once the CSS had a file of its own.

## Notes on the rebuild

Four classes of dead code surfaced when this moved from a single-file prototype to a real build,
each of which looked fine and did nothing:

1. **Dark mode never worked.** Tailwind v4 compiles `dark:` utilities against
   `prefers-color-scheme` by default and ignores a toggled class. The workaround in the prototype
   — hand-written `.dark .dark\:bg-*` rules inside a JS template literal — was itself inert,
   because `\:` collapses to `:` in a template literal, producing a selector that matches nothing.
   Fixed with one `@custom-variant` line, which let ~113 lines of workaround CSS be deleted.
2. **Every entrance animation was inert.** `animate-in`, `fade-in`, `slide-in-from-*` come from a
   plugin that was never installed. Now defined directly as keyframes.
3. **`!important` on the brand tokens defeated every `dark:` pairing.** Invisible while dark mode
   was broken; the moment it worked, thirteen token/variant pairs rendered navy-on-black. Fixed
   by moving them into `@layer components`, where Tailwind's layer order does the work.
4. **The mobile search field was inert** — it accepted typing and had no state behind it, on the
   viewport most residents arrive from. It now shares one component with the hero search.

A second pass, once dark mode was working and the bugs it had been hiding became visible:

5. **The fire-danger needle was `#111111`** — the one element carrying the actual reading,
   near-invisible against the dark card. It now inherits `currentColor`, so it cannot fall out of
   step with the surface behind it again.
6. **The event date tile was unreadable on hover in both themes**, for opposite reasons: navy on
   navy in light, blue on blue in dark. Both traced to one component's states being spread across
   two cascade layers. It is now a single component class with its states defined in one place.

## Licence and attribution

Code is available for review as part of a job application. City of North Bay branding, wordmark,
and municipal content are the property of the Corporation of the City of North Bay and are
reproduced here solely to illustrate a redesign proposal.

Built with React, TypeScript, Vite, and Tailwind CSS.
