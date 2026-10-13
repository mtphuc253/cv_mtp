"use client"

import { createContext, Fragment, useContext, useEffect, useMemo } from "react"
import { fontStack, googleFamily, loadGoogleFont } from "@/lib/cv-fonts"
import { isRichEmpty, sanitizeRich } from "@/lib/cv-rich"
import { stripProtocol, toHref } from "@/lib/cv-url"
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

// The "dark" sidebar is a fixed deep navy whatever the accent is; the accent only tints its titles.
const DARK_PANEL = "#1b2638"
const darkInk = ({ sidebarStyle, accent }) => (sidebarStyle === "dark" ? `color-mix(in srgb, ${accent} 40%, white)` : "#fff")

const BULLETS = { disc: "disc", square: "square", dash: '"–  "', arrow: '"›  "' }
const PHOTO_SHAPE = { circle: "rounded-full", rounded: "rounded-[0.9em]", square: "rounded-none" }

const tags = (text) =>
  text
    .split(/[,;\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)

const notBlank = (item) =>
  Object.entries(item).some(([key, value]) => key !== "id" && (key === "description" ? !isRichEmpty(value) : String(value).trim()))

// Short details joined with a dot ("Acme Corp · Ho Chi Minh City"). Each one is an inline-block, so
// a line breaks between details and never in the middle of one (e.g. inside "Ho Chi Minh City"),
// unless a single detail is wider than the column. The dot stays with the detail before it.
function joinDot(...parts) {
  const list = parts.filter(Boolean)
  if (!list.length) return null
  return list.map((part, index) => {
    const last = index === list.length - 1
    return (
      <Fragment key={index}>
        <span className="inline-block">
          {part}
          {!last && <span className="whitespace-nowrap"> ·</span>}
        </span>
        {!last && " "}
      </Fragment>
    )
  })
}

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

  // Inline items with literal separators, so extracted text never fuses two items together. Each
  // item is an inline-block carrying the separator after it: a long line wraps between items
  // (after a "|"), never inside one such as "linkedin.com/in/alex-nguyen".
  return (
    <p className={cn("text-[0.95em]", T.soft, className)}>
      {items.map((item, index) => (
        <span key={item.text} className="inline-block">
          <Anchor href={item.href}>{item.text}</Anchor>
          {index < items.length - 1 && <span className={cn("px-[0.5em]", T.faint)}>|</span>}
        </span>
      ))}
    </p>
  )
}

// Descriptions and summaries. The markup is rebuilt from an allow-list first (see cv-rich.js),
// so it is safe to inject; it stays real <p>, <ul> and <li> so the PDF text is parseable.
// Bullet style and spacing come from the .cv-rich rules in cv.css.
function RichText({ html, className }) {
  const clean = useMemo(() => sanitizeRich(html), [html])
  if (isRichEmpty(clean)) return null
  return <div className={cn("cv-rich", className)} dangerouslySetInnerHTML={{ __html: clean }} />
}

