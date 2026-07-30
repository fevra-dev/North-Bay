# ADR-0003 — Cascade Layers Separate Resting Colour From Interaction State

**Status:** Accepted · **Date:** 2026-07-30
**Supersedes:** — · **Superseded-by:** —

## Context
The two brand colours are semantic classes (`nb-bg-navy`, `nb-text-ink`) rather than arbitrary
values scattered through the markup, so changing the municipal navy is one edit.

They originally carried `!important` on every declaration. That made light mode correct and dark
mode impossible: `!important` beats `dark:text-blue-400`, so every element pairing a brand token
with a dark variant kept its light colour on a near-black background — thirteen such pairs, navy
`#003366` body links on `#09090b`. Removing `!important` fixed that and broke something else. A
Tailwind utility outranks anything in the `components` layer, so an element carrying both
`bg-white` and `nb-hover-bg-ink` kept its white background on hover while `hover:text-white`
applied anyway. White text on white. The button disappeared.

Both failures are the same mistake: one component's states spread across layers that resolve in an
order nobody chose.

## Decision
Split the tokens by role, not by convenience.

- **Resting colours** are declared in `@layer components`, so a `dark:` utility on the same element
  overrides them. That is what makes dark mode work at all.
- **Interaction states** — hover, group-hover, focus — are declared in `@layer utilities`, so they
  outrank the resting utility on the same element. That is the entire job of a hover state.

Neither uses `!important`. Selector specificity settles it on merit: `.nb-hover-bg-ink:hover` is
(0,2,0) against `.bg-white` at (0,1,0).

Where both the resting and hover colours have dark-mode counterparts, express the whole set in
plain Tailwind utilities instead, so the pair cannot half-apply.

## Considered Options
- **Split by role across the two layers — chosen** — states the rule in the cascade itself, so it
  holds without anyone remembering it.
- **`!important` everywhere** — rejected: the original state; makes dark mode unreachable.
- **`!important` on interaction states only** — rejected: works, but re-introduces the habit that
  caused the first bug and beats legitimate overrides too.
- **Arbitrary values (`bg-[#003366]`) in the markup** — rejected: no fight to lose, but the colour
  stops being editable in one place, which is the reason the tokens exist.

## Consequences
A contributor adding a brand token must decide which layer it belongs to. The distinction is
documented at the top of both blocks in `src/styles/index.css`. The failure mode this prevents is
specifically a *silent* one — nothing errors, nothing logs, the markup reads correctly, and the
control simply stops responding.

## Enforcement
`tests/verify.mjs` hovers the feedback buttons, both meeting-registry action buttons and a news
card, and asserts for each that the property actually changes **and** that foreground and
background do not end up equal. A token declared in the wrong layer fails one of the two.
