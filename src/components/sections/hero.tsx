"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { RequestTrace } from "@/components/request-trace";
import { site } from "@/data/site";
import { useIntroDone } from "@/lib/intro";

const ease = [0.22, 1, 0.36, 1] as const;
const hidden = { opacity: 0, y: 16, filter: "blur(6px)" };

export function Hero() {
  // Entrance waits for the intro to lift
  const ready = useIntroDone();
  const fadeUp = (delay: number) => ({
    initial: hidden,
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : hidden,
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section id="top" className="relative isolate overflow-hidden px-6 pb-24 pt-32 sm:pt-36">
      {/* Fine grid fading out from the centre, plus a warm glow rising behind the trace panel */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(to_right,var(--border)_1px,transparent_1px)] [background-size:72px_72px] [background-position:center_top] opacity-60 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_30%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] -z-10 h-[520px] w-[min(1100px,140vw)] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--spark)_22%,transparent),transparent)] blur-3xl [mask-image:linear-gradient(to_bottom,black_25%,transparent_70%)]"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.p
          {...fadeUp(0.1)}
          className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 py-1.5 pl-3 pr-3.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] text-muted backdrop-blur sm:text-xs sm:tracking-[0.14em]"
        >
          {site.available && (
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--spark)] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[var(--spark)]" />
            </span>
          )}
          <span className="text-fg">{site.role}</span>
          {site.available && (
            <>
              <span className="h-3 w-px bg-border" />
              Open to work
            </>
          )}
        </motion.p>

        <Name play={ready} />

        <motion.p {...fadeUp(1.0)} className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
          {site.tagline}
        </motion.p>

        <motion.div {...fadeUp(1.15)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-accent py-3 pl-6 pr-5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-85"
          >
            View my work
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-surface-2"
          >
            Get in touch
          </a>
        </motion.div>

        <motion.p {...fadeUp(1.25)} className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {site.location} · <LocalTime />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.2, delay: 1.3, ease }}
          className="mt-16 w-full max-w-3xl text-left sm:mt-20"
        >
          <RequestTrace play={ready} />
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── Name ───────────────────────── */

const BASE_WEIGHT = 500;
const PEAK_WEIGHT = 800;
const RADIUS = 260;

// Letters ink in from a hairline weight, then thicken as the cursor passes near them
function Name({ play }: { play: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [settled, setSettled] = useState(false);
  const letters = Array.from(site.name);
  const lastDelay = 0.25 + (letters.length - 1) * 0.05;

  useEffect(() => {
    const root = ref.current;
    if (!settled || !root || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    const glyphs = Array.from(root.querySelectorAll<HTMLElement>("[data-glyph]"));
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const render = () => {
      frame = 0;
      // Measure every letter first, then write: interleaving would force a layout per letter
      const centres = glyphs.map((g) => {
        const r = g.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      glyphs.forEach((g, i) => {
        let weight = BASE_WEIGHT;
        if (pointer) {
          const t = Math.max(0, 1 - Math.hypot(pointer.x - centres[i].x, pointer.y - centres[i].y) / RADIUS);
          weight += (PEAK_WEIGHT - BASE_WEIGHT) * t * t * (3 - 2 * t); // smoothstep falloff
        }
        const next = String(Math.round(weight));
        if (g.style.fontWeight !== next) g.style.fontWeight = next;
      });
    };
    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      frame ||= requestAnimationFrame(render);
    };
    const onLeave = () => {
      pointer = null;
      frame ||= requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [settled]);

  return (
    <h1
      ref={ref}
      aria-label={site.name}
      className="mt-8 whitespace-nowrap font-name text-[clamp(2.75rem,14vw,10rem)] leading-[0.95] tracking-[-0.04em]"
    >
      {letters.map((char, i) =>
        char === " " ? (
          <span key={i} aria-hidden className="inline-block w-[0.22em]" />
        ) : (
          <motion.span
            key={i}
            aria-hidden
            initial={{ opacity: 0, y: "0.18em", fontWeight: 200 }}
            animate={play ? { opacity: 1, y: 0, fontWeight: BASE_WEIGHT } : { opacity: 0, y: "0.18em", fontWeight: 200 }}
            transition={{
              opacity: { duration: 0.6, delay: 0.25 + i * 0.05 },
              y: { duration: 1, delay: 0.25 + i * 0.05, ease },
              fontWeight: { duration: 1.4, delay: 0.35 + i * 0.05, ease },
            }}
            onAnimationComplete={() => i === letters.length - 1 && setSettled(true)}
            className="inline-block"
          >
            {/* Inner span takes the cursor-driven weight once the entrance has finished */}
            <span data-glyph className="inline-block transition-[font-weight] duration-200 ease-out">
              {char}
            </span>
          </motion.span>
        ),
      )}
      <motion.span
        aria-hidden
        initial={{ scale: 0 }}
        animate={{ scale: play ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 15, delay: lastDelay + 0.5 }}
        className="ml-[0.03em] inline-block size-[0.13em] rounded-full bg-[var(--spark)]"
      />
    </h1>
  );
}

// The visitor sees the time where I am; filled in after mount so server and client markup match
function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {now?.toLocaleTimeString("en-GB", { timeZone: site.timeZone, hour: "2-digit", minute: "2-digit" }) ?? "--:--"} IST
    </>
  );
}
