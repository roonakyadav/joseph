# APEX Visual Refinement Pass

- [x] Finish reading and distill the complete refinement brief.
- [x] Audit the current Home page at 390 × 844 and identify specific composition, hierarchy, and product-emphasis gaps.
- [x] Redesign the hero into a product-led APEX account-artifact composition.
- [x] Strengthen the account metadata grammar, visual rhythm, typography contrast, and concept-specimen teaser.
- [x] Replace the generic menu treatment with a branded, touch-native mobile navigation experience.
- [x] Add restrained scroll-linked and touch-native motion while respecting reduced-motion preferences.
- [x] Validate 360, 375, 390, and 412px mobile layouts before testing desktop expansion at 768–1920px.
- [x] Run type, production-build, console, image, and overflow checks; complete final visual review.
- [x] Save and deliver the visual-refinement checkpoint.

# APEX Account Discovery

- [x] Finish reviewing the complete account-discovery brief and record the non-negotiable product constraints.
- [x] Audit the current route and data architecture, then define a presentation-independent Account model.
- [x] Generate distinct concept-only account product imagery and persistent UI states needed for the catalog.
- [x] Build the `/accounts` route around compact catalog entry, search, quick filters, sorting, and a touch-native filter sheet.
- [x] Create custom APEX account cards with deliberate available, sold, skeleton, missing-image, no-data, and no-results states.
- [x] Build `/accounts/[account-id]` as a compact inspection record with an honest seller-contact configuration state; the full detail surface remains intentionally out of scope.
- [x] Connect Home and catalog navigation without breaking the established Account Archive header language.
- [x] Validate search, filters, sorting, card actions, detail route, and 360/375/390/412px layouts before desktop expansion.
- [x] Run production checks, visual review, checkpoint, and delivery.

# APEX Premium Account Detail

- [x] Finish reviewing the complete account-detail brief and record the scoped product decisions.
- [x] Extend the development Account model with truthful gallery, squad, specification, transfer, and seller-contact fields.
- [x] Rebuild the mobile account hero so gallery imagery is the first product signal, followed by identity, OVR, status, price, and action.
- [x] Add swipeable gallery, pagination, missing-image handling, fullscreen lightbox, Escape behavior, focus restoration, and scroll locking.
- [x] Build premium specs, key-player, factual account-summary, and transfer-information sections using only populated data.
- [x] Create an honest configurable WhatsApp handoff with contextual messaging, plus a safe no-contact state.
- [x] Add a safe-area-aware sticky mobile conversion bar and an appropriate archived sold-state alternative.
- [x] Add a compact related-account continuation module with data-derived suggestions.
- [x] Validate normal, sold, missing, gallery, lightbox, WhatsApp, and 360/375/390/412px flows before desktop expansion.
- [x] Run final build, visual review, checkpoint, and delivery.

# APEX Sale Proofs Archive

- [x] Finish reviewing the complete proof-archive brief and document the non-fabrication, privacy, and publishing rules.
- [x] Define a presentation-independent Proof model that keeps development sample content separate from authentic published proof.
- [x] Prepare development-only proof assets that are unmistakably labelled and contain no customer, payment, transaction, or personal data.
- [x] Add the `/proofs` route and connect it to Home and APEX navigation without breaking direct URL or browser-history behavior.
- [x] Build the mobile-first documentary proof archive with image-led evidence cards and an ethical empty state.
- [x] Implement proof-to-account linking only where a linked account remains publicly reachable.
- [x] Build an accessible fullscreen proof viewer with keyboard, touch, focus, zoom, lock-scroll, and reduced-motion support.
- [x] Validate development, empty, missing-image, related-account, viewer, and 360/375/390/412px mobile states before desktop expansion.
- [x] Run production checks, visual review, checkpoint, and delivery.

# APEX Seller Intake

