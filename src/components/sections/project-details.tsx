"use client";

import { motion, type Variants } from "motion/react";
import { DOCSAGE_DESKTOP_SIZE, DocSageDesktop } from "@/components/docsage-desktop";
import { FlowDiagram } from "@/components/flow-diagram";
import { MacWindow } from "@/components/mac-window";
import { projectDetails } from "@/data/project-details";
import { projects, type Project } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

const windowReveal: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.2, ease } },
};

export function ProjectDetails() {
  return (
    <section id="projects" className="relative py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={group}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p variants={item} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Projects in depth
        </motion.p>
        <motion.h2 variants={item} className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
          How they work
        </motion.h2>
      </motion.div>

      <div className="mt-20 flex flex-col gap-40">
        {projects.map((p, i) => (
          <ProjectBlock key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const d = projectDetails[project.slug];
  if (!d) return null;

  return (
    <article id={`project-${project.slug}`} className="mx-auto w-full max-w-6xl scroll-mt-24 px-6">
      {/* Header */}
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={group}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <motion.p variants={item} className="font-mono text-sm text-subtle">
            {String(index + 1).padStart(2, "0")} · {project.year} · {project.role}
          </motion.p>
          <motion.h3 variants={item} className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {project.title}
          </motion.h3>
          <motion.p variants={item} className="mt-1 text-lg text-muted">
            {project.tagline}
          </motion.p>
        </div>
        <motion.div variants={item} className="flex items-center gap-3 text-sm font-medium">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-4 py-2 text-accent-fg transition-opacity hover:opacity-85"
            >
              Live site ↗
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-4 py-2 transition-colors hover:bg-surface-2"
            >
              GitHub ↗
            </a>
          )}
        </motion.div>
      </motion.header>

      {/* Browser window */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={windowReveal}
        className="mt-10"
      >
        <MacWindow
          title={project.title}
          domain={d.domain}
          image={d.image}
          screen={d.screen === "docsage" ? { node: <DocSageDesktop />, size: DOCSAGE_DESKTOP_SIZE } : undefined}
        />
      </motion.div>

      {/* Problem / solution · features · use cases */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={group}
        className="mt-14 grid gap-12 md:grid-cols-[1.3fr_1fr_1fr] md:gap-10"
      >
        <motion.div variants={item} className="space-y-6">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">The problem</h4>
            <p className="mt-3 leading-relaxed text-fg/85">{d.problem}</p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">The solution</h4>
            <p className="mt-3 leading-relaxed text-fg/85">{d.solution}</p>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Key features</h4>
          <ul className="mt-3 space-y-2.5">
            {d.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm leading-relaxed text-fg/85">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-fg/60" />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={item}>
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Use cases</h4>
          <ul className="mt-3 space-y-2.5">
            {d.useCases.map((u) => (
              <li key={u} className="flex gap-3 text-sm leading-relaxed text-fg/85">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-fg/60" />
                {u}
              </li>
            ))}
          </ul>
          {project.tech.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </motion.div>

      {/* How it works */}
      <div className="mt-14">
        <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">How it works</h4>
        <div className="mt-5">
          <FlowDiagram steps={d.flow} />
        </div>
      </div>

      {d.stats && (
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={group}
          className="mt-12 flex flex-wrap gap-x-14 gap-y-6 border-t border-border pt-8"
        >
          {d.stats.map((s) => (
            <motion.div key={s.label} variants={item}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-5xl leading-none">{s.value}</dd>
              <dd className="mt-2 font-mono text-xs text-muted">{s.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      )}
    </article>
  );
}
