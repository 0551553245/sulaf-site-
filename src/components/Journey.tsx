"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/dictionary";
import { flavors, type Flavor, type Lang } from "@/content/site";
import { bottles } from "@/content/media";
import { FlavorBox, LineBottle, PlaceholderTag, Weave, WhatsAppIcon } from "./Brand";
import { IngredientMarks } from "./Ingredients";
import { useCart } from "./CartContext";
import { toneOnTone } from "@/lib/color";
import { weaveUrl } from "@/lib/weave";
import { generalLink } from "@/lib/whatsapp";
import { createRoller } from "@/lib/roll";
import { hasPhotos, wrapFor } from "@/lib/wraps";
import { DUR, EASE, STAGGER, anchorResolvers, motionAllowed, preloaderDelay, registerGsap, scrollToTarget, whenIdle } from "@/lib/motion";

const FOREST = "#3A473E";
const SAGE = "#D6D8B0";

/** State 0 is the hero; states 1..5 are the flavors. A bottle is keyed by its flavor id. */
type BottleKey = string;
const bottleFor = (i: number): BottleKey => flavors[Math.max(0, i - 1)].id;
const bottleKeys = flavors.map((f) => f.id);
/**
 * Changing flavor rolls the bottles like real ones on a table: the current one
 * rolls away out of frame while the next rolls in from the other side and stops
 * facing you. How far each turns follows how far it travels (no slipping).
 */
const ROLL_OUT = 0.8;
const ROLL_IN = 1.1;
const ROLL_IN_AT = 0.25;

function GiantWord({ word, bg, lang, brand = false }: { word: string; bg: string; lang: Lang; brand?: boolean }) {
  const [ground, line] = toneOnTone(bg);
  return (
    <span
      aria-hidden="true"
      className={`jp-word pointer-events-none absolute top-[58%] whitespace-nowrap leading-none select-none md:top-1/2 ${
        lang === "ar" || brand ? "jp-word-ar" : "jp-word-en"
      }`}
      style={{
        backgroundColor: ground,
        backgroundImage: weaveUrl(ground, line, 2.4),
        backgroundSize: "auto 0.42em",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        fontFamily: brand ? "var(--font-ar)" : lang === "ar" ? "var(--font-ar)" : "var(--font-lat)",
        fontWeight: brand ? 700 : lang === "ar" ? 800 : 700,
      }}
      lang={brand ? "ar" : undefined}
    >
      {word}
    </span>
  );
}

function BottleArt({ k, lang, priority }: { k: BottleKey; lang: Lang; priority?: boolean }) {
  const set = bottles[k];
  if (!set) {
    const f = flavors.find((x) => x.id === k)!;
    return <LineBottle label={f.name[lang]} className="h-full w-auto" />;
  }
  const m = set.views["000"];
  return (
    <Image
      src={m.src}
      alt={set.alt[lang]}
      width={m.width}
      height={m.height}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      sizes="(min-width: 768px) 260px, 180px"
      className="h-full w-auto max-w-none"
      draggable={false}
    />
  );
}

