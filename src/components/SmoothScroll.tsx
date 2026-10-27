"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { DUR, EASE, STAGGER, motionAllowed, registerGsap, whenIdle } from "@/lib/motion";

/**
 * Lenis smooth scroll wired into GSAP's ticker, plus the site-wide reveal:
 * anything with [data-reveal] rises out of its mask the first time it
 * enters the viewport. Same easing and timing everywhere.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!motionAllowed()) {
      document.documentElement.classList.remove("js-motion");
      return;
    }
    let cleanup: (() => void) | undefined;
    const cancel = whenIdle(() => (cleanup = setup()));
    return () => {
      cancel();
      cleanup?.();
    };
  }, []);

  return null;
}

function setup() {
  {
    const { gsap, ScrollTrigger } = registerGsap();

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, syncTouch: false });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            // opacity, not autoAlpha: never set visibility:hidden, or a focused
            // element scrolled in by Tab would lose focus.
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: DUR, ease: EASE, stagger: STAGGER, overwrite: true },
          ),
      });

      // Header ink + backdrop follow the section under it.
      const html = document.documentElement;
      gsap.utils.toArray<HTMLElement>("[data-ink]").forEach((s) => {
        ScrollTrigger.create({
          trigger: s,
          start: "top top+=36",
          end: "bottom top+=36",
          onToggle: (self) => {
            if (!self.isActive) return;
            html.style.setProperty("--hdr-ink", s.dataset.ink!);
            html.style.setProperty("--hdr-bg", getComputedStyle(s).backgroundColor);
          },
        });
      });
      ScrollTrigger.create({
        trigger: "#top",
        start: "top top",
        end: "bottom top+=36",
        onToggle: (self) => self.isActive && html.style.setProperty("--hdr-bg", "transparent"),
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }
}
