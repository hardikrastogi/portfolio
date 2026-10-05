"use client";

import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { heroTraces } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

// One trace "plays" over SWEEP seconds, holds, then the next one swaps in
const SWEEP = 1.8;
const HOLD = 3.4;

// A live-looking request waterfall: each span's bar draws in at its start time while a playhead sweeps across
export function RequestTrace({ play }: { play: boolean }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const trace = heroTraces[index];
  const total = Math.max(...trace.spans.map((s) => s.end));

  useEffect(() => {
    if (!play) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % heroTraces.length), (SWEEP + HOLD) * 1000 + 600);
    return () => clearTimeout(id);
  }, [play, index]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      {/* Header: request line, status, total time */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 font-mono text-[11px] sm:px-5 sm:text-xs">
        <span className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-fg">
          {trace.method}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={trace.route}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease }}
            className="truncate text-fg"
          >
            {trace.route}
          </motion.span>
        </AnimatePresence>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 text-muted">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {trace.status}
        </span>
        <span className="hidden shrink-0 text-muted sm:inline">·</span>
        <TotalTime key={index} total={total} play={play} instant={!!reduce} />
      </div>

      {/* Waterfall */}
      <div className="relative px-4 pb-5 pt-3 sm:px-5">
        <Ticks total={total} />

        <div className="relative mt-2">
          <AnimatePresence mode="wait">
            <motion.ul
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="space-y-1.5"
            >
              {trace.spans.map((span, i) => {
                const delay = reduce ? 0 : (span.start / total) * SWEEP;
                const duration = reduce ? 0 : Math.max(((span.end - span.start) / total) * SWEEP, 0.15);
                return (
                  <li key={i} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[11rem_1fr]">
                    <div
                      className="flex min-w-0 items-baseline gap-2 font-mono text-[11px] sm:text-xs"
                      style={{ paddingLeft: span.depth * 14 }}
                    >
                      {span.depth > 0 && <span className="text-subtle">└</span>}
                      <span className="text-fg">{span.name}</span>
                      <span className="hidden truncate text-muted sm:inline">{span.service}</span>
                    </div>

                    <div className="relative h-6">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: play ? 1 : 0 }}
                        transition={{ duration, delay, ease: "easeOut" }}
                        className={`absolute inset-y-1 origin-left rounded-[5px] ${
                          span.depth === 0 ? "bg-fg/85" : "bg-[var(--spark)]/75"
                        }`}
                        style={{
                          left: `${(span.start / total) * 100}%`,
                          width: `${((span.end - span.start) / total) * 100}%`,
                        }}
                      />
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: play ? 1 : 0 }}
                        transition={{ duration: 0.4, delay: delay + duration }}
                        className="absolute top-1/2 -translate-y-1/2 pl-2 font-mono text-[10px] text-muted"
                        style={
                          span.end / total > 0.8
                            ? { right: `${100 - (span.start / total) * 100}%`, paddingRight: 8 }
                            : { left: `${(span.end / total) * 100}%` }
                        }
                      >
                        {span.end - span.start}ms
                      </motion.span>
                    </div>
                  </li>
                );
              })}
            </motion.ul>
          </AnimatePresence>

          {/* Playhead sweeping the timeline column. The track-wide wrapper moves by transform
              (x: 100% = the track's width), so the sweep never triggers layout */}
          {!reduce && (
            <div className="pointer-events-none absolute inset-y-0 left-[calc(7.5rem+0.75rem)] right-0 sm:left-[calc(11rem+0.75rem)]">
              <motion.div
                key={index}
                initial={{ x: "0%", opacity: 0 }}
                animate={play ? { x: "100%", opacity: [0, 1, 1, 0] } : { x: "0%", opacity: 0 }}
                transition={{ duration: SWEEP, ease: "linear", opacity: { duration: SWEEP, times: [0, 0.05, 0.85, 1] } }}
                className="absolute inset-0"
              >
                <div className="absolute -inset-y-2 left-0 w-px bg-[var(--spark)] shadow-[0_0_12px_2px_var(--spark)]" />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Millisecond scale above the bars
function Ticks({ total }: { total: number }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 font-mono text-[10px] text-subtle sm:grid-cols-[11rem_1fr]">
      <span>span</span>
      <div className="relative h-4">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <span
            key={t}
            className={`absolute ${t === 1 ? "-translate-x-full" : t === 0 ? "" : "-translate-x-1/2"}`}
            style={{ left: `${t * 100}%` }}
          >
            {Math.round(total * t)}
          </span>
        ))}
      </div>
    </div>
  );
}

// Counts up to the trace's total while the playhead runs
function TotalTime({ total, play, instant }: { total: number; play: boolean; instant: boolean }) {
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${Math.round(v)} ms`);

  useEffect(() => {
    if (!play) return;
    const controls = animate(value, total, { duration: instant ? 0 : SWEEP, ease: "linear" });
    return () => controls.stop();
  }, [play, total, instant, value]);

  return <motion.span className="shrink-0 tabular-nums text-fg">{text}</motion.span>;
}
