"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { navLinks, site } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { introPlayed, useIntroDone, useIntroLanded } from "@/lib/intro";

const ease = [0.22, 1, 0.36, 1] as const;
const closed = "inset(0% 50% 0% 50% round 9999px)";
const open = "inset(0% 0% 0% 0% round 9999px)";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const ready = useIntroDone();
  const landed = useIntroLanded();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  // Entrance start; the pill must reach full width before the intro's "HR" lands (0.8s)
  const delay = ready && !introPlayed() ? 0.9 : 0.15;

  return (
    <motion.header
      // No vertical offset: the intro measures the logo's resting spot to fly "HR" into it
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.6, delay, ease }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 max-[380px]:px-2"
    >
      {/* Opens from the centre with clip-path, which leaves the logo's measured position untouched */}
      <motion.nav
        layout
        initial={{ clipPath: closed }}
        animate={ready ? { clipPath: open, transitionEnd: { clipPath: "none" } } : { clipPath: closed }}
        transition={{ duration: 0.35, ease, clipPath: { duration: 0.6, delay, ease } }}
        className={`relative flex items-center rounded-full border border-border bg-surface/70 shadow-lg shadow-black/5 backdrop-blur-xl ${
          scrolled ? "gap-1 py-1 pl-3 pr-1" : "gap-2 py-1.5 pl-4 pr-1.5"
        }`}
      >
        {/* One soft highlight sweeps across once the pill is open */}
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <motion.span
            initial={{ x: "-120%" }}
            animate={{ x: ready ? "320%" : "-120%" }}
            transition={{ duration: 1.1, delay: delay + 0.75, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-fg/10 to-transparent"
          />
        </span>

        {/* Hidden until the intro's flying "HR" lands exactly here */}
        <a
          id="nav-logo"
          href="#top"
          className={`relative mr-1 font-mono text-sm font-semibold tracking-tight after:absolute after:-inset-3 after:content-[''] sm:mr-2 ${landed ? "" : "opacity-0"}`}
          aria-label="Back to top"
        >
          {site.initials}
        </a>

        {/* Few enough links to stay visible on phones too, just tighter; ::after pads each tap area */}
        <ul className="flex items-center">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(4px)" }}
              transition={{ duration: 0.5, delay: delay + 0.25 + i * 0.06, ease }}
            >
              <a
                href={link.href}
                className="relative whitespace-nowrap rounded-full px-2 py-1.5 text-[13px] max-[380px]:px-1.5 after:absolute after:inset-x-0 after:-inset-y-2 after:content-[''] text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:px-3 sm:text-sm"
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.6, rotate: -90 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: delay + 0.5 }}
          className="flex"
        >
          <ThemeToggle />
        </motion.div>
      </motion.nav>
    </motion.header>
  );
}
