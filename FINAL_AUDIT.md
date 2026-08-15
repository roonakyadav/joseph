# APEX FC Mobile Store — Final Audit

**Audit date:** 15 August 2026  
**Scope:** Public storefront, account discovery, account record, proof archive, seller intake, private operations workspace, live data contracts, media processing, responsive visual system, accessibility, SEO, analytics, error states, and release readiness.

## Executive assessment

APEX has a coherent, premium **Account Archive** visual system and a sound core operating model: public records are database-backed, administration is gated on the server, seller submissions remain private, and development proof specimens cannot be published. The public catalogue remains usable with an empty database, and no fabricated reviews, social proof, customer records, or marketplace inventory were introduced.

The audit identified two implementation-level production defects and several release hardening opportunities. The defects are limited in scope but are high priority because one leaves malformed markup visible in the public document and another exposes raw client error stacks. The following corrective work is required before the hardening release is considered complete.

| Priority | Finding | Impact | Required correction |
|---|---|---|---|
| P0 | `client/index.html` contains a malformed trailing `@@`/duplicate head fragment. | Invalid document structure and visible debug characters at the bottom of public pages. | Restore a single valid document head and body. |
| P0 | `ErrorBoundary` renders `error.stack` to customers. | Internal implementation details may be exposed after a client failure. | Replace with an APEX recovery state that does not render technical error details. |
| P1 | The public 404 is a generic light template. | Breaks the established archive product frame. | Rebuild it as a dark archive-record fallback with one clear recovery action. |
| P1 | Static metadata still says “currently in development”; no robots, sitemap, canonical, or route-level metadata layer exists. | Weak crawl, search, and share presentation. | Add supported static/route metadata, robots, sitemap, and a clear SSR limitation record for dynamic social cards. |
| P1 | Published/sold timestamps are recalculated on every account edit; publication does not require a primary image. | Historical lifecycle data can drift and public records can ship without a visual record. | Preserve transition timestamps and require a primary image to publish. |
| P1 | Community URLs and proof account references need stricter validation. | Reduces trust and allows irrelevant destinations or dangling record links. | Accept only HTTPS WhatsApp community URLs and verify linked account IDs. |
| P1 | Existing analytics tracks page views through the configured privacy-conscious provider but has no explicit high-value product event instrumentation. | Conversion and discovery signals cannot be measured consistently. | Add minimal non-sensitive events for catalogue search/filter, account inquiry, seller submission, and outbound community actions. |
| P2 | The account controls contain some conventional ecommerce language and preview/build labels remain in public navigation. | Slightly weakens the archive vocabulary. | Refine labels toward record/index terminology and remove build-stage claims. |
| P2 | Media mutations should assert ownership for all individual media updates/removals. | Better defensive data integrity for future operations changes. | Verify the related account before modifying media. |

## Route and state coverage

| Surface | Verified strengths | Audit outcome |
|---|---|---|
| `/` | Clear visual hierarchy, primary archive framing, database-backed featured-record and community seams. | Ready after metadata and event work. |
| `/accounts` | Live published records, loading/error/empty/filter-empty states, session-preserved discovery state, keyboard-friendly controls. | Refine copy and add search/filter telemetry; maintain intentional empty state. |
| `/accounts/:slug` | Live record lookup, sold treatment, gallery failure state, related records, WhatsApp/contact fallback. | Add per-record document metadata and retain published data-only source. |
| `/proofs` | Published/non-development public contract and privacy-minded archive presentation. | Ready after metadata and technical hardening. |
| `/sell` | Client and server validation, explicit private-review boundary, image validation and no self-publish claim. | Add submission-complete telemetry only; do not expose private submissions. |
| `/admin` | Authentication/role gate, dashboard-shell reuse, controlled record/media/proof/settings procedures. | Owner lifecycle exercise remains deferred only because provider-side redirect allowlisting is unavailable here. |
| unknown route | Route exists but is visually and semantically generic. | P1 correction required. |
| client failure | Root fallback catches failures but exposes raw stack information. | P0 correction required. |

## Security, privacy, and data conclusions

Public tRPC procedures return only published accounts and non-development published proofs. Admin mutations remain behind the server-side role gate. Seller contact information and submission evidence are not returned through public procedures. Upload validation limits type, decoded size, data-URL format, signature, and image dimensions before storage; automated tests verify invalid uploads do not reach storage.

No payment mechanics, login bypasses, plaintext credentials, customer reviews, or manufactured marketplace inventory are present. The one remaining authentication limitation is documented in `oauth-validation-status.md`: the provider must register the canonical preview or published callback origin before an authenticated owner session can be exercised outside an approved origin.

## SEO and performance decision

The current application is a client-rendered Vite application. Static metadata and page-level document metadata can materially improve normal browser and JavaScript-capable crawler behavior; static `robots.txt` and `sitemap.xml` can cover the stable public routes. Fully dynamic account social cards for non-JavaScript crawlers require the separately documented SSR conversion path and a stable canonical public origin. That conversion is not safe to partially emulate by hardcoding an ephemeral development URL.

The hardening release will therefore add correct static metadata, canonical/meta helpers, crawl assets, explicit noindex protection for private routes, image lazy-loading/async-decoding where appropriate, and privacy-conscious browser events. It will not misrepresent client-only metadata as guaranteed server-rendered social previews.

## Release criteria

The following must be completed before checkpointing the hardening release:

1. Resolve every P0 and P1 finding above.
2. Re-run type checks, automated tests, production build, and public/private endpoint checks.
3. Re-review public routes at mobile and desktop widths.
4. Record the result in `FINAL_QA.md` and provide an operator-facing `LAUNCH_CHECKLIST.md`.

> **Authenticated owner lifecycle validation remains an approved external dependency, not a reason to weaken the login flow or create test marketplace data.**
