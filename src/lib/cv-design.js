import { normalizeFontId } from "@/lib/cv-fonts"

// Design settings of the CV builder: presets, ranges and the normalizer that keeps
// imported / stored values inside safe bounds.

// The first one is the default. Any other colour can be set with the RGB picker.
export const ACCENTS = ["#4b5563", "#1e3a5f", "#2563eb", "#0d9488", "#7c3aed", "#be185d", "#b45309"]

const HEX = /^#[0-9a-f]{6}$/i

export const isHex = (value) => HEX.test(String(value))

export const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

export const rgbToHex = (rgb) => `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`

// Numeric settings: one source for the sliders and for clamping stored values.
export const RANGES = {
  fontSize: { label: "Font size", min: 8, max: 12, step: 0.5, unit: "pt" },
  lineHeight: { label: "Line height", min: 1.05, max: 1.8, step: 0.05, unit: "" },
  margin: { label: "Page margin", min: 8, max: 25, step: 1, unit: "mm" },
  sectionGap: { label: "Gap between sections", min: 4, max: 24, step: 1, unit: "pt" },
  entryGap: { label: "Gap between entries", min: 2, max: 16, step: 1, unit: "pt" },
  sidebarWidth: { label: "Sidebar width", min: 45, max: 80, step: 1, unit: "mm" },
  bulletIndent: { label: "Bullet indent", min: 0.8, max: 2.4, step: 0.05, unit: "em" },
  bulletGap: { label: "Space between bullets", min: 0, max: 0.6, step: 0.05, unit: "em" },
  // How much bigger than the text the job title and organisation are in an entry header (0 gives the classic size).
  entryBoost: { label: "Title & company: bigger than text by", min: 0, max: 8, step: 0.5, unit: "px" },
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
    { id: "thick", label: "Thick rule" },
    { id: "pill", label: "Pill" },
    { id: "box", label: "Box" },
    { id: "rule", label: "Accent rule" },
  ],
  headerStyle: [
    { id: "plain", label: "Plain" },
    { id: "band", label: "Banner" },
    { id: "split", label: "Split" },
    { id: "stripe", label: "Stripe" },
    { id: "inline", label: "Inline" },
  ],
  entryHeader: [
    { id: "stacked", label: "Stacked" },
    { id: "inline", label: "Inline" },
  ],
  contactStyle: [
    { id: "pipes", label: "Separators" },
    { id: "icons", label: "Icons" },
  ],
  inkStyle: [
    { id: "soft", label: "Soft" },
    { id: "black", label: "Black" },
  ],
  listStyle: [
    { id: "bullets", label: "Bullets" },
    { id: "columns", label: "Columns" },
  ],
  nameStyle: [
    { id: "bold", label: "Bold" },
    { id: "caps", label: "Caps" },
    { id: "refined", label: "Refined" },
  ],
  entryStyle: [
    { id: "plain", label: "Plain" },
    { id: "timeline", label: "Timeline" },
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
    { id: "outline", label: "Outline" },
    { id: "columns", label: "Columns" },
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
    { id: "dark", label: "Dark" },
    { id: "line", label: "Divider" },
  ],
  sidebarSide: [
    { id: "left", label: "Left" },
    { id: "right", label: "Right" },
  ],
}

// Everything a template controls. Photo shape is personal and stays out; the accent colour does too,
// unless a template carries its own `accent` (it is applied when the template is picked).
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
  nameStyle: "bold",
  entryStyle: "plain",
  entryHeader: "stacked",
  entryBoost: 4,
  contactStyle: "pipes",
  inkStyle: "soft",
  linkColor: "",
  sectionLayout: "stacked",
  skillStyle: "lines",
  listStyle: "bullets",
  bulletStyle: "disc",
  bulletIndent: 1.4,
  bulletGap: 0.2,
  sidebarStyle: "tint",
  sidebarSide: "left",
  sidebarWidth: 60,
}

export const DEFAULT_DESIGN = { accent: ACCENTS[0], photoShape: "circle", entryUppercase: false, ...LOOK }

const look = (overrides) => ({ ...LOOK, ...overrides })

