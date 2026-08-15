# APEX FC Mobile Store — Launch Checklist

Use this checklist when preparing the live APEX archive. It deliberately avoids creating test listings, fake evidence, fabricated reviews, or placeholder commercial claims.

## Before publishing

- [ ] Confirm the canonical live domain and ensure HTTPS is active.
- [ ] Register that exact canonical domain callback at the Manus OAuth provider, including `/api/oauth/callback`.
- [ ] Open `/admin` through the registered origin and confirm the designated owner has the `admin` role.
- [ ] Set the live WhatsApp number and a secure `https://chat.whatsapp.com/...` community URL in **Admin → Settings**, if those channels are ready. Leave them empty if they are not ready.
- [ ] Review store name and default currency in **Admin → Settings**.

## Inventory publishing protocol

- [ ] Review a genuine seller submission before moving it to `approved`.
- [ ] Convert an approved submission to an account **draft** only when appropriate.
- [ ] Verify title, OVR, price, resource fields, formation, key players, description, and seller contact are genuine and current.
- [ ] Upload a clear primary account image. Publishing is intentionally blocked without one.
- [ ] Check account imagery for credentials, recovery codes, payment details, private messages, and personal information before upload.
- [ ] Publish only after a final record review. Confirm it appears in `/accounts` and the correct `/accounts/:slug` detail page.
- [ ] When sold, set the account status to `sold`; confirm the public page retains an archive state but removes direct seller contact.
- [ ] Archive rather than delete a record whenever historic operational context should remain available.

## Proof publication protocol

- [ ] Check every proof for private contact information, payment references, recovery codes, and unrelated personal data.
- [ ] Confirm redaction before upload and use accurate caption/alt text.
- [ ] Keep development specimens marked as development; they are intentionally blocked from public publication.
- [ ] Publish only approved non-development proof material, then verify it appears in `/proofs`.

## Public release verification

- [ ] Check `/`, `/accounts`, an actual published account record, `/proofs`, and `/sell` on a mobile device and desktop browser.
- [ ] Test the visible WhatsApp account action and configured community link with current production settings.
- [ ] Confirm `/robots.txt` and `/sitemap.xml` resolve from the canonical live domain.
- [ ] Review privacy-conscious event collection in the configured analytics workspace; do not add enquiry text, contact details, account IDs, names, or upload filenames to events.
- [ ] Verify the branded 404 and unavailable-account states remain understandable.

## Post-launch cadence

- [ ] Review pending seller submissions and proof drafts regularly.
- [ ] Recheck published account availability and price context before responding to enquiries.
- [ ] Rotate/remove stale community or seller-contact destinations in settings promptly.
- [ ] Re-run the authenticated owner lifecycle exercise after OAuth callback registration is confirmed.

> **Operational rule:** APEX public pages should contain only intentionally published account records and privacy-checked proof material. Do not use production customer data as test data.
