# ADR-0001 — Zero-Trust Dependencies

**Status:** Accepted · **Date:** 2026-07-27
**Supersedes:** — · **Superseded-by:** —

## Context
A front-end project can reach a hundred transitive dependencies without anyone deciding to let it.
Each one is code that ships to a resident's browser, a maintainer who could be compromised, and a
package that has to keep existing for the build to keep working. On a municipal site the cost is
not abstract: dependency weight is measured in seconds of load time on the mobile connection most
residents arrive on.

Two moments in this project made the trade concrete. The markup used `animate-in`, `fade-in` and
`slide-in-from-*` classes, which come from `tailwindcss-animate`. The footer needed four brand
glyphs — Facebook, X, Instagram, YouTube — which lucide-react no longer ships, because they are
trademarks rather than iconography.

## Decision
No third-party dependency is added without a written justification that names the exact package
and version, and weighs its cost — transitive count, maintenance status, bundle weight — against
the cost of writing the functionality here. Prefer the platform or an in-house implementation for
anything trivial. Pin exact versions; no floating ranges.

## Considered Options
- **Write it here — chosen** — the animations are four `@keyframes` rules and the brand marks are
  four SVG paths. Both are static, neither needs updating, and together they are under 40 lines.
- **`tailwindcss-animate`** — rejected: a whole package and its update surface, to generate CSS
  that does not vary.
- **A second icon library for four glyphs** — rejected: brand marks are stable trademarks, so the
  library provides no ongoing value, and the four paths cost less than the dependency's own entry.

## Consequences
Adding a dependency is slower and requires an argument, which is the point. The four keyframes and
four SVG paths are now this project's to maintain — acceptable because neither will change. A
future contributor who wants `tailwindcss-animate` has to read this and disagree in writing rather
than reach for it by reflex.

## Enforcement
- `trivy fs --scanners vuln,secret,license` runs in the pre-push gate and blocks on HIGH/CRITICAL.
- `npm ci` in `.github/workflows/deploy.yml` installs strictly from the lockfile and fails if the
  lockfile and `package.json` disagree, so a build can never silently resolve a different tree.
- The two applied cases carry the rationale inline: `src/styles/index.css` (keyframes) and
  `src/components/Footer.tsx` (brand paths).
