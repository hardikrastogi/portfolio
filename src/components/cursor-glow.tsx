"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

// Page-wide cursor spotlight: a soft glow that trails the pointer and reveals a faint
// dot grid around it. Fixed to the viewport, so it follows across every section.
// Hidden on touch devices, where there is no hovering pointer.
const REVEAL = 220; // radius of the dot-grid reveal

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

  // Both layers are small, fixed-size and moved by transform, so following the cursor is
  // compositor-only instead of repainting full-screen gradients on every move and scroll.
  // The dot grid inside the reveal is shifted back by the same amount (plus scroll),
  // so its dots stay pinned to the page and line up with the hero's grid.
  const { scrollY } = useScroll();
  const gridX = useTransform(x, (v) => -(v - REVEAL));
  const gridY = useTransform([y, scrollY], ([v, s]: number[]) => -(v - REVEAL) - s);
  const gridPos = useMotionTemplate`${gridX}px ${gridY}px`;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden [@media(pointer:fine)]:block" style={{ opacity: fade }}>
      <motion.div
        className="absolute -left-[440px] -top-[440px] size-[880px] bg-[radial-gradient(circle_closest-side,color-mix(in_oklab,var(--fg)_7%,transparent),transparent_70%)] will-change-transform"
        style={{ x, y }}
      />
      <motion.div
        className="absolute -left-[220px] -top-[220px] size-[440px] opacity-50 [background-image:radial-gradient(var(--subtle)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(circle_closest-side,black,transparent)] will-change-transform"
        style={{ x, y, backgroundPosition: gridPos }}
      />
    </motion.div>
  );
}
