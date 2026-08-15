# APEX Seller Intake — Validation Record

| State | Viewport | Result | Finding |
| --- | --- | --- | --- |
| Normal seller intake | 390 × 844 | Pass | The page starts with a clear seller proposition, uses a compact four-step review protocol, and then enters the structured submission form without a generic dashboard shell. |
| Required-field validation | 390 × 844 | Pass | Missing name, contact, account title, OVR and screenshot evidence receive adjacent, plain-language correction guidance. Required labels remain visible without relying on placeholders. |
| Unconfigured service handoff | 390 × 844 | Pass | The interface clearly says that submissions are not connected, and that details have not been sent or stored. It makes no false review, listing, or persistence claim. |

The normal route remains unaffected by the `preview` query states used only for visual verification.

| Layout | Viewport | Result | Finding |
| --- | --- | --- | --- |
| Compact mobile form | 360 × 800 | Pass | The single-column account-preparation flow remains readable, contact controls retain usable width, required labels remain visible, and the evidence action plus final submit control stay accessible without horizontal overflow. |
| Compact mobile form | 375 × 812 | Pass | The display copy, process sequence, form sections, numeric controls and image intake area maintain a calm, phone-first rhythm with no clipped fields. |
| Expanded mobile form | 412 × 915 | Pass | The additional width improves form breathing room without allowing the seller intake to lose its compact document hierarchy. |
| Tablet intake | 768 × 1024 | Pass | The introduction becomes a balanced two-part product statement; process steps and form fields expand into useful multi-column groups while retaining touch-sized controls and readable labels. |

## Final independent review and refinement

The final independent review confirmed that the seller page follows the Account Archive direction while recommending a stronger review-protocol dossier treatment. The accepted amendments now give the form a more deliberate account-file rhythm: each major input grouping has an indexed rail, registration detail and A-form inspection identifier; evidence uses a dedicated tray; and the revised opening speaks in account-record and review language rather than generic marketplace language. The final mobile check confirms these changes retain readable labels, clear actions and the controlled APEX-green hierarchy.

## Final production validation

The final 390 × 844 review verifies the improved review-protocol dossier structure, including account-file field groupings, inspection seals and dedicated evidence tray. `pnpm check` and the production build complete successfully. The only build notice is the inherited non-blocking bundle-size advisory; recent browser-console output contains no application errors.
