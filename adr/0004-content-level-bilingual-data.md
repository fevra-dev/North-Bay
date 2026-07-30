# ADR-0004 — Bilingual Data, Not a Bilingual Interface

**Status:** Accepted · **Date:** 2026-07-30
**Supersedes:** — · **Superseded-by:** —

## Context
Ontario's French Language Services Act makes French-language service a requirement in designated
areas, and a municipal website is where most residents meet that promise or find it hollow.

The first pass translated the interface chrome and left everything else in English, on the
reasoning that navigation items and news headlines are CMS content rather than template strings.
The reasoning was sound. The result was a French page with thirteen English links under "Services
et paiements", English headlines, English table headers, and a search index that behaved as though
the French side of the site did not exist. A resident does not care which layer a string came from.

## Decision
Content carries its own `{ en, fr }` pair alongside it, in the same record as everything else about
that item — see `src/data/navigation.ts`, `feeds.ts`, `search.ts`, `conditions.ts`. UI chrome stays
in the key-based dictionary in `src/data/i18n.ts`.

Language is a React context, not a hook returning local state, and not a prop.

Search matches **both** languages regardless of which is active, and folds diacritics before
comparing.

Stable English keys (`'City Council'`, category names) remain the lookup keys; only their display
labels are translated.

## Considered Options
- **`{ en, fr }` on the record — chosen** — models exactly what a localized CMS field is, keeps a
  translation beside the thing it describes, and makes an untranslated field visible in review.
- **Everything in the key dictionary** — rejected: hundreds of flat keys divorced from the content
  they belong to, and adding one news item means editing two files.
- **A separate French route or site** — rejected: two artefacts drift, and the drift always lands
  on the smaller audience.
- **Machine translation at runtime** — rejected: unreviewed machine output presented as municipal
  communication is worse than English, and Tokyo's portal is instructive precisely because it
  labels machine-translated content as such.
- **Match only the active language in search** — rejected: bilingual residents mix languages and
  often know a municipal term in only one of them, so this penalises exactly the people the French
  interface exists to serve.

## Consequences
Adding content means writing both languages, which is the intended friction — it is visible at
review time rather than discovered by a francophone resident. The French has **not** had a
native-speaker review; that is disclosed in the site's own accessibility statement, in both
languages, and should stay there until someone fluent has actually read it.

Because language is a context, a component rendered outside the provider throws rather than
silently defaulting to English — a partial-language page is far harder to notice than a build that
stops.

## Enforcement
`tests/verify.mjs` switches to French, opens every mega menu, and scans the rendered page for a
list of English-only markers; anything surviving the switch is by definition untranslated. It also
asserts French search ("ordures"), accent-folded search ("impots" → "Impôts fonciers") and
cross-language search ("garbage" while in French). The scan caught the screen-reader-only text on
the Agenda buttons still reading "City Council" — invisible to sighted testing.
