"use client";

import { IntroGreeting } from "@/components/intro-greeting";
import { IntroMorph } from "@/components/intro-morph";
import { introStyle } from "@/data/site";

// Picks the intro set by `introStyle` in src/data/site.ts
export function Intro() {
  return introStyle === "morph" ? <IntroMorph /> : <IntroGreeting />;
}
