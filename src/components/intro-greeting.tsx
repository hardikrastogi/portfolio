"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { INTRO_SEEN_KEY, markIntroLanded, startIntroFlight, useIntroLanded } from "@/lib/intro";

const words = ["Hello", "Namaste", "Bonjour"];
const ease = [0.76, 0, 0.24, 1] as const;

// Every word stays on screen for the same time (ms)
const HOLD_MS = 475;
// …and fades in at the same speed (s)
const FADE_IN_S = 0.2;

// Greeting intro: words flash in the centre, then the curtain slides up with a curved
// bottom edge that flattens as it leaves. Plays once per browser session; returning
// visitors never see it (an inline script in <head> hides it before first paint).
export function IntroGreeting() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const landed = useIntroLanded();

  useEffect(() => {
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

    // Hold scroll still while the curtain is down
    const root = document.documentElement;
    root.style.overflow = "hidden";

    if (reduce) {
      const id = setTimeout(() => setLeaving(true), 700);
      return () => clearTimeout(id);
    }

    window.scrollTo(0, 0);
    let i = 0;
    let id: ReturnType<typeof setTimeout>;
    const next = () => {
      if (i < words.length - 1) {
        i += 1;
        setIndex(i);
        id = setTimeout(next, HOLD_MS);
      } else {
        setLeaving(true);
      }
    };
    id = setTimeout(next, HOLD_MS);
    return () => clearTimeout(id);
  }, []);

  // Start the page entrance as the curtain is halfway up, so the two overlap
  useEffect(() => {
    if (!leaving) return;
    // Remember only once it has actually played (safe under React's dev double-effects)
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
    document.documentElement.style.overflow = "";
    const id = setTimeout(() => {
      startIntroFlight();
      markIntroLanded(); // no flying logo here: the navbar shows its own "HR" right away
    }, 350);
    return () => clearTimeout(id);
  }, [leaving]);

  // Landed without ever leaving = skipped (already seen this session)
  if (gone || (landed && !leaving)) return null;

  return (
    <motion.div
      id="intro"
      aria-hidden
      className="fixed inset-x-0 top-0 z-[100] h-[118svh] cursor-wait"
      initial={{ y: 0 }}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.9, ease }}
      onAnimationComplete={() => leaving && setGone(true)}
    >
      <div className="flex h-[100svh] items-center justify-center bg-[#0b0b0b]">
        {/* The last word fades as the curtain lifts, so it isn't on screen longer than the others */}
        <motion.div animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.15 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={words[index]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              // Quick exit of its own: with mode="wait" a slow exit would swallow the next words
              exit={{ opacity: 0, y: -8, transition: { duration: 0.05 } }}
              transition={{ duration: FADE_IN_S }}
              className="flex items-center gap-3 text-4xl font-medium tracking-tight text-[#ededed] md:text-6xl"
            >
              <span className="size-2.5 rounded-full bg-[#ededed] md:size-3" />
              {words[index]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Curved bottom edge: bulges while moving, flattens as it exits */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block h-[18svh] w-full">
        <motion.path
          fill="#0b0b0b"
          initial={{ d: "M0 0 L100 0 Q50 100 0 0 Z" }}
          animate={leaving ? { d: "M0 0 L100 0 Q50 0 0 0 Z" } : { d: "M0 0 L100 0 Q50 100 0 0 Z" }}
          transition={{ duration: 0.9, ease }}
        />
      </svg>
    </motion.div>
  );
}
