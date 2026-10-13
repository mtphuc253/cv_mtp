import { normalizeFontId } from "@/lib/cv-fonts"

// Design settings of the CV builder: presets, ranges and the normalizer that keeps
// imported / stored values inside safe bounds.

export const ACCENTS = ["#2563eb", "#0d9488", "#7c3aed", "#db2777", "#d97706", "#374151"]

// Numeric settings: one source for the sliders and for clamping stored values.
export const RANGES = {
  fontSize: { label: "Font size", min: 8, max: 12, step: 0.5, unit: "pt" },
  lineHeight: { label: "Line height", min: 1.1, max: 1.8, step: 0.05, unit: "" },
  margin: { label: "Page margin", min: 8, max: 25, step: 1, unit: "mm" },
  sectionGap: { label: "Gap between sections", min: 4, max: 24, step: 1, unit: "pt" },
  entryGap: { label: "Gap between entries", min: 2, max: 16, step: 1, unit: "pt" },
  sidebarWidth: { label: "Sidebar width", min: 45, max: 80, step: 1, unit: "mm" },
}

// Choice settings: label list for the UI, and the values the normalizer accepts.
export const OPTIONS = {
  layout: [
    { id: "single", label: "One column" },
    { id: "sidebar", label: "Sidebar" },
  ],
  headingStyle: [
    { id: "line", label: "Line" },
    { id: "accent-line", label: "Accent line" },
    { id: "plain", label: "Plain" },
    { id: "filled", label: "Filled" },
    { id: "bar", label: "Bar" },
    { id: "short", label: "Short rule" },
  ],
  headerStyle: [
    { id: "plain", label: "Plain" },
    { id: "band", label: "Banner" },
    { id: "split", label: "Split" },
  ],
  headerAlign: [
    { id: "left", label: "Left" },
    { id: "center", label: "Center" },
  ],
  sectionLayout: [
    { id: "stacked", label: "Above" },
    { id: "side", label: "Left column" },
  ],
  skillStyle: [
    { id: "lines", label: "Lines" },
    { id: "tags", label: "Tags" },
  ],
  bulletStyle: [
    { id: "disc", label: "Dot" },
    { id: "square", label: "Square" },
    { id: "dash", label: "Dash" },
    { id: "arrow", label: "Arrow" },
  ],
  photoShape: [
    { id: "circle", label: "Circle" },
    { id: "rounded", label: "Rounded" },
    { id: "square", label: "Square" },
  ],
  sidebarStyle: [
    { id: "tint", label: "Tinted" },
    { id: "solid", label: "Solid" },
    { id: "line", label: "Divider" },
  ],
  sidebarSide: [
    { id: "left", label: "Left" },
    { id: "right", label: "Right" },
  ],
}

// Everything a template controls. Accent colour and photo shape are personal and stay out.
const LOOK = {
  layout: "single",
  font: "inter",
  fontSize: 9.5,
  lineHeight: 1.4,
  margin: 14,
  sectionGap: 11,
  entryGap: 7,
  headingStyle: "accent-line",
  uppercase: true,
  headerStyle: "plain",
  headerAlign: "left",
  headerRule: true,
  sectionLayout: "stacked",
  skillStyle: "lines",
  bulletStyle: "disc",
  sidebarStyle: "tint",
  sidebarSide: "left",
  sidebarWidth: 60,
}

export const DEFAULT_DESIGN = { accent: ACCENTS[0], photoShape: "circle", ...LOOK }

const look = (overrides) => ({ ...LOOK, ...overrides })

