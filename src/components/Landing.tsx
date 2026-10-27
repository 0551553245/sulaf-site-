import { dictionaries } from "@/content/dictionary";
import type { Lang } from "@/content/site";
import { CartProvider } from "./CartContext";
import { Header } from "./Header";
import { Journey } from "./Journey";
import { Benefits } from "./Benefits";
import { Business } from "./Business";
import { Order } from "./Order";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { Preloader } from "./Preloader";
import { SmoothScroll } from "./SmoothScroll";

export function Landing({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];
  return (
    <CartProvider>
      <a
        href="#main"
        className="fixed start-4 top-4 z-[110] -translate-y-24 rounded-full bg-sage px-5 py-3 text-forest-ink focus:translate-y-0"
      >
        {t.skip}
      </a>
      <Preloader label={t.loading} />
      <Header t={t} lang={lang} />
      <main id="main">
        <Journey t={t} lang={lang} />
        <Benefits t={t} lang={lang} />
        <Business t={t} lang={lang} />
        <Order t={t} lang={lang} />
      </main>
      <Footer t={t} lang={lang} />
      <FloatingWhatsApp t={t} lang={lang} />
      {/* Last, so its triggers are created after the pinned journey. */}
      <SmoothScroll />
    </CartProvider>
  );
}
