# ADR-0006 — Verified in a Real Browser Before "Done"

**Status:** Accepted · **Date:** 2026-07-30
**Supersedes:** — · **Superseded-by:** —

## Context
Typechecking and linting say the code is well-formed. They say nothing about whether the theme
toggle repaints, whether a focus trap holds, or whether a button is white-on-white on hover. Every
significant defect in this project's history passed both gates and shipped.

There is a sharper version of the problem. Several regressions here were caught only after they
reached the live site, and in each case an assertion *did* exist — it was measuring the adjacent
thing. An overflow check watched the header row while the nav's children spilled out of it. A
contrast check averaged a region no text occupied. A search assertion resolved `.first()` to a
different combobox than the one under test.

## Decision
Behavioural claims are verified against a real browser before the work is called done, and the
same suite is run against the deployed URL after every release — not only against localhost.

An assertion must measure **the thing claimed**, not a proxy for it. When a defect is found, the
first question is why the existing assertion missed it, and the fix includes closing that gap.

## Considered Options
- **Playwright against real Chrome — chosen** — drives the actual rendering engine, can read
  computed styles and composited pixels, and runs against localhost and production unchanged.
- **jsdom unit tests** — rejected: no layout, no paint, no computed cascade. Every bug in this
  project's history would have passed.
- **Manual checking** — rejected: it is how these shipped. It also cannot see screen-reader-only
  text, which is where one French leak was hiding.
- **Visual snapshot diffing** — rejected as primary: flags every intentional change as a failure
  and answers "did pixels move", not "does the control work".

## Consequences
The suite is 66 assertions and takes about a minute. It needs Chrome (or Playwright's own
Chromium via `NB_CHROMIUM=1`). Running it against production after each deploy has repeatedly been
worth it — the deployed environment differs from dev in base paths, asset hashing and caching.

The honest limit: a browser assertion catches what someone thought to ask about. Several bugs here
surfaced by hovering things by hand first, and only then became assertions.

## Enforcement
```bash
npm run dev            # one terminal
npm run verify         # another
NB_URL=https://fevra-dev.github.io/North-Bay/ npm run verify   # against production
```
`.github/workflows/deploy.yml` gates the deploy on `typecheck`, `lint` and `format:check`, so a
build that does not typecheck never reaches the live URL.
