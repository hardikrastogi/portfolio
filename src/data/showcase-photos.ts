// Hand-held iPhone photos used in the project showcase.
// Files carry a version suffix (.v2) so a regenerated image never collides with a cached copy.
// `quad` is the screen's four corners in the photo's pixel space (measured from the image),
// so a flat screen can be perspective-mapped onto it. `fingers` is a cut-out layered
// above the screen wherever fingertips overlap the glass.

export type Point = [number, number];
export type Quad = { tl: Point; tr: Point; br: Point; bl: Point };

export type ShowcasePhoto = {
  src: string;
  width: number;
  height: number;
  quad: Quad;
  fingers?: { src: string; x: number; y: number; w: number; h: number };
  /** Dims the screen to match darker, moodier lighting */
  dim?: number;
  /** Slims the black bezel: grows the screen outward by this many px (screen is 300 px wide). Try 1–4. */
  bezelTrim?: number;
};

export const showcasePhotos = {
  sunset: {
    src: "/showcase/hand-sunset.v3.webp",
    width: 1484,
    height: 1920,
    quad: { tl: [465.6, 252.2], tr: [1067.8, 251.8], br: [1072.8, 1568.5], bl: [471.9, 1568.5] },
    bezelTrim: 4.5,
  },
  dark: {
    src: "/showcase/hand-dark.v2.webp",
    width: 964,
    height: 1128,
    quad: { tl: [412.6, 56.1], tr: [781, 20.7], br: [552.2, 910.8], bl: [172.3, 889.7] },
    dim: 0.18,
    bezelTrim: 2.5,
  },
  front: {
    src: "/showcase/hand-front.v2.webp",
    width: 736,
    height: 1103,
    quad: { tl: [158.8, 155.4], tr: [499.6, 163.5], br: [550.9, 880.8], bl: [204.3, 877.1] },
    fingers: { src: "/showcase/hand-front-fingers.v2.webp", x: 140, y: 400, w: 90, h: 360 },
    
  },
  // Same shot as `front`, mirrored, with the grey studio backdrop swapped for a blue-hour gradient
  blueHour: {
    src: "/showcase/hand-bluehour.v1.webp",
    width: 736,
    height: 1103,
    quad: { tl: [236.4, 163.5], tr: [577.2, 155.4], br: [531.7, 877.1], bl: [185.1, 880.8] },
    fingers: { src: "/showcase/hand-front-mirrored-fingers.v2.webp", x: 506, y: 400, w: 90, h: 360 },
  },
} satisfies Record<string, ShowcasePhoto>;

export type ShowcasePhotoKey = keyof typeof showcasePhotos;
