"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { navLinks, site } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { introPlayed, useIntroDone, useIntroLanded } from "@/lib/intro";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const ready = useIntroDone();
  const landed = useIntroLanded();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <motion.header
      // No vertical offset: the intro measures the logo's resting spot to fly "HR" into it
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.6, delay: ready && !introPlayed() ? 0.9 : 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <motion.nav
        layout
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center rounded-full border border-border bg-surface/70 shadow-lg shadow-black/5 backdrop-blur-xl ${
          scrolled ? "gap-1 py-1 pl-3 pr-1" : "gap-2 py-1.5 pl-4 pr-1.5"
        }`}
      >
        {/* Hidden until the intro's flying "HR" lands exactly here */}
        <a
          id="nav-logo"
          href="#top"
          className={`mr-2 font-mono text-sm font-semibold tracking-tight ${landed ? "" : "opacity-0"}`}
          aria-label="Back to top"
        >
          {site.initials}
        </a>

        <ul className="hidden items-center sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle />
      </motion.nav>
    </motion.header>
  );
}
