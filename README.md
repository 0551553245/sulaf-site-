# Sulaf (سُلاف) landing page

Next.js 15 (App Router) + TypeScript + Tailwind 4 + GSAP/ScrollTrigger + Lenis.
Arabic (RTL) at `/`, English at `/en`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production preview
```

## Where things live
| What | File |
|---|---|
| **All images** (swap placeholders here) | `src/content/media.ts` + files in `public/media/` |
| Flavors, colors, business facts (VAT, CR, WhatsApp, socials) | `src/content/site.ts` |
| Every piece of copy, Arabic + English | `src/content/dictionary.ts` |
| WhatsApp links and message format | `src/lib/whatsapp.ts` |
| Fonts | `src/lib/fonts.ts` |
| Motion timing / easing | `src/lib/motion.ts` |
| Logo (vector word until the official SVG arrives) | `src/components/LogoWord.tsx`, `Logo` in `src/components/Brand.tsx` |
| Design system notes | `DESIGN.md` |

### Swapping bottle photos
Each flavor has a 2×3 rotation sheet (0°, 45°, 90°, 135°, 180°, 225°) in `assets/bottle-sheets/`.
1. Run `python3 scripts/extract_views.py <sheet> <flavor-id> public/media/bottles` (needs Pillow, numpy, scipy, opencv).
2. Update that flavor's `width` values in `src/content/media.ts` if they changed.

Other images (the B2B photo) are listed in `src/content/media.ts` too. Set `placeholder: false` to hide the "placeholder photo" tag.

### Fonts
Alexandria for Arabic and English (SIL Open Font License, free for web use), defined only in `src/lib/fonts.ts`. The «سُلاف» logo word is vector outlines in `src/components/LogoWord.tsx`, so no logo font is published. Replace it with the official logo SVG when it arrives. The original brand fonts in `assets/fonts/` are not licensed for the web and are excluded from git.

### Social links
Set `instagram` / `tiktok` in `src/content/site.ts` (handle without `@`). Until then the footer shows `[TBD]`.

## Deploy
Vercel, domain `sulav.co`.
1. In Vercel: **Add New → Project → Import** this GitHub repository. Framework: Next.js (detected). No environment variables needed.
2. **Settings → Domains → Add** `sulav.co` and `www.sulav.co`, then add the DNS records Vercel shows at your domain registrar.
