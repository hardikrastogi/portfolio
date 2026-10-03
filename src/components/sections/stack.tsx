"use client";

import { motion, type Variants } from "motion/react";
import { disciplines, stack } from "@/data/site";
import { TechIcon, techIcons } from "@/lib/tech-icons";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

const allTech = stack.flatMap((g) => g.items);
// Marquee shows only items with a real logo; split into two rows moving in opposite directions
const logoTech = allTech.filter((t) => techIcons[t]);
const marqueeRows = [logoTech.filter((_, i) => i % 2 === 0), logoTech.filter((_, i) => i % 2 === 1)];

export function Stack() {
  return (
    // overflow-x-clip: spread-out letters mid-animation never cause sideways scrolling
    <section id="stack" className="relative overflow-x-clip py-32">
      <Disciplines />
      <TechStack />
    </section>
  );
}

/* ───────────────────────── What I do ───────────────────────── */

function Disciplines() {
  return (
    <div>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mx-auto max-w-6xl px-6 font-mono text-xs uppercase tracking-[0.2em] text-muted"
      >
        What I do
      </motion.p>

      <ul className="mt-8 border-t border-border">
        {disciplines.map((d, i) => (
          <li key={d.title} className="relative">
            {/* Divider draws itself in from the left */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, delay: i * 0.12, ease }}
              className="absolute inset-x-0 bottom-0 h-px origin-left bg-border"
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ staggerChildren: 0.08, delayChildren: i * 0.1 }}
              className="relative mx-auto grid max-w-6xl grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-3 px-6 py-4 md:grid-cols-[4rem_1fr_minmax(0,21rem)] md:gap-x-8"
            >
              <motion.span
                variants={fadeUp}
                className="self-center font-mono text-xs text-subtle"
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>

              {/* Word: widely spaced, blurred letters pull together into the condensed word */}
              {/* min-w-0: the spread-out word overflows visually without resizing the grid */}
              <span className="block min-w-0 whitespace-nowrap">
                <motion.span
                  variants={{
                    hidden: { letterSpacing: "0.4em", opacity: 0, filter: "blur(12px)" },
                    visible: {
                      letterSpacing: "-0.01em",
                      opacity: 1,
                      filter: "blur(0px)",
                      transition: { duration: 1.3, ease },
                    },
                  }}
                  className="block font-display text-[clamp(3.25rem,11vw,9.5rem)] uppercase leading-[0.92]"
                >
                  {d.title}
                </motion.span>
              </span>

              {/* Description: wiped in from the left */}
              <motion.p
                variants={{
                  hidden: { clipPath: "inset(0% 100% 0% 0%)", opacity: 0.4 },
                  visible: {
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                    transition: { duration: 1, delay: 0.35, ease },
                  },
                }}
                className="col-start-2 font-mono text-[13px] leading-relaxed text-muted md:col-start-3"
              >
                {d.text}
              </motion.p>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── Tech stack ───────────────────────── */

function TechStack() {
  return (
    <div className="mt-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        transition={{ staggerChildren: 0.08 }}
        className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-6"
      >
        <div>
          <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Tech stack
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Tools I build with
          </motion.h2>
        </div>
        <motion.p variants={fadeUp} className="font-mono text-sm text-subtle">
          {allTech.length} technologies · {stack.length} areas
        </motion.p>
      </motion.div>

      {/* Logo marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2 }}
        className="group mt-14 flex flex-col gap-6 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
      >
        {marqueeRows.map((row, r) => (
          <div
            key={r}
            className={`flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused] ${
              r === 1 ? "[animation-direction:reverse]" : ""
            }`}
          >
            {[...row, ...row].map((t, i) => (
              <span
                key={`${t}-${i}`}
                aria-hidden={i >= row.length}
                className="flex shrink-0 items-center gap-3 text-subtle transition-colors duration-300 hover:text-fg"
              >
                <TechIcon name={t} className="size-7" />
                <span className="text-lg font-medium tracking-tight">{t}</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Grouped grid */}
      <div className="mx-auto mt-16 grid max-w-6xl gap-px overflow-hidden px-6 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((group, g) => (
          <motion.div
            key={group.group}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.04, delayChildren: (g % 3) * 0.1 }}
            className="border-t border-border pb-10 pt-5 sm:pr-8"
          >
            <motion.div variants={fadeUp} className="flex items-baseline justify-between">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{group.group}</h3>
              <span className="font-mono text-xs text-subtle">{String(group.items.length).padStart(2, "0")}</span>
            </motion.div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {group.items.map((t) => (
                <motion.li
                  key={t}
                  variants={fadeUp}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-sm text-fg/85 transition-colors duration-300 hover:border-fg/40 hover:text-fg"
                >
                  <TechIcon name={t} className="size-4 shrink-0 text-muted" />
                  {t}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