export function Journey({ t, lang }: { t: Dictionary; lang: Lang }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const jumpRef = useRef<(i: number) => void>(() => {});
  const { cart, add } = useCart();
  const n = flavors.length + 1;
  const tilt = lang === "ar" ? -22 : 22;

  useEffect(() => {
    const el = root.current;
    if (!el || !motionAllowed()) return;
    let ctx: gsap.Context | null = null;
    const cancel = whenIdle(() => (ctx = setup(el)));
    return () => {
      cancel();
      ctx?.revert();
      delete anchorResolvers["#flavors"];
      delete anchorResolvers["#top"];
      document.documentElement.style.removeProperty("--hdr-ink");
    };
  }, [n]);

  function setup(el: HTMLElement) {
    const { gsap, ScrollTrigger } = registerGsap();
    const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", el);
    const rollBox = el.querySelector<HTMLElement>("[data-roll-box]")!;
    const runners = gsap.utils.toArray<HTMLElement>("[data-runner]", el);
    const rollers = runners.map((r) => createRoller(r));
    let lead = 0;
    const arts = gsap.utils.toArray<HTMLElement>("[data-art]", el);
    const stage = el.querySelector<HTMLElement>("[data-stage]")!;
    let cur = 0;
    let shown: string = bottleFor(0);
    let rollTl: gsap.core.Timeline | null = null;
    let resting: BottleKey = bottleFor(0);
    // Warm the textures so the first roll never shows an empty slice.
    const warmed = new Set<string>();
    const warm = (i: number) => {
      const k = bottleFor(Math.min(n - 1, Math.max(0, i)));
      if (warmed.has(k)) return;
      warmed.add(k);
      wrapFor(k).faces.forEach((f) => (new window.Image().src = f.url));
    };
    warm(1);
    warm(2);
    const showArt = (k: BottleKey) =>
      gsap.set(arts, { autoAlpha: (j: number) => (arts[j].dataset.art === k ? 1 : 0) });
    const inks = [SAGE, ...flavors.map((f) => f.ink)];

    return gsap.context(() => {
      gsap.set(panels.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(arts, { autoAlpha: (i: number) => (arts[i].dataset.art === shown ? 1 : 0) });

      // Hero entrance, only on the first visit while the preloader lifts.
      if (!document.documentElement.classList.contains("preloader-seen")) {
        gsap
          .timeline({ delay: preloaderDelay() })
          .fromTo(
            panels[0].querySelectorAll("[data-anim]"),
            { y: 48, opacity: 0 },
            { y: 0, opacity: 1, stagger: STAGGER, duration: DUR * 1.4, immediateRender: true },
          )
          // Transform only: the bottle is painted from the first frame (good LCP).
          .fromTo("[data-rise]", { y: "18%" }, { y: "0%", duration: DUR * 1.8, immediateRender: true }, 0.05)
          .fromTo("[data-side]", { opacity: 0 }, { opacity: 1, duration: DUR, immediateRender: true }, 0.6);
      }

      const seen = new Set<number>([0]);
      const showText = (i: number) => {
        if (seen.has(i)) return;
        seen.add(i);
        panels[i].classList.add("is-on"); // draws the ingredient marks
        gsap.fromTo(
          panels[i].querySelectorAll("[data-anim]"),
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, stagger: STAGGER * 0.75, duration: DUR, delay: 0.18, overwrite: true },
        );
      };

      const goTo = (i: number) => {
        if (i === cur) return;
        const dir = i > cur ? 1 : -1;
        const prev = cur;
        cur = i;
        setActive(i);
        document.documentElement.style.setProperty("--hdr-ink", inks[i]);
        gsap.to(stage, { "--ink": inks[i], duration: DUR, overwrite: "auto" } as gsap.TweenVars);

        panels.forEach((p, k) => {
          const show = k <= i;
          gsap.to(p, {
            clipPath: show ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
            duration: DUR,
            ease: show ? EASE : "power3.inOut",
            overwrite: "auto",
            onStart: () => {
              if (k <= Math.max(i, prev)) p.style.contentVisibility = "visible";
            },
            // Once settled, only the top panel needs painting.
            onComplete: () => {
              p.style.contentVisibility = k === cur ? "visible" : "hidden";
            },
          });
        });
        showText(i);

        warm(i + 1);
        warm(i - 1);
        const next = bottleFor(i);
        warm(i);
        if (next !== shown) {
          shown = next;
          // A roll still in flight lands where it was going, then the next one starts.
          if (rollTl) {
            rollTl.progress(1).kill();
          }
          const from = resting;
          const [outEl, inEl] = [runners[lead], runners[1 - lead]];
          const [outR, inR] = [rollers[lead], rollers[1 - lead]];
          lead = 1 - lead;
          const fromWrap = wrapFor(from);
          const toWrap = wrapFor(next);
          outR.set(fromWrap);
          inR.set(toWrap);
          gsap.set(outEl.querySelector(".jp-shadow"), { autoAlpha: fromWrap.flat ? 0 : 1 });
          gsap.set(inEl.querySelector(".jp-shadow"), { autoAlpha: toWrap.flat ? 0 : 1 });

          // Far enough along the bottle's own axis to leave the screen.
          const D = window.innerWidth * 0.75 + rollBox.clientWidth * 2;
          const turned = (x: number, r: number) => ((x / r) * 180) / Math.PI;
          const pos = { out: 0, in: -dir * D };
          const draw = () => {
            gsap.set(outEl, { x: pos.out });
            gsap.set(inEl, { x: pos.in });
            outR.render(fromWrap.flat ? 0 : turned(pos.out, outR.radius()));
            inR.render(toWrap.flat ? 0 : turned(pos.in, inR.radius()));
          };
          showArt("none");
          gsap.set("[data-shadow]", { autoAlpha: 0 });
          gsap.set([outEl, inEl], { autoAlpha: 1 });
          draw();
          rollTl = gsap
            .timeline({
              onUpdate: draw,
              onComplete: () => {
                resting = next;
                showArt(next);
                gsap.set("[data-shadow]", { autoAlpha: toWrap.flat ? 0 : 1 });
                gsap.set([outEl, inEl], { autoAlpha: 0 });
                rollTl = null;
              },
            })
            .to(pos, { out: dir * D, duration: ROLL_OUT, ease: "power2.in" }, 0)
            .to(pos, { in: 0, duration: ROLL_IN, ease: "power3.out" }, ROLL_IN_AT);
        }
      };

      const st = ScrollTrigger.create({
        trigger: el,
        // The stage is CSS-sticky inside a tall section (see .journey in globals.css),
        // so the page has its final height before any JS runs.
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => goTo(Math.min(n - 1, Math.floor(self.progress * n))),
        onToggle: (self) => {
          if (self.isActive) document.documentElement.style.setProperty("--hdr-ink", inks[cur]);
        },
      });

      const posFor = (i: number) => st.start + ((i + 0.5) / n) * (st.end - st.start);
      jumpRef.current = (i: number) => scrollToTarget(posFor(i));
      anchorResolvers["#flavors"] = () => posFor(1);
      anchorResolvers["#top"] = () => 0;
      return () => rollers.forEach((r) => r.destroy());
    }, el);
  }

  const jump = (i: number) => {
    if (motionAllowed() && root.current?.querySelector("[data-stage]")) jumpRef.current(i);
  };

  return (
    <section ref={root} id="top" className="journey relative" aria-label={t.journey.core}>
      <div data-stage className="jp-stage" style={{ "--ink": SAGE } as React.CSSProperties}>
        {/* ---------- Flavor index (desktop). First in DOM so Tab reaches the active panel next. ---------- */}
        <nav data-side className="jp-side" aria-label={t.journey.jump}>
          <ol className="flex flex-col gap-3">
            {flavors.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => jump(i + 1)}
                  aria-current={active === i + 1 ? "true" : undefined}
                  className="group flex min-h-8 items-center gap-3 text-[14px]"
                  style={{ fontWeight: active === i + 1 ? 700 : 400 }}
                >
                  <span className="ltr caps text-[11px]">0{i + 1}</span>
                  <span
                    className="block h-px bg-current transition-[width] duration-700 ease-[var(--ease)]"
                    style={{ width: active === i + 1 ? 40 : 16 }}
                  />
                  <span className="whitespace-nowrap">{f.name[lang]}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* ---------- State 0: hero ---------- */}
        <div data-panel className="jp-panel jp-panel-0" style={{ background: FOREST, color: SAGE }}>
          <GiantWord word="سلاف" bg={FOREST} lang="ar" />
          <div className="jp-text jp-hero-text">
            <p data-anim className="eyebrow mb-4 text-[12px] opacity-80 md:mb-6 md:text-[13px]">
              {t.hero.eyebrow}
            </p>
            <h1 className="font-display text-[clamp(30px,8.6vw,124px)] md:text-[clamp(48px,5.2vw,84px)] leading-[1.3] md:leading-[1.2]">
              {t.hero.title.map((w, i) => (
                <span key={i} data-anim className="block">
                  {w}
                  {i < t.hero.title.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p data-anim className="mt-4 max-w-[30ch] text-[15px] leading-[1.7] opacity-85 md:mt-8 md:max-w-[34ch] md:text-[17px]">
              {t.hero.line}
            </p>
            <div data-anim className="jp-hero-ctas mt-8 hidden gap-3 md:flex">
              <HeroCtas t={t} lang={lang} onFlavors={() => scrollToTarget("#flavors")} />
            </div>
          </div>
          <div className="jp-actions md:hidden">
            <HeroCtas t={t} lang={lang} onFlavors={() => scrollToTarget("#flavors")} />
          </div>
          <StaticBottle k={flavors[0].id} lang={lang} priority />
          <Weave bg={FOREST} line={SAGE} height={56} className="jp-weave absolute inset-x-0 bottom-0 hidden md:block" />
        </div>

        {/* ---------- States 1..5: flavors ---------- */}
        {flavors.map((f, idx) => (
          <FlavorPanel
            key={f.id}
            f={f}
            idx={idx}
            t={t}
            lang={lang}
            qty={cart[f.id] ?? 0}
            onAdd={() => add(f.id)}
          />
        ))}

        {/* ---------- Shared bottle (motion mode) ---------- */}
        <div className="jp-shared pointer-events-none" aria-hidden="true">
          <div data-bottle-pos className="jp-bottle-pos" style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}>
            <div data-rise className="h-full">
            <div className="drift h-full">
              <div className="relative h-full">
              <div data-roll-box className="relative h-full">
                <span data-shadow className="jp-shadow" />
                {bottleKeys.map((k, i) => (
                  <div
                    key={k}
                    data-art={k}
                    className="absolute inset-0 flex justify-center"
                    style={{ color: hasPhotos(k) ? undefined : "var(--ink)" }}
                  >
                    <BottleArt k={k} lang={lang} priority={i === 0} />
                  </div>
                ))}
              </div>
              {/* Two runners: one rolls the current bottle away, the other rolls the next one in. */}
              {[0, 1].map((r) => (
                <div key={r} data-runner className="invisible absolute inset-0">
                  <span className="jp-shadow" />
                </div>
              ))}
              </div>
            </div>
            </div>
          </div>
          {bottles[bottleFor(active)]?.placeholder ? (
            <PlaceholderTag label={t.placeholder} className="bottom-24 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 md:bottom-8" />
          ) : null}
        </div>

      </div>
    </section>
  );
}

function HeroCtas({ t, lang, onFlavors }: { t: Dictionary; lang: Lang; onFlavors: () => void }) {
  return (
    <>
      <a
        href={generalLink(lang)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-12 items-center gap-2 rounded-full bg-sage px-5 text-[14px] text-forest-ink transition-transform md:px-6 md:text-[15px] duration-500 ease-[var(--ease)] hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="h-[18px] w-[18px]" />
        {t.hero.order}
      </a>
      <a
        href="#flavors"
        onClick={(e) => {
          e.preventDefault();
          onFlavors();
        }}
        className="inline-flex h-12 items-center rounded-full border border-sage/50 px-5 text-[14px] transition-colors md:px-6 md:text-[15px] duration-500 hover:bg-sage/10"
      >
        {t.hero.flavors}
      </a>
    </>
  );
}

function StaticBottle({ k, lang, priority }: { k: BottleKey; lang: Lang; priority?: boolean }) {
  const tilt = lang === "ar" ? -12 : 12;
  return (
    <div className="jp-static-bottle" aria-hidden="true">
      <div className="h-full" style={{ transform: `rotate(${tilt}deg)` }}>
        <BottleArt k={k} lang={lang} priority={priority} />
      </div>
    </div>
  );
}

function FlavorPanel({
  f,
  idx,
  t,
  lang,
  qty,
  onAdd,
}: {
  f: Flavor;
  idx: number;
  t: Dictionary;
  lang: Lang;
  qty: number;
  onAdd: () => void;
}) {
  return (
    <article
      data-panel
      id={idx === 0 ? "flavors" : undefined}
      className="jp-panel"
      style={{ background: f.bg, color: f.ink }}
      aria-labelledby={`flavor-${f.id}`}
    >
      <GiantWord word={t.journey.word} bg={f.bg} lang={lang} />
      <IngredientMarks f={f} lang={lang} />
      <div className="jp-text jp-flavor-text">
        <p data-anim className="eyebrow mb-3 flex items-center gap-3 text-[12px] md:mb-5 md:text-[13px]">
          <span className="ltr caps text-[11px]">
            0{idx + 1} / 0{flavors.length}
          </span>
          <span className="h-px w-6 bg-current opacity-60" />
          {f.seasonal ? t.journey.seasonal : t.journey.core}
        </p>
        {/* One size and one line for every flavor name, so all five panels share the same layout. */}
        <h2 id={`flavor-${f.id}`} data-anim className="font-display whitespace-nowrap text-[clamp(32px,8.6vw,72px)] leading-[1.08]">
          {f.name[lang]}
        </h2>
        <p data-anim className="mt-3 max-w-[28ch] text-[15px] leading-[1.7] md:mt-6 md:text-[18px]">
          {f.description[lang]}
        </p>
        <div data-anim className="mt-5 flex flex-wrap items-center gap-3 md:mt-8">
          <FlavorBox ar={f.name.ar} en={f.name.en} className="hidden xs:inline-flex" />
          {f.seasonal ? (
            <span className="arch-soft inline-flex h-9 items-center border border-current px-4 pt-0.5 text-[12px]">
              {t.journey.inSeason}
            </span>
          ) : null}
        </div>
        <div data-anim className="mt-10 hidden md:flex">
          <FlavorActions f={f} t={t} qty={qty} onAdd={onAdd} lang={lang} />
        </div>
      </div>
      <div className="jp-actions md:hidden">
        <FlavorActions f={f} t={t} qty={qty} onAdd={onAdd} lang={lang} />
      </div>
      <StaticBottle k={f.id} lang={lang} />
    </article>
  );
}

function FlavorActions({ f, t, qty, onAdd, lang }: { f: Flavor; t: Dictionary; qty: number; onAdd: () => void; lang: Lang }) {
  const dark = f.ink.toLowerCase() === "#202823";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] transition-transform duration-500 ease-[var(--ease)] hover:-translate-y-0.5"
        style={{ background: dark ? "#202823" : f.ink, color: dark ? f.bg : "#202823" }}
        aria-label={`${qty > 0 ? t.journey.added : t.journey.add}: ${f.name[lang]}${qty > 0 ? ` (${qty})` : ""}`}
      >
        <span aria-hidden="true" className="text-[18px] leading-none">
          +
        </span>
        {qty > 0 ? (
          <span>
            {t.journey.added} <span className="ltr">· {qty}</span>
          </span>
        ) : (
          t.journey.add
        )}
      </button>
      <a
        href="#order"
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget("#order");
        }}
        className="inline-flex h-12 items-center rounded-full border border-current/50 px-6 text-[15px] transition-colors duration-500 hover:bg-current/10"
      >
        {t.journey.order}
      </a>
    </div>
  );
}
