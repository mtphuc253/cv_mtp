// Sections of the CV. A section is an instance of a "kind"; the kind decides which
// fields its entries have. Built-in sections and user-added ones share this model, so
// any kind can be added any number of times (Volunteering is just another "entries").

export const uid = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)

// text: one free-form paragraph. The others hold a list of entries with these fields.
export const KINDS = {
  text: { fields: null },
  entries: { fields: ["title", "company", "location", "period", "bullets", "tech"] },
  projects: { fields: ["name", "role", "link", "bullets", "tech"] },
  education: { fields: ["degree", "school", "location", "period", "bullets"] },
  skills: { fields: ["title", "items"] },
  list: { fields: ["title", "detail"] },
}

export const KIND_IDS = Object.keys(KINDS)

// `side` decides which column a section lands in when the layout is "sidebar".
export const DEFAULT_SECTIONS = [
  { id: "summary", kind: "text", title: "Summary", side: false },
  { id: "experience", kind: "entries", title: "Experience", side: false },
  { id: "projects", kind: "projects", title: "Projects", side: false },
  { id: "skills", kind: "skills", title: "Skills", side: true },
  { id: "education", kind: "education", title: "Education", side: true },
  { id: "certificates", kind: "list", title: "Certificates", side: true },
]

export const defaultSections = () => DEFAULT_SECTIONS.map((section) => ({ ...section, visible: true }))

// What the "Add section" menu offers.
export const SECTION_PRESETS = [
  { key: "languages", label: "Languages", kind: "skills", title: "Languages", side: true },
  { key: "interests", label: "Interests", kind: "skills", title: "Interests", side: true },
  { key: "awards", label: "Awards", kind: "list", title: "Awards", side: false },
  { key: "courses", label: "Courses & training", kind: "list", title: "Courses", side: true },
  { key: "publications", label: "Publications", kind: "list", title: "Publications", side: false },
  { key: "volunteering", label: "Volunteering", kind: "entries", title: "Volunteering", side: false },
  { key: "references", label: "References", kind: "text", title: "References", side: false, text: "Available upon request." },
  { key: "custom-text", label: "Custom text", kind: "text", title: "Custom section", side: false },
  { key: "custom-entries", label: "Custom entries", kind: "entries", title: "Custom section", side: false },
  { key: "custom-list", label: "Custom list", kind: "list", title: "Custom section", side: false },
]

export function newSection(preset) {
  return {
    id: `${preset.key}-${uid().slice(0, 6).toLowerCase()}`,
    kind: preset.kind,
    title: preset.title,
    visible: true,
    side: preset.side,
  }
}

export const newItem = (kind) => ({ id: uid(), ...Object.fromEntries(KINDS[kind].fields.map((field) => [field, ""])) })

export const initialContent = (kind, preset) => (kind === "text" ? (preset?.text ?? "") : [])

const ID_PATTERN = /^[a-z0-9-]{1,48}$/

// Keeps order, drops unknown kinds / bad or duplicate ids. Data saved before section kinds
// existed has no `kind`: it is recovered from the built-in id.
export function normalizeSections(raw) {
  if (!Array.isArray(raw)) return defaultSections()
  const seen = new Set()
  const out = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const id = typeof item.id === "string" && ID_PATTERN.test(item.id) ? item.id : null
    const builtIn = DEFAULT_SECTIONS.find((section) => section.id === id)
    const kind = KIND_IDS.includes(item.kind) ? item.kind : builtIn?.kind
    if (!id || !kind || seen.has(id)) continue
    seen.add(id)
    out.push({
      id,
      kind,
      title: typeof item.title === "string" ? item.title.slice(0, 60) : (builtIn?.title ?? "Section"),
      visible: item.visible !== false,
      side: typeof item.side === "boolean" ? item.side : (builtIn?.side ?? false),
    })
  }
  return out
}
