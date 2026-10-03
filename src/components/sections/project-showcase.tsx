"use client";

import { motion, type Variants } from "motion/react";
import { PhonePhoto } from "@/components/phone-photo";
import { mockScreens, ScreenshotScroll, ScreenVideo } from "@/components/mock-screens";
import { projects, type Project } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

const textGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

// Photo reveal: rises gently while a soft mask opens from the bottom and the blur clears
const photoReveal: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.97, filter: "blur(10px)", clipPath: "inset(18% 0% 0% 0% round 28px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    clipPath: "inset(0% 0% 0% 0% round 28px)",
    transition: { duration: 1.3, ease },
  },
};

export function ProjectShowcase() {
  return (
    <section id="work" className="relative">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={textGroup}
        className="mx-auto max-w-5xl px-6 pt-32"
      >
        <motion.p variants={textItem} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Selected work
        </motion.p>
        <motion.h2 variants={textItem} className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
          Things I&apos;ve built
        </motion.h2>
      </motion.div>

      {projects.map((project, i) => (
        <ProjectFeature key={project.slug} project={project} index={i} total={projects.length} />
      ))}
    </section>
  );
}

function ProjectFeature({ project, index, total }: { project: Project; index: number; total: number }) {
  const flipped = index % 2 === 1;
  const Mock = mockScreens[project.slug];
  const number = String(index + 1).padStart(2, "0");

  return (
    <article id={`showcase-${project.slug}`} className="relative flex min-h-svh items-center px-6 py-20">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={textGroup}
          className={`order-2 ${flipped ? "md:order-2" : "md:order-1"}`}
        >
          <motion.p variants={textItem} className="font-mono text-sm text-subtle">
            {number} / {String(total).padStart(2, "0")} · {project.year}
          </motion.p>
          <motion.h3 variants={textItem} className="mt-3 text-5xl font-semibold tracking-tight md:text-7xl">
            {project.title}
          </motion.h3>
          <motion.p variants={textItem} className="mt-2 text-lg text-muted md:text-xl">
            {project.tagline}
          </motion.p>
          <motion.p variants={textItem} className="mt-6 max-w-md leading-relaxed text-fg/80">
            {project.summary}
          </motion.p>
          {project.tech.length > 0 && (
            <motion.ul variants={textItem} className="mt-6 flex max-w-md flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </motion.ul>
          )}
          <motion.div variants={textItem} className="mt-8 flex flex-wrap items-center gap-5 text-sm font-medium">
            <a href={`#project-${project.slug}`} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
              How it works <span aria-hidden>↓</span>
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="text-muted underline-offset-4 hover:text-fg hover:underline">
                Live ↗
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className="text-muted underline-offset-4 hover:text-fg hover:underline">
                GitHub ↗
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Photo */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={photoReveal}
          className={`order-1 mx-auto w-full max-w-[440px] overflow-hidden rounded-[28px] border border-border ${
            flipped ? "md:order-1" : "md:order-2"
          }`}
        >
          <PhonePhoto photo={project.photo} alt={`${project.title} running on an iPhone`} statusTone={project.statusTone}>
            {(active) =>
              project.video ? (
                <ScreenVideo src={project.video.src} poster={project.video.poster} active={active} />
              ) : project.screen ? (
                <ScreenshotScroll src={project.screen} alt={`${project.title} app screen`} />
              ) : (
                Mock && <Mock active={active} />
              )
            }
          </PhonePhoto>
        </motion.div>
      </div>
    </article>
  );
}
