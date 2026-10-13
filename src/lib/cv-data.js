import { normalizeDesign } from "@/lib/cv-design"
import { bulletsToRich, paragraphsToRich, techLine, toRich } from "@/lib/cv-rich"
import { DEFAULT_SECTIONS, KINDS, defaultSections, initialContent, normalizeSections, uid } from "@/lib/cv-sections"

// Data model + helpers for the CV builder (/resumes). It is a standalone tool: nothing here
// depends on the portfolio. Everything is plain strings so it round-trips through
// localStorage and JSON import/export without surprises.
//
// A CV is { design, sections, basics, content }. `sections` is the ordered list of
// sections (see cv-sections.js) and `content[sectionId]` holds its text or entries.

const BASIC_KEYS = ["name", "role", "email", "phone", "location", "website", "linkedin", "github"]

const str = (value) => (typeof value === "string" ? value : "")

// Only local assets and small embedded images are accepted as a photo source.
const PHOTO_SRC = /^(\/[^/]|data:image\/(png|jpeg|webp);base64,)/

// The description is rich text. Older data kept it as plain bullet lines in `bullets` and the
// technologies in a separate `tech` field; those are folded into the description.
function normalizeDescription(item) {
  if (typeof item.description === "string") return toRich(item.description, bulletsToRich)
  return bulletsToRich(str(item.bullets)) + techLine(str(item.tech))
}

function normalizeField(item, field) {
  if (field === "description") return normalizeDescription(item)
  // The first version stored a certificate's issuer as `provider`.
  return str(item[field] ?? (field === "detail" ? item.provider : undefined))
}

function normalizeItems(kind, list) {
  if (!Array.isArray(list)) return []
  return list
    .filter((item) => item && typeof item === "object")
    .map((item) => ({ id: uid(), ...Object.fromEntries(KINDS[kind].fields.map((field) => [field, normalizeField(item, field)])) }))
}

// Empty content for a set of sections (used when starting a blank CV).
export const emptyContent = (sections) => Object.fromEntries(sections.map((section) => [section.id, initialContent(section.kind)]))

// Coerces arbitrary input (storage, imported file, sample data) into a valid CV.
export function normalizeCv(raw) {
  const src = raw && typeof raw === "object" ? raw : {}
  const basics = src.basics && typeof src.basics === "object" ? src.basics : {}
  const photo = str(basics.photo)
  const sections = normalizeSections(src.sections)
  const stored = src.content && typeof src.content === "object" ? src.content : {}

  // The first version kept built-in sections at the top level (summary, experience, ...).
  const legacy = (id) => (DEFAULT_SECTIONS.some((section) => section.id === id) ? src[id] : undefined)

  const content = {}
  for (const section of sections) {
    const value = stored[section.id] ?? legacy(section.id)
    content[section.id] = section.kind === "text" ? toRich(value, paragraphsToRich) : normalizeItems(section.kind, value)
  }

  return {
    design: normalizeDesign(src.design),
    sections,
    basics: {
      ...Object.fromEntries(BASIC_KEYS.map((key) => [key, str(basics[key])])),
      photo: PHOTO_SRC.test(photo) ? photo : "",
      showPhoto: basics.showPhoto === true,
    },
    content,
  }
}

// Pure updaters for the Sections panel. The new section is created by the caller (not in
// here) because React may run an updater twice and the id has to be the same both times.
export const withSection = (cv, section, preset) => ({
  ...cv,
  sections: [...cv.sections, section],
  content: { ...cv.content, [section.id]: initialContent(section.kind, preset) },
})

export function withoutSection(cv, id) {
  const content = { ...cv.content }
  delete content[id]
  return { ...cv, sections: cv.sections.filter((section) => section.id !== id), content }
}

export function parseCv(text) {
  const raw = JSON.parse(text)
  if (!raw || typeof raw !== "object" || !raw.basics) throw new Error("Not a CV file")
  return normalizeCv(raw)
}

export const blankCv = () => normalizeCv({ sections: defaultSections() })

// Example content so the templates have something to show on first visit.
export function sampleCv() {
  return normalizeCv({
    basics: {
      name: "Alex Nguyen",
      role: "Software Engineer",
      email: "alex.nguyen@example.com",
      phone: "+84 900 000 000",
      location: "Ho Chi Minh City, Vietnam",
      linkedin: "linkedin.com/in/alex-nguyen",
      github: "github.com/alex-nguyen",
    },
    sections: defaultSections(),
    content: {
      summary: paragraphsToRich(
        "Software engineer with 3+ years of experience building web products end to end. Comfortable across the stack, with a focus on clean APIs, fast interfaces and well-tested code.",
      ),
      experience: [
        {
          title: "Software Engineer",
          company: "Acme Corp",
          location: "Ho Chi Minh City",
          period: "JAN 2023 — PRESENT",
          description:
            bulletsToRich(
              "Led the rebuild of the customer dashboard, cutting page load time by 40%.\nDesigned REST APIs used by 3 internal teams and 2 mobile apps.\nMentored 2 junior engineers and introduced code review guidelines.",
            ) + techLine("React, Node.js, PostgreSQL, AWS"),
        },
        {
          title: "Junior Developer",
          company: "Beta Studio",
          location: "Ho Chi Minh City",
          period: "JUN 2021 — DEC 2022",
          description:
            bulletsToRich("Built and shipped 12 marketing sites and landing pages.\nAutomated deployments, reducing release time from 1 hour to 10 minutes.") +
            techLine("Next.js, TypeScript, Tailwind CSS"),
        },
      ],
      projects: [
        {
          name: "Task Board",
          role: "Creator",
          link: "github.com/alex-nguyen/task-board",
          description: bulletsToRich("Open-source kanban app with real-time collaboration.\nUsed by 500+ people.") + techLine("React, WebSocket, MongoDB"),
        },
      ],
      skills: [
        { title: "Languages", items: "TypeScript, JavaScript, SQL, Python" },
        { title: "Frameworks", items: "React, Next.js, Node.js, Express" },
        { title: "Tools", items: "Git, Docker, AWS, Figma" },
      ],
      education: [
        {
          degree: "Bachelor of Software Engineering",
          school: "Example University",
          location: "Ho Chi Minh City",
          period: "2017 — 2021",
          description: bulletsToRich("GPA 3.5 / 4.0\nDean's list, 4 semesters"),
        },
      ],
      certificates: [{ title: "AWS Certified Cloud Practitioner", detail: "Amazon Web Services" }],
    },
  })
}