// The looks follow layout families that are common across resume builders and open-source
// resume themes, not any one product's templates: the classic Harvard-style one-pager,
// sb2nov's full-width rules, moderncv's titles in the left column, Reactive Resume-style
// banner and sidebar layouts, timeline and dark-sidebar designs, and the usual ATS advice
// (one column is the safest). Each one is just a bundle of the options above.
export const TEMPLATES = [
  {
    id: "signature",
    name: "Signature",
    hint: "Compact one-pager: navy name with the job title beside it, icon contact row, ruled headings, 4-column skills.",
    accent: "#033753",
    preset: look({
      font: "source-sans-3",
      fontSize: 9.25,
      lineHeight: 1.08,
      margin: 10,
      sectionGap: 8.25,
      entryGap: 5,
      headerStyle: "inline",
      headerRule: false,
      contactStyle: "icons",
      linkColor: "#0939aa",
      headingStyle: "rule",
      uppercase: true,
      entryHeader: "inline",
      skillStyle: "columns",
      listStyle: "columns",
      bulletIndent: 0.85,
      bulletGap: 0,
      inkStyle: "black",
    }),
  },
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
  {
    id: "harvard",
    name: "Harvard",
    hint: "Traditional serif one-pager with a caps name, for conservative fields.",
    preset: look({
      font: "times",
      nameStyle: "caps",
      headerAlign: "center",
      headerRule: false,
      headingStyle: "line",
      fontSize: 10.5,
      lineHeight: 1.3,
      margin: 15,
      sectionGap: 9,
      entryGap: 6,
    }),
  },
  {
    id: "timeline",
    name: "Timeline",
    hint: "Experience on a vertical timeline with short rules under titles.",
    preset: look({ font: "manrope", entryStyle: "timeline", headingStyle: "short", headerRule: false, sectionGap: 13, entryGap: 6 }),
  },
  {
    id: "pill",
    name: "Pill",
    hint: "Rounded filled section labels and tag-style skills.",
    preset: look({
      font: "hanken-grotesk",
      nameStyle: "refined",
      headingStyle: "pill",
      skillStyle: "tags",
      headerRule: false,
      lineHeight: 1.45,
      sectionGap: 13,
    }),
  },
  {
    id: "boxed",
    name: "Boxed",
    hint: "Centered caps name with outlined section titles.",
    preset: look({
      font: "ibm-plex-sans",
      nameStyle: "caps",
      headerAlign: "center",
      headerRule: false,
      headingStyle: "box",
      sectionGap: 12,
    }),
  },
  {
    id: "studio",
    name: "Studio",
    hint: "Large refined name with heavy rules under the titles.",
    preset: look({
      font: "work-sans",
      nameStyle: "refined",
      headingStyle: "thick",
      uppercase: false,
      headerRule: false,
      lineHeight: 1.5,
      sectionGap: 14,
      entryGap: 9,
    }),
  },
  {
    id: "stripe",
    name: "Stripe",
    hint: "A bold accent stripe across the top of the page.",
    preset: look({ font: "roboto", headerStyle: "stripe", headerRule: false, headingStyle: "accent-line", sectionGap: 12 }),
  },
  {
    id: "journal",
    name: "Journal",
    hint: "Editorial serif with a centered header and short rules.",
    preset: look({
      font: "source-serif-4",
      nameStyle: "refined",
      headerAlign: "center",
      headerRule: false,
      headingStyle: "short",
      uppercase: false,
      lineHeight: 1.45,
      sectionGap: 14,
      bulletStyle: "dash",
    }),
  },
  {
    id: "nordic",
    name: "Nordic",
    hint: "Calm and airy with outlined skill chips.",
    preset: look({
      font: "mulish",
      nameStyle: "refined",
      headingStyle: "plain",
      uppercase: false,
      skillStyle: "outline",
      bulletStyle: "dash",
      headerRule: false,
      lineHeight: 1.5,
      sectionGap: 15,
      entryGap: 10,
    }),
  },
  {
    id: "swiss",
    name: "Swiss",
    hint: "Grid-like: section titles sit in a left column.",
    preset: look({
      font: "barlow",
      nameStyle: "refined",
      headingStyle: "plain",
      sectionLayout: "side",
      headerRule: true,
      fontSize: 10,
      lineHeight: 1.4,
    }),
  },
  {
    id: "corporate",
    name: "Corporate",
    hint: "Accent banner with a caps name and filled section bars.",
    preset: look({
      font: "open-sans",
      nameStyle: "caps",
      headerStyle: "band",
      headerAlign: "center",
      headerRule: false,
      headingStyle: "filled",
      sectionGap: 12,
    }),
  },
  {
    id: "midnight",
    name: "Midnight",
    hint: "Two columns with a dark navy side panel.",
    preset: look({
      layout: "sidebar",
      sidebarStyle: "dark",
      font: "libre-franklin",
      nameStyle: "refined",
      headingStyle: "accent-line",
      headerRule: false,
    }),
  },
  {
    id: "atlas",
    name: "Atlas",
    hint: "Dark panel on the right, outlined skills.",
    preset: look({
      layout: "sidebar",
      sidebarStyle: "dark",
      sidebarSide: "right",
      font: "public-sans",
      headingStyle: "bar",
      skillStyle: "outline",
      headerRule: false,
      sidebarWidth: 56,
    }),
  },
  {
    id: "circuit",
    name: "Circuit",
    hint: "Tinted side panel with a timeline for experience.",
    preset: look({
      layout: "sidebar",
      sidebarStyle: "tint",
      entryStyle: "timeline",
      font: "fira-sans",
      headingStyle: "thick",
      headerRule: false,
      entryGap: 5,
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
    accent: isHex(src.accent) ? src.accent : d.accent,
    linkColor: isHex(src.linkColor) ? src.linkColor : "",
    font: normalizeFontId(src.font, d.font),
    uppercase: typeof src.uppercase === "boolean" ? src.uppercase : d.uppercase,
    entryUppercase: typeof src.entryUppercase === "boolean" ? src.entryUppercase : d.entryUppercase,
    headerRule: typeof src.headerRule === "boolean" ? src.headerRule : d.headerRule,
  }
  for (const key of Object.keys(OPTIONS)) design[key] = pick(src[key], ids(key), d[key])
  for (const [key, range] of Object.entries(RANGES)) design[key] = clamp(src[key], range, d[key])
  return design
}
