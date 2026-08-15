# APEX Secure Admin & Operations Architecture

## Operating principle

The public storefront and private operations area will read from one shared database. Public queries will return only intentionally published, non-archived records. All administration, seller review, publishing, archiving, media changes and settings changes will be handled by authenticated server-side mutations that check an explicit administrative role before writing.

> A hidden route is never used as a security boundary. The `/admin` route is a usability entry point only; authorization is rechecked by every sensitive server query and mutation.

## Core records

| Record | Public lifecycle | Private operational behavior | Key relationships |
| --- | --- | --- | --- |
| Account | `draft` → `published` → `archived`; availability is `available` or `sold` | Admin creates, edits, publishes, marks sold, features or archives records | One account has many media assets, may originate from one seller submission, and may link to many proofs |
| Account media | Exposed only for a published non-archived account | Admin uploads, orders, selects a primary image or removes assets | Belongs to one account |
| Seller submission | `pending`, `reviewing`, `approved`, `rejected` | Admin reviews, requests changes, rejects or prepares one listing conversion | May create one account without erasing original submission data |
| Sale proof | `draft`, `published`, `archived`; `development` samples can never publish | Admin creates, redacts, links, publishes or archives proof records | May link to one publicly reachable account |
| Store settings | Intentionally public values only | Admin changes approved public configuration | Singleton settings profile |
| Admin member | No public visibility | An explicit authenticated user allow-list controls operational access | Linked to the full-stack authenticated user identity |

## Role and mutation boundary

The admin role is assigned only by a trusted server-side bootstrap or database operation. Client code receives no database credential, no private environment value, and no mutation capability without an authenticated session. Every admin procedure will first resolve the authenticated user and then query the private allow-list; failure returns a generic unauthorized response without disclosing database, storage or ownership details.

## Media boundary

Account and proof images will use authenticated upload endpoints, server-side allow-listing of image MIME types, file-size limits and dimension checks. Original assets will stay non-public until their related record reaches a deliberate published state. Public-facing image URLs are returned only through published-content read paths. Client previews are temporary browser object URLs and are never treated as persistent storage.

## Lifecycle and public propagation

| Admin action | Immediate public effect |
| --- | --- |
| Publish account | The account becomes eligible for `/accounts`, `/accounts/:slug`, and featured-home queries. |
| Mark account sold | The public detail state updates to sold and contact action is suppressed. |
| Archive account | The account is removed from public catalog and featured queries while private history remains. |
| Publish proof | The proof becomes eligible for `/proofs` only when it is not a development specimen and uses an approved public asset. |
| Update settings | Public pages fetch only approved public values, such as store name and community/contact links. |

## Intentionally excluded

The operations release does not add payments, payouts, seller wallets, ratings, public seller dashboards, analytics-heavy reporting, or AI valuation. It focuses strictly on secure records, review workflow, controlled publishing and public propagation.