- [x] Finish reviewing the seller-intake brief and record the required privacy, review, and non-publishing constraints.
- [x] Define a presentation-independent seller-submission model and a clearly temporary service boundary without localStorage persistence.
- [x] Add the `/sell` route and connect it to live APEX navigation and relevant entry points.
- [x] Build the compact mobile seller-intake introduction and four-stage review expectation sequence.
- [x] Implement the account profile form with useful required/optional field labeling and field-level validation.
- [x] Build client-side evidence selection, preview, removal, reorder, image constraints, and no-sensitive-secrets guidance.
- [x] Implement an honest temporary submission handoff and complete confirmation screen that does not claim a listing or review decision.
- [x] Validate normal, validation-error, image-preview, confirmation, missing-contact, and 360/375/390/412px mobile states before desktop expansion.
- [x] Run production checks, visual review, checkpoint, and delivery.

# APEX Secure Admin & Operations

- [x] Document the shared account, media, submission, proof, settings, lifecycle, and role-based authorization model.
- [x] Upgrade the static project to the secure full-stack foundation with authentication, database, and file storage.
- [x] Add server-authorized admin routes and mutation APIs; verify public users cannot access or mutate operational data.
- [x] Build the authenticated desktop-oriented `/admin` dashboard with only real operational counts and action-oriented empty/loading/error states.
- [x] Build protected account inventory listing, create/edit forms, archive/sold/featured controls, safe destructive confirmations, and media upload/reorder/primary workflows.
- [x] Build seller submission review, status progression, request-changes/reject/approve-for-listing actions, and safe submission-to-account conversion.
- [x] Build protected proof management with publish/archive controls, privacy-redaction guidance, account links, and a production-versus-development guard.
- [x] Build protected store settings for only public-facing values currently used by APEX.
- [x] Replace public hardcoded data with shared published queries and validate account, featured, sold, proof, and settings propagation.
- [x] Test secure access control, mutations, storage boundaries, 390–1920px layouts, and the required operational end-to-end flow. The authenticated real-record lifecycle exercise is intentionally deferred pending provider-side preview-origin registration; no marketplace test data was created.
- [x] Run final production checks, independent review, checkpoint, and delivery.

# APEX Operations Implementation Detail

- [x] Resolve the full-stack Home merge artifact without replacing the established Account Archive public page.
- [x] Migrate a shared operational schema for published accounts, controlled media, seller submissions, proof records, and store settings.
- [x] Enforce role-gated operations server-side and prohibit public exposure of drafts, archived records, development proofs, and unreviewed submissions.
- [x] Replace all public demo datasets and seller handoff logic with database-backed queries and mutations.
- [x] Require approved seller submissions before they can be converted into an APEX account draft.
- [x] Align the archive-control published-inventory metric with published records only.
- [x] Add a private request-changes status and action to the seller-submission review workflow.
- [x] Unify the mobile private-operations header with the APEX archive document frame.
- [x] Defer provider-side registration of the canonical Manus preview or published callback origin; the application audit is complete, and this workspace cannot modify that provider configuration without a supported provider-side setting.
- [x] Add non-interactive automated coverage for critical protected mutations and the controlled media upload boundary.
- [x] Separate verified public/private access and responsive review from the deferred authenticated real-record lifecycle exercise in the operations validation record.
- [x] If OAuth redirect registration is unavailable in this environment, defer only authenticated lifecycle exercise and keep public product validation unblocked.

# Attached Requirements Application

