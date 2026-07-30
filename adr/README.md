# Architecture Decision Records

Short records of decisions that were not obvious, written so a future reader — or a future me —
does not re-litigate a settled call or reverse it by accident.

Each one states the decision, the alternatives that lost and why, and **the test that fails if the
decision is violated**. An ADR without enforcement is a comment, not a control.

| # | Decision | Why it exists |
| --- | --- | --- |
| [0001](0001-zero-trust-dependencies.md) | Zero-trust dependencies | Declined `tailwindcss-animate` and a second icon library; wrote 4 keyframes and 4 SVG paths instead |
| [0002](0002-class-based-dark-mode.md) | Class-based dark mode | The theme toggle did nothing; Tailwind v4 keys `dark:` off the OS setting by default |
| [0003](0003-cascade-layers-for-brand-tokens.md) | Cascade layers split resting colour from interaction state | `!important` broke dark mode; removing it broke every hover state |
| [0004](0004-content-level-bilingual-data.md) | Bilingual data, not a bilingual interface | Translating only the chrome left thirteen English links under "Services et paiements" |
| [0005](0005-measured-not-asserted-accessibility.md) | Accessibility measured from rendered pixels | White text over a photograph is where municipal sites quietly fail SC 1.4.3 |
| [0006](0006-browser-verification-before-done.md) | Verified in a real browser before "done" | Every significant defect here passed typecheck and lint |

New decision → copy [TEMPLATE.md](TEMPLATE.md). ADRs are append-only: supersede, don't edit.