// `darkInk` is the heading colour on a dark panel (white unless given).
function headingProps({ headingStyle, uppercase, accent }, { small = false, dark = false, darkInk = "#fff" } = {}) {
  const base = cn("break-after-avoid font-bold", small ? "text-[1em]" : "text-[1.1em]", uppercase && "uppercase tracking-[0.12em]")
  const ink = dark ? darkInk : accent
  const strong = dark ? "#fff" : "var(--cv-strong)"
  switch (headingStyle) {
    case "thick":
      return { className: cn(base, "border-b-[0.2em] pb-[0.2em]"), style: { color: strong, borderColor: ink } }
    case "pill":
      return {
        className: cn(base, "w-fit rounded-full px-[0.9em] py-[0.12em]"),
        style: dark ? { backgroundColor: "rgba(255, 255, 255, 0.16)", color: "#fff" } : { backgroundColor: accent, color: "#fff" },
      }
    case "box":
      return { className: cn(base, "w-fit rounded-[0.25em] border-[0.1em] px-[0.7em] py-[0.1em]"), style: { color: strong, borderColor: ink } }
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
  const { design } = useCv()
  // On a timeline each entry carries its own gap, so the vertical line stays unbroken.
  const gap = design.entryStyle === "timeline" ? "" : "space-y-[var(--cv-entry-gap)]"
  if (side) {
    return (
      <section className="mt-[var(--cv-section-gap)] grid grid-cols-[8.5em_minmax(0,1fr)] gap-[1.2em]">
        <h2 className={cn("self-start", heading.className)} style={heading.style}>
          {title}
        </h2>
        <div className={gap}>{children}</div>
      </section>
    )
  }
  return (
    <section className="mt-[var(--cv-section-gap)]">
      <h2 className={heading.className} style={heading.style}>
        {title}
      </h2>
      <div className={cn("mt-[0.5em]", gap)}>{children}</div>
    </section>
  )
}

function Entry({ title, subtitle, period, description, stacked }) {
  const { design } = useCv()
  const timeline = design.entryStyle === "timeline" && !stacked
  const periodLine = period && <p className={cn("whitespace-nowrap text-[0.95em]", T.muted)}>{period}</p>
  return (
    <div
      className={cn(timeline && "relative ml-[0.3em] border-l pb-[var(--cv-entry-gap)] pl-[1em] last:pb-0")}
      style={timeline ? { borderColor: `color-mix(in srgb, ${design.accent} 55%, white)` } : undefined}
    >
      {timeline && (
        <span
          aria-hidden
          className="absolute -left-[0.3em] top-[0.4em] size-[0.55em] rounded-full ring-[0.15em] ring-white"
          style={{ backgroundColor: design.accent }}
        />
      )}
      {/* The title block never ends a page on its own; each list item is kept whole, so a long entry can still flow onto the next page. */}
      <div className="break-after-avoid">
        <div className="flex items-baseline justify-between gap-[1em]">
          {title && <h3 className={cn("min-w-0 text-[1.1em] font-semibold", T.strong)}>{title}</h3>}
          {!stacked && periodLine}
        </div>
        {subtitle && <p className={T.soft}>{subtitle}</p>}
        {stacked && periodLine}
      </div>
      <RichText html={description} className="mt-[0.3em]" />
    </div>
  )
}

function SkillRows({ rows }) {
  const { design, dark } = useCv()

  if (design.skillStyle === "tags" || design.skillStyle === "outline") {
    const outline = design.skillStyle === "outline"
    const tagStyle = dark
      ? outline
        ? { border: "1px solid rgba(255, 255, 255, 0.55)", color: "#fff" }
        : { backgroundColor: "rgba(255, 255, 255, 0.18)", color: "#fff" }
      : outline
        ? { border: `1px solid color-mix(in srgb, ${design.accent} 55%, white)`, color: "var(--cv-strong)" }
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
  text: ({ content }) => <RichText html={content} />,

  entries: ({ content, stacked }) =>
    content.filter(notBlank).map((item) => (
      <Entry
        key={item.id}
        title={item.title}
        subtitle={joinDot(item.company, item.location)}
        period={item.period}
        description={item.description}
        stacked={stacked}
      />
    )),

  projects: ({ content, stacked }) =>
    content.filter(notBlank).map((item) => (
      <Entry
        key={item.id}
        title={item.name}
        subtitle={joinDot(item.role, item.link && <Anchor href={toHref(item.link)}>{stripProtocol(item.link)}</Anchor>)}
        description={item.description}
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
        description={item.description}
        stacked={stacked}
      />
    )),

  skills: ({ content }) => <SkillRows rows={content.filter(notBlank)} />,

  list: ({ content }) => (
    <ul className="space-y-[0.2em] pl-[1.4em] marker:text-[color:var(--cv-faint)]" style={{ listStyleType: "disc" }}>
      {content.filter(notBlank).map((item) => (
        <li key={item.id}>
          {item.title}
          {/* The detail moves to the next line as a whole instead of being split ("Amazon Web / Services"). */}
          {item.detail && (
            <>
              <span className={cn("whitespace-nowrap", T.muted)}> —</span> <span className={cn("inline-block", T.muted)}>{item.detail}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  ),
}

// A section is shown when it is visible and has something to show.
function hasContent(cv, section) {
  const content = cv.content[section.id]
  if (section.kind === "text") return !isRichEmpty(content)
  return Array.isArray(content) && content.some(notBlank)
}

function Sections({ cv, sections, stacked = false, small = false, side = false }) {
  const { design, dark } = useCv()
  const heading = headingProps(design, { small, dark, darkInk: darkInk(design) })
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

const NAME_STYLES = {
  bold: { name: "text-[2.4em] font-bold leading-tight", role: "mt-[0.1em] text-[1.25em] font-medium" },
  caps: { name: "text-[1.9em] font-semibold uppercase leading-tight tracking-[0.14em]", role: "mt-[0.2em] text-[0.95em] font-medium uppercase tracking-[0.22em]" },
  refined: { name: "text-[2.7em] font-medium leading-none tracking-tight", role: "mt-[0.35em] text-[1.2em]" },
}

function NameBlock({ basics, roleStyle, contact, className }) {
  const { design } = useCv()
  const look = NAME_STYLES[design.nameStyle]
  return (
    <div className={cn("min-w-0", className)}>
      <h1 className={cn(look.name, T.strong)}>{nameOf(basics)}</h1>
      {basics.role && (
        <p className={look.role} style={roleStyle}>
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

  // The stripe is a thick accent border on top; the optional rule adds the one below.
  const stripe = design.headerStyle === "stripe"
  return (
    <header
      className={cn("flex items-center gap-[2em]", centered ? "flex-col text-center" : "justify-between", stripe && "border-t-[0.5em] pt-[0.9em]", rule.className)}
      style={stripe ? { borderColor: design.accent } : rule.style}
    >
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
  // Both "solid" (accent colour) and "dark" (fixed navy) panels are dark backgrounds with light text.
  const dark = design.sidebarStyle === "solid" || design.sidebarStyle === "dark"
  const left = design.sidebarSide === "left"
  const hasContact = contactItems(basics).length > 0
  const hasPhoto = basics.showPhoto && basics.photo
  const showAside = hasContact || hasPhoto || sideSections.some((s) => hasContent(cv, s))

  const asideStyle =
    design.sidebarStyle === "tint"
      ? { backgroundColor: `color-mix(in srgb, ${design.accent} 9%, white)` }
      : design.sidebarStyle === "solid"
        ? { backgroundColor: design.accent, ...DARK_VARS }
        : design.sidebarStyle === "dark"
          ? { backgroundColor: DARK_PANEL, ...DARK_VARS }
          : undefined

  const aside = (
    <Ctx.Provider key="aside" value={{ ...ctx, dark }}>
      <aside
        className={cn(
          design.sidebarStyle === "line"
            ? cn("self-stretch", left ? "border-r pr-[1.4em]" : "border-l pl-[1.4em]")
            : "self-start rounded-[0.6em] p-[1.2em]",
        )}
        style={{ borderColor: "var(--cv-rule)", ...asideStyle }}
      >
        <Photo basics={basics} ring={dark} className="mx-auto mb-[0.9em] w-full max-w-[34mm]" />
        {hasContact && (
          <section>
            <h2 {...headingProps(design, { small: true, dark, darkInk: darkInk(design) })}>Contact</h2>
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
          "--cv-bullet": BULLETS[design.bulletStyle],
          "--cv-section-gap": `${design.sectionGap}pt`,
          "--cv-entry-gap": `${design.entryGap}pt`,
        }}
      >
        {design.layout === "sidebar" ? <WithSidebar cv={cv} /> : <SingleColumn cv={cv} />}
      </article>
    </Ctx.Provider>
  )
}
