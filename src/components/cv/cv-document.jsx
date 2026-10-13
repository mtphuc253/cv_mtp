"use client"

import { createContext, useContext, useEffect } from "react"
import { stripProtocol, toHref } from "@/lib/cv-data"
import { fontStack, googleFamily, loadGoogleFont } from "@/lib/cv-fonts"
import { cn } from "@/lib/utils"

// The printable CV. Plain semantic markup with real text (no images of text) so the
// exported PDF stays selectable and parseable by ATS software. The sheet is always white
// paper, so colours are explicit CSS variables (defined in cv.css) rather than theme
// tokens; a solid sidebar just redefines them. Sizes are in `em` so the font-size setting
// scales everything, and gaps come from variables set on the sheet.

const Ctx = createContext(null)
const useCv = () => useContext(Ctx)

const T = {
  strong: "text-[color:var(--cv-strong)]",
  soft: "text-[color:var(--cv-soft)]",
  muted: "text-[color:var(--cv-muted)]",
  faint: "text-[color:var(--cv-faint)]",
}

const DARK_VARS = {
  color: "#fff",
  "--cv-text": "#fff",
  "--cv-strong": "#fff",
  "--cv-soft": "rgba(255, 255, 255, 0.92)",
  "--cv-muted": "rgba(255, 255, 255, 0.8)",
  "--cv-faint": "rgba(255, 255, 255, 0.55)",
}

const BULLETS = { disc: "disc", square: "square", dash: '"–  "', arrow: '"›  "' }
const PHOTO_SHAPE = { circle: "rounded-full", rounded: "rounded-[0.9em]", square: "rounded-none" }

const lines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim().replace(/^[-•*]\s+/, ""))
    .filter(Boolean)

