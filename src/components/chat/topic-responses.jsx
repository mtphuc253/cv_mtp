"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Award,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Facebook,
  Github,
  Globe,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MousePointerClick,
  Package,
  Phone,
  Search,
  Server,
  Database,
  Cloud,
  Sparkles,
  X,
  Bot,
} from "lucide-react"
import { ProfileAvatar } from "@/components/chat/profile-avatar"
import { TechChip } from "@/components/chat/tech-chip"
import { useSmoothText } from "@/hooks/use-smooth-text"
import { cn } from "@/lib/utils"
import {
  certificates,
  education,
  english,
  experienceGroups,
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
    <p className="mb-5 text-[17px] leading-7">
      {text}
      <span className="invisible">{children.slice(text.length)}</span>
    </p>
  )
}

function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-card p-5 sm:p-7",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Bullets({ items, icon: Icon = ChevronRight }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base leading-7 text-white">
          <Icon className="mt-1.5 size-4 shrink-0 text-[#a8c7fa]" />
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
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        primary ? "bg-[#004a77] text-[#c2e7ff] hover:bg-[#005a92]" : "bg-secondary text-white hover:bg-accent",
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
          className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-white transition-colors hover:bg-accent"
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
    <ProfileAvatar className="size-28" sizes="112px" />
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
              <div className="font-medium text-[#a8c7fa]">{profile.role}</div>
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
          { title: "Back-end & Data", icon: Server, text: profile.backend },
          { title: "AI & Automation", icon: Sparkles, text: profile.ai },
        ].map(({ title, icon: Icon, text }, i) => (
          <Reveal key={title} delay={0.16 + i * 0.08} className="sm:last:col-span-2">
            <Card className="h-full p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Icon className="size-4 text-[#a8c7fa]" />
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

const hostOf = (url) => new URL(url).hostname.replace(/^www\./, "")

// A headline number with what it measures underneath.
function StatTile({ value, label, className }) {
  return (
    <div className={cn("rounded-2xl bg-secondary px-3.5 py-3", className)}>
      <div className="text-2xl font-bold leading-none tracking-tight text-[#a8c7fa]">{value}</div>
      <div className="mt-1.5 text-xs leading-4 text-white/80">{label}</div>
    </div>
  )
}

// A screenshot in a browser window, so a company site reads as a site and not as a loose picture.
function BrowserShot({ image, host, onOpen }) {
  return (
    <figure>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Enlarge: ${image.alt}`}
        className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-[#131314] text-left"
      >
        <div className="flex items-center gap-3 bg-[#2a2b2d] px-3 py-2">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-[#131314] px-2.5 py-1 text-[11px] text-white/70">
            <Lock className="size-3 shrink-0" />
            <span className="truncate">{image.url ?? host}</span>
          </div>
        </div>
        <div className="relative overflow-hidden" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 340px, 90vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </button>
      <figcaption className="mt-2 text-center text-xs text-white/70">{image.caption}</figcaption>
    </figure>
  )
}

// A StatTile that acts as a tab: bordered, with an arrow and a pointer cursor, and the selected
// one points down at the panel it controls.
function TabTile({ tab, value, label, selected, onSelect }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "relative flex cursor-pointer flex-col rounded-2xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#a8c7fa] max-sm:last:odd:col-span-2",
        selected
          ? "border-[#a8c7fa]/50 bg-[#004a77] after:absolute after:-bottom-[7px] after:left-1/2 after:size-3 after:-translate-x-1/2 after:rotate-45 after:bg-[#004a77]"
          : "border-white/10 bg-secondary hover:border-[#a8c7fa]/40 hover:bg-accent",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-h-8 text-[11px] font-semibold uppercase leading-4 tracking-wider text-white">{tab}</span>
        <ChevronDown className={cn("size-4 shrink-0", selected ? "text-[#c2e7ff]" : "text-white/50")} />
      </div>
      <div className={cn("mt-2 text-2xl font-bold leading-none tracking-tight", selected ? "text-[#c2e7ff]" : "text-[#a8c7fa]")}>
        {value}
      </div>
      <div className="mt-1.5 text-xs leading-4 text-white/80">{label}</div>
    </button>
  )
}

const GROUP_ICONS = { product: Package, ai: Bot, content: Megaphone, data: Database, seo: Search }

// Groups with a `metric` become tabs: the area and its number up front, what was built below.
function ImpactTabs({ groups }) {
  const [active, setActive] = useState(0)
  const group = groups[active]
  const GroupIcon = GROUP_ICONS[group.icon] ?? Sparkles
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5 text-xs text-white/70">
        <MousePointerClick className="size-3.5 text-[#a8c7fa]" />
        Select an area to see what was built there
      </div>
      <div role="tablist" className="grid grid-cols-2 gap-2 sm:auto-cols-fr sm:grid-flow-col">
        {groups.map((g, i) => (
          <TabTile key={g.tab} tab={g.tab} {...g.metric} selected={i === active} onSelect={() => setActive(i)} />
        ))}
      </div>
      <motion.div
        key={active}
        role="tabpanel"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mt-4 rounded-2xl border border-white/10 p-4 sm:p-5"
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#004a77] text-[#c2e7ff]">
            <GroupIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <h4 className="text-base font-bold leading-snug">{group.title}</h4>
            <div className="text-xs text-[#a8c7fa]">
              {group.metric.value} · {group.metric.label}
            </div>
          </div>
        </div>
        <p className="mb-3 text-sm leading-6 text-white/80">{group.heading}</p>
        <Bullets items={group.bullets} />
      </motion.div>
    </div>
  )
}

function ExperienceCard({ exp }) {
  const [selected, setSelected] = useState(null)
  const groups = experienceGroups(exp)
  const hasTabs = groups.every((group) => group.metric)
  const images = exp.images ?? []

  return (
    <>
      <Card>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{exp.title}</h3>
            {exp.link ? (
              <a
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-medium text-[#a8c7fa] transition-colors hover:text-[#d3e3fd]"
              >
                {exp.company}
                <ExternalLink className="size-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
              </a>
            ) : (
              <div className="font-medium text-[#a8c7fa]">{exp.company}</div>
            )}
            <div className="text-sm text-white">{exp.location}</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-[13px] text-white">
            <CalendarDays className="size-3.5 text-[#a8c7fa]" />
            {exp.period}
          </div>
        </div>

        {exp.stats && (
          <div className="mb-5 grid grid-cols-2 gap-2 sm:auto-cols-fr sm:grid-flow-col">
            {exp.stats.map((stat) => (
              <StatTile key={stat.label} {...stat} />
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <BrowserShot key={image.src} image={image} host={hostOf(exp.link)} onOpen={() => setSelected(image)} />
            ))}
          </div>
        )}

        {hasTabs ? (
          <ImpactTabs groups={groups} />
        ) : (
          groups.map((group, groupIndex) => (
            <div key={group.heading ?? groupIndex} className={groupIndex > 0 ? "mt-5" : undefined}>
              {group.heading && <div className="mb-2.5 font-semibold leading-6">{group.heading}</div>}
              <Bullets items={group.bullets} />
            </div>
          ))
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {exp.technologies.map((tech) => (
            <TechChip key={tech}>{tech}</TechChip>
          ))}
        </div>

        {exp.link && (
          <div className="mt-5">
            <PillLink href={exp.link} icon={Globe} external>
              Visit {hostOf(exp.link)}
            </PillLink>
          </div>
        )}
      </Card>

      {selected && <ImageLightbox src={selected.src} alt={selected.alt} onClose={() => setSelected(null)} />}
    </>
  )
}

function ExperienceResponse() {
  return (
    <div>
      <Reveal>
        <Intro>{"Here's where Phuc has worked, most recent first."}</Intro>
      </Reveal>
      <div className="space-y-3">
        {experiences.map((exp, i) => (
          <Reveal key={`${exp.company}-${exp.period}`} delay={0.08 + i * 0.1}>
            <ExperienceCard exp={exp} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ---------- Projects ---------- */

const TECH_ROWS = [
  { key: "frontend", label: "Frontend", icon: Globe },
  { key: "backend", label: "Backend", icon: Server },
  { key: "database", label: "Database", icon: Database },
  { key: "others", label: "Others", icon: Cloud },
]

function ProjectCard({ project }) {
  const [selected, setSelected] = useState(null)
  // Screenshots live on external hosts; drop any that fail to load instead of showing empty boxes.
  const [failed, setFailed] = useState(() => new Set())
  const images = project.images.filter((src) => !failed.has(src))
  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src))

  return (
    <>
      <Card>
        {project.featured && (
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#a8c7fa]">Featured project</div>
        )}

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-lg font-bold transition-colors hover:text-[#d3e3fd]"
        >
          {project.title}
          <ExternalLink className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
        <div className="mt-1 text-sm text-white">{project.subtitle}</div>
        <div className="mt-2 text-sm font-medium text-[#a8c7fa]">Role: {project.role}</div>

        <div className="mt-4">
          <Bullets items={project.description} />
        </div>

        <dl className="mt-5 space-y-3">
          {TECH_ROWS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex flex-wrap items-center gap-2">
              <dt className="flex w-24 shrink-0 items-center gap-1.5 text-xs font-medium text-white">
                <Icon className="size-3.5" />
                {label}
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {project.technologies[key].map((tech) => (
                  <TechChip key={tech}>{tech}</TechChip>
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
                  "group relative cursor-zoom-in overflow-hidden rounded-2xl bg-secondary",
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
                    <TechChip key={item}>{item}</TechChip>
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
        <div className="rounded-3xl bg-card px-6 py-5 text-center text-lg italic text-white">
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
        <Intro>{"Phuc graduated with a Bachelor of Software Engineering from FPT University."}</Intro>
      </Reveal>
      <Reveal delay={0.08}>
        <Card>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">{education.degree}</h3>
              <div className="font-medium text-[#a8c7fa]">{education.school}</div>
              <div className="text-sm text-white">
                {education.location} · GPA {education.gpa}
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-[13px] text-white">
              <CalendarDays className="size-3.5 text-[#a8c7fa]" />
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
                  <div className="mt-1 text-sm font-medium text-[#a8c7fa]">{cert.provider}</div>
                </div>
                <Award className="size-5 shrink-0 text-[#a8c7fa]" />
              </div>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-[#d3e3fd]"
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
