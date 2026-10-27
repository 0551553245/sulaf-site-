# Sulaf landing page: design system

Direction: **"One bottle, five colors."** Based on the owner's reference video: a mobile flavor carousel where each flavor gets a full-screen solid panel, a huge tone-on-tone word sits behind a tilted bottle, and scrolling wipes the next color up while the bottle spins to its new label. That language is translated into Sulaf's identity: forest + sage, arches, the woven-arch band and calm, short copy. Anything that reads as beer (brown bottles, grunge type, "brewery" wording) is avoided.

## Color
| Token | Hex | Role |
|---|---|---|
| `forest` | `#3A473E` | Brand ground: hero, process, footer |
| `forest-deep` | `#2C3730` | Menu overlay |
| `forest-ink` | `#202823` | Text on light grounds, floating button |
| `sage` | `#D6D8B0` | Ink on forest, values ground, primary buttons |
| `sage-soft` | `#E7E8CF` | Chat bubble, tile fills |
| `stone` | `#E9E1D2` | Gallery and order grounds |

Flavor panels (muted, taken from the liquid): Black Grape & Ginger `#9A4936` (clay), Pineapple `#D2A24A` (saffron), Berry `#7C2B37` (pomegranate), Peach `#DFA27C` (apricot), Apple & Cinnamon `#86593C` (cinnamon). Each one sets its own ink (`src/content/site.ts`). All text passes WCAG AA (checked with Lighthouse).

## Type
- Arabic: Muna Regular / Black. Logo and brand word: Layla Pro Arabic Bold. Latin: Caviar Dreams Regular / Bold.
- Fonts are defined in one place only, `src/lib/fonts.ts`. **They are for local preview only; swap them for licensed fonts before launch.**
- Scale: display `clamp(36px, 8.5–11.5vw, 96–124px)`, body 15–18px, eyebrow 12–13px (Latin: tracked caps, 0.22em).
- All digits are Latin; numbers and phone numbers are isolated LTR (`.ltr`).

## Shape and motifs
- **Arch**: image frames (gallery), value tiles (desktop), the footer logo frame, the "In season" badge and the arch tab above the WhatsApp preview card (taken from the label's logo tab).
- **Woven-arch band**: `src/lib/weave.ts` rebuilds the label pattern as a seamless tile, served as static SVGs from `/weave/<bg>-<line>-<stroke>.svg`. It's used as section dividers and as the fill of the giant background word.
- **Flavor box**: the thin outlined "English | عربي" box from the label.

## Motion (one system)
- Easing `expo.out` / `cubic-bezier(0.16, 1, 0.3, 1)`, 0.7s, 80ms stagger. These live in `src/lib/motion.ts` and are mirrored in CSS variables.
- Three moves only: text rises (y 40 → 0, fades in), panels and images wipe up from the bottom (clip-path), lines light up (process arch).
- Signature scene: the hero and five flavors in one sticky stage; scrolling moves through 6 states, and each change plays a fixed 0.7s transition (it is not scrubbed, so the page never rests between two flavors).
- `prefers-reduced-motion`: no Lenis and no animation; the journey becomes six normal stacked sections.

## Components
Buttons are pills (48px tall; 56px for the main order button). Primary: sage on forest / ink on panel. Secondary: 1px outline. The floating WhatsApp pill sits bottom-end and appears after the hero (desktop) or after the flavor scene (mobile).
