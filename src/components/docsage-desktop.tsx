"use client";

import { useEffect, useRef, useState } from "react";

// Desktop version of the DocSage phone mock: laid out at a fixed 1440 × 648 "screen"
// (same shape as the other window screenshots) and scaled to fit, so it stays crisp.
const W = 1440;
const H = 648;

export const DOCSAGE_DESKTOP_SIZE = { width: W, height: H };

export function DocSageDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-white">
      {scale !== null && (
        <div
          className="flex origin-top-left text-[14px] text-zinc-900"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          {/* Sidebar */}
          <aside className="flex w-[260px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 px-5 py-6">
            <p className="text-[22px] font-semibold tracking-tight">DocSage</p>
            <div className="mt-6 rounded-xl bg-zinc-900 py-2.5 text-center font-medium text-white">+ New chat</div>
            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400">Your chats</p>
            <ul className="mt-3 space-y-1">
              {[
                ["annual-report-2025.pdf", true],
                ["research-paper.pdf", false],
                ["product-spec-v2.pdf", false],
                ["onboarding-guide.pdf", false],
              ].map(([name, active]) => (
                <li
                  key={name as string}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${active ? "bg-white shadow-sm ring-1 ring-zinc-200" : "text-zinc-600"}`}
                >
                  <span className="rounded bg-zinc-900 px-1 py-px text-[8px] font-bold text-white">PDF</span>
                  <span className="truncate">{name}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center gap-2.5 text-zinc-500">
              <span className="grid size-8 place-items-center rounded-full bg-zinc-200 text-[12px] font-semibold text-zinc-700">H</span>
              <span>hardik</span>
            </div>
          </aside>

          {/* Chat */}
          <main className="flex flex-1 flex-col">
            <header className="flex items-center gap-3 border-b border-zinc-200 px-8 py-4">
              <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-bold text-white">PDF</span>
              <span className="font-medium">annual-report-2025.pdf</span>
              <span className="text-zinc-400">· 128 chunks</span>
              <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-700">● Indexed</span>
            </header>

            <div className="flex flex-1 flex-col gap-4 overflow-hidden px-8 py-6">
              <Bubble from="user">What was the revenue growth last year?</Bubble>
              <Bubble from="ai">
                Revenue grew <b>18% year over year</b>, driven mainly by subscription renewals and two new enterprise
                contracts in the second half. <Cite n={2} /> <Cite n={4} />
              </Bubble>
              <Bubble from="user">Any risks mentioned?</Bubble>
              <Bubble from="ai">
                The report flags <b>supply-chain costs</b> and <b>foreign-exchange exposure</b> as the two key risks for
                the coming year, with a hedging plan outlined for FX. <Cite n={5} />
              </Bubble>
            </div>

            <div className="flex items-center gap-3 border-t border-zinc-200 px-8 py-4">
              <div className="flex-1 rounded-full border border-zinc-200 px-5 py-3 text-zinc-400">Ask about your PDF…</div>
              <div className="rounded-full bg-zinc-900 px-6 py-3 font-medium text-white">Ask</div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

function Bubble({ from, children }: { from: "user" | "ai"; children: React.ReactNode }) {
  return from === "user" ? (
    <div className="ml-auto max-w-[60%] rounded-2xl rounded-br-md bg-zinc-900 px-5 py-3 text-white">{children}</div>
  ) : (
    <div className="max-w-[70%] rounded-2xl rounded-bl-md bg-zinc-100 px-5 py-3 leading-relaxed">{children}</div>
  );
}

function Cite({ n }: { n: number }) {
  return <span className="rounded bg-zinc-300 px-1.5 py-0.5 text-[11px] font-medium text-zinc-700">Source {n}</span>;
}
