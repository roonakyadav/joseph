# APEX Account Discovery — Implementation Record

## Scope boundary

The account discovery pass introduces a real catalog route, a true account route, and seller-contact handoff. It does **not** build a complete account-detail experience, account administration, seller submission, authentication, checkout, payment, or live inventory integration.

## Data ownership

| Layer | Responsibility | Location |
| --- | --- | --- |
| Data | Stable account identity, status, price, assets, resource values, player names and ordering metadata | `client/src/data/accounts.ts` |
| Presentation | Catalog card hierarchy, filtering UI, search controls, visual states and responsive behavior | `client/src/pages/Accounts.tsx` and catalog-specific components |
| Route | Catalog and account record navigation | `client/src/App.tsx` |

## Development-data protocol

The current project has no live catalog connection. Every account record, resource count, player list and price is therefore **development content**, explicitly marked in the interface. Records are not portrayed as verified inventory, sold history, community claims, testimonials, or commerce outcomes.

## Catalog ordering

On small screens, each account must prioritize its squad image, OVR, price, compact asset field, availability, account ID and only then supporting detail. Search matches the title, ID, player names and relevant structured metadata. The most useful top-level controls are OVR, price and availability.
