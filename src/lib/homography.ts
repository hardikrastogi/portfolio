import type { Quad } from "@/data/showcase-photos";

// Grows a w×h screen's quad outward by `by` px (in screen units) on every side,
// following the photo's perspective — used to slim the visible bezel.
export function expandQuad(w: number, h: number, q: Quad, by: number): Quad {
  if (!by) return q;
  const [x0, y0] = q.tl;
  const [x1, y1] = q.tr;
  const [x2, y2] = q.br;
  const [x3, y3] = q.bl;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const k = (dx1 * dy3 - dx3 * dy1) / den;
  const map = (u: number, v: number): [number, number] => {
    const s = u / w, t = v / h, d = g * s + k * t + 1;
    return [
      ((x1 - x0 + g * x1) * s + (x3 - x0 + k * x3) * t + x0) / d,
      ((y1 - y0 + g * y1) * s + (y3 - y0 + k * y3) * t + y0) / d,
    ];
  };
  return { tl: map(-by, -by), tr: map(w + by, -by), br: map(w + by, h + by), bl: map(-by, h + by) };
}

// CSS matrix3d that maps a w×h rectangle onto an arbitrary quadrilateral
// (projective square-to-quad mapping, Heckbert 1989).
export function rectToQuad(w: number, h: number, q: Quad): string {
  const [x0, y0] = q.tl;
  const [x1, y1] = q.tr;
  const [x2, y2] = q.br;
  const [x3, y3] = q.bl;

  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const k = (dx1 * dy3 - dx3 * dy1) / den;

  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3;
  const d = y1 - y0 + g * y1, e = y3 - y0 + k * y3;

  // Column-major, with the unit square scaled up to w×h
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.join(",")})`;
}
