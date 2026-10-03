"use client";

import { motion, type Variants } from "motion/react";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Holds the letters hidden until true */
  play?: boolean;
};

const letter: Variants = {
  hidden: { opacity: 0, filter: "blur(54px)", y: 10 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// Letter-by-letter blur-in. Words stay unbroken so the line wraps naturally.
export function BlurReveal({ text, className, delay = 0, stagger = 0.045, play = true }: Props) {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      animate={play ? "visible" : "hidden"}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {words.map((word, w) => (
        <span key={w} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, c) => (
            <motion.span key={c} variants={letter} className="inline-block">
              {char}
            </motion.span>
          ))}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
