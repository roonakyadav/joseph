# OAuth Validation Status

## Current implementation

The APEX client uses the template-supported Manus OAuth flow. The login entrypoint derives its callback from `window.location.origin` and sends it as `${window.location.origin}/api/oauth/callback`. The callback preserves the template nonce/state binding and exchanges a code only after the nonce cookie matches.

This means a browser opened through the canonical Manus preview requests this callback:

```
https://3000-ixi6i9vmt7m4310n34jcy-08847a21.us3.manus.computer/api/oauth/callback
```

The direct preview browser audit confirmed this is the active origin. No OAuth, preview-host, or redirect allowlist setting is exposed through the current project configuration, so the provider-side allowlist cannot be safely modified from this workspace.

## Validation decision

An earlier browser session ran the development site at a loopback origin (`127.0.0.1:3000`). Because OAuth correctly uses that browser's origin, its callback was rejected by the provider as an unregistered localhost redirect. This is an environment/provider registration issue, not a reason to hardcode a temporary preview host or weaken authentication.

The authenticated admin lifecycle exercise is therefore deferred for this release. The following protections remain in force:

- Public routes can read only published, non-archived accounts and published, non-development proofs.
- Private procedures require the existing authenticated admin role gate.
- No login bypass, temporary admin identity, credentials, marketplace records, or test customer data were introduced.
- Public account, detail, proof, and seller-intake routes remain available and database-backed without an admin session.

To complete the deferred exercise later, open the application through its canonical Manus preview or published domain and ensure that exact origin is registered by the Manus OAuth project configuration. Do not test OAuth from a loopback-only preview origin.

## Completed release validation

The release was validated without creating marketplace records. The public `accounts.list` contract returns an empty published catalog as expected on a clean database, while an anonymous request to `admin.dashboard` returns HTTP 403. The automated suite also verifies that standard users cannot call inventory creation or account-media upload mutations, and that invalid, mismatched, or undersized image payloads are rejected before the storage helper is invoked.

The interactive owner/admin lifecycle remains deliberately out of scope until the provider-side redirect allowlist accepts the canonical preview or published callback origin. That later exercise should use genuine operational records supplied by the store owner; it must not introduce fabricated listings, sale proofs, submissions, or customer information.
