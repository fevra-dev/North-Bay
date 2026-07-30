# ADR-0005 — Accessibility Claims Are Measured, Not Asserted

**Status:** Accepted · **Date:** 2026-07-30
**Supersedes:** — · **Superseded-by:** —

## Context
This site targets WCAG 2.2 Level AA, one level above the WCAG 2.0 AA that Ontario's Integrated
Accessibility Standards Regulation requires of municipal sites. A conformance target stated in a
README is a claim; the question is what makes it true tomorrow.

The hero puts white text over a photograph — the single most common place municipal sites quietly
fail SC 1.4.3. The requirement applies to text against *whatever pixel is actually behind it*, not
against the average or against the colour in the stylesheet. A scrim that looks right over the
water can be unreadable over a cloud.

## Decision
Where a criterion is numeric, assert the number from rendered pixels rather than from source.

For the hero: screenshot the heading's own bounding box with the text hidden, find the **lightest**
pixel in it — the worst case for white text — and compute the real contrast ratio. That number
must clear 4.5:1 or the suite fails.

Contrast is sampled at the scope the criterion describes: the text's box, not the whole section.

## Considered Options
- **Measure composited pixels — chosen** — the only method that survives changing the photograph,
  and it caught two real failures (see below).
- **Compute from the declared colours** — rejected: the scrim is semi-transparent over a
  photograph, so the stylesheet does not contain the answer.
- **Eyeball it** — rejected: it looked fine at 2.63:1 in one region and at 4.42:1 in another.
- **An automated audit tool (axe, Lighthouse)** — rejected as the *sole* check: they skip
  text-over-image contrast precisely because the backdrop is not a computable colour. Worth adding
  alongside, never instead.

## Consequences
The measurement is slower than reading a value, and it needs a screenshot decoder (`pngjs`) in
dev dependencies. It also has to be scoped correctly to be meaningful — an early version sampled
the whole hero section, most of which no text overlaps, and reported a worst-case pixel from a
region nothing was written on. That forced the scrim far darker than legibility required and
buried the photograph for nothing.

## Enforcement
`tests/verify.mjs`, both themes. Current: 5.02:1 light, 9.29:1 dark, against 4.5:1 required.

Two failures this caught that inspection did not:
- A first measurement returned 2.63:1 — **a false alarm**, sampling antialiased glyph edges as
  though they were backdrop. Trusting it would have made the scrim heavier for no reason.
- A later lightening returned 4.42:1 — **a real failure**, below the floor, before it shipped.
