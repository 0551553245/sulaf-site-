import type { Metadata, Viewport } from "next";
import { dictionaries } from "@/content/dictionary";
import { siteUrl, type Lang } from "@/content/site";

export function buildMetadata(lang: Lang): Metadata {
  const t = dictionaries[lang].meta;
  const path = lang === "ar" ? "/" : "/en";
  return {
    metadataBase: new URL(siteUrl),
    title: t.title,
    description: t.description,
    alternates: {
      canonical: path,
      languages: { ar: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: lang === "ar" ? "سُلاف" : "Sulaf",
      title: t.title,
      description: t.description,
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
      images: [{ url: `/og-${lang}.png`, width: 1200, height: 630, alt: t.title }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [`/og-${lang}.png`] },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }],
      apple: "/apple-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#3A473E",
  width: "device-width",
  initialScale: 1,
};

/** Runs before paint: turns motion on (unless reduced) and skips the preloader after the first visit. */
export const bootScript = `try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('js-motion');if(sessionStorage.getItem('sulaf-pl'))d.classList.add('preloader-seen');else sessionStorage.setItem('sulaf-pl','1')}catch(e){}`;
