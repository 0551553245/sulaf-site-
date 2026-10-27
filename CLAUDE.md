# Sulaf landing page: project rules

You are building the official landing page for **Sulaf (سُلاف)**, a premium non-alcoholic kombucha brand in Saudi Arabia. The quality bar is a **SAR/USD 10K agency site**: think award-level beverage/CPG brand sites, not a template.

## Read first, in this order
1. `docs/BRAND.md`: colors, fonts, logo, motifs, photo caveats
2. `docs/CONTENT.md`: every fact and all the copy you may use
3. `/references/`: **the owner's reference images. These define the visual direction, layout and quality level. Study every one before designing.**
4. `assets/`: fonts, product images, the woven-arch pattern SVG, recovered label preview

## Non-negotiable rules
- **References win on look and feel.** Match their composition, spacing, typography scale, image treatment and motion feel. Don't copy any brand's logo or text.
- **Never invent facts.** Use only `docs/CONTENT.md`. Missing facts become `[TBD: …]` placeholders, listed in your final summary.
- **Never alter the product images' content** (no recoloring or regenerating). Cropping for layout and CSS treatments are fine.
- **Bilingual, Arabic first.** Arabic is the default at `/`, RTL. English is available through a language switch. Every string exists in both languages, layout mirrors correctly, and Latin numbers/phones stay LTR.
- **Mobile first.** Most traffic will come from Instagram/TikTok/WhatsApp on phones. Every section must look designed at 390px, not just shrunk.
- **Respect `prefers-reduced-motion`**: all content stays visible and usable without animation.
- **Ask before deploying** or connecting the domain. Never push or publish without the owner's OK.

## Recommended stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- GSAP + ScrollTrigger for scroll motion, Lenis for smooth scroll
- `next/font/local` for the brand fonts, `next/image` for all images (AVIF/WebP, responsive sizes)
- Deploy target: Vercel (the owner has their own domain)

## Quality checklist (verify before saying "done")
- [ ] Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices and SEO
- [ ] LCP < 2.5s on mobile; no layout shift from fonts or images
- [ ] Screenshot every section with Playwright at 390px and 1440px, in Arabic and English, and review the screenshots against the references. Fix anything that looks off, then screenshot again.
- [ ] No horizontal scroll at any width; nothing overlaps or clips
- [ ] All WhatsApp buttons open `wa.me/966552228689` with the right pre-filled message
- [ ] Meta tags, Open Graph image (1200×630), `lang`/`dir` set per language, favicon from the arch/logo
- [ ] VAT and CR numbers in the footer
