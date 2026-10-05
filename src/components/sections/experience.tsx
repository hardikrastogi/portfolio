"use client";

import { motion, type Variants } from "motion/react";
import { mockScreens, ScreenVideo } from "@/components/mock-screens";
import { PhonePhoto } from "@/components/phone-photo";
import { experience, type Experience as ExperienceItem } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
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

export function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-16 pt-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={group}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p variants={item} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Experience
        </motion.p>
        <motion.h2 variants={item} className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
          Where I&apos;ve worked
        </motion.h2>
      </motion.div>

      <ol className="mx-auto mt-14 max-w-6xl px-6">
        {experience.map((job, i) => (
          <Role key={job.slug} job={job} index={i} />
        ))}
      </ol>
    </section>
  );
}

function Role({ job, index }: { job: ExperienceItem; index: number }) {
  const Mock = mockScreens[job.slug];

  return (
    <li className="relative py-10 md:py-12">
      {/* Divider draws itself in from the left */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, delay: index * 0.1, ease }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-border"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={group}
        className="grid gap-10 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-16 [&>*]:min-w-0"
      >
        <div>
          {/* Company + period */}
          <motion.div variants={item}>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-subtle">
              {job.period}
              {job.type && <> · {job.type}</>}
            </p>
            <h3 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{job.company}</h3>
            {job.link && (
              <a
                href={job.link.href}
                target="_blank"
                rel="noreferrer"
                className="relative mt-2 inline-block font-mono text-xs text-muted underline-offset-4 after:absolute after:inset-x-0 after:-inset-y-3 after:content-[''] transition-colors hover:text-fg hover:underline"
              >
                {job.link.label} ↗
              </a>
            )}
          </motion.div>

          {/* Role, summary, highlights */}
          <div className="mt-6">
            <motion.p variants={item} className="text-lg font-medium md:text-xl">
              {job.role}
            </motion.p>
            <motion.p variants={item} className="mt-3 max-w-2xl leading-relaxed text-fg/80">
              {job.summary}
            </motion.p>

            <motion.ul variants={item} className="mt-6 max-w-2xl space-y-2.5">
              {job.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-fg/85">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-fg/60" />
                  {h}
                </li>
              ))}
            </motion.ul>

            {job.stats && (
              <motion.dl variants={item} className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                {job.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-4xl leading-none">{s.value}</dd>
                    <dd className="mt-1.5 font-mono text-xs text-muted">{s.label}</dd>
                  </div>
                ))}
              </motion.dl>
            )}

            {job.tech.length > 0 && (
              <motion.ul variants={item} className="mt-8 flex flex-wrap gap-1.5">
                {job.tech.map((t) => (
                  <li key={t} className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>

        {/* The product running on a hand-held iPhone, pinned while the text scrolls past */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={photoReveal}
          className="mx-auto w-full max-w-[440px] overflow-hidden rounded-[28px] border border-border lg:sticky lg:top-28 lg:self-start"
        >
          <PhonePhoto photo={job.photo} alt={`${job.company} running on an iPhone`} statusTone={job.statusTone}>
            {(active) =>
              job.video ? (
                <ScreenVideo src={job.video.src} poster={job.video.poster} active={active} />
              ) : (
                Mock && <Mock active={active} />
              )
            }
          </PhonePhoto>
        </motion.div>
      </motion.div>
    </li>
  );
}
