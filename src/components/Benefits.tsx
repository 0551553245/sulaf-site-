"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Dictionary } from "@/content/dictionary";
import type { Lang } from "@/content/site";
import { bottles } from "@/content/media";
import { createRoller } from "@/lib/roll";
import { wrapFor } from "@/lib/wraps";
import { DUR, EASE, motionAllowed, registerGsap, whenIdle } from "@/lib/motion";

/** The bottle that stands in the arch. */
const HERO_FLAVOR = "pineapple";

/*
 * Desktop board: one 1200×600 coordinate space shared by the SVG lines and the
 * callouts, so every line meets its callout exactly at any size.
 * Three callouts on the start side, three on the end side, top to bottom.
 */
const ROWS = [118, 300, 482];
const ANCHORS = [318, 408, 498]; // where each line touches the bottle
const BOTTLE_EDGE = 66; // half the body width at the label, in board units
const COL = 360; // callout column width

function geometry(i: number, lang: Lang) {
  const startSide = i < 3;
  // Start side is the right in Arabic, the left in English.
  const left = startSide === (lang === "en");
  const row = ROWS[i % 3];
  const anchor = ANCHORS[i % 3];
  const x0 = left ? COL + 14 : 1200 - COL - 14;
  const x1 = left ? x0 + 60 : x0 - 60;
  const xe = left ? 600 - BOTTLE_EDGE : 600 + BOTTLE_EDGE;
  return { left, row, path: `M${x0},${row} H${x1} L${xe},${anchor}`, start: [x0, row], end: [xe, anchor] };
}

function Tbd({ text }: { text: string }) {
  return (
    <span className="mt-2 inline-block rounded-full border border-sage/50 px-2.5 py-1 font-[family-name:var(--font-lat)] text-[12px] leading-snug">
      <bdi>[TBD: {text}]</bdi>
    </span>
  );
}

