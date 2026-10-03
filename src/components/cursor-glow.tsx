"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

// Page-wide cursor spotlight: a soft glow that trails the pointer and reveals a faint
// dot grid around it. Fixed to the viewport, so it follows across every section.
// Hidden on touch devices, where there is no hovering pointer.
export function CursorGlow() {
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const opacity = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 140, damping: 22 });
  const y = useSpring(my, { stiffness: 140, damping: 22 });
  const fade = useSpring(opacity, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX);
      my.set(e.clientY);
      opacity.set(1);
    };
    const leave = () => opacity.set(0);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [mx, my, opacity]);

  const glow = useMotionTemplate`radial-gradient(440px circle at ${x}px ${y}px, color-mix(in oklab, var(--fg) 7%, transparent), transparent 70%)`;
  // Grid scrolls with the page so it lines up with the hero's dot grid
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, (v) => -v);
  const gridPos = useMotionTemplate`0px ${gridY}px`;
  const reveal = useMotionTemplate`radial-gradient(220px circle at ${x}px ${y}px, black, transparent)`;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden [@media(pointer:fine)]:block" style={{ opacity: fade }}>
      <motion.div className="absolute inset-0" style={{ background: glow }} />
      <motion.div
        className="absolute inset-0 [background-image:radial-gradient(var(--subtle)_1px,transparent_1px)] [background-size:24px_24px]"
        style={{ maskImage: reveal, WebkitMaskImage: reveal, backgroundPosition: gridPos, opacity: 0.5 }}
      />
    </motion.div>
  );
}
