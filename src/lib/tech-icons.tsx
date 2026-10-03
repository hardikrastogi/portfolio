import type { IconType } from "react-icons";
import {
  SiCplusplus,
  SiCss,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiGit,
  SiGithub,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJunit5,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPandas,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiScikitlearn,
  SiSocketdotio,
  SiSpringboot,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVitest,
} from "react-icons/si";
import {
  TbApi,
  TbBrandAws,
  TbChartDots3,
  TbDatabase,
  TbFileSearch,
  TbInfinity,
  TbLanguage,
  TbMasksTheater,
  TbPrompt,
  TbSparkles,
} from "react-icons/tb";

// Brand marks from Simple Icons; generic Tabler glyphs where a brand mark doesn't exist
export const techIcons: Record<string, IconType> = {
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  Python: SiPython,
  Java: SiOpenjdk,
  "C++": SiCplusplus,
  SQL: TbDatabase,
  React: SiReact,
  "Next.js": SiNextdotjs,
  Redux: SiRedux,
  "Tailwind CSS": SiTailwindcss,
  HTML5: SiHtml5,
  CSS3: SiCss,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  NestJS: SiNestjs,
  "Spring Boot": SiSpringboot,
  FastAPI: SiFastapi,
  "REST APIs": TbApi,
  GraphQL: SiGraphql,
  "Socket.io": SiSocketdotio,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  SQLite: SiSqlite,
  Prisma: SiPrisma,
  "LLM & GenAI": TbSparkles,
  RAG: TbFileSearch,
  FAISS: TbChartDots3,
  "Prompt Engineering": TbPrompt,
  "scikit-learn": SiScikitlearn,
  Pandas: SiPandas,
  NLTK: TbLanguage,
  Docker: SiDocker,
  AWS: TbBrandAws,
  "CI/CD": TbInfinity,
  Linux: SiLinux,
  Git: SiGit,
  GitHub: SiGithub,
  Vercel: SiVercel,
  Playwright: TbMasksTheater,
  Vitest: SiVitest,
  JUnit: SiJunit5,
};

/** Icon for a tech name, or a two-letter monogram when none exists */
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = techIcons[name];
  if (Icon) return <Icon aria-hidden className={className} />;
  return (
    <span
      aria-hidden
      className={`inline-grid place-items-center rounded-[4px] border border-current font-mono text-[0.5em] font-semibold leading-none ${className ?? ""}`}
    >
      {name.slice(0, 2)}
    </span>
  );
}
