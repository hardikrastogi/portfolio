import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  title: string;
  domain?: string;
  /** Screenshot shown in the window; its width/height set the window's shape */
  image?: { src: string; width: number; height: number };
  /** Coded screen used instead of a screenshot, laid out at `size` */
  screen?: { node: ReactNode; size: { width: number; height: number } };
};

// macOS-style browser window (no laptop): title bar with traffic lights and an address
// pill, then the page — a screenshot or a coded screen.
export function MacWindow({ title, domain, image, screen }: Props) {
  const size = image ?? screen?.size;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)]">
      {/* Title bar */}
      <div className="relative flex h-10 items-center border-b border-border bg-surface-2/80 px-4">
        <div className="flex gap-2" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="absolute left-1/2 flex max-w-[min(60%,calc(100%-10rem))] -translate-x-1/2 items-center gap-1.5 truncate rounded-md bg-bg/60 px-3 py-1 text-xs text-muted">
          <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="currentColor" aria-hidden>
            <path d="M8 1a3 3 0 0 0-3 3v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3Zm-1.5 5V4a1.5 1.5 0 0 1 3 0v2h-3Z" />
          </svg>
          <span className="truncate">{domain ?? title.toLowerCase()}</span>
        </div>
      </div>

      {/* Page */}
      <div
        className="relative aspect-video bg-bg"
        style={size ? { aspectRatio: `${size.width} / ${size.height}` } : undefined}
      >
        {image ? (
          <Image
            src={image.src}
            alt={`${title} home screen`}
            fill
            sizes="(min-width: 1200px) 1104px, 100vw"
            quality={90}
            className="object-cover object-top"
          />
        ) : (
          screen?.node
        )}
      </div>
    </div>
  );
}
