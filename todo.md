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
- [ ] Generate distinct concept-only account product imagery and persistent UI states needed for the catalog.
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
- [ ] Test secure access control, mutations, storage boundaries, 390–1920px layouts, and the required operational end-to-end flow. Authenticated real-record lifecycle exercise is deferred pending provider-side preview-origin registration; no marketplace test data will be created.
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
- [ ] Register the canonical Manus preview or published callback origin in the provider-side OAuth allowlist; the application audit is complete, but this workspace cannot modify that provider configuration.
- [x] If OAuth redirect registration is unavailable in this environment, defer only authenticated lifecycle exercise and keep public product validation unblocked.
