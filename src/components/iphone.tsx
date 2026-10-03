import type { CSSProperties, ReactNode } from "react";

// iPhone 17 Pro Max, drawn to real proportions (163.4 × 78.0 × 8.75 mm, 6.9″ display).
// All sizes are in millimetres converted to container-width units, so the device scales
// as one piece. Stacked layers behind the front face give the body real thickness when tilted.

const BODY_W = 78;
const BODY_H = 163.4;
const DEPTH = 8.75;
const CORNER = 12.4;
const FRAME = 0.95; // visible metal band around the glass
const BEZEL = 1.0;
const DEPTH_LAYERS = 14;

const mm = (v: number) => `${(v / BODY_W) * 100}cqw`;

const SILVER_FACE =
  "linear-gradient(145deg,#fbfbfd 0%,#cfd0d4 14%,#9a9ba1 30%,#e9eaee 48%,#b4b5ba 64%,#f5f5f8 80%,#a3a4aa 100%)";
const SILVER_EDGE =
  "linear-gradient(90deg,#8d8e94 0%,#e3e4e8 12%,#c3c4c9 30%,#f4f4f7 50%,#bcbdc2 70%,#e6e7ea 88%,#8d8e94 100%)";
const BUTTON = "linear-gradient(90deg,#9c9da3,#eeeef1 45%,#b9babf)";

type Side = "left" | "right";
const buttons: { side: Side; top: number; height: number; recessed?: boolean }[] = [
  { side: "left", top: 31, height: 7 }, // Action button
  { side: "left", top: 46, height: 12 }, // Volume up
  { side: "left", top: 61, height: 12 }, // Volume down
  { side: "right", top: 50, height: 18 }, // Side button
  { side: "right", top: 93, height: 14, recessed: true }, // Camera Control
];

type Props = {
  children: ReactNode;
  className?: string;
};

export function IPhone({ children, className = "" }: Props) {
  const outer: CSSProperties = {
    aspectRatio: `${BODY_W} / ${BODY_H}`,
    containerType: "inline-size",
    transformStyle: "preserve-3d",
  };

  return (
    <div className={`relative ${className}`} style={outer}>
      {/* Body thickness: silver layers stepping back from the front face */}
      {Array.from({ length: DEPTH_LAYERS }, (_, i) => {
        const z = ((i + 1) / DEPTH_LAYERS) * DEPTH;
        const isBack = i === DEPTH_LAYERS - 1;
        return (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0"
            style={{
              borderRadius: mm(CORNER),
              background: isBack ? "#d9dadd" : SILVER_EDGE,
              transform: `translateZ(-${mm(z)})`,
              boxShadow: isBack ? "0 40px 80px -10px rgba(0,0,0,0.55), 0 15px 30px -10px rgba(0,0,0,0.4)" : undefined,
            }}
          />
        );
      })}

      {/* Buttons sit halfway into the body's depth */}
      {buttons.map((b) => (
        <span
          key={`${b.side}-${b.top}`}
          aria-hidden
          className="absolute"
          style={{
            top: mm(b.top),
            height: mm(b.height),
            width: mm(0.9),
            [b.side]: mm(-0.45),
            borderRadius: mm(0.45),
            background: b.recessed ? "linear-gradient(90deg,#6b6c72,#c9cace 50%,#6b6c72)" : BUTTON,
            transform: `translateZ(-${mm(DEPTH / 2)})`,
          }}
        />
      ))}

      {/* Front face: polished silver band → black bezel → screen */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: mm(CORNER),
          padding: mm(FRAME),
          background: SILVER_FACE,
          boxShadow: `inset 0 0 0 ${mm(0.12)} rgba(255,255,255,0.8), inset 0 0 ${mm(0.5)} rgba(0,0,0,0.35)`,
        }}
      >
        <div
          className="h-full w-full bg-black"
          style={{
            borderRadius: mm(CORNER - FRAME),
            padding: mm(BEZEL),
            boxShadow: `inset 0 0 0 ${mm(0.15)} #1c1c1e`,
          }}
        >
          <div
            className="relative h-full w-full overflow-hidden bg-white"
            style={{ borderRadius: mm(CORNER - FRAME - BEZEL) }}
          >
            {children}

            {/* Status bar */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between font-semibold text-white mix-blend-difference"
              style={{ height: mm(7.6), paddingInline: mm(7.2), fontSize: mm(2.75) }}
            >
              <span>9:41</span>
              <span className="flex items-center" style={{ gap: mm(0.9) }}>
                <svg viewBox="0 0 18 12" style={{ height: mm(1.7) }} fill="currentColor" aria-hidden>
                  <rect x="0" y="8" width="3" height="4" rx="1" />
                  <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                  <rect x="10" y="3" width="3" height="9" rx="1" />
                  <rect x="15" y="0" width="3" height="12" rx="1" />
                </svg>
                <svg viewBox="0 0 16 12" style={{ height: mm(1.7) }} fill="currentColor" aria-hidden>
                  <path d="M8 2.4c2.2 0 4.2.9 5.7 2.3l1.2-1.2A9.7 9.7 0 0 0 8 .7 9.7 9.7 0 0 0 1.1 3.5l1.2 1.2A8 8 0 0 1 8 2.4Zm0 3.3c1.3 0 2.5.5 3.4 1.4l1.2-1.2A6.4 6.4 0 0 0 8 4a6.4 6.4 0 0 0-4.6 1.9l1.2 1.2c.9-.9 2.1-1.4 3.4-1.4Zm0 3.2c-.5 0-1 .2-1.3.5L8 10.7l1.3-1.3c-.3-.3-.8-.5-1.3-.5Z" />
                </svg>
                <svg viewBox="0 0 27 12" style={{ height: mm(1.8) }} fill="none" aria-hidden>
                  <rect x="0.5" y="0.5" width="23" height="11" rx="3.2" stroke="currentColor" opacity="0.45" />
                  <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
                  <path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4Z" fill="currentColor" opacity="0.45" />
                </svg>
              </span>
            </div>

            {/* Dynamic Island with front camera */}
            <div
              className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-full bg-black"
              style={{ top: mm(1.8), width: mm(20.8), height: mm(6.1) }}
            >
              <span
                className="absolute top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  right: mm(1.6),
                  width: mm(2.6),
                  height: mm(2.6),
                  background: "radial-gradient(circle at 35% 35%,#2b3a55 0%,#0d1220 45%,#000 70%)",
                }}
              />
            </div>

            {/* Glass reflection */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(118deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_28%,transparent_42%)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
