# Sulaf (سُلاف) — Brand Identity

> Source of truth for brand facts. **Visual direction and layout come from the images in `/references`**: where the references and this file disagree on look and feel, the references win. Colors, fonts and the logo come from this file.

## 1. The brand
- **Name:** Sulaf / سُلاف
- **Category:** Non-alcoholic kombucha (fermented tea, flavored with fruit)
- **Market:** Saudi Arabia / GCC, premium positioning ("accessible premium": a step above mass-market, not luxury-intimidating)
- **Tagline on the label:** "Naturally alive"
- **Tone:** calm, confident, warm. States, doesn't shout. Short sentences. No hype words ("amazing", "best ever"), no health promises.

## 2. Colors (from the original Illustrator label file)
| Token | Hex | Use |
|---|---|---|
| `forest` | `#3A473E` | Label ground, main dark background |
| `sage` | `#D6D8B0` | Label ink, logo, pattern lines, light accents |

Supporting neutrals (derived, adjust freely): `forest-deep #2C3730`, `forest-ink #202823`, `sage-soft #E7E8CF`, `stone #E9E1D2`.

⚠️ **Open question:** the product photos in `assets/images` show a **charcoal** label (≈ `#2E2F2E`) and **olive-gold crown caps** (≈ `#B5AE4E`). The Illustrator file shows **dark green**. Confirm with the owner which one is final before locking the palette.

## 3. Typography (files in `assets/fonts`)
| Role | Font | Files |
|---|---|---|
| Arabic text and headings | **Muna** (Regular / Bold / Black) | `Muna-*.ttf`, `muna-*.woff2` |
| Arabic logotype / display accents | **Layla Pro Arabic Bold** | `laylaproarabic-Bold.ttf`, `layla-bold.woff2` |
| Latin text, "KOMBUCHA" wordmark | **Caviar Dreams** (Regular / Bold / Italic) | `CaviarDreams*.ttf`, `caviar-*.woff2` |

⚠️ **Licensing, must be resolved before going public:**
- Muna is an Apple system font. It is not licensed for web embedding.
- Caviar Dreams' license forbids redistributing the font data, which web embedding does.
- Layla Pro Arabic: check the license with the foundry (iwantype).

If a license can't be cleared, use the closest Google Fonts substitute (Arabic: e.g. *Readex Pro*, *Alexandria*, *IBM Plex Sans Arabic*; Latin: e.g. *Josefin Sans*, *Jost*), and keep the originals only in the logo artwork (as SVG/PNG, not as a font).

## 4. Logo
- The original vector logo has not been provided yet (the `.ai` file arrived corrupted). `assets/brand/label-preview-recovered.png` is a small recovered preview of the label.
- Structure: Arabic calligraphic **سُلاف** above the Latin **SULAF**, with a small line `— KOMBUCHA —` or `Naturally alive` beneath, set inside an **arch**.
- Until the owner supplies the SVG, build the logo as live text (Layla for Arabic, Caviar Dreams Bold for Latin) inside one component, so it can be swapped later in one place.

## 5. Graphic motifs (from the label)
1. **The arch.** It appears as the tab at the top of the label holding the logo, and as the arched info panel. Use arches as image frames, section shapes and buttons. It's the brand's key shape.
2. **The woven arch band.** A repeating border of overlapping arches, each made of 4 concentric lines, in two staggered rows. A ready SVG tile is in `assets/brand/woven-arch-pattern.svg` (line `#D6D8B0` on `#3A473E`).
3. **The flavor box.** A thin rectangular outline holding "Flavor | نكهة", in both languages.

## 6. Photography (`assets/images`)
These are AI-generated renders cut from one collage (`product-collage-original.png`):
`lineup` (6 bottles), `grape`, `berry`, `pour` (pineapple over ice), `trio-wood`, `trio-stone`, `closeup` (label).
⚠️ They are **low resolution (about 500px)** and the **label text is misspelled** ("SULAV", "شالاف", "Pineapple" typos). Use them as **placeholders only**. Replace them with the owner's real photography or bottle images as soon as they're provided.
