"use client";

import { motion } from "motion/react";
import { BlurReveal } from "@/components/blur-reveal";
import { site } from "@/data/site";
import { useIntroDone } from "@/lib/intro";

const ease = [0.22, 1, 0.36, 1] as const;
const hidden = { opacity: 0, y: 16, filter: "blur(6px)" };

export function Hero() {
  // Entrance waits for the greeting intro to lift
  const ready = useIntroDone();
  const fadeUp = (delay: number) => ({
    initial: hidden,
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : hidden,
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh items-center overflow-hidden px-6"
    >
      {/* Dot grid, faded toward the edges */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]"
      />

      <div className="mx-auto w-full max-w-5xl">
        {site.available && (
          <motion.p {...fadeUp(0.1)} className="flex items-center gap-2 font-mono text-xs text-muted sm:text-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#A0522D] opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-[#A0522D]" />
            </span>
            Open to Work
          </motion.p>
        )}

        <h1 className="mt-6 text-[clamp(3rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
          <BlurReveal text={site.name} delay={0.2} play={ready} />
        </h1>

        <motion.p {...fadeUp(1.0)} className="mt-8 max-w-2xl text-lg text-fg/90 sm:text-xl">
          {site.tagline}
        </motion.p>
        <motion.p {...fadeUp(1.15)} className="mt-3 max-w-2xl text-base text-muted">
          {site.intro}
        </motion.p>

        <motion.div {...fadeUp(1.3)} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-85"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            Get in touch
          </a>
          <span className="ml-1 font-mono text-xs text-muted">{site.role} · {site.location}</span>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#work"
        aria-label="Scroll to work"
        {...fadeUp(1.6)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <span className="flex h-9 w-5 justify-center rounded-full border border-border pt-1.5">
          <motion.span
            className="block h-1.5 w-1 rounded-full bg-muted"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
