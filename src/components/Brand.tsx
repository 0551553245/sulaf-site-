import type { CSSProperties } from "react";
import { LOGO_PATH, LogoWord, logoTransform } from "./LogoWord";
import { weaveUrl, WEAVE_RATIO } from "@/lib/weave";

/**
 * Logo, built as live text until the owner supplies the vector file.
 * Swap the inside of this component for the SVG later; nothing else changes.
 */
export function Logo({
  tagline,
  className = "",
  size = "md",
}: {
  tagline?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const s = {
    sm: { ar: "text-[22px]", lat: "text-[11px] tracking-[0.34em]", tag: "text-[8px]" },
    md: { ar: "text-[34px]", lat: "text-[15px] tracking-[0.36em]", tag: "text-[10px]" },
    lg: { ar: "text-[64px]", lat: "text-[26px] tracking-[0.4em]", tag: "text-[13px]" },
  }[size];
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`} aria-hidden="true">
      <span className={`${s.ar} flex leading-none`}>
        <LogoWord />
      </span>
      <span className={`${s.lat} ltr mt-[0.35em] font-bold ps-[0.36em]`} style={{ fontFamily: "var(--font-lat)" }}>
        SULAF
      </span>
      {tagline ? (
        <span className={`${s.tag} mt-[0.6em] flex items-center gap-[0.6em] opacity-80`}>
          <span className="h-px w-[1.6em] bg-current" />
          {tagline}
          <span className="h-px w-[1.6em] bg-current" />
        </span>
      ) : null}
    </span>
  );
}

/** The woven-arch band. `height` is the band height in px. */
export function Weave({
  bg = "#3A473E",
  line = "#D6D8B0",
  height = 64,
  className = "",
  style,
}: {
  bg?: string;
  line?: string;
  height?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        height,
        backgroundImage: weaveUrl(bg, line),
        backgroundRepeat: "repeat-x",
        backgroundSize: `${height * WEAVE_RATIO}px ${height}px`,
        backgroundPosition: "center top",
        ...style,
      }}
    />
  );
}

/** The thin "Flavor | نكهة" outline box from the label. */
export function FlavorBox({ ar, en, className = "" }: { ar: string; en: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-3 border border-current px-4 py-2 text-[13px] leading-none ${className}`}
      dir="ltr"
    >
      <span style={{ fontFamily: "var(--font-lat)" }}>{en}</span>
      <span className="h-3.5 w-px bg-current opacity-70" />
      <span style={{ fontFamily: "var(--font-ar)" }} lang="ar" dir="rtl">
        {ar}
      </span>
    </span>
  );
}

export function PlaceholderTag({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute z-10 rounded-full bg-black/45 px-2.5 py-1 text-[10px] leading-none text-white/90 backdrop-blur-sm ${className}`}
    >
      {label}
    </span>
  );
}

/**
 * Line-drawn bottle for flavors that have no photo yet (the seasonal ones).
 * Same proportions as the real bottle, drawn in the label's line language.
 */
export function LineBottle({ label, className = "" }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 520" className={className} role="img" aria-label={label} fill="none">
      <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* cap */}
        <path d="M52 10 h56 v24 h-56 z" />
        <path d="M56 10 v24 M64 10 v24 M72 10 v24 M80 10 v24 M88 10 v24 M96 10 v24 M104 10 v24" opacity="0.35" />
        {/* neck + shoulders + body */}
        <path d="M56 34 c0 10 -4 14 -4 22 c0 8 4 10 4 18 v58 c0 34 -46 54 -46 104 v240 c0 24 12 34 34 34 h72 c22 0 34 -10 34 -34 v-240 c0 -50 -46 -70 -46 -104 v-58 c0 -8 4 -10 4 -18 c0 -8 -4 -12 -4 -22" />
        {/* liquid line */}
        <path d="M30 196 c16 -10 34 -14 50 -14 s34 4 50 14" opacity="0.5" />
        {/* label with arch tab, as on the real label */}
        <path d="M10 290 h36 c0 -20 15 -34 34 -34 s34 14 34 34 h36 v156 h-140 z" />
        {/* woven band at the foot of the label */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity="0.6">
            <path d={`M${18 + i * 26} 446 v-14 a13 13 0 0 1 26 0 v14`} />
            <path d={`M${23 + i * 26} 446 v-14 a8 8 0 0 1 16 0 v14`} />
          </g>
        ))}
      </g>
      <path d={LOGO_PATH} transform={logoTransform(80, 372, 30)} fill="currentColor" />

    </svg>
  );
}

/** The same line bottle as an image URL, used as a texture while the bottle rolls. */
export function lineBottleUrl(ink: string) {
  const band = [0, 1, 2, 3, 4]
    .map(
      (i) =>
        `<g opacity="0.6"><path d="M${18 + i * 26} 446 v-14 a13 13 0 0 1 26 0 v14"/><path d="M${23 + i * 26} 446 v-14 a8 8 0 0 1 16 0 v14"/></g>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 520" fill="none"><g stroke="${ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M52 10 h56 v24 h-56 z"/><path d="M56 10 v24 M64 10 v24 M72 10 v24 M80 10 v24 M88 10 v24 M96 10 v24 M104 10 v24" opacity="0.35"/><path d="M56 34 c0 10 -4 14 -4 22 c0 8 4 10 4 18 v58 c0 34 -46 54 -46 104 v240 c0 24 12 34 34 34 h72 c22 0 34 -10 34 -34 v-240 c0 -50 -46 -70 -46 -104 v-58 c0 -8 4 -10 4 -18 c0 -8 -4 -12 -4 -22"/><path d="M30 196 c16 -10 34 -14 50 -14 s34 4 50 14" opacity="0.5"/><path d="M10 290 h36 c0 -20 15 -34 34 -34 s34 14 34 34 h36 v156 h-140 z"/>${band}</g><path d="${LOGO_PATH}" transform="${logoTransform(80, 372, 28)}" fill="${ink}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.24 8.22Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}
