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
  available: true,
  email: "hardik.rastogi8118@gmail.com",
  socials: {
    github: "https://github.com/hardikrastogi",
    linkedin: "https://www.linkedin.com/in/hardikrastogi0087/",
    x: "https://x.com/Hardik0087",
  },
} as const;

export const about = {
  // Separate greyscale file: a live CSS grayscale filter gets re-rasterised at low res while scrolling
  photo: { src: "/showcase/portrait.v1.webp", mono: "/showcase/portrait-mono.v1.webp", width: 1198, height: 1313 },
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
export const introStyle: "greeting" | "morph" = "greeting";

export const navLinks = [
  { label: "Work", href: "#work" },
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
  /** Hand-held iPhone photo the screen is mapped onto */
  photo: ShowcasePhotoKey;
  /** Phone screen recording (status bar already removed) — takes priority over `screen` */
  video?: { src: string; poster: string };
  /** Phone-sized screenshot in /public/projects — falls back to a coded mock screen */
  screen?: string;
  /** Status bar text colour: "light" for dark app screens */
  statusTone?: "dark" | "light";
};

export const projects: Project[] = [
  {
    slug: "formora",
    photo: "sunset",
    title: "Formora",
    tagline: "Dynamic form builder",
    summary: "Open-source npm packages for JSON-first forms, with a live playground and a drag-and-drop visual builder.",
    year: "2026",
    role: "Package author & lead developer",
    tech: ["TypeScript", "React", "Next.js", "Zod", "Turborepo", "Playwright"],
    live: "https://formora-web.vercel.app",
    video: { src: "/showcase/formora.v1.mp4", poster: "/showcase/formora-poster.v1.webp" },
    statusTone: "light",
  },
  {
    slug: "baxus",
    photo: "dark",
    title: "Baxus",
    tagline: "Bottle price-matching extension",
    summary:
      "A Chrome extension that reads whisky and wine listings on retail sites and checks the BAXUS marketplace for the same bottle at a better price.",
    year: "2025",
    role: "Developer",
    // TODO: confirm Baxus tech stack
    tech: [],
  },
  {
    slug: "sphere",
    photo: "front",
    title: "Sphere",
    tagline: "Social media app",
    summary: "An Instagram-inspired social platform with stories, real-time DMs and WebRTC video calling.",
    year: "2026",
    role: "Full-stack developer",
    tech: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Redis", "Socket.io", "WebRTC"],
  },
  {
    slug: "docsage",
    photo: "blueHour",
    title: "DocSage",
    tagline: "AI RAG agent for PDFs",
    summary: "Upload PDFs and ask questions — answers are grounded in your documents with inline source citations.",
    year: "2026",
    role: "Full-stack developer",
    tech: ["React", "FastAPI", "Python", "FAISS", "PostgreSQL", "Docker"],
  },
];