- [x] Review the newly attached APEX requirements and translate each applicable item into a verified product change.
- [x] Create FINAL_AUDIT.md after reviewing every public and private route, shared state, failure state, and deployment concern.
- [x] Resolve all identified P0 and P1 hardening issues and practical P2 polish issues without redesigning the product or adding unsupported commercial claims.
- [x] Complete a mobile-first touch, navigation, WhatsApp conversion, search/filter/sort, forms, and responsive layout review across public routes.
- [x] Audit account/proof/image data integrity, public claims, placeholder content, accessibility, error handling, security boundaries, and the APEX 404 experience.
- [x] Implement supported technical SEO, route metadata, canonical/robots/sitemap assets, semantic content improvements, and image performance safeguards.
- [x] Serve a host-derived XML sitemap containing only public stable routes and published account records.
- [x] Verify lazy-loaded public, fallback, and protected routes after vendor chunking before closing the bundle-size warning task.
- [x] Apply noindex route metadata to the private operations area and missing-record fallbacks.
- [x] Implement privacy-conscious, non-sensitive product analytics using only the project’s supported infrastructure.
- [x] Verify account-record open analytics sends only non-sensitive attributes and passes the final type/build checks.
- [x] Complete final public/admin visual, performance, browser, and production-build QA; create FINAL_QA.md and LAUNCH_CHECKLIST.md.
- [x] Verify non-home route splitting with a post-change production build and public/protected route checks before recording the payload improvement as complete.
- [x] Replace the proof archive “being built” empty-state headline with a truthful no-published-records message.
- [x] Correct the malformed HTML tail that exposes debug characters below public pages.
- [x] Replace the generic light 404 with the APEX Account Archive fallback state.
- [x] Remove raw error-stack disclosure from the client fallback and use a branded, non-sensitive recovery state.
- [x] Replace remaining development-preview and build-stage labels in the public navigation with accurate live archive language.
- [x] Replace stale build, future-listing, platform-preview, and configuration-pending copy on the live home experience, including non-destination index rows and concept labels.
- [x] Remove public preview-query switches that expose development-only welcome, index, filter, and empty-state behavior.
- [x] Remove the proof-viewer query preview switch from the public evidence archive.
- [x] Remove the account media-viewer query preview switch from the public account-record route.
- [x] Remove the seller-intake validation preview switch and track only successful, non-sensitive submission completion.
- [x] Verify and remove any stray literal artifact between seller-form sections; source verification confirmed the apparent artifact was a line-number display boundary, not rendered JSX.
- [x] Preserve original publication and sold timestamps across routine account edits, rather than resetting lifecycle history.
- [x] Require a valid public primary image before an account record can be published, and verify optional proof-account links.
- [x] Restrict the community setting to a safe HTTPS WhatsApp destination and retain safe media ownership checks on private mutations.

# Resubmitted Revision Application

- [x] Review the resubmitted APEX revision and translate each applicable requirement into a verified product change.
- [x] Perform the required first-time visitor journey at 390px across landing, account discovery, a published record, gallery, specs, and WhatsApp without inspecting implementation details. Published-record, gallery, and configured WhatsApp validation remain explicitly deferred until genuine inventory exists.
- [x] Establish and verify the public CTA hierarchy: account discovery and account inquiry primary; proofs and community secondary; navigation tertiary.
- [x] Review and document account-detail inquiry/information hierarchy, account-card/proof continuity, seller guidance, and mobile drawer behavior; refine only evidence-backed friction while retaining genuine-record-dependent actions as deferred.
- [x] Complete and record a focused final UX hardening pass covering interaction feedback, loading/error/empty states, typography/spacing consistency, footer utility, accessibility, and performance after the latest homepage and catalogue changes.
- [x] Add a concise public-footer independence disclaimer without introducing unsupported commercial claims.
- [x] Remove unsupported “verified” language from account-detail price and related-record treatments.
- [x] Add evidence-backed mobile archive-index drawer focus return, Escape dismissal, focus containment, scroll locking, and an explicit backdrop.
- [x] Raise the archive-index trigger and close control to a 44px minimum touch target.
- [x] Show a non-clickable archived account reference on proof records when the related account is no longer publicly reachable.
- [x] Replace the remaining homepage marketplace phrasing with accurate controlled-archive language, including the welcome overlay.
- [x] Reverify the buyer, trust-focused buyer, and seller journey record against the final public routes, explicitly retaining the genuine-record-dependent steps as deferred.
- [x] Make the seller submission route directly discoverable from the homepage hero without competing with the buyer-first primary action.
- [x] Add a secondary account-index continuation to the empty proof archive so evidence review does not end the buyer journey.
- [x] Verify the `/accounts` publication-led wording and the dossier-style no-record state after the interrupted patch recovery.
- [x] Fix the clean-database `/admin/settings` query so `admin.settings.get` always returns defined data and does not trigger a React Query undefined-data error.
- [x] Add focused regression coverage for the admin settings default/fallback contract.

