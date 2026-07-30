# ADR-0002 — Class-Based Dark Mode

**Status:** Accepted · **Date:** 2026-07-27
**Supersedes:** — · **Superseded-by:** —

## Context
The site shipped with a sun/moon toggle that did nothing. The class landed on the element, the
state updated, and not one colour changed.

Two causes, stacked. Tailwind v4 compiles every `dark:` utility inside
`@media (prefers-color-scheme: dark)` by default, so the utilities only ever respond to the
operating system and ignore a toggled class entirely. The workaround already in the prototype —
hand-written `.dark .dark\:bg-*` rules inside a JSX template literal — was itself inert, because
`\:` collapses to `:` in a template literal, producing selectors that match nothing. Roughly 113
lines of CSS that looked like a fix and was not.

## Decision
Dark mode is driven by a `.dark` class on `document.documentElement`, and the `dark:` variant is
redefined once in the CSS entry to key off it:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

The class goes on the document element, never on a wrapper. A blocking script in `index.html`
applies it before first paint, reading the same `nb-theme` key the theme hook writes.

## Considered Options
- **`@custom-variant` on the root element — chosen** — one line, works with every existing `dark:`
  utility, and let the 113-line workaround be deleted outright.
- **Hand-written `.dark` overrides per utility** — rejected: it is the thing that was already
  broken, it has to be maintained by hand against every new utility, and it silently drifts.
- **`.dark` on a wrapper `<div>`** — rejected: leaves `<html>` and `<body>` unstyled, so the area
  behind a short page and the iOS overscroll region stay light while the content is dark.
- **Follow `prefers-color-scheme` only, no toggle** — rejected: a visitor who wants the other
  theme for this one site has no way to ask for it.

## Consequences
`:where()` keeps the variant at zero specificity, so `dark:` utilities still lose to a more
specific rule exactly as before — this changes what they respond to, not how they rank. The
pre-paint script and `useTheme` share one storage key and must be changed together; both say so.
Anything that renders outside `<html>` (there is nothing today) would not inherit the theme.

## Enforcement
`tests/verify.mjs` asserts the toggle sets `.dark` on `<html>`, that the page background actually
*repaints* between themes rather than merely toggling a class, and that the choice survives a
reload. A regression to the `prefers-color-scheme` default fails the repaint assertion.
