import type { ShowcasePhotoKey } from "@/data/showcase-photos";

// Single source of truth for portfolio content — edit text here, not in components.

export const site = {
  name: "Hardik Rastogi",
  initials: "HR",
  role: "Full Stack Developer",
  tagline: "I build full-stack products end to end — from database schema to the last pixel.",
  intro:
    "React and Next.js on the front, Node, Spring Boot and FastAPI on the back, with a soft spot for AI-powered apps and well-tested open-source tooling.",
  location: "Based in India",
  timeZone: "Asia/Kolkata",
  available: true,
  email: "hardik.rastogi8118@gmail.com",
  socials: {
    github: "https://github.com/hardikrastogi",
    linkedin: "https://www.linkedin.com/in/hardikrastogi0087/",
    x: "https://x.com/Hardik0087",
  },
  // To update, replace the PDF in /public
  cv: { href: "/Hardik-Rastogi-CV.pdf", file: "Hardik-Rastogi-CV.pdf" },
} as const;

// Request traces cycling in the hero panel. Times in ms; depth indents child spans.
export const heroTraces = [
  {
    method: "POST",
    route: "/docsage/ask",
    status: 200,
    spans: [
      { name: "edge", service: "Vercel", start: 0, end: 9, depth: 0 },
      { name: "render", service: "React", start: 9, end: 34, depth: 0 },
      { name: "api", service: "FastAPI", start: 34, end: 168, depth: 0 },
      { name: "retrieve", service: "FAISS", start: 42, end: 66, depth: 1 },
      { name: "query", service: "PostgreSQL", start: 68, end: 84, depth: 1 },
      { name: "generate", service: "LLM", start: 86, end: 162, depth: 1 },
    ],
  },
  {
    method: "POST",
    route: "/formora/submit",
    status: 201,
    spans: [
      { name: "edge", service: "Vercel", start: 0, end: 7, depth: 0 },
      { name: "validate", service: "Zod", start: 7, end: 19, depth: 0 },
      { name: "api", service: "NestJS", start: 19, end: 96, depth: 0 },
      { name: "write", service: "Prisma", start: 27, end: 63, depth: 1 },
      { name: "cache", service: "Redis", start: 65, end: 74, depth: 1 },
      { name: "respond", service: "Next.js", start: 96, end: 112, depth: 0 },
    ],
  },
  {
    method: "WS",
    route: "/sphere/messages",
    status: 101,
    spans: [
      { name: "connect", service: "Socket.io", start: 0, end: 14, depth: 0 },
      { name: "auth", service: "Node.js", start: 14, end: 31, depth: 0 },
      { name: "store", service: "PostgreSQL", start: 31, end: 58, depth: 1 },
      { name: "publish", service: "Redis", start: 58, end: 67, depth: 1 },
      { name: "deliver", service: "Socket.io", start: 67, end: 81, depth: 0 },
    ],
  },
] as const;

export const about = {
  heading: "Hi, I'm Hardik.",
  paragraphs: [
    "I'm a freelance full-stack developer who likes owning a product end to end — from the database schema and the API in the middle to the last pixel of the interface.",
    "The work I enjoy most sits where clean engineering meets real users: turning a fuzzy idea into something fast, well-tested and pleasant to use. Lately that means AI-powered apps, real-time features and open-source tools other developers can build on.",
  ],
  lookingFor: "Open to full-time roles, internships and freelance projects.",
  interests: ["Reading books", "Building Lego", "Badminton"],
} as const;

// Intro shown on first visit:
//   "greeting" → Hello · Namaste · Bonjour, then a curved curtain lifts
//   "morph"    → "HR" fades in at the centre, then flies into the navbar logo
export const introStyle: "greeting" | "morph" = "morph";

export const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

// "What I do" rows at the top of the Stack section
export const disciplines = [
  {
    title: "Front-end",
    text: "Fast, accessible interfaces in React and Next.js — typed end to end, tested, and animated with restraint.",
  },
  {
    title: "Full-stack",
    text: "APIs, Postgres and Redis, auth and real-time — the plumbing that keeps the interface honest.",
  },
  {
    title: "Product",
    text: "Starting from the user's problem, shipping in small steps, and keeping what actually works.",
  },
] as const;

