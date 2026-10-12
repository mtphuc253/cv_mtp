"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Award,
  CalendarDays,
  ChevronRight,
  Download,
  ExternalLink,
  Facebook,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Server,
  Database,
  Cloud,
  X,
} from "lucide-react"
import { ProfileAvatar } from "@/components/chat/profile-avatar"
import { useSmoothText } from "@/hooks/use-smooth-text"
import { cn } from "@/lib/utils"
import {
  certificates,
  education,
  english,
  experiences,
  profile,
  projects,
  skillGroups,
  softSkills,
} from "@/data/profile"

/* ---------- shared building blocks ---------- */

function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// The opening line of each answer is typed out, like a chat reply.
function Intro({ children }) {
  const { text } = useSmoothText(children, true)
  return (
    <p className="mb-4 text-base leading-7">
      {text}
      <span className="invisible">{children.slice(text.length)}</span>
    </p>
  )
}

function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:border-cyan-400/25 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  )
}

const TONES = {
  cyan: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  blue: "border-blue-400/20 bg-blue-500/10 text-blue-200",
  emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  violet: "border-violet-400/20 bg-violet-500/10 text-violet-200",
  neutral: "border-border bg-secondary/60 text-white",
}

function Chip({ children, tone = "cyan" }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[13px] font-medium", TONES[tone])}>
      {children}
    </span>
  )
}

function Bullets({ items, icon: Icon = ChevronRight }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px] leading-7 text-white">
          <Icon className="mt-1.5 size-4 shrink-0 text-cyan-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function PillLink({ href, icon: Icon, children, external, primary }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
        primary
          ? "border-transparent bg-foreground text-background hover:bg-foreground/90"
          : "border-border bg-secondary/50 text-white hover:bg-secondary",
      )}
    >
      <Icon className="size-4" />
      {children}
    </a>
  )
}

function SocialLinks() {
  const links = [
    { label: "GitHub", href: profile.socials.github, icon: Github },
    { label: "LinkedIn", href: profile.socials.linkedin, icon: Linkedin },
    { label: "Facebook", href: profile.socials.facebook, icon: Facebook },
  ]
  return (
    <div className="flex items-center gap-2">
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/50 text-white transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  )
}

function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        sizes="90vw"
        className="max-h-[90vh] w-auto rounded-xl border border-white/20 object-contain shadow-2xl"
      />
    </div>,
    document.body,
  )
}

/* ---------- About ---------- */

function Avatar() {
  return (
    <div className="relative size-28 shrink-0">
      <div className="absolute -inset-1.5 animate-[spin_10s_linear_infinite] rounded-full bg-[conic-gradient(#06b6d4,#3b82f6,#8b5cf6,#06b6d4)] opacity-80 blur-md" />
      <ProfileAvatar className="size-full border-2 border-white/20" sizes="112px" textClass="text-3xl" />
    </div>
  )
}

