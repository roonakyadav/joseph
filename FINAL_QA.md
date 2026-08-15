# APEX FC Mobile Store — Final QA

**QA date:** 15 August 2026  
**Release scope:** Production hardening for the public Account Archive and private APEX operations workspace.

## Automated validation

| Check | Result | Evidence |
|---|---|---|
| Type checking | Pass | `pnpm check` completed with zero TypeScript errors. |
| Automated suite | Pass | `pnpm test`: 5 test files and 11 tests passed. |
| Production build | Pass | `pnpm build` completed; route modules and vendor groups were emitted as separate chunks with no oversized-shared-bundle warning. |
| Public records contract | Pass | Anonymous `accounts.list` returned the expected public result contract on an empty catalog. |
| Private route boundary | Pass | Anonymous `admin.dashboard` returned HTTP 403. |
| Crawler controls | Pass | `/robots.txt` disallows `/admin`; host-derived `/sitemap.xml` contains only stable public routes on an empty catalog. |

## Responsive route review

The following routes were reviewed at **390 × 844** and **1280 × 720** after the final code changes.

| Route | Result | Notes |
|---|---|---|
| `/` | Pass | Archive framing, empty featured state, safe community-unavailable state, and live language render correctly. |
| `/accounts` | Pass | Empty published-index state, search/refine controls, and mobile/desktop layout render correctly. |
| `/accounts/not-a-record` | Pass | Account-specific unavailable-record recovery is clear and archive-consistent. |
| `/proofs` | Pass | Published-only empty state contains no build-stage copy and retains the privacy review boundary. |
| `/sell` | Pass | Long form remains ordered, legible, mobile-friendly, and explicit about private review. |
| `/not-a-route` | Pass | Branded archive 404 replaces the generic fallback. |
| `/admin` | Pass | Private archive shell, dense operations dashboard, and mobile header render coherently. |

## Security and integrity validation

- Public procedures exclude drafts, archived accounts, private seller submissions, and development proof specimens.
- Standard users are blocked from protected operations, account creation, and account-media mutation before database or storage side effects.
- Invalid, mismatched, or undersized upload payloads are rejected before storage.
- Publishing requires a primary account image; proof-to-account references are verified; operation timestamps preserve lifecycle history across edits.
- Community URLs are limited to secure WhatsApp destinations.
- Error fallback views do not expose stack traces or technical exception details.

## SEO, analytics, and performance validation

- Public route metadata, canonical URL handling, robots, and sitemap coverage are implemented without hardcoding an ephemeral deployment domain.
- Private and unavailable-record routes are marked `noindex` in the client route metadata layer.
- Dynamic social cards for individual account records remain a future SSR capability; the client-rendered application does not claim otherwise.
- Analytics uses the existing privacy-conscious browser provider and emits only non-sensitive interaction metadata: catalogue search/filter/sort, account record opening by OVR, WhatsApp/enquiry action, community open, and seller-submission completion.
- Route-level code splitting and vendor chunking reduce initial route payload work; non-home routes were visually rechecked after the split.

## Approved deferral

The interactive owner/admin lifecycle exercise remains deferred until the Manus OAuth provider registers the canonical preview or published callback origin. This does **not** weaken authentication or authorization. No test account, proof, seller submission, customer data, or fabricated marketplace record was created to simulate the flow. See `oauth-validation-status.md` for the exact provider-side dependency.

## QA decision

**Public product hardening: ready for operator review and publish.** The only remaining external prerequisite is provider-side OAuth redirect allowlisting before running a real owner-admin lifecycle with genuine records.