export const stack = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "C++", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Redux", "Zustand", "Tailwind CSS", "HTML5", "CSS3"] },
  {
    group: "Backend",
    items: ["Node.js", "Express.js", "NestJS", "Spring Boot", "FastAPI", "REST APIs", "GraphQL", "Socket.io"],
  },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Prisma"] },
  { group: "AI / ML", items: ["LLM & GenAI", "RAG", "FAISS", "Prompt Engineering", "scikit-learn", "Pandas", "NLTK"] },
  {
    group: "DevOps & Testing",
    items: ["Docker", "AWS", "CI/CD", "Linux", "Git", "GitHub", "Vercel", "Playwright", "Vitest", "JUnit"],
  },
] as const;

export type Experience = {
  slug: string;
  company: string;
  role: string;
  period: string;
  /** e.g. "Open source", "Freelance", "Internship" */
  type?: string;
  summary: string;
  highlights: string[];
  stats?: { value: string; label: string }[];
  tech: string[];
  link?: { label: string; href: string };
  /** Hand-held iPhone photo the screen is mapped onto */
  photo: ShowcasePhotoKey;
  /** Phone screen recording — takes priority over the coded mock screen */
  video?: { src: string; poster: string };
  /** Status bar text colour: "light" for dark app screens */
  statusTone?: "dark" | "light";
};

// Newest first
export const experience: Experience[] = [
  {
    slug: "formora",
    company: "Formora",
    role: "Open-Source Package Manager",
    period: "Feb 2026 – Present",
    type: "Remote",
    summary:
      "An open-source, schema-driven form-building platform shipped as versioned npm packages (@hardikrastogi/core, react, builder), with a Next.js documentation site, live playground and drag-and-drop visual builder.",
    highlights: [
      "Directed the architecture and delivery of the platform, from the core packages to the docs, playground and visual builder",
      "Designed a JSON-first, Zod-validated schema as the single source of truth for live rendering, dual client/server validation, token-based theming and a plugin architecture supporting 13 field types",
      "Directed testing: 70+ Vitest/Testing Library unit tests, 50+ Playwright end-to-end tests and automated axe-core accessibility audits",
      "Ran the release pipeline (pnpm workspaces, Turborepo, Changesets), publishing versioned packages to npm and deploying to Vercel",
    ],
    stats: [
      { value: "13", label: "field types" },
      { value: "70+", label: "unit tests" },
      { value: "50+", label: "e2e tests" },
    ],
    tech: ["TypeScript", "React", "Next.js", "Zod", "Vitest", "Playwright", "Turborepo", "Changesets"],
    link: { label: "formora-web.vercel.app", href: "https://formora-web.vercel.app" },
    photo: "sunset",
    video: { src: "/showcase/formora.v1.mp4", poster: "/showcase/formora-poster.v1.webp" },
    statusTone: "light",
  },
  {
    slug: "baxus",
    company: "BAXUS",
    role: "Whisky Price Comparison Extension",
    period: "Oct 2025",
    type: "Remote",
    summary:
      "A Chrome extension that scrapes bottle name, price and spirit type from four whisky and wine sites (Sotheby's, ReserveBar, Unicorn Auctions, Wine-Searcher) and finds the same bottles on the BAXUS marketplace, showing where they're cheaper.",
    highlights: [
      "Architected around per-site content scripts, a background service worker and a React popup communicating via Chrome message passing",
      "Built a weighted fuzzy-matching algorithm that pairs scraped product names with marketplace listings",
      "Added live price comparison (savings per match, cheapest first), paginated search across 5,000 listings and locale-aware price parsing",
      "Found and removed an obfuscated supply-chain backdoor from the build config",
    ],
    stats: [
      { value: "4", label: "retail sites" },
      { value: "5,000", label: "listings searched" },
    ],
    tech: ["React", "TypeScript", "Chrome Manifest V3", "Vite", "Tailwind CSS"],
    photo: "dark",
  },
];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  year: string;
  role: string;
  tech: string[];
  live?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "sphere",
    title: "Sphere",
    tagline: "Social media app",
    summary: "An Instagram-inspired social platform with stories, real-time DMs and WebRTC video calling.",
    year: "2026",
    role: "Full-stack developer",
    tech: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Redis", "Socket.io", "WebRTC"],
  },
  {
    slug: "docsage",
    title: "DocSage",
    tagline: "AI RAG agent for PDFs",
    summary: "Upload PDFs and ask questions — answers are grounded in your documents with inline source citations.",
    year: "2026",
    role: "Full-stack developer",
    tech: ["React", "FastAPI", "Python", "FAISS", "PostgreSQL", "Docker"],
  },
];
