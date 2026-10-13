import { normalizeCv, parseCv } from "@/lib/cv-data"
import { uid } from "@/lib/cv-sections"

// The library is the list of CVs a visitor has saved in this browser. Each one has its own
// content AND its own design, so one person can keep e.g. an ATS version and a designed one.

export const LIBRARY_KEY = "cv-builder:v2"
const LEGACY_KEY = "cv-builder:v1" // single CV, before the library existed
const MAX_DOCS = 50
const APP = "cv-builder"

export const newDoc = (name, cv) => ({ id: uid(), name, updatedAt: Date.now(), cv })

const cleanName = (value, fallback) => (typeof value === "string" && value.trim() ? value.trim().slice(0, 60) : fallback)

function normalizeDoc(raw, fallbackName) {
  if (!raw || typeof raw !== "object" || !raw.cv || typeof raw.cv !== "object") return null
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : uid(),
    name: cleanName(raw.name, fallbackName),
    updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : Date.now(),
    cv: normalizeCv(raw.cv),
  }
}

function withUniqueIds(docs) {
  const seen = new Set()
  return docs.map((doc) => {
    const id = seen.has(doc.id) ? uid() : doc.id
    seen.add(id)
    return { ...doc, id }
  })
}

// Reads the saved library, migrating the single-CV format if that is all there is.
export function loadLibrary() {
  try {
    const stored = localStorage.getItem(LIBRARY_KEY)
    if (stored) {
      const raw = JSON.parse(stored)
      const docs = withUniqueIds((Array.isArray(raw?.docs) ? raw.docs : []).map((doc, i) => normalizeDoc(doc, `CV ${i + 1}`)).filter(Boolean)).slice(0, MAX_DOCS)
      if (docs.length) return { docs, activeId: docs.some((doc) => doc.id === raw.activeId) ? raw.activeId : docs[0].id }
    }
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const cv = parseCv(legacy)
      const doc = newDoc(cleanName(cv.basics.name, "My CV"), cv)
      return { docs: [doc], activeId: doc.id }
    }
  } catch {
    // Unreadable or blocked storage: start fresh.
  }
  return null
}

export function saveLibrary(docs, activeId) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify({ version: 2, activeId, docs }))
  } catch {
    // Storage full or blocked (private mode): the CVs just won't persist.
  }
}

// ---- Files ---------------------------------------------------------------

const asFile = (payload, indent = 2) => JSON.stringify({ app: APP, version: 2, ...payload }, null, indent)

export const serializeDoc = (doc) => asFile({ name: doc.name, updatedAt: doc.updatedAt, cv: doc.cv })

// `indent` 0 gives one compact line, which is what the clipboard wants.
export const serializeLibrary = (docs, indent = 2) =>
  asFile({ docs: docs.map(({ name, updatedAt, cv }) => ({ name, updatedAt, cv })) }, indent)

// Accepts a library export, a single-CV export, or a bare CV from the first version.
// Imported CVs always get fresh ids so they never clash with the ones already saved.
export function parseImport(text) {
  const raw = JSON.parse(text)
  let docs = []
  if (Array.isArray(raw?.docs)) docs = raw.docs.map((doc, i) => normalizeDoc({ ...doc, id: "" }, `Imported CV ${i + 1}`))
  else if (raw?.cv) docs = [normalizeDoc({ ...raw, id: "" }, "Imported CV")]
  else if (raw?.basics) docs = [normalizeDoc({ name: raw.basics.name, cv: raw }, "Imported CV")]
  docs = docs.filter(Boolean).slice(0, MAX_DOCS)
  if (!docs.length) throw new Error("No CV found in this file")
  return docs
}

export const fileSlug = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "cv"

export function downloadText(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const suggestName = (docs, base = "CV") => {
  const names = new Set(docs.map((doc) => doc.name))
  for (let n = docs.length + 1; ; n++) if (!names.has(`${base} ${n}`)) return `${base} ${n}`
}

// `base`, or `base 2`, `base 3`... when that name is already taken.
export function uniqueName(docs, base) {
  const names = new Set(docs.map((doc) => doc.name))
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? base : `${base} ${n}`
    if (!names.has(candidate)) return candidate
  }
}
