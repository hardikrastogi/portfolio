"use client";

import { useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import { INTRO_SEEN_KEY, markIntroLanded, startIntroFlight, useIntroLanded } from "@/lib/intro";

const ease = [0.76, 0, 0.24, 1] as const;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Initials morph intro: "HR" fades in large at the centre of a black screen, holds,
// then shrinks and flies into the navbar logo's exact spot while the screen fades away.
// Plays once per browser session; an inline script in <head> hides it before first paint
// for returning visitors.
export function Intro() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [flying, setFlying] = useState(false);
  const landed = useIntroLanded();

  useEffect(() => {
    let cancelled = false;
    const root = document.documentElement;

    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {}
    if (seen) {
      startIntroFlight();
      markIntroLanded();
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // Remember only once it has actually played (safe under React's dev double-effects)
    const finish = () => {
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {}
      root.style.overflow = "";
      markIntroLanded();
    };

    (async () => {
      const logo = scope.current?.querySelector<HTMLElement>("[data-intro-logo]");
      const bg = scope.current?.querySelector<HTMLElement>("[data-intro-bg]");
      if (!logo || !bg) return;

      // 1. Fade in, 2. hold
      await animate(
        logo,
        { opacity: [0, 1], scale: [0.96, 1], filter: ["blur(8px)", "blur(0px)"] },
        { duration: 0.55, ease: "easeOut" },
      );
      await wait(reduce ? 150 : 450);
      if (cancelled) return;

      startIntroFlight(); // navbar + hero begin their entrance now
      setFlying(true);

      // 3. Fly into the navbar logo: measure both, then translate + scale between them
      const target = document.getElementById("nav-logo");
      if (reduce || !target) {
        await animate(scope.current, { opacity: 0 }, { duration: 0.4 });
        if (!cancelled) finish();
        return;
      }
      const from = logo.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      const scale = parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(logo).fontSize);
      const color = getComputedStyle(target).color;

      await Promise.all([
        animate(logo, { x: dx, y: dy, scale, color }, { duration: 0.8, ease }),
        animate(bg, { opacity: 0 }, { duration: 0.7, ease: "easeInOut", delay: 0.1 }),
      ]);
      if (!cancelled) finish();
    })();

    return () => {
      cancelled = true;
      root.style.overflow = "";
    };
  }, [animate, scope]);

  if (landed) return null;

  return (
    <div ref={scope} id="intro" aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        data-intro-bg
        className={`absolute inset-0 bg-[#0b0b0b] ${flying ? "" : "pointer-events-auto cursor-wait"}`}
      />
      <div className="absolute inset-0 grid place-items-center">
        {/* Same face, weight and tracking as the navbar logo, so the scale-down lands seamlessly */}
        <span
          data-intro-logo
          className="font-mono text-[clamp(5rem,14vw,9rem)] font-semibold leading-none tracking-tight text-[#ededed] opacity-0 will-change-transform"
        >
          HR
        </span>
      </div>
    </div>
  );
}
