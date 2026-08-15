# APEX Seller Intake — Product and Privacy Boundary

## Intended flow

> **Sell → submit → review.** A seller provides account information and supporting screenshots for APEX consideration. A submission is never a public listing, an approval, a seller profile, a payment request, or a collection point for account credentials.

## Submission model

| Category | Fields | Reasoning |
| --- | --- | --- |
| Contact | Preferred name, contact method, contact address | Lets APEX continue the review without requesting unrelated identity data. |
| Account overview | Title, OVR, price expectation, rank, formation | Supplies the initial catalog-review context. |
| Resources | Coins, gems, FC Points | Optional structured context for an eventual account record. |
| Squad | Key players, notes | Optional concise description of distinguishing elements. |
| Evidence | Browser-selected image files | Temporarily available to the live form only; not persisted by this static build. |

## Explicit static-project boundary

The project has no secure backend, review queue, database or file storage configured. `handoffSellerSubmission()` is therefore a named service seam that returns **not configured** rather than faking a saved submission. It never uses localStorage as false production infrastructure and never automatically creates a public listing.

## Privacy restrictions

The interface explicitly excludes passwords, recovery codes, payment credentials, and other authentication secrets. Any production submission endpoint must enforce authentication, consent, rate limiting, retention policy, virus scanning and secure file storage before it is enabled.
