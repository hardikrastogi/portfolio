"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useRef } from "react";
import { useIntroDone } from "@/lib/intro";

// Eased wheel/trackpad scrolling. Touch keeps the device's native scrolling (syncTouch off),
// and visitors who prefer reduced motion get plain native scrolling.
// Motion's useScroll reads window scroll, so scroll-linked animations keep working as-is.
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const ready = useIntroDone();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      autoRaf: true,
      anchors: true, // in-page links (#work, #about…) glide with the same easing
    });

    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Hold the page still while the greeting intro is showing
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (ready) lenis.start();
    else lenis.stop();
  }, [ready]);

  return null;
}
