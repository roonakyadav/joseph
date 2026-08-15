# APEX Conversion and Interaction Review

**Review date:** 15 August 2026  
**Method:** First-time mobile visitor review at 390 × 844, followed by focused route and CTA verification. The review used the live public routes and did not create marketplace records, proof material, or submissions.

## CTA hierarchy

| Priority | Action | Placement and treatment | Result |
|---|---|---|---|
| Primary buyer action | **Explore accounts** | Green hero action on `/` | Clear buyer-first entry to the public account index. |
| Primary record action | **Contact on WhatsApp** / **Copy WhatsApp enquiry** | Sticky account detail decision rail when a genuine account is available | Preserved as the single decisive account-level action. |
| Secondary trust action | **Browse accounts** | Empty proof archive | Prevents a no-proof state from becoming a buyer dead end. |
| Secondary community action | **Open WhatsApp community** | Home community relay when configured | Kept distinct from an individual account enquiry. |
| Seller action | **Submit an account** | Secondary home hero action, plus persistent index navigation | Directly discoverable without competing with the buyer-primary CTA. |

## Journey observations

### Buyer looking for an account

The visitor can identify APEX as a controlled public archive, enter through **Explore accounts**, understand the no-record dossier state, and retain a clear expectation that only published records appear. Account-card browsing, a genuine account detail page, gallery controls, specs, and WhatsApp inquiry cannot be exercised on the current clean catalog without fabricating inventory. This is deliberately deferred until an operator publishes a genuine account record.

### Trust-focused buyer checking evidence

The proof archive clearly states its privacy-review boundary and uses a published-only empty state. The **Browse accounts** continuation returns the visitor to the intended primary discovery path. When genuine public proofs exist, each card links to the related account record; that path remains data-driven and was not simulated with invented evidence.

### Seller considering submission

The seller action is available from the homepage and the archive index. The `/sell` route explains private review, shows the staged dossier protocol before long inputs, frames supporting images as review evidence, and separates submission from publication. The final form action does not promise approval, price, sale, or self-publishing.

## Changes made from the review

1. Replaced unsupported “verified” catalogue wording with publication-led language.
2. Added a compact record-status dossier to the no-account state.
3. Confirmed the proof archive already returns empty-state visitors to the account index.
4. Replaced residual marketplace wording on the home hero and welcome overlay with **account archive** language.
5. Replaced the vague home hero protocol control with a secondary **Submit an account** route, while retaining **Explore accounts** as the primary action.
6. Replaced residual “verified” claims in account-card, account-detail, and proof-adjacent language with accurate **published**, **available**, and **archived** record terminology.
7. Added a non-clickable **Archived account reference** treatment for a published proof whose connected account is no longer public, preserving context without offering a broken link.
8. Refined the archive-index drawer as a proper modal route index: it now has an explicit backdrop, Escape and backdrop dismissal, focus containment, focus return to the trigger, body-scroll locking, active-route state, and mobile-sized row targets.
9. Added a concise footer disclaimer clarifying that APEX is an independent public record service and is not affiliated with EA or EA SPORTS.

## Final presentation and access review

The current public routes were rendered at **390 × 844** and **1440 × 1000**. The first mobile viewports provide a meaningful next action immediately: buyers see the account-archive entry, account-index filters and dossier state, proof-archive continuation, or the seller-review protocol. The desktop views retain the same hierarchy with more deliberate white space rather than changing to a separate product experience.

Account-record source review confirms the mobile hierarchy is gallery → record identity and price → decision rail → factual specifications → related records. A configured account exposes a calm **Contact on WhatsApp** action; where no channel is configured, the interface uses a clear copy-enquiry fallback rather than implying payment or inventing contact data. The configured live record and WhatsApp journey remains deferred until the operator adds genuine inventory and a real channel.

The public catalogue and proof states use content-shaped loading/empty treatments, concise visitor-facing error language, visible focus styles, reduced-motion handling, and utility-only continuations. The protected admin interface remains visually separate and anonymous direct access to the valid `admin.dashboard` procedure returned **403 Forbidden** during validation.

## Validation summary

| Check | Result |
|---|---|
| Type check | Passed with zero TypeScript errors |
| Automated tests | Passed: 11 tests across 5 suites |
| Production build | Passed; route chunks remain split and no new bundle warning was introduced |
| Mobile public routes | Home, Accounts, Proofs, and Sell rendered successfully at 390 × 844 |
| Desktop public routes | Home, Accounts, Proofs, and Sell rendered successfully at 1440 × 1000 |
| Runtime logs after final edits | No current browser application errors or non-2xx public-route requests detected |
| Crawler endpoints | `robots.txt` and `sitemap.xml` returned the intended public routes and excluded `/admin` and `/api/` |

## Honest limitation and next validation

The remaining conversion-critical check is a real published account journey: catalogue card → account record → gallery/specs → configured WhatsApp action. It should be run only after the operator adds genuine reviewed inventory and a live configured contact route. No fabricated records, proof images, reviews, status claims, or user data were created for this review.