function AboutResponse() {
  return (
    <div>
      <Reveal>
        <Intro>{"Sure! Here's a quick introduction to Phuc."}</Intro>
      </Reveal>

      <Reveal delay={0.08}>
        <Card>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar />
            <div className="min-w-0">
              <h3 className="text-2xl font-bold tracking-tight">{profile.name}</h3>
              <div className="font-medium text-cyan-300">{profile.role}</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-white">
                <MapPin className="size-4" />
                {profile.location}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <PillLink href={profile.phoneHref} icon={Phone}>
                  {profile.phone}
                </PillLink>
                <PillLink href={`mailto:${profile.email}`} icon={Mail}>
                  {profile.email}
                </PillLink>
              </div>
            </div>
          </div>
          <p className="mt-6 leading-7 text-white">{profile.summary}</p>
          <div className="mt-5">
            <SocialLinks />
          </div>
        </Card>
      </Reveal>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {[
          { title: "Front-end", icon: Globe, text: profile.frontend },
          { title: "Back-end", icon: Server, text: profile.backend },
        ].map(({ title, icon: Icon, text }, i) => (
          <Reveal key={title} delay={0.16 + i * 0.08}>
            <Card className="h-full p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Icon className="size-4 text-cyan-400" />
                {title}
              </div>
              <p className="text-sm leading-6 text-white">{text}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ---------- Experience ---------- */

function ExperienceResponse() {
  return (
    <div>
      <Reveal>
        <Intro>{"Here's where Phuc has worked, most recent first."}</Intro>
      </Reveal>
      <div className="space-y-3">
        {experiences.map((exp, i) => (
          <Reveal key={`${exp.company}-${exp.period}`} delay={0.08 + i * 0.1}>
            <Card>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{exp.title}</h3>
                  <div className="font-medium text-cyan-300">{exp.company}</div>
                  <div className="text-sm text-white">{exp.location}</div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-white">
                  <CalendarDays className="size-3.5 text-cyan-400" />
                  {exp.period}
                </div>
              </div>
              <Bullets items={exp.description} />
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ---------- Projects ---------- */

const TECH_ROWS = [
  { key: "frontend", label: "Frontend", icon: Globe, tone: "cyan" },
  { key: "backend", label: "Backend", icon: Server, tone: "blue" },
  { key: "database", label: "Database", icon: Database, tone: "emerald" },
  { key: "others", label: "Others", icon: Cloud, tone: "violet" },
]

function ProjectCard({ project }) {
  const [selected, setSelected] = useState(null)
  // Screenshots live on external hosts; drop any that fail to load instead of showing empty boxes.
  const [failed, setFailed] = useState(() => new Set())
  const images = project.images.filter((src) => !failed.has(src))
  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src))

  return (
    <>
      <Card className={cn(project.featured && "border-cyan-400/25 bg-cyan-500/[0.04]")}>
        {project.featured && (
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-300">Featured project</div>
        )}

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-lg font-bold transition-colors hover:text-cyan-300"
        >
          {project.title}
          <ExternalLink className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
        <div className="mt-1 text-sm text-white">{project.subtitle}</div>
        <div className="mt-2 text-sm font-medium text-cyan-300">Role: {project.role}</div>

        <div className="mt-4">
          <Bullets items={project.description} />
        </div>

        <dl className="mt-5 space-y-3">
          {TECH_ROWS.map(({ key, label, icon: Icon, tone }) => (
            <div key={key} className="flex flex-wrap items-center gap-2">
              <dt className="flex w-24 shrink-0 items-center gap-1.5 text-xs font-medium text-white">
                <Icon className="size-3.5" />
                {label}
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {project.technologies[key].map((tech) => (
                  <Chip key={tech} tone={tone}>
                    {tech}
                  </Chip>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        {images.length > 0 && (
          <div className={cn("mt-5 grid gap-2", project.isMobile ? "grid-cols-3" : "grid-cols-2")}>
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelected(src)}
                aria-label={`Enlarge ${project.title} screenshot ${i + 1}`}
                className={cn(
                  "group relative cursor-zoom-in overflow-hidden rounded-xl border border-border bg-secondary/40",
                  project.isMobile ? "aspect-[9/16]" : "aspect-video",
                )}
              >
                <Image
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 360px, 45vw"
                  onError={() => markFailed(src)}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}

        <div className="mt-5">
          <PillLink href={project.link} icon={Github} external>
            View on GitHub
          </PillLink>
        </div>
      </Card>

      {selected && (
        <ImageLightbox src={selected} alt={`${project.title} screenshot`} onClose={() => setSelected(null)} />
      )}
    </>
  )
}

function ProjectsResponse() {
  return (
    <div>
      <Reveal>
        <Intro>{"Here are the highlight projects Phuc has worked on. Click a screenshot to enlarge it."}</Intro>
      </Reveal>
      <div className="space-y-3">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={0.08 + i * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ---------- Skills ---------- */

function SkillsResponse() {
  return (
    <div>
      <Reveal>
        <Intro>{"Here's Phuc's tech stack, grouped by area, plus how he likes to work."}</Intro>
      </Reveal>

      <Reveal delay={0.08}>
        <Card>
          <h3 className="mb-4 text-lg font-bold">Tech stack</h3>
          <div className="space-y-4">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white">
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.16} className="mt-3">
        <Card>
          <h3 className="mb-4 text-lg font-bold">Workflow & soft skills</h3>
          <Bullets items={softSkills} />
          <div className="mt-5">
            <div className="mb-2 font-semibold">{english.title}</div>
            <Bullets items={english.points} icon={Award} />
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.24} className="mt-3">
        <div className="rounded-2xl border border-cyan-400/25 bg-cyan-500/[0.06] px-5 py-4 text-center font-medium italic text-cyan-100">
          {`My maxim: "${profile.maxim}"`}
        </div>
      </Reveal>
    </div>
  )
}

/* ---------- Education ---------- */

function EducationResponse() {
  return (
    <div>
      <Reveal>
        <Intro>{"Phuc is studying Software Engineering at FPT University."}</Intro>
      </Reveal>
      <Reveal delay={0.08}>
        <Card>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">{education.degree}</h3>
              <div className="font-medium text-cyan-300">{education.school}</div>
              <div className="text-sm text-white">{education.location}</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-white">
              <CalendarDays className="size-3.5 text-cyan-400" />
              {education.period}
            </div>
          </div>
          <Bullets items={education.highlights} icon={Award} />
        </Card>
      </Reveal>
    </div>
  )
}

/* ---------- Certificates ---------- */

function CertificatesResponse() {
  return (
    <div>
      <Reveal>
        <Intro>{"Yes! Phuc has completed these courses:"}</Intro>
      </Reveal>
      <div className="grid gap-3 sm:grid-cols-2">
        {certificates.map((cert, i) => (
          <Reveal key={cert.title} delay={0.08 + i * 0.08}>
            <Card className="h-full p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold leading-snug">{cert.title}</h3>
                  <div className="mt-1 text-sm font-medium text-cyan-300">{cert.provider}</div>
                </div>
                <Award className="size-5 shrink-0 text-cyan-400" />
              </div>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-cyan-300"
                >
                  <ExternalLink className="size-4" />
                  View certificate
                </a>
              )}
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ---------- Contact ---------- */

function ContactResponse() {
  return (
    <div>
      <Reveal>
        <Intro>{"Thanks for your interest! Here's how to reach Phuc."}</Intro>
      </Reveal>
      <Reveal delay={0.08}>
        <Card>
          <p className="text-lg font-semibold">
            {"Finally, I'd want to say Thank You for taking your time to review my CV."}
          </p>
          <p className="mt-2 leading-7 text-white">
            {"If you think I may be a good fit, I'd love to connect and learn more about your team and projects."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <PillLink href={profile.phoneHref} icon={Phone} primary>
              Call me
            </PillLink>
            <PillLink href={`mailto:${profile.email}`} icon={Mail}>
              {profile.email}
            </PillLink>
            <PillLink href={profile.cvUrl} icon={Download} external>
              Download CV
            </PillLink>
          </div>
          <div className="mt-5">
            <SocialLinks />
          </div>
        </Card>
      </Reveal>
    </div>
  )
}

const RESPONSES = {
  about: AboutResponse,
  experience: ExperienceResponse,
  projects: ProjectsResponse,
  skills: SkillsResponse,
  education: EducationResponse,
  certificates: CertificatesResponse,
  contact: ContactResponse,
}

export function TopicResponse({ id }) {
  const Response = RESPONSES[id]
  return Response ? <Response /> : null
}
