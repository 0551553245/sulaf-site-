import localFont from "next/font/local";

/**
 * Font config: the ONLY place fonts are defined.
 *
 * Alexandria for both scripts (SIL Open Font License, free for web use;
 * see src/fonts/ALEXANDRIA-OFL.txt). The «سُلاف» logo word is vector
 * outlines in components/LogoWord.tsx, not a font.
 */
export const arabic = localFont({
  src: [
    { path: "../fonts/alexandria-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/alexandria-arabic-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/alexandria-arabic-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  preload: true, // every weight listed is preloaded: keep the list short
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export const latin = localFont({
  src: [
    { path: "../fonts/alexandria-latin-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/alexandria-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/alexandria-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-latin",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const fontVariables = `${arabic.variable} ${latin.variable}`;
