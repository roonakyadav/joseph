# APEX FC Mobile Store — Design Directions

## Three stylistic approaches

| Theme Name | Very Brief Intro | Probability |
| --- | --- | --- |
| **The Account Archive** | A noir editorial catalogue: precise account data, documented status marks, and calm typographic restraint make the store feel considered rather than gamified. | 0.04 |
| **Pitchside Atelier** | An elevated football-culture treatment inspired by print matchday programmes, crafted materials, and close-cropped squad artefacts. | 0.07 |
| **Control Room / 90** | A refined operations-room interface built from score-line geometry, progressive reveals, and disciplined product instrumentation. | 0.02 |

---

# Chosen Direction — The Account Archive

## Design Movement

**Contemporary editorial product design** informed by football scouting reports, archive labels, and premium mobile commerce. The experience is a composed product briefing rather than a conventional launch page or gaming landing screen.

## Core Principles

1. **Account-first visual language.** Product identity, squad composition, OVR notation, inventory and controlled preview states replace player photography, stadium imagery, and generic gaming decoration.
2. **Calm intensity.** Near-black surfaces, sharply structured typography, restrained green cues and deliberate empty space establish confidence without neon or visual noise.
3. **Editorial sequence over section stacking.** The page unfolds as one continuous dossier: introduction, launch status, product preview, platform promise and community handoff.
4. **Tactile precision.** Hairline rules, offset labels, clipped edges and monospace metadata make every element feel engineered and intentionally placed.

## Color Philosophy

The base is **archive black**—a warm, very dark near-black that lets off-white typography feel material rather than digital-white. Surfaces lift only slightly to preserve depth. **APEX green** is a controlled signal color, reserved for active markers, status, availability, primary action, and direct community contact. Its scarcity preserves authority; the interface must remain composed and premium when viewed without it. A muted stone tone supports labels and secondary data, while a quiet orange-red is reserved only for unavailable/future states if needed.

## Layout Paradigm

The mobile page behaves as a **vertical product dossier** instead of a centralized landing template. The header acts as a document tab. The statement follows a left-aligned editorial column, interrupted by an offset oversized wordmark and a tangible “preview terminal” that spans into the gutter. On wide screens, the dossier opens into a two-track composition—narrative to the left and the preview terminal to the right—while preserving mobile ordering and touch comfort.

## Signature Elements

1. **Archive rails:** thin horizontal rules with compact index labels, timestamps and status dots that create the visual rhythm.
2. **Squad dossier preview:** a clearly labelled *concept preview*, rendered as a partially revealed account/squad interface with abstract card silhouettes, OVR and resource modules—never presented as sale inventory.
3. **Corner registration marks:** compact bracket and crop-mark motifs around key panels, suggesting a scanned document or inspected asset.

## Interaction Philosophy

Interactions should feel like handling a premium product file: buttons press with a compact, tactile response; the menu reveals only working or clearly marked forthcoming destinations; the preview responds to pointer movement with minimal parallax on capable devices. No distractive dashboard controls, fake filters or misleading clickable inventory will be used.

## Animation

The welcome state arrives in a controlled sequence: mark reveal, vertical rule, headline, then supporting copy. The transition into Home uses an opacity and clipped-mask release rather than a hard page swap. In the Home view, the terminal's scanning guide travels slowly, individual dossier modules settle with short staggered transforms, and the status dot pulses at a restrained cadence. Motion is gated behind `prefers-reduced-motion`, uses transform and opacity where possible, and has no particles, spinning objects, load bars or sudden scale-from-zero effects.

## Typography System

**Manrope** is the primary interface face: semibold and bold for crisp editorial statements, medium for navigation, and regular for explanatory copy. **IBM Plex Mono** carries metadata, labels, item codes, resource numerals and status copy. Headline line breaks are set intentionally with controlled max-widths; labels use tight tracking in all caps; body copy stays readable with generous leading. No display gaming font is used.

## Brand Essence

**APEX is the considered FC Mobile account destination for players who value a direct, transparent way to find and eventually list standout squads.**

Personality: **assured, exacting, discreet.**

## Brand Voice

Voice is concise, composed, and direct. Headlines sound like a strong editorial assertion; CTAs state exactly what happens; microcopy explains status without hype or vague promises.

Example headline: **“A better way to choose your next FC Mobile account.”**

Example action: **“Open the APEX community”**

## Wordmark & Logo

The mark is a **sharp, rising A-form built from two tapered pitch-green planes**, separated by a thin negative-space seam that implies ascent and a player-card edge. It stands alone without text at small sizes, while the custom-spaced APEX wordmark uses Manrope's geometric structure and tracked capitals.

## Signature Brand Color

**APEX Pitch Green — `#77D44D`**. It is vivid enough to act as a signifier, yet natural enough to feel tied to the pitch instead of generic technology glow.

## Style Decisions

- The preview terminal and every specimen card must include an explicit **Concept preview** or **Platform preview** label, so none can be misread as a live account listing.
- The primary community action remains visibly configured as a future action unless a real APEX WhatsApp link is supplied in project configuration.
- Corners are mostly sharp or minimally softened; high-radius cards and glass treatments are excluded.
- Every account card, price-bearing specimen and account record must visibly declare **Concept preview**, **Development record**, or **Verified live record**. Development data may never read as active verified inventory.
- **APEX Pitch Green** is reserved for active availability, a primary action and one focal metric per viewport. Prices, secondary data, archive rails and decorative emphasis default to off-white or muted stone.
- Catalog language uses index, archive and inspection vocabulary. Generic marketplace wording is deferred until a genuine seller-contact or purchase flow is live.
- Archived or sold records never use **APEX Pitch Green** for OVR, price, status, or primary emphasis; their dominant state language uses muted stone and off-white.
- Every account-detail route reads as one continuous inspected dossier: major sections receive archive rails, index labels, registration marks, or stamped states rather than generic stacked-card rhythm.
- Related account modules are treated as archive index entries; record ID, preview status, OVR and inspection language take priority over conventional recommendation styling.
- Every archive surface carries the rising **A-form** as a functional inspection seal or controlled status identifier, not solely as a header mark.
- Long evidence sequences deliberately alternate lead specimens, indexed entries, archive rails, stamps and registration marks instead of relying on uniform card stacking.
- Display headlines retain intentional editorial line breaks and readable breathing room; Manrope’s intensity comes from scale and phrasing, never excessive compression.
- Development and published proof surfaces use **privacy review** vocabulary. A sample remains a labelled, privacy-safe specimen until permissioned authentic material is supplied.
- Seller-intake pages are **review protocol dossiers**, not conventional forms: long field sequences alternate account-file rails, evidence trays, inspection stamps, and indexed record groupings.
- The rising A-form appears on every major submission or review surface as an **inspection seal / record identifier**, not only as a header brand mark.
- Seller-facing copy prioritizes composed review vocabulary—**submission**, **record**, **review**, **evidence**, and **contact channel**—over marketplace hype or self-publishing language.
