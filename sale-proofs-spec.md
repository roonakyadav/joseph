# APEX Sale Proofs — Publication and Privacy Record

## Principle

The proof archive is an evidence surface, not a testimonial or conversion-claim surface. Authentic proof is published only after the business has supplied the material, confirmed it is appropriate for public display, and provided any required redaction.

| Rule | Implementation decision |
| --- | --- |
| Authenticity | `publishedProofs` is intentionally empty. The current archive displays development specimens rather than representing invented handovers, payment confirmations, dates, amounts, names, reviews, ratings or verification claims. |
| Development content | `developmentProofs` is a separate source collection. Every specimen receives explicit visual and textual development labeling. |
| Privacy | Proof images must be replaced with redacted public-ready assets before they reach `publishedProofs`. The model supports only approved image assets and concise metadata; it does not expose unreviewed source conversations or payment data. |
| Metadata | The interface renders only fields that are present. No date, amount, customer identity, transaction reference or account link is invented. |
| Account linking | A proof links only if `accountSlug` resolves to a public current account route. Otherwise, the record stays informative without a broken link. |
| Trust language | The archive says “development specimen,” “previous handover example” or “shared record” only when the record data warrants it. It never claims verification, safety, guarantee, affiliation or popularity. |
