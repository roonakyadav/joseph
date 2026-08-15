# APEX Sale Proofs — Validation Record

## Primary mobile states — 390 × 844

| State | Result | Finding |
| --- | --- | --- |
| Development archive | Pass | The archive reads as an evidence-oriented dossier. Every card visibly carries both development-sample and disclosure language, preventing the concept media from reading as a completed sale claim. |
| Empty published archive preview | Pass | The empty state is direct and useful: it states that authentic records are pending public approval, avoids fake proof, and provides one concise path back to accounts. |
| Missing development image preview | Pass | The first evidence card maintains document scale and identity while clearly reporting its unavailable image; metadata and disclosure remain readable. |
| Fullscreen viewer | Pass | The viewer displays an explicit development specimen, has a legible close control, navigation controls, zoom controls and no visible archive bleed-through. |

The `preview=empty` and `preview=missing` query states exist only as non-public validation fixtures. Normal visitors continue to receive the configured archive mode.

## Compact mobile sweep

| Viewport | Result | Finding |
| --- | --- | --- |
| 360 × 800 | Pass | The header, archive rail, document imagery, disclosure lines and inspection buttons remain legible without horizontal overflow. |
| 375 × 812 | Pass | Headline wrapping remains intentional, each proof card preserves its document rhythm, and the publication-policy note closes the sequence cleanly. |
| 412 × 915 | Pass | The wider mobile frame gives the proof documents and card metadata more room without weakening the archive’s compact evidence rhythm. |
| 1280 × 900 | Pass | The archive expands to a controlled three-document array with preserved top-line classification and a clearly bounded development-status note; it does not turn into a generic gallery grid. |

## Final independent review and refinement

The final independent review found the proof archive strongly aligned to the **Account Archive** direction and recommended a more ownable APEX inspection motif, less-compressed display typography, stronger material separation, varied archive rhythm, and more explicit privacy-review vocabulary. The accepted amendments were applied and visually confirmed at 390 × 844:

| Amendment | Result |
| --- | --- |
| APEX ownership | Pass — the rising A-form now appears as a controlled archive-status inspection seal. |
| Editorial display rhythm | Pass — the headline uses clearer intentional breaks and additional breathing room. |
| Archive sequence | Pass — the first record reads as a lead specimen while later proof cards become indexed document entries with rails and registration marks. |
| Privacy-review voice | Pass — development evidence is described consistently as a labelled, privacy-safe specimen rather than as a completed transaction. |

`pnpm check` and the production build complete successfully. The build emits only the inherited non-blocking bundle-size advisory; browser-console inspection found no client errors.