// Styles are modelled on what popular builders offer: Reactive Resume (banner / sidebar
// templates), RenderCV (themes differ mainly by section-title style, font and margins,
// e.g. sb2nov's full-width rules, moderncv's titles in the left column) and the usual
// ATS advice (one column is the safest). Each one is just a bundle of the options below.
export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    hint: "Serif, centered header, ruled headings.",
    preset: look({ font: "georgia", headingStyle: "line", headerAlign: "center", headerRule: false }),
  },
  { id: "modern", name: "Modern", hint: "Clean sans-serif with accent headings.", preset: look({}) },
  {
    id: "compact",
    name: "Compact",
    hint: "Tight spacing to fit more on one page.",
    preset: look({
      font: "source-sans-3",
      headingStyle: "plain",
      headerRule: false,
      fontSize: 9,
      lineHeight: 1.3,
      margin: 11,
      sectionGap: 8,
      entryGap: 5,
    }),
  },
  {
    id: "engineer",
    name: "Engineer",
    hint: "Dense one-pager with full-width rules (sb2nov style).",
    preset: look({
      font: "lora",
      headingStyle: "line",
      headerAlign: "center",
      headerRule: false,
      fontSize: 10,
      lineHeight: 1.25,
      margin: 12,
      sectionGap: 8,
      entryGap: 5,
    }),
  },
  {
    id: "minimal",
    name: "Minimal",
    hint: "Airy and understated, no rules.",
    preset: look({
      font: "be-vietnam-pro",
      headingStyle: "plain",
      uppercase: false,
      headerRule: false,
      lineHeight: 1.5,
      sectionGap: 15,
      entryGap: 10,
    }),
  },
  {
    id: "elegant",
    name: "Elegant",
    hint: "Serif with a short accent rule under titles.",
    preset: look({
      font: "playfair-display",
      headingStyle: "short",
      headerAlign: "center",
      headerRule: false,
      lineHeight: 1.45,
      sectionGap: 14,
      bulletStyle: "dash",
    }),
  },
  {
    id: "banner",
    name: "Banner",
    hint: "Accent header band with tag-style skills.",
    preset: look({ font: "roboto", headerStyle: "band", headerRule: false, headingStyle: "plain", skillStyle: "tags" }),
  },
  {
    id: "ledger",
    name: "Ledger",
    hint: "Section titles in the left column (moderncv style).",
    preset: look({
      font: "source-sans-3",
      headerStyle: "split",
      headingStyle: "plain",
      uppercase: false,
      sectionLayout: "side",
      lineHeight: 1.35,
    }),
  },
  {
    id: "bold",
    name: "Bold bar",
    hint: "Heavy headings marked with an accent bar.",
    preset: look({ font: "montserrat", fontSize: 9, headingStyle: "bar", headerRule: true, bulletStyle: "square" }),
  },
  {
    id: "creative",
    name: "Creative",
    hint: "Tags, short rules and relaxed spacing.",
    preset: look({
      font: "plus-jakarta-sans",
      headingStyle: "short",
      headerRule: false,
      skillStyle: "tags",
      bulletStyle: "arrow",
      sectionGap: 13,
      entryGap: 9,
    }),
  },
  {
    id: "sidebar",
    name: "Sidebar",
    hint: "Two columns with a tinted side panel.",
    preset: look({ layout: "sidebar", headerRule: false }),
  },
  {
    id: "solid",
    name: "Solid sidebar",
    hint: "Two columns with a solid accent panel.",
    preset: look({ layout: "sidebar", sidebarStyle: "solid", headerRule: false, font: "nunito-sans" }),
  },
  {
    id: "executive",
    name: "Executive",
    hint: "Right-hand panel separated by a divider.",
    preset: look({
      layout: "sidebar",
      sidebarStyle: "line",
      sidebarSide: "right",
      font: "merriweather",
      fontSize: 9,
      headingStyle: "line",
      headerRule: false,
    }),
  },
]

export const isPresetActive = (design, preset) => Object.entries(preset).every(([key, value]) => design[key] === value)

const ids = (key) => OPTIONS[key].map((option) => option.id)

const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback)

const clamp = (value, { min, max }, fallback) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback

export function normalizeDesign(raw) {
  const src = raw && typeof raw === "object" ? raw : {}
  const d = DEFAULT_DESIGN
  const design = {
    accent: /^#[0-9a-f]{6}$/i.test(String(src.accent)) ? src.accent : d.accent,
    font: normalizeFontId(src.font, d.font),
    uppercase: typeof src.uppercase === "boolean" ? src.uppercase : d.uppercase,
    headerRule: typeof src.headerRule === "boolean" ? src.headerRule : d.headerRule,
  }
  for (const key of Object.keys(OPTIONS)) design[key] = pick(src[key], ids(key), d[key])
  for (const [key, range] of Object.entries(RANGES)) design[key] = clamp(src[key], range, d[key])
  return design
}
