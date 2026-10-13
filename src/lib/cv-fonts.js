// Fonts for the CV. Every Google font below was checked against the Google Fonts API and
// ships a Vietnamese subset (Poppins, Lato, DM Sans, Figtree, Outfit... do not, so they are
// left out). Any other family can be used through the "custom Google Font" field.

const slug = (name) => name.toLowerCase().replace(/ /g, "-")

const google = (name, fallback) => ({ id: slug(name), name, google: name, stack: `'${name}', ${fallback}` })

const SANS = "system-ui, sans-serif"
const SERIF = "Georgia, serif"
const MONO = "ui-monospace, monospace"

export const FONT_GROUPS = [
  {
    label: "Sans serif",
    fonts: [
      "Inter", "Roboto", "Open Sans", "Noto Sans", "Source Sans 3", "Be Vietnam Pro", "Plus Jakarta Sans",
      "Montserrat", "Nunito Sans", "Mulish", "Raleway", "Work Sans", "Manrope", "Lexend", "Public Sans",
      "IBM Plex Sans", "Fira Sans", "Barlow", "Libre Franklin", "Hanken Grotesk", "Josefin Sans", "Quicksand",
      "Space Grotesk",
    ].map((name) => google(name, SANS)),
  },
  {
    label: "Serif",
    fonts: [
      "Lora", "Merriweather", "Playfair Display", "Noto Serif", "Source Serif 4", "Crimson Pro", "EB Garamond",
      "Cormorant Garamond", "Bitter", "Roboto Slab", "Spectral", "IBM Plex Serif", "Newsreader", "Gelasio",
      "Fraunces", "Literata", "Alegreya", "Vollkorn",
    ].map((name) => google(name, SERIF)),
  },
  {
    label: "Monospace",
    fonts: ["JetBrains Mono", "IBM Plex Mono", "Space Mono", "Roboto Mono", "Source Code Pro"].map((name) => google(name, MONO)),
  },
  {
    label: "System (no download)",
    fonts: [
      { id: "georgia", name: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
      { id: "times", name: "Times New Roman", stack: "'Times New Roman', Times, serif" },
      { id: "arial", name: "Arial", stack: "Arial, Helvetica, sans-serif" },
    ],
  },
]

export const FONTS = FONT_GROUPS.flatMap((group) => group.fonts)

// Ids used by the first version of the builder.
const LEGACY_IDS = { "be-vietnam": "be-vietnam-pro", "source-sans": "source-sans-3" }

// A custom font is stored as "g:Family Name". The pattern keeps the value safe to put in a URL and CSS.
const CUSTOM = /^g:([A-Za-z0-9][A-Za-z0-9 ]{1,39})$/

export const customFontId = (family) => `g:${family.trim().replace(/\s+/g, " ")}`
export const isCustomFontId = (id) => CUSTOM.test(id)
export const customFamily = (id) => CUSTOM.exec(id)?.[1] ?? null

export function normalizeFontId(id, fallback) {
  const resolved = LEGACY_IDS[id] ?? id
  return FONTS.some((font) => font.id === resolved) || isCustomFontId(resolved) ? resolved : fallback
}

export function fontStack(id) {
  const family = customFamily(id)
  if (family) return `'${family}', ${SANS}`
  return (FONTS.find((font) => font.id === id) ?? FONTS[0]).stack
}

// The Google family behind a font id, or null for system fonts.
export const googleFamily = (id) => customFamily(id) ?? FONTS.find((font) => font.id === id)?.google ?? null

const requests = new Map()

// Injects the stylesheet for a Google family once. Resolves true when it loaded. Single-weight
// families reject the 4-weight request, so it falls back to fewer weights (and then to none).
export function loadGoogleFont(family) {
  if (requests.has(family)) return requests.get(family)

  const specs = [":wght@400;500;600;700", ":wght@400;700", ""]
  const request = new Promise((resolve) => {
    const attempt = (index) => {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}${specs[index]}&display=swap`
      link.onload = () => resolve(true)
      link.onerror = () => {
        link.remove()
        if (index + 1 < specs.length) attempt(index + 1)
        else resolve(false)
      }
      document.head.append(link)
    }
    attempt(0)
  })
  requests.set(family, request)
  return request
}

// Resolves once the font used by `id` is ready to paint (used before printing to PDF).
export async function ensureFont(id) {
  const family = googleFamily(id)
  if (family) await loadGoogleFont(family)
  const stack = fontStack(id)
  await Promise.all(["400", "600", "700"].map((weight) => document.fonts?.load(`${weight} 1em ${stack}`).catch(() => [])))
  await document.fonts?.ready
}