const tags = (text) =>
  text
    .split(/[,;\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)

const notBlank = (item) => Object.entries(item).some(([key, value]) => key !== "id" && String(value).trim())

const joinDot = (...parts) => parts.filter(Boolean).join(" · ")

function contactItems(basics) {
  return [
    basics.email && { text: basics.email, href: `mailto:${basics.email.trim()}` },
    basics.phone && { text: basics.phone, href: `tel:${basics.phone.replace(/[^\d+]/g, "")}` },
    basics.location && { text: basics.location },
    basics.website && { text: stripProtocol(basics.website), href: toHref(basics.website) },
    basics.linkedin && { text: stripProtocol(basics.linkedin), href: toHref(basics.linkedin) },
    basics.github && { text: stripProtocol(basics.github), href: toHref(basics.github) },
  ].filter(Boolean)
}

function Anchor({ href, children }) {
  const { links } = useCv()
  return href && links ? <a href={href}>{children}</a> : children
}

function Photo({ basics, className, ring }) {
  const { design } = useCv()
  if (!basics.showPhoto || !basics.photo) return null
  // eslint-disable-next-line @next/next/no-img-element -- user-supplied data URL / local asset
  return <img src={basics.photo} alt="" className={cn("aspect-square object-cover", PHOTO_SHAPE[design.photoShape], ring && "ring-[0.25em] ring-white/80", className)} />
}

function ContactLine({ basics, vertical, className }) {
  const items = contactItems(basics)
  if (!items.length) return null

  if (vertical) {
    return (
      <ul className={cn("space-y-[0.3em] text-[0.95em]", T.soft, className)}>
        {items.map((item) => (
          <li key={item.text} className="[overflow-wrap:anywhere]">
            <Anchor href={item.href}>{item.text}</Anchor>
          </li>
        ))}
      </ul>
    )
  }

  // Inline items with literal separators, so extracted text never fuses two items together.
  return (
    <p className={cn("text-[0.95em]", T.soft, className)}>
      {items.map((item, index) => (
        <span key={item.text}>
          {index > 0 && <span className={cn("px-[0.5em]", T.faint)}>|</span>}
          <Anchor href={item.href}>{item.text}</Anchor>
        </span>
      ))}
    </p>
  )
}

function Bullets({ text }) {
  const { design } = useCv()
  const items = lines(text)
  if (!items.length) return null
  return (
    <ul className="mt-[0.3em] space-y-[0.2em] pl-[1.4em] marker:text-[color:var(--cv-faint)]" style={{ listStyleType: BULLETS[design.bulletStyle] }}>
      {items.map((line, index) => (
        <li key={index} className="break-inside-avoid">{line}</li>
      ))}
    </ul>
  )
}

function headingProps({ headingStyle, uppercase, accent }, { small = false, dark = false } = {}) {
  const base = cn("break-after-avoid font-bold", small ? "text-[1em]" : "text-[1.1em]", uppercase && "uppercase tracking-[0.12em]")
  const ink = dark ? "#fff" : accent
  const strong = dark ? "#fff" : "var(--cv-strong)"
  switch (headingStyle) {
    case "line":
      return { className: cn(base, "border-b pb-[0.15em]"), style: { color: strong, borderColor: dark ? "rgba(255, 255, 255, 0.7)" : strong } }
    case "accent-line":
      return {
        className: cn(base, "border-b pb-[0.15em]"),
        style: { color: ink, borderColor: dark ? "rgba(255, 255, 255, 0.4)" : `color-mix(in srgb, ${accent} 35%, white)` },
      }
    case "filled":
      return { className: cn(base, "px-[0.5em] py-[0.15em]"), style: dark ? { backgroundColor: "#fff", color: accent } : { backgroundColor: accent, color: "#fff" } }
    case "bar":
      return { className: cn(base, "border-l-[0.3em] pl-[0.5em]"), style: { color: strong, borderColor: ink } }
    case "short":
      return {
        className: cn(base, "relative pb-[0.45em] after:absolute after:bottom-0 after:left-0 after:h-[0.2em] after:w-[2.4em] after:rounded-full after:bg-[var(--cv-short)]"),
        style: { color: ink, "--cv-short": ink },
      }
    default:
      return { className: base, style: { color: ink } }
  }
}

function Section({ title, heading, side, children }) {
  if (side) {
    return (
      <section className="mt-[var(--cv-section-gap)] grid grid-cols-[8.5em_minmax(0,1fr)] gap-[1.2em]">
        <h2 className={cn("self-start", heading.className)} style={heading.style}>
          {title}
        </h2>
        <div className="space-y-[var(--cv-entry-gap)]">{children}</div>
      </section>
    )
  }
  return (
    <section className="mt-[var(--cv-section-gap)]">
      <h2 className={heading.className} style={heading.style}>
        {title}
      </h2>
      <div className="mt-[0.5em] space-y-[var(--cv-entry-gap)]">{children}</div>
    </section>
  )
}

function Entry({ title, subtitle, period, bullets, tech = "", stacked }) {
  const periodLine = period && <p className={cn("whitespace-nowrap text-[0.95em]", T.muted)}>{period}</p>
  return (
    <div>
      {/* The title block never ends a page on its own; each bullet is kept whole, so a long entry can still flow onto the next page. */}
      <div className="break-after-avoid">
        <div className="flex items-baseline justify-between gap-[1em]">
          {title && <h3 className={cn("min-w-0 text-[1.1em] font-semibold", T.strong)}>{title}</h3>}
          {!stacked && periodLine}
        </div>
        {subtitle && <p className={T.soft}>{subtitle}</p>}
        {stacked && periodLine}
      </div>
      <Bullets text={bullets} />
      {tech.trim() && (
        <p className={cn("mt-[0.3em] text-[0.95em]", T.muted)}>
          <span className="font-semibold">Tech:</span> {tech}
        </p>
      )}
    </div>
  )
}

function SkillRows({ rows }) {
  const { design, dark } = useCv()

  if (design.skillStyle === "tags") {
    const tagStyle = dark
      ? { backgroundColor: "rgba(255, 255, 255, 0.18)", color: "#fff" }
      : { backgroundColor: `color-mix(in srgb, ${design.accent} 12%, white)`, color: "var(--cv-strong)" }
    return (
      <div className="space-y-[0.5em]">
        {rows.map((row) => (
          <div key={row.id}>
            {row.title && <p className={cn("font-semibold", T.strong)}>{row.title}</p>}
            <ul className="mt-[0.2em] flex flex-wrap gap-[0.35em]">
              {tags(row.items).map((tag, index) => (
                <li key={index} className="rounded-full px-[0.7em] py-[0.08em] text-[0.95em]" style={tagStyle}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-[0.3em]">
      {rows.map((row) => (
        <p key={row.id}>
          {row.title && <span className={cn("font-semibold", T.strong)}>{row.title}: </span>}
          {row.items}
        </p>
      ))}
    </div>
  )
}

// One body per section kind. They are only rendered for sections that have content.
const BODIES = {
  text: ({ content }) => <p className="whitespace-pre-line">{content.trim()}</p>,

  entries: ({ content, stacked }) =>
    content.filter(notBlank).map((item) => (
      <Entry
        key={item.id}
        title={item.title}
        subtitle={joinDot(item.company, item.location)}
        period={item.period}
        bullets={item.bullets}
        tech={item.tech}
        stacked={stacked}
      />
    )),

  projects: ({ content, stacked }) =>
    content.filter(notBlank).map((item) => (
      <Entry
        key={item.id}
        title={item.name}
        subtitle={
          (item.role || item.link) && (
            <>
              {item.role}
              {item.role && item.link && " · "}
              {item.link && <Anchor href={toHref(item.link)}>{stripProtocol(item.link)}</Anchor>}
            </>
          )
        }
        bullets={item.bullets}
        tech={item.tech}
        stacked={stacked}
      />
    )),

  education: ({ content, stacked }) =>
    content.filter(notBlank).map((item) => (
      <Entry
        key={item.id}
        title={item.degree}
        subtitle={joinDot(item.school, item.location)}
        period={item.period}
        bullets={item.bullets}
        stacked={stacked}
      />
    )),

  skills: ({ content }) => <SkillRows rows={content.filter(notBlank)} />,

  list: ({ content }) => (
    <ul className="space-y-[0.2em] pl-[1.4em] marker:text-[color:var(--cv-faint)]" style={{ listStyleType: "disc" }}>
      {content.filter(notBlank).map((item) => (
        <li key={item.id}>
          {item.title}
          {item.detail && <span className={T.muted}> — {item.detail}</span>}
        </li>
      ))}
    </ul>
  ),
}

// A section is shown when it is visible and has something to show.
function hasContent(cv, section) {
  const content = cv.content[section.id]
  if (section.kind === "text") return typeof content === "string" && content.trim() !== ""
  return Array.isArray(content) && content.some(notBlank)
}

function Sections({ cv, sections, stacked = false, small = false, side = false }) {
  const { design, dark } = useCv()
  const heading = headingProps(design, { small, dark })
  return sections
    .filter((section) => hasContent(cv, section))
    .map((section) => {
      const Body = BODIES[section.kind]
      return (
        <Section key={section.id} title={section.title.trim() || "Section"} heading={heading} side={side}>
          <Body content={cv.content[section.id]} stacked={stacked} />
        </Section>
      )
    })
}

const nameOf = (basics) => basics.name || "Your Name"

function NameBlock({ basics, roleStyle, contact, className }) {
  return (
    <div className={cn("min-w-0", className)}>
      <h1 className={cn("text-[2.4em] font-bold leading-tight", T.strong)}>{nameOf(basics)}</h1>
      {basics.role && (
        <p className="mt-[0.1em] text-[1.25em] font-medium" style={roleStyle}>
          {basics.role}
        </p>
      )}
      {contact}
    </div>
  )
}

function Header({ cv }) {
  const { design } = useCv()
  const { basics } = cv
  const centered = design.headerAlign === "center"
  const hasPhoto = basics.showPhoto && basics.photo
  const accentRole = { color: design.accent }
  const rule = design.headerRule ? { className: "border-b-2 pb-[0.9em]", style: { borderColor: design.accent } } : {}
  const contact = <ContactLine basics={basics} className="mt-[0.6em]" />

  if (design.headerStyle === "band") {
    return (
      <header
        className={cn("flex items-center gap-[1.6em] rounded-[0.7em] px-[1.6em] py-[1.3em]", centered ? "flex-col text-center" : "justify-between")}
        style={{ backgroundColor: design.accent, ...DARK_VARS }}
      >
        {centered && hasPhoto && <Photo basics={basics} ring className="size-[26mm]" />}
        <NameBlock basics={basics} roleStyle={{ color: "var(--cv-soft)" }} contact={contact} />
        {!centered && hasPhoto && <Photo basics={basics} ring className="size-[26mm] shrink-0" />}
      </header>
    )
  }

  if (design.headerStyle === "split") {
    return (
      <header className={cn("flex items-end justify-between gap-[2em]", rule.className)} style={rule.style}>
        <div className="flex min-w-0 items-center gap-[1.2em]">
          <Photo basics={basics} className="size-[24mm] shrink-0" />
          <NameBlock basics={basics} roleStyle={accentRole} />
        </div>
        <ContactLine basics={basics} vertical className="shrink-0 text-right" />
      </header>
    )
  }

  return (
    <header className={cn("flex items-center gap-[2em]", centered ? "flex-col text-center" : "justify-between", rule.className)} style={rule.style}>
      {centered && hasPhoto && <Photo basics={basics} className="size-[28mm]" />}
      <NameBlock basics={basics} roleStyle={accentRole} contact={contact} />
      {!centered && hasPhoto && <Photo basics={basics} className="size-[28mm] shrink-0" />}
    </header>
  )
}

function SingleColumn({ cv }) {
  const { design } = useCv()
  return (
    <>
      <Header cv={cv} />
      <Sections cv={cv} sections={cv.sections.filter((s) => s.visible)} side={design.sectionLayout === "side"} />
    </>
  )
}

function WithSidebar({ cv }) {
  const ctx = useCv()
  const { design } = ctx
  const { basics } = cv
  const visible = cv.sections.filter((s) => s.visible)
  const sideSections = visible.filter((s) => s.side)
  const solid = design.sidebarStyle === "solid"
  const left = design.sidebarSide === "left"
  const hasContact = contactItems(basics).length > 0
  const hasPhoto = basics.showPhoto && basics.photo
  const showAside = hasContact || hasPhoto || sideSections.some((s) => hasContent(cv, s))

  const asideStyle =
    design.sidebarStyle === "tint"
      ? { backgroundColor: `color-mix(in srgb, ${design.accent} 9%, white)` }
      : solid
        ? { backgroundColor: design.accent, ...DARK_VARS }
        : undefined

  const aside = (
    <Ctx.Provider key="aside" value={{ ...ctx, dark: solid }}>
      <aside
        className={cn(
          design.sidebarStyle === "line"
            ? cn("self-stretch", left ? "border-r pr-[1.4em]" : "border-l pl-[1.4em]")
            : "self-start rounded-[0.6em] p-[1.2em]",
        )}
        style={{ borderColor: "var(--cv-rule)", ...asideStyle }}
      >
        <Photo basics={basics} ring={solid} className="mx-auto mb-[0.9em] w-full max-w-[34mm]" />
        {hasContact && (
          <section>
            <h2 {...headingProps(design, { small: true, dark: solid })}>Contact</h2>
            <ContactLine basics={basics} vertical className="mt-[0.5em]" />
          </section>
        )}
        <Sections cv={cv} sections={sideSections} stacked small />
      </aside>
    </Ctx.Provider>
  )

  const main = (
    <div key="main" className="min-w-0">
      <header>
        <NameBlock basics={basics} roleStyle={{ color: design.accent }} />
      </header>
      <Sections cv={cv} sections={visible.filter((s) => !s.side)} />
    </div>
  )

  if (!showAside) return main

  return (
    <div
      className="grid gap-[2em]"
      style={{ gridTemplateColumns: left ? `${design.sidebarWidth}mm minmax(0, 1fr)` : `minmax(0, 1fr) ${design.sidebarWidth}mm` }}
    >
      {left ? [aside, main] : [main, aside]}
    </div>
  )
}

// `links: false` is used for thumbnails, where nothing should be clickable.
export function CvDocument({ cv, links = true }) {
  const { design } = cv
  const family = googleFamily(design.font)

  useEffect(() => {
    if (family) loadGoogleFont(family)
  }, [family])

  return (
    <Ctx.Provider value={{ design, dark: false, links }}>
      <article
        className="cv-paper"
        style={{
          fontFamily: fontStack(design.font),
          "--cv-margin": `${design.margin}mm`,
          "--cv-font-size": `${design.fontSize}pt`,
          "--cv-line-height": design.lineHeight,
          "--cv-section-gap": `${design.sectionGap}pt`,
          "--cv-entry-gap": `${design.entryGap}pt`,
        }}
      >
        {design.layout === "sidebar" ? <WithSidebar cv={cv} /> : <SingleColumn cv={cv} />}
      </article>
    </Ctx.Provider>
  )
}