# Elite Traders Configuration and Authorization

- [x] Inspect current users, roles, server-side authorization, store settings, and user-facing APEX brand surface without altering marketplace data.
- [x] Restrict server-side admin authorization to roonakyadav1609@gmail.com and elitetradersfcm@gmail.com, while preserving ordinary authenticated users as non-admins.
- [x] Safely demote any existing users outside the approved two-email admin set without deleting users or marketplace data.
- [x] Configure the provided official WhatsApp community URL through the existing database-backed store settings model without fabricating contact numbers.
- [x] Rename all user-facing APEX product branding, metadata, and public/admin copy to Elite Traders while retaining safe internal technical identifiers.
- [x] Add regression coverage for the two-email admin authorization policy and settings/brand configuration behavior.
- [x] Validate public pages, metadata, community CTA, admin access boundaries, protected procedures, and the production build; document any OAuth provider-side blocker.

# GitHub Delivery

- [x] Identify the intended Joseph repository, current GitHub linkage, and target branch for the verified Elite Traders checkpoint (`roonakyadav/joseph`, new `main` branch).
- [x] Confirm the repository push target and synchronize the current verified project revision without changing application code.

# Homepage Headline Copy

- [x] Replace only the homepage hero headline with “Buy or sell FC Mobile accounts.” while preserving its current visual treatment and behavior.
- [x] Verify the updated hero headline at the mobile viewport, run the relevant check/build, and push the requested isolated commit to `roonakyadav/joseph`.

# Hero Label Simplification

- [x] Replace only the homepage hero technical label with “FC MOBILE ACCOUNTS”, removing its green-highlight treatment and avoiding an empty mobile gap.
- [x] Verify the simplified hero label at the mobile viewport, run the relevant check/build, and push the requested isolated commit to `roonakyadav/joseph`.

# Mobile Archive Spacing

- [x] Identify and correct only the underlying responsive layout rule causing excess mobile space between Featured in the archive and the Account Protocol section.
- [x] Verify the narrowed mobile gap plus tablet/desktop behavior, run the relevant check/build, and push the requested isolated commit to `roonakyadav/joseph`.

# Archive Whitespace Follow-up

- [x] Re-measure and remove only any remaining excessive mobile whitespace below Featured in the archive and above Account Protocol, preserving the desktop composition. The existing `2.75rem` mobile rule yields an approximately 32–44px rendered boundary.
- [x] Verify the adjusted mobile boundary plus tablet/desktop behavior, run the relevant check/build, and push the requested isolated commit to `roonakyadav/joseph`. No further code change was necessary beyond commit `76c6821`.

# Mobile Bottom Navigation

- [x] Review the complete mobile-bottom-navigation brief and current shared public navigation architecture without altering routes, commerce behavior, or desktop navigation.
- [x] Replace the mobile Index overlay pattern with one shared, safe-area-aware floating bottom navigation containing only Home, Buy, Sell, and Proofs.
- [x] Remove the now-unused mobile menu trigger, overlay interaction, and local state while retaining an appropriate desktop navigation model.
- [x] Add responsive mobile public-content clearance so the floating navigation does not cover end-of-page content.
- [x] Verify all four routes, active state, keyboard/touch behavior, safe-area handling, 320–414px layouts, tablet/desktop composition, and production build.
- [x] Save, commit, and push the approved mobile navigation implementation to `roonakyadav/joseph` without changing unrelated product functionality.
