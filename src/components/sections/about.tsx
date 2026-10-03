"use client";

import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { SiGithub, SiX } from "react-icons/si";
import { TbBrandLinkedin, TbCheck, TbCopy } from "react-icons/tb";
import { about, site } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

const group: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

const socials = [
  { label: "GitHub", href: site.socials.github, Icon: SiGithub },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: TbBrandLinkedin },
  { label: "X", href: site.socials.x, Icon: SiX },
];

export function About() {
  return (
    <section id="about" className="relative pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        {/* Photo: greyscale, warms to colour on hover */}
        <motion.div
          initial={{ opacity: 0, y: 40, clipPath: "inset(12% 0% 0% 0% round 24px)" }}
          whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 24px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease }}
          className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-border md:max-w-none"
        >
          {/* Colour photo underneath; the greyscale copy on top fades out on hover (opacity only, no filters) */}
          <Image
            src={about.photo.src}
            alt={`Portrait of ${site.name}`}
            width={about.photo.width}
            height={about.photo.height}
            sizes="(min-width: 768px) 420px, 90vw"
            quality={90}
            className="h-auto w-full"
          />
          <Image
            src={about.photo.mono}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 420px, 90vw"
            quality={90}
            className="object-cover transition-opacity duration-700 ease-out group-hover:opacity-0"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
          <p className="absolute bottom-4 left-5 font-mono text-xs text-white/80">{site.location}</p>
        </motion.div>

        {/* Text */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={group}>
          <motion.p variants={item} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            About me
          </motion.p>
          <motion.h2 variants={item} className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            {about.heading}
          </motion.h2>
          {about.paragraphs.map((p) => (
            <motion.p key={p.slice(0, 20)} variants={item} className="mt-6 max-w-xl leading-relaxed text-fg/80 md:text-lg">
              {p}
            </motion.p>
          ))}

          <motion.p variants={item} className="mt-8 flex items-center gap-2.5 text-sm font-medium">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-fg opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-fg" />
            </span>
            {about.lookingFor}
          </motion.p>

          <motion.div variants={item} className="mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Off the keyboard</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {about.interests.map((i) => (
                <li key={i} className="rounded-full border border-border px-3 py-1.5 text-sm text-fg/85">
                  {i}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <Contact />
      <Footer />
    </section>
  );
}

/* ───────────────────────── Contact ───────────────────────── */

function Contact() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  }

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={group}
      id="contact"
      className="mx-auto mt-40 max-w-6xl scroll-mt-28 px-6"
    >
      <motion.p variants={item} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Get in touch
      </motion.p>
      <motion.h2
        variants={item}
        className="mt-4 font-display text-[clamp(3.5rem,12vw,10rem)] uppercase leading-[0.9]"
      >
        Let&apos;s build
        <br />
        something.
      </motion.h2>

      {/* Email: click to copy */}
      <motion.div variants={item} className="mt-12 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={copy}
          className="group inline-flex items-center gap-3 border-b border-border pb-1 text-xl font-medium transition-colors hover:border-fg md:text-3xl"
        >
          {site.email}
          <span className="relative grid size-6 place-items-center text-muted transition-colors group-hover:text-fg md:size-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "done" : "copy"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? <TbCheck className="size-full" /> : <TbCopy className="size-full" />}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="font-mono text-xs text-muted"
            >
              Copied to clipboard
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${site.email}`}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-85"
        >
          Send an email
        </a>
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </a>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  const [time, setTime] = useState<string | null>(null);

  // Local time in India, ticking each minute (client-only to avoid hydration mismatch)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="mx-auto mt-32 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-8 font-mono text-xs text-muted">
      <span>
        © {new Date().getFullYear()} {site.name}
      </span>
      <span>{time ? `${time} IST · India` : "India"}</span>
      <a href="#top" className="transition-colors hover:text-fg">
        Back to top ↑
      </a>
    </footer>
  );
}
