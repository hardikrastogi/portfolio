"use client";

import { useSyncExternalStore } from "react";

// Shared intro state:
//   "intro"   → the "HR" splash covers the page
//   "flying"  → splash fading, "HR" flying into the navbar (page entrance starts here)
//   "landed"  → "HR" has reached the navbar; the real navbar logo takes over
// `played` tells the navbar whether the splash ran (true) or was skipped this session.

type Phase = "intro" | "flying" | "landed";

let phase: Phase = "intro";
let played = false;
const listeners = new Set<() => void>();

export const INTRO_SEEN_KEY = "intro-seen";

function set(next: Phase) {
  if (phase === next || phase === "landed") return;
  phase = next;
  listeners.forEach((l) => l());
}

export const startIntroFlight = () => {
  played = true;
  set("flying");
};
export const markIntroLanded = () => set("landed");

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const usePhase = () =>
  useSyncExternalStore(
    subscribe,
    () => phase,
    () => "intro" as Phase,
  );

/** True once the page entrance may start (splash lifting, or skipped). False on the server. */
export const useIntroDone = () => usePhase() !== "intro";

/** True once "HR" has landed in the navbar (or the splash was skipped). */
export const useIntroLanded = () => usePhase() === "landed";

/** Whether the splash actually played this page load. */
export const introPlayed = () => played;
