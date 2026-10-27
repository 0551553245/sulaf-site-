"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/dictionary";
import type { Lang } from "@/content/site";
import { Logo, Weave, WhatsAppIcon } from "./Brand";
import { generalLink } from "@/lib/whatsapp";
import { scrollToTarget } from "@/lib/motion";

const links = ["flavors", "benefits", "business", "order"] as const;

export function Header({ t, lang }: { t: Dictionary; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a,button")?.focus());
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && open && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToTarget(`#${id}`));
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[color,background-color] duration-500"
        style={{
          color: "var(--hdr-ink, var(--color-sage))",
          background: "color-mix(in srgb, var(--hdr-bg, transparent) 88%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div className="mx-auto grid h-[var(--header-h)] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)]">
          <button
            ref={btnRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="group flex h-11 w-11 items-center justify-self-start"
          >
            <span className="sr-only">{t.nav.menu}</span>
            <span className="flex w-7 flex-col gap-[7px]" aria-hidden="true">
              <span className="h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease)] group-hover:scale-x-75 rtl:origin-right ltr:origin-left" />
              <span className="h-[1.5px] w-full bg-current" />
              <span className="h-[1.5px] w-2/3 bg-current transition-transform duration-500 ease-[var(--ease)] group-hover:scale-x-150 rtl:origin-right ltr:origin-left" />
            </span>
          </button>

          <a href={lang === "ar" ? "/" : "/en"} className="justify-self-center">
            <span className="sr-only">{t.logo.aria}</span>
            <Logo size="sm" />
          </a>

          <div className="flex items-center gap-2 justify-self-end">
          <a
            href="#business"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#business");
            }}
            className="flex h-11 items-center rounded-full bg-current/0 px-3 text-[13px] underline-offset-4 transition-colors duration-500 hover:underline md:border md:border-current/40 md:px-4 md:no-underline md:hover:bg-current/10"
          >
            <span className="md:hidden">{t.nav.businessShort}</span>
            <span className="hidden md:inline">{t.nav.business}</span>
          </a>
          <a
            href={lang === "ar" ? "/en" : "/"}
            hrefLang={lang === "ar" ? "en" : "ar"}
            lang={lang === "ar" ? "en" : "ar"}
            className="flex h-11 min-w-11 items-center justify-center rounded-full border border-current/40 px-4 text-[13px] transition-colors duration-500 hover:bg-current/10"
            style={{ fontFamily: lang === "ar" ? "var(--font-lat)" : "var(--font-ar)" }}
          >
            {t.nav.switchShort}
            <span className="sr-only" lang={lang}>
              {" "}
              {t.nav.switchAria}
            </span>
          </a>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        className={`fixed inset-0 z-[60] flex flex-col bg-forest-deep text-sage duration-700 ease-[var(--ease)] ${
          open
            ? "visible transition-[clip-path] [clip-path:inset(0_0_0_0)]"
            : "invisible transition-[clip-path,visibility] [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[1600px] items-center justify-between px-[var(--gutter)]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              btnRef.current?.focus();
            }}
            className="flex h-11 items-center gap-3 text-[14px]"
          >
            <span className="relative block h-5 w-5" aria-hidden="true">
              <span className="absolute top-1/2 h-[1.5px] w-full rotate-45 bg-current" />
              <span className="absolute top-1/2 h-[1.5px] w-full -rotate-45 bg-current" />
            </span>
            {t.nav.close}
          </button>
          <Logo size="sm" />
          <span className="w-11" />
        </div>
        <nav className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center gap-1 px-[var(--gutter)]">
          {links.map((id, i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                go(id);
              }}
              className={`font-display group flex items-baseline gap-4 py-2 text-[clamp(40px,9vw,96px)] leading-[1.05] transition-[opacity,transform] duration-700 ease-[var(--ease)] hover:opacity-70 ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              <span className="ltr caps text-[12px] opacity-80">0{i + 1}</span>
              {t.nav[id]}
            </a>
          ))}
        </nav>
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-[var(--gutter)] pb-8">
          <a
            href={generalLink(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-sage px-6 text-[15px] text-forest-ink"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t.wa.float}
          </a>
        </div>
        <Weave bg="#2C3730" line="#D6D8B0" height={48} />
      </div>
    </>
  );
}