export function Benefits({ t, lang }: { t: Dictionary; lang: Lang }) {
  const root = useRef<HTMLElement>(null);
  const items = t.benefits.items;
  const set = bottles[HERO_FLAVOR]!;
  const front = set.views["000"];

  useEffect(() => {
    const el = root.current;
    if (!el || !motionAllowed()) return;
    let ctx: gsap.Context | null = null;
    const cancel = whenIdle(() => {
      const { gsap, ScrollTrigger } = registerGsap();
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        const wrap = wrapFor(HERO_FLAVOR);

        // Desktop: the board stays on screen while the bottle turns once and the six lines draw in.
        mm.add("(min-width: 1100px)", () => {
          const box = el.querySelector<HTMLElement>("[data-bn-bottle='board']")!;
          const roller = createRoller(box);
          roller.set(wrap);
          roller.render(0);
          box.querySelector("img")!.style.visibility = "hidden";
          const turn = { a: 0 };
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
            defaults: { ease: "none" },
          });
          tl.to(turn, { a: 360, duration: 6.6, onUpdate: () => roller.render(turn.a) }, 0);
          gsap.utils.toArray<HTMLElement>("[data-bn-call]", el).forEach((c, i) => {
            const line = el.querySelector(`[data-bn-line='${i}']`)!;
            const dots = el.querySelectorAll(`[data-bn-dot='${i}']`);
            const at = 0.3 + i;
            tl.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, at)
              .fromTo(dots, { opacity: 0 }, { opacity: 1, duration: 0.25 }, at + 0.5)
              .fromTo(c, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, at + 0.35);
          });
          ScrollTrigger.refresh();
          return () => {
            roller.destroy();
            box.querySelector("img")!.style.visibility = "";
          };
        });

        // Phone and tablet: the bottle turns as it passes; each benefit draws its line, then rises.
        mm.add("(max-width: 1099px)", () => {
          const box = el.querySelector<HTMLElement>("[data-bn-bottle='stack']")!;
          const roller = createRoller(box);
          roller.set(wrap);
          roller.render(0);
          box.querySelector("img")!.style.visibility = "hidden";
          const turn = { a: 0 };
          gsap.to(turn, {
            a: 360,
            ease: "none",
            onUpdate: () => roller.render(turn.a),
            scrollTrigger: { trigger: el.querySelector("[data-bn-list]"), start: "top 60%", end: "bottom 60%", scrub: 0.6 },
          });
          gsap.utils.toArray<HTMLElement>("[data-bn-item]", el).forEach((li) => {
            gsap
              .timeline({ scrollTrigger: { trigger: li, start: "top 82%", once: true } })
              .fromTo(li.querySelector("[data-bn-spine]"), { scaleY: 0 }, { scaleY: 1, duration: DUR, ease: EASE })
              .fromTo(li.querySelector("[data-bn-pin]"), { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.2)
              .fromTo(li.querySelector("[data-bn-text]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: DUR, ease: EASE }, 0.15);
          });
          return () => {
            roller.destroy();
            box.querySelector("img")!.style.visibility = "";
          };
        });
      }, el);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, [lang]);

  const bottle = (
    <Image
      src={front.src}
      alt={set.alt[lang]}
      width={front.width}
      height={front.height}
      sizes="200px"
      className="h-full w-auto max-w-none"
    />
  );

  return (
    <section ref={root} id="benefits" data-ink="#D6D8B0" className="bn relative bg-forest text-sage">
      <div className="bn-stage">
        <header className="mx-auto max-w-[1400px] px-[var(--gutter)] text-center">
          <p data-reveal className="eyebrow text-[12px] opacity-80 md:text-[13px]">
            {t.benefits.eyebrow}
          </p>
          <h2 data-reveal className="font-display mt-3 text-[clamp(34px,7vw,64px)] leading-[1.3] [text-wrap:balance]">
            {t.benefits.title}
          </h2>
          <p data-reveal className="mt-4 text-[16px] md:text-[19px]">
            {t.benefits.line}
          </p>
        </header>

        {/* ---------- Desktop board ---------- */}
        <div className="bn-board">
          <svg viewBox="0 0 1200 600" className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
            {/* The arch, drawn like the label's: two concentric lines */}
            <path d="M440,600 V180 A160,160 0 0 1 760,180 V600" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
            <path d="M456,600 V180 A144,144 0 0 1 744,180 V600" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            {items.map((_, i) => {
              const g = geometry(i, lang);
              return (
                <g key={i}>
                  <path data-bn-line={i} d={g.path} pathLength={1} className="bn-line" stroke="currentColor" strokeWidth="1.2" />
                  <circle data-bn-dot={i} cx={g.start[0]} cy={g.start[1]} r="3.5" fill="currentColor" className="bn-dot" />
                  <circle data-bn-dot={i} cx={g.end[0]} cy={g.end[1]} r="5" fill="var(--color-forest)" stroke="currentColor" strokeWidth="1.5" className="bn-dot" />
                </g>
              );
            })}
          </svg>
          <div data-bn-bottle="board" className="bn-board-bottle">
            {bottle}
          </div>
          {items.map((b, i) => {
            const g = geometry(i, lang);
            return (
              <div
                key={b.title}
                data-bn-call
                className="bn-call"
                style={{
                  top: `${(g.row / 600) * 100}%`,
                  left: g.left ? 0 : undefined,
                  right: g.left ? undefined : 0,
                  textAlign: g.left ? "right" : "left",
                }}
              >
                <h3 className="font-display text-[clamp(22px,2vw,30px)] leading-[1.15]">{b.title}</h3>
                {b.line ? <p className="mt-1.5 text-[16px] leading-[1.6]">{b.line}</p> : null}
                {b.tbd ? <Tbd text={b.tbd} /> : null}
              </div>
            );
          })}
        </div>

        {/* ---------- Phone and tablet stack ---------- */}
        <div className="bn-stack mx-auto max-w-[560px] px-[var(--gutter)]">
          <div className="relative mx-auto mt-10 h-[min(58svh,460px)] w-[min(72vw,300px)]">
            <svg viewBox="0 0 300 460" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2,460 V150 A148,148 0 0 1 298,150 V460" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
              <path d="M14,460 V150 A136,136 0 0 1 286,150 V460" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            </svg>
            <div data-bn-bottle="stack" className="absolute inset-x-0 bottom-[3%] top-[9%] flex justify-center">
              {bottle}
            </div>
          </div>
          <ul data-bn-list className="mt-4">
            {items.map((b) => (
              <li key={b.title} data-bn-item className="grid grid-cols-[28px_1fr] gap-x-4">
                <span className="relative flex justify-center" aria-hidden="true">
                  <span data-bn-spine className="bn-spine absolute inset-y-0 w-px bg-current opacity-50" />
                  <span data-bn-pin className="relative mt-[30px] block h-3 w-3 rounded-full border-[1.5px] border-current bg-forest" />
                </span>
                <div data-bn-text className="pb-8 pt-6">
                  <h3 className="font-display text-[26px] leading-[1.2]">{b.title}</h3>
                  {b.line ? <p className="mt-1.5 text-[16px] leading-[1.6]">{b.line}</p> : null}
                  {b.tbd ? <Tbd text={b.tbd} /> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
