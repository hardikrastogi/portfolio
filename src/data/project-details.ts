// Content for the "Projects in depth" section, keyed by project slug.
// Drafted from the CV — review the wording, especially anything marked DRAFT.

export type FlowStep = { label: string; detail: string };

export type ProjectDetail = {
  /** Shown in the window's address bar */
  domain?: string;
  /** Home-screen screenshot for the browser window; width/height set the window's shape */
  image?: { src: string; width: number; height: number };
  /** Coded desktop screen used instead of a screenshot */
  screen?: "docsage";
  problem: string;
  solution: string;
  flow: FlowStep[];
  features: string[];
  useCases: string[];
  stats?: { value: string; label: string }[];
};

export const projectDetails: Record<string, ProjectDetail> = {
  formora: {
    image: { src: "/showcase/formora-desktop.v1.webp", width: 1920, height: 864 },
    domain: "formora-web.vercel.app",
    problem:
      "Every product rebuilds the same forms by hand — fields, layout, validation and theming — and the rules on the client and the server slowly drift apart.",
    solution:
      "Formora describes a whole form as one JSON document. The renderer draws it, Zod validates it identically in the browser and on the server, and the schema version travels with every submission.",
    flow: [
      { label: "FormDefinition", detail: "One JSON document" },
      { label: "Core", detail: "Zod schema + validation" },
      { label: "React renderer", detail: "Layout, theme, fields" },
      { label: "FormSubmission", detail: "Versioned answers" },
    ],
    features: [
      "13 field types, with a plugin system for custom ones",
      "The same validation on client and server, from one schema",
      "Token-based theming with light and dark modes",
      "Drag-and-drop visual builder and a live JSON playground",
    ],
    useCases: [
      "Event registration and RSVP forms",
      "Feedback, intake and application forms",
      "A consistent form system inside a larger React product",
    ],
    stats: [
      { value: "70+", label: "unit tests" },
      { value: "50+", label: "end-to-end tests" },
      { value: "13", label: "field types" },
    ],
  },
  baxus: {
    image: { src: "/showcase/baxus-desktop.v1.webp", width: 1236, height: 654 },
    domain: "Chrome extension",
    // DRAFT — confirm how matching works and the tech used
    problem:
      "Collectors browsing whisky and wine on retail sites have no quick way to tell whether the same bottle is cheaper on the BAXUS marketplace.",
    solution:
      "The extension reads the bottle details from the page you're on, matches them against BAXUS listings and shows the better price right in the browser — no tab-hopping.",
    flow: [
      { label: "Retail page", detail: "Product you're viewing" },
      { label: "Content script", detail: "Scrapes name, size, ABV, price" },
      { label: "Matcher", detail: "Normalises and finds the bottle" },
      { label: "BAXUS", detail: "Price comparison popup" },
    ],
    features: [
      "Works across popular whisky and wine retailers",
      "Extracts bottle name, size and ABV from the page",
      "Tolerant matching across naming differences",
      "Shows the saving at a glance",
    ],
    useCases: [
      "Checking for a better deal before buying",
      "Comparing prices while casually browsing",
      "Discovering bottles available on BAXUS",
    ],
  },
  sphere: {
    image: { src: "/showcase/sphere-desktop.v1.webp", width: 1920, height: 862 },
    problem:
      "A social app is a classic full-stack challenge: real-time messaging, media, privacy rules and a feed that has to stay fast as it grows.",
    solution:
      "Sphere pairs a Next.js front end with a NestJS + Prisma API. Socket.io carries live messages, WebRTC handles calls, and Redis caches feeds with automatic invalidation.",
    flow: [
      { label: "Next.js client", detail: "Feed, stories, DMs" },
      { label: "NestJS API", detail: "Auth + access control" },
      { label: "PostgreSQL", detail: "Data via Prisma" },
      { label: "Redis", detail: "Feed cache" },
    ],
    features: [
      "Posts, stories, likes and comments",
      "Real-time direct messages over Socket.io",
      "WebRTC audio and video calling",
      "Public and private accounts with follow approval, enforced in every API",
    ],
    useCases: [
      "Small communities that want their own space",
      "Private sharing between friends and teams",
      "A reference build for real-time social features",
    ],
  },
  docsage: {
    domain: "rag-doc-qa-project.vercel.app",
    screen: "docsage",
    problem:
      "Long PDFs are slow to search, and general chatbots answer confidently even when the document says nothing about the question.",
    solution:
      "DocSage splits each PDF into chunks, indexes them with FAISS and answers only from the most relevant passages — with inline [Source N] citations you can check.",
    flow: [
      { label: "PDF upload", detail: "Per-user documents" },
      { label: "Chunk + embed", detail: "100+ chunks per file" },
      { label: "FAISS search", detail: "Nearest passages" },
      { label: "LLM answer", detail: "Grounded, with citations" },
    ],
    features: [
      "Answers cite their sources inline, so you can verify them",
      "A tuned relevance cutoff rejects questions the document can't answer",
      "ChatGPT-style chat history stored in PostgreSQL",
      "Pick up past conversations without re-uploading files",
    ],
    useCases: [
      "Students reviewing papers and notes",
      "Analysts scanning long reports",
      "Teams querying internal documents",
    ],
    stats: [
      { value: "0.95", label: "relevance cutoff" },
      { value: "100+", label: "chunks per doc" },
    ],
  },
};
