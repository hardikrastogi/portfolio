"use client";

import { useEffect, useRef } from "react";

// A quiet dotted globe beside the contact heading: India glows, and thin arcs drift out
// from it to cities around the world. Canvas-drawn; pauses off screen; still for reduced motion.

const HOME = { lat: 21, lon: 78 }; // India
const CITIES = [
  { lat: 51.5, lon: -0.1 }, // London
  { lat: 37.8, lon: -122.4 }, // San Francisco
  { lat: 40.7, lon: -74 }, // New York
  { lat: 52.5, lon: 13.4 }, // Berlin
  { lat: 1.35, lon: 103.8 }, // Singapore
  { lat: 35.7, lon: 139.7 }, // Tokyo
  { lat: -33.9, lon: 151.2 }, // Sydney
  { lat: 25.2, lon: 55.3 }, // Dubai
  { lat: 43.7, lon: -79.4 }, // Toronto
];

const DOTS = 1100;
const DEPTH_BUCKETS = 8;
const TILT = (18 * Math.PI) / 180; // tips the north pole away so India sits near the middle
const SPIN = 0.06; // radians per second
const RADIUS = 0.38; // of the canvas width, leaving room for arcs to rise off the surface
const ARC_LIFE = 3.2; // seconds: draw in, hold, fade

type Vec = [number, number, number];

const toVec = (lat: number, lon: number): Vec => {
  const φ = (lat * Math.PI) / 180;
  const λ = (lon * Math.PI) / 180;
  return [Math.cos(φ) * Math.sin(λ), Math.sin(φ), Math.cos(φ) * Math.cos(λ)];
};

// Even spread of points over the sphere
const sphere: Vec[] = Array.from({ length: DOTS }, (_, i) => {
  const y = 1 - (2 * (i + 0.5)) / DOTS;
  const r = Math.sqrt(1 - y * y);
  const θ = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.cos(θ) * r, y, Math.sin(θ) * r];
});

// Great-circle point between a and b at t, lifted off the surface mid-way
function arcPoint(a: Vec, b: Vec, t: number): Vec {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const ω = Math.acos(dot);
  const s = Math.sin(ω) || 1;
  const k1 = Math.sin((1 - t) * ω) / s;
  const k2 = Math.sin(t * ω) / s;
  const lift = 1 + Math.sin(t * Math.PI) * Math.min(0.12 * ω, 0.25);
  return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift];
}

export function ContactGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const home = toVec(HOME.lat, HOME.lon);
    const targets = CITIES.map((c) => toVec(c.lat, c.lon));

    let size = 0;
    let colors = { fg: "#888", spark: "#a0522d" };
    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      colors = { fg: css.getPropertyValue("--fg").trim(), spark: css.getPropertyValue("--spark").trim() };
    };
    readColors();
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);

    // Start with India a little left of centre; the spin carries it across
    let rotation = (-HOME.lon * Math.PI) / 180 - 0.5;
    const arcs: { to: Vec; born: number }[] = [];
    let nextArc = 0;

    const project = (p: Vec) => {
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const x = p[0] * cos + p[2] * sin;
      const z1 = -p[0] * sin + p[2] * cos;
      const y = p[1] * Math.cos(TILT) - z1 * Math.sin(TILT);
      const z = p[1] * Math.sin(TILT) + z1 * Math.cos(TILT);
      const r = size * RADIUS;
      return { x: size / 2 + x * r, y: size / 2 - y * r, z };
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, size, size);

      // Faint rim
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = colors.fg;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Dots, brighter toward the viewer. Bucketed by depth so each bucket is one path and one fill
      ctx.fillStyle = colors.fg;
      const buckets: number[][] = Array.from({ length: DEPTH_BUCKETS }, () => []);
      for (const p of sphere) {
        const s = project(p);
        if (s.z <= 0) continue;
        buckets[Math.min(DEPTH_BUCKETS - 1, Math.floor(s.z * DEPTH_BUCKETS))].push(s.x, s.y);
      }
      buckets.forEach((pts, b) => {
        const z = (b + 0.5) / DEPTH_BUCKETS;
        const r = 0.6 + z * 0.7;
        ctx.globalAlpha = 0.08 + z * 0.4;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i += 2) {
          ctx.moveTo(pts[i] + r, pts[i + 1]);
          ctx.arc(pts[i], pts[i + 1], r, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      // Arcs: the visible part draws in from home, holds, then fades
      ctx.strokeStyle = colors.spark;
      ctx.lineWidth = 1.25;
      ctx.lineCap = "round";
      for (const arc of arcs) {
        const age = (time - arc.born) / ARC_LIFE;
        const head = Math.min(1, age / 0.45);
        const fade = age > 0.7 ? 1 - (age - 0.7) / 0.3 : 1;
        ctx.globalAlpha = Math.max(0, fade) * 0.85;
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i <= 48; i++) {
          const t = (i / 48) * head;
          const s = project(arcPoint(home, arc.to, t));
          if (s.z <= 0) {
            pen = false;
            continue;
          }
          if (pen) ctx.lineTo(s.x, s.y);
          else ctx.moveTo(s.x, s.y);
          pen = true;
        }
        ctx.stroke();

        // Landing dot once the arc arrives
        const end = project(arc.to);
        if (head >= 1 && end.z > 0) {
          ctx.fillStyle = colors.spark;
          ctx.beginPath();
          ctx.arc(end.x, end.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Home marker with a soft pulse
      const h = project(home);
      if (h.z > 0) {
        const pulse = reduce ? 0 : (time % 2.4) / 2.4;
        ctx.fillStyle = colors.spark;
        ctx.globalAlpha = (1 - pulse) * 0.35;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 3 + pulse * 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduce) {
      // A couple of arcs frozen mid-way so the still frame still reads
      arcs.push({ to: targets[0], born: -1.5 }, { to: targets[4], born: -1.5 });
      draw(0);
      return () => {
        ro.disconnect();
        themeObserver.disconnect();
      };
    }

    let frame = 0;
    let last = 0;
    let clock = 0;
    let visible = false;

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      clock += dt;
      rotation += SPIN * dt;

      // Launch a new arc every ~1.1s while home faces the viewer
      if (clock >= nextArc && project(home).z > 0.15) {
        arcs.push({ to: targets[Math.floor(Math.random() * targets.length)], born: clock });
        nextArc = clock + 0.9 + Math.random() * 0.6;
      }
      while (arcs.length && clock - arcs[0].born > ARC_LIFE) arcs.shift();

      draw(clock);
      frame = requestAnimationFrame(tick);
    };

    // Only animate while on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === visible) return;
      visible = entry.isIntersecting;
      if (visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      } else cancelAnimationFrame(frame);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="block aspect-square w-full" />;
}
