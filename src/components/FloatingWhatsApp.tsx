"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/content/dictionary";
import type { Lang } from "@/content/site";
import { WhatsAppIcon } from "./Brand";
import { useCart } from "./CartContext";
import { orderMessage, waLink } from "@/lib/whatsapp";

/**
 * Appears once the hero is behind you (desktop) / after the flavor scene
 * (mobile, where each flavor panel already has its own buttons), and steps
 * aside over the order section and footer.
 */
export function FloatingWhatsApp({ t, lang }: { t: Dictionary; lang: Lang }) {
  const [show, setShow] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const hideFor = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? hideFor.add(e.target) : hideFor.delete(e.target)));
        update();
      },
      { threshold: 0.15 },
    );
    const blockers = [document.getElementById("b2b-form"), document.getElementById("order"), document.querySelector("footer")].filter(Boolean) as Element[];
    blockers.forEach((b) => io.observe(b));

    const update = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const after = document.getElementById("benefits");
      const pastHero = desktop
        ? window.scrollY > window.innerHeight * 0.6
        : !!after && after.getBoundingClientRect().top < window.innerHeight * 0.9;
      setShow(pastHero && hideFor.size === 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      href={waLink(orderMessage(lang, cart))}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-forest-ink px-5 text-[15px] text-sage shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-700 ease-[var(--ease)] end-5 md:bottom-8 md:end-8 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span>{t.wa.float}</span>
    </a>
  );
}
