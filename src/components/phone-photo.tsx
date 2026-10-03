"use client";

import Image from "next/image";
import { useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { showcasePhotos, type ShowcasePhoto, type ShowcasePhotoKey } from "@/data/showcase-photos";
import { expandQuad, rectToQuad } from "@/lib/homography";

// The flat screen is laid out at this size, then projected onto the photo.
// 300 × 652 matches the iPhone's 1320 × 2868 display ratio.
export const SCREEN_W = 300;
export const SCREEN_H = 652;
const SCREEN_RADIUS = 42;

type Props = {
  photo: ShowcasePhotoKey;
  alt: string;
  children: (active: boolean) => ReactNode;
  statusTone?: "dark" | "light";
};

// Layers: photo → black underlay (hides the original screen's corners) → projected screen → fingertips
export function PhonePhoto({ photo: key, alt, children, statusTone = "dark" }: Props) {
  const photo: ShowcasePhoto = showcasePhotos[key];
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const active = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / photo.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [photo.width]);

  const trim = photo.bezelTrim ?? 0;
  const matrix = rectToQuad(SCREEN_W, SCREEN_H, expandQuad(SCREEN_W, SCREEN_H, photo.quad, trim));
  // Corners stay concentric with the phone body as the screen grows
  const radius = SCREEN_RADIUS + trim;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div ref={ref} className="relative">
      <Image
        src={photo.src}
        alt={alt}
        width={photo.width}
        height={photo.height}
        sizes="(min-width: 768px) 460px, 90vw"
        className="block h-auto w-full"
      />

      {scale !== null && (
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale}) ${matrix}` }}
        >
          {/* Underlay is only needed when the screen sits exactly on the original glass */}
          {!trim && <div className="absolute inset-0 bg-black" style={{ borderRadius: 28 }} />}
          <div className="absolute inset-0 overflow-hidden bg-white" style={{ borderRadius: radius }}>
            {children(active)}

            {/* Status bar */}
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[50px] items-center justify-between px-[30px] text-[14px] font-semibold ${
                statusTone === "dark" ? "text-zinc-900" : "text-white"
              }`}
            >
              <span>9:41</span>
              <span className="flex items-center gap-[5px]">
                <svg viewBox="0 0 18 12" className="h-[10px]" fill="currentColor" aria-hidden>
                  <rect x="0" y="8" width="3" height="4" rx="1" />
                  <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                  <rect x="10" y="3" width="3" height="9" rx="1" />
                  <rect x="15" y="0" width="3" height="12" rx="1" />
                </svg>
                <svg viewBox="0 0 16 12" className="h-[10px]" fill="currentColor" aria-hidden>
                  <path d="M8 2.4c2.2 0 4.2.9 5.7 2.3l1.2-1.2A9.7 9.7 0 0 0 8 .7 9.7 9.7 0 0 0 1.1 3.5l1.2 1.2A8 8 0 0 1 8 2.4Zm0 3.3c1.3 0 2.5.5 3.4 1.4l1.2-1.2A6.4 6.4 0 0 0 8 4a6.4 6.4 0 0 0-4.6 1.9l1.2 1.2c.9-.9 2.1-1.4 3.4-1.4Zm0 3.2c-.5 0-1 .2-1.3.5L8 10.7l1.3-1.3c-.3-.3-.8-.5-1.3-.5Z" />
                </svg>
                <svg viewBox="0 0 27 12" className="h-[11px]" fill="none" aria-hidden>
                  <rect x="0.5" y="0.5" width="23" height="11" rx="3.2" stroke="currentColor" opacity="0.45" />
                  <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
                  <path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4Z" fill="currentColor" opacity="0.45" />
                </svg>
              </span>
            </div>

            {/* Dynamic Island */}
            <div className="pointer-events-none absolute left-1/2 top-[11px] z-20 h-[26px] w-[88px] -translate-x-1/2 rounded-full bg-black" />

            {/* Match the photo's lighting: optional dimming + a soft glass sheen */}
            {photo.dim ? (
              <div className="pointer-events-none absolute inset-0 z-30 bg-black" style={{ opacity: photo.dim }} />
            ) : null}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(120deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_30%,transparent_45%)]" />
          </div>
        </div>
      )}

      {photo.fingers && scale !== null && (
        // eslint-disable-next-line @next/next/no-img-element -- tiny pre-cut matte, positioned in % of the photo
        <img
          src={photo.fingers.src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: pct(photo.fingers.x, photo.width),
            top: pct(photo.fingers.y, photo.height),
            width: pct(photo.fingers.w, photo.width),
          }}
        />
      )}
    </div>
  );
}
