"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import type { FlowStep } from "@/data/project-details";

const ease = [0.22, 1, 0.36, 1] as const;

// "How it works" pipeline: nodes appear in order, connectors draw between them,
// then a small pulse keeps travelling along each connector. Horizontal on desktop,
// vertical on mobile.
export function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="flex flex-col items-stretch md:flex-row md:items-center"
    >
      {steps.map((step, i) => (
        <Fragment key={step.label}>
          <motion.li
            variants={{
              hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, delay: i * 0.35, ease } },
            }}
            className="flex-1 rounded-xl border border-border bg-surface/60 px-4 py-3"
          >
            <p className="font-mono text-[10px] text-subtle">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 text-sm font-medium">{step.label}</p>
            <p className="mt-0.5 text-xs text-muted">{step.detail}</p>
          </motion.li>

          {i < steps.length - 1 && (
            <li aria-hidden className="relative mx-auto h-8 w-px md:mx-0 md:h-px md:w-10 md:shrink-0 lg:w-14">
              <motion.span
                variants={{
                  hidden: { scale: 0 },
                  visible: { scale: 1, transition: { duration: 0.5, delay: i * 0.35 + 0.3, ease } },
                }}
                className="absolute inset-0 origin-top bg-border md:origin-left"
              />
              {!reduce && (
                <motion.span
                  className="absolute inset-0"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { delay: steps.length * 0.35 } },
                  }}
                >
                  <span className="flow-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                </motion.span>
              )}
            </li>
          )}
        </Fragment>
      ))}
    </motion.ol>
  );
}
