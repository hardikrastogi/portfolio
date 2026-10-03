"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Coded stand-ins for each project's app screen (300 × 652), each with a gentle looping
// animation that only runs while the phone is on screen. Swapped for real screenshots later.

const ease = [0.22, 1, 0.36, 1] as const;
const appear = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease },
};

/** Steps through 0…length-1 on a timer while active; holds the final state for reduced motion. */
function useLoop(length: number, interval: number, active: boolean) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active || reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % length), interval);
    return () => clearInterval(id);
  }, [length, interval, active, reduce]);
  return reduce ? length - 1 : step;
}

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-white px-5 pt-[62px] text-[11px] text-zinc-900">
      <p className="text-[20px] font-semibold tracking-tight">{title}</p>
      <div className="mt-4 flex flex-1 flex-col gap-3">{children}</div>
    </div>
  );
}

function Caret() {
  return (
    <motion.span
      className="ml-px inline-block h-[13px] w-px bg-zinc-900 align-middle"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}

function FormoraScreen({ active }: { active: boolean }) {
  const step = useLoop(7, 1100, active);
  const fields = [
    ["Full name", "Hardik Rastogi"],
    ["Email", "hardik@formora.dev"],
    ["Company", "Formora"],
  ] as const;

  return (
    <Shell title="Formora">
      <p className="text-zinc-500">Contact form · 4 fields · Zod-validated</p>
      {fields.map(([label, value], i) => (
        <div key={label}>
          <p className="mb-1.5 font-medium">{label}</p>
          <div
            className={`flex h-9 items-center rounded-lg border px-3 transition-colors duration-300 ${
              step === i + 1 ? "border-zinc-900" : "border-zinc-200"
            } bg-zinc-50`}
          >
            {step > i && (
              <motion.span {...appear} className="text-zinc-800">
                {value}
              </motion.span>
            )}
            {step === i && <Caret />}
          </div>
        </div>
      ))}
      <div>
        <p className="mb-1.5 font-medium">Plan</p>
        <div className="flex gap-2">
          {["Free", "Pro", "Team"].map((p) => {
            const on = p === "Pro" && step >= 4;
            return (
              <span
                key={p}
                className={`rounded-full border px-3 py-1.5 transition-colors duration-300 ${
                  on ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200"
                }`}
              >
                {p}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mb-8 mt-auto overflow-hidden rounded-xl bg-zinc-900 py-3 text-center font-medium text-white">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={step >= 5 ? "done" : "submit"} {...appear} className="block">
            {step >= 5 ? "✓ Submitted" : "Submit"}
          </motion.span>
        </AnimatePresence>
      </div>
    </Shell>
  );
}

function BaxusScreen({ active }: { active: boolean }) {
  const step = useLoop(6, 1200, active);

  return (
    <Shell title="Baxus">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 p-4">
        <div className="mx-auto h-24 w-9 rounded-b-md rounded-t-full bg-gradient-to-b from-amber-200 to-amber-700" />
        <p className="mt-3 text-[12px] font-semibold">Highland Single Malt 12yr</p>
        <p className="text-zinc-500">700ml · 43% ABV</p>
        {step === 0 && (
          <motion.div
            className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent"
            initial={{ top: "-20%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        )}
      </div>
      <p className="mt-1 font-medium text-zinc-500">{step === 0 ? "Scanning listing…" : "Price comparison"}</p>
      <div className="flex min-h-[132px] flex-col gap-2.5">
        <AnimatePresence>
          {step >= 1 && (
            <motion.div key="retail" {...appear} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3.5 py-2.5">
              <span>Retail site</span>
              <span className={step >= 3 ? "text-zinc-400 line-through" : ""}>$89.00</span>
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div key="baxus" {...appear} className="flex items-center justify-between rounded-xl border border-zinc-900 px-3.5 py-2.5">
              <span className="font-semibold">BAXUS</span>
              <span className="font-semibold">$72.50</span>
            </motion.div>
          )}
          {step >= 3 && (
            <motion.p
              key="save"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease }}
              className="text-center font-semibold text-emerald-600"
            >
              You save $16.50
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="mb-8 mt-auto rounded-xl bg-zinc-900 py-3 text-center font-medium text-white">View on BAXUS</div>
    </Shell>
  );
}

const stories = ["Aarav", "Maya", "Kabir", "Zoe", "Leo"];

function SphereScreen({ active }: { active: boolean }) {
  const step = useLoop(4, 1400, active);
  const liked = step >= 2;

  return (
    <Shell title="Sphere">
      {/* Stories (illustrated avatars: "Notionists" by Zoish, CC0) */}
      <div className="-mx-1 flex gap-3 overflow-hidden">
        {stories.map((name, i) => (
          <div key={name} className="flex shrink-0 flex-col items-center gap-1">
            <div className="relative size-[52px]">
              <motion.div
                className="absolute inset-0 rounded-full bg-[conic-gradient(#18181b,#a1a1aa,#18181b)]"
                animate={active ? { rotate: 360 } : undefined}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG inside a CSS-projected layer */}
              <img
                src={`/showcase/sphere/story-${name.toLowerCase()}.svg`}
                alt=""
                className="absolute inset-[2.5px] rounded-full border-2 border-white bg-zinc-100"
              />
            </div>
            <span className="text-[9px] text-zinc-500">{name.toLowerCase()}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG */}
        <img src="/showcase/sphere/story-kabir.svg" alt="" className="size-7 rounded-full bg-zinc-100 ring-1 ring-zinc-200" />
        <span className="font-semibold">kabir</span>
        <span className="text-zinc-400">· 2h</span>
      </div>
      <div className="relative -mx-5 aspect-square overflow-hidden bg-zinc-900">
        {/* Post image from the Sphere app's explore feed, with a slow Ken Burns drift */}
        <motion.img
          src="/showcase/sphere/post-1.webp"
          alt=""
          className="absolute inset-0 size-full object-cover"
          animate={active ? { scale: [1, 1.06, 1] } : undefined}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <AnimatePresence>
          {step === 2 && (
            <motion.span
              key="pop"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.45, ease }}
              className="absolute inset-0 grid place-items-center text-[64px] text-white drop-shadow-lg"
            >
              ♥
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-4 text-[17px]">
        <motion.span
          animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.35 }}
          className={liked ? "text-red-500" : ""}
        >
          {liked ? "♥" : "♡"}
        </motion.span>
        <span>◯</span>
        <span>➤</span>
      </div>
      <p className="-mt-1 font-semibold">{liked ? "1,285" : "1,284"} likes</p>
      <p className="-mt-2 leading-snug">
        <span className="font-semibold">kabir</span> late night sketch session ✦
      </p>

      {/* Next post peeking in */}
      <div className="flex items-center gap-2 pt-1">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG */}
        <img src="/showcase/sphere/story-zoe.svg" alt="" className="size-7 rounded-full bg-zinc-100 ring-1 ring-zinc-200" />
        <span className="font-semibold">zoe</span>
        <span className="text-zinc-400">· 5h</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- rendered inside a CSS-projected layer */}
      <img src="/showcase/sphere/post-2.webp" alt="" className="-mx-5 aspect-square w-[calc(100%+2.5rem)] max-w-none object-cover" />
    </Shell>
  );
}

function DocSageScreen({ active }: { active: boolean }) {
  const step = useLoop(7, 1300, active);

  return (
    <Shell title="DocSage">
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5">
        <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[9px] font-bold text-white">PDF</span>
        <span className="truncate">annual-report-2025.pdf</span>
        <span className="ml-auto text-zinc-400">128 chunks</span>
      </div>
      <div className="flex flex-col gap-2.5">
        <AnimatePresence>
          {step >= 1 && (
            <motion.div key="q1" {...appear} className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-zinc-900 px-3.5 py-2.5 text-white">
              What was the revenue growth last year?
            </motion.div>
          )}
          {step === 2 && <TypingDots key="t1" />}
          {step >= 3 && (
            <motion.div key="a1" {...appear} className="max-w-[86%] rounded-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-2.5 leading-relaxed">
              Revenue grew <b>18% year over year</b>, driven mainly by subscriptions{" "}
              <span className="rounded bg-zinc-300 px-1 text-[9px]">Source 2</span>
            </motion.div>
          )}
          {step >= 4 && (
            <motion.div key="q2" {...appear} className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-zinc-900 px-3.5 py-2.5 text-white">
              Any risks mentioned?
            </motion.div>
          )}
          {step === 5 && <TypingDots key="t2" />}
          {step >= 6 && (
            <motion.div key="a2" {...appear} className="max-w-[86%] rounded-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-2.5 leading-relaxed">
              Supply-chain costs and FX exposure are flagged as key risks{" "}
              <span className="rounded bg-zinc-300 px-1 text-[9px]">Source 5</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mb-8 mt-auto rounded-full border border-zinc-200 px-4 py-2.5 text-zinc-400">Ask about your PDF…</div>
    </Shell>
  );
}

function TypingDots() {
  return (
    <motion.div {...appear} className="flex w-14 gap-1 rounded-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-zinc-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  );
}

/** Real screen recording: plays (muted, looping) only while on screen; reduced motion shows the poster. */
export function ScreenVideo({ src, poster, active }: { src: string; poster: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active && !reduce) video.play().catch(() => {});
    else video.pause();
  }, [active, reduce]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className="block h-full w-full object-cover"
    />
  );
}

/** Real screenshot: drifts slowly down the page and back, like someone browsing. */
export function ScreenshotScroll({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- rendered inside a CSS-projected layer
    <img src={src} alt={alt} className="animate-screen-scroll block w-full" />
  );
}

export const mockScreens: Record<string, (props: { active: boolean }) => ReactNode> = {
  formora: FormoraScreen,
  baxus: BaxusScreen,
  sphere: SphereScreen,
  docsage: DocSageScreen,
};
