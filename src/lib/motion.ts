"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** One timing system for the whole site. CSS mirrors these in globals.css. */
export const EASE = "expo.out";
export const EASE_IN = "power2.in";
export const DUR = 0.7;
export const DUR_UI = 0.45;
export const STAGGER = 0.08;
/** Hero entrance waits for the CSS preloader to lift. */
export const PRELOADER_MS = 1150;

/** Runs motion setup off the critical path, so first paint and hydration stay light. */
export function whenIdle(fn: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout: 700 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 120);
  return () => window.clearTimeout(id);
}

let registered = false;
export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: EASE, duration: DUR });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export function motionAllowed() {
  return typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function preloaderDelay() {
  if (typeof document === "undefined") return 0;
  if (document.documentElement.classList.contains("preloader-seen")) return 0.1;
  // The CSS preloader runs on the page clock; wait only for what's left of it.
  return Math.max(0.1, (PRELOADER_MS - performance.now()) / 1000 + 0.2);
}

type LenisLike = { scrollTo: (t: number | string | HTMLElement, o?: { offset?: number; duration?: number; immediate?: boolean }) => void };

/** Anchors whose scroll position isn't the element's top (e.g. inside the pinned journey). */
export const anchorResolvers: Record<string, () => number> = {};

export function scrollToTarget(target: number | string | HTMLElement, immediate = false) {
  if (typeof target === "string" && anchorResolvers[target]) target = anchorResolvers[target]();
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: immediate ? 0 : 1.2, immediate });
    return;
  }
  const y =
    typeof target === "number"
      ? target
      : (typeof target === "string" ? document.querySelector<HTMLElement>(target) : target)?.getBoundingClientRect().top! +
        window.scrollY;
  window.scrollTo({ top: y, behavior: motionAllowed() && !immediate ? "smooth" : "auto" });
}
