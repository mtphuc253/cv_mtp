import { toHref } from "@/lib/cv-url"

// Rich text for descriptions and summaries. It is stored as a small HTML subset (what the
// editor produces): paragraphs, bold / italic / underline, bullet and numbered lists, links.
// Stored data can come from an imported file, so every string is passed through
// `sanitizeRich` before it is rendered: it rebuilds the markup from an allow-list and never
// copies an attribute other than a checked `href`. It uses no DOM, so it also runs on the server.

const ALLOWED = new Set(["p", "br", "strong", "em", "u", "ul", "ol", "li", "a"])
const ALIAS = { b: "strong", i: "em" }

// A whole tag: name, attributes (quoted values may contain ">"), optional self-closing slash.
const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g
const HREF = /\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i

const escapeText = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const escapeAttr = (text) => escapeText(text).replace(/"/g, "&quot;")

const decode = (text) =>
  text.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")

export function sanitizeRich(html) {
  if (typeof html !== "string" || !html) return ""
  let out = ""
  let last = 0
  // Text between tags is kept, but a "<" that is not part of an allowed tag becomes text.
  const text = (chunk) => (out += chunk.replace(/</g, "&lt;"))

  for (const match of html.matchAll(TAG)) {
    text(html.slice(last, match.index))
    last = match.index + match[0].length
    const [, slash, rawName, attrs] = match
    const name = ALIAS[rawName.toLowerCase()] ?? rawName.toLowerCase()
    if (!ALLOWED.has(name)) continue
    if (name === "br") {
      if (!slash) out += "<br>"
    } else if (slash) {
      out += `</${name}>`
    } else if (name === "a") {
      const found = HREF.exec(attrs)
      const href = found ? toHref(decode(found[1] ?? found[2] ?? found[3] ?? "")) : null
      if (href) out += `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">`
    } else {
      out += `<${name}>`
    }
  }
  text(html.slice(last))
  return out
}

// Nothing to show: no text left once the tags are gone.
export const isRichEmpty = (html) => typeof html !== "string" || html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === ""

const isRich = (text) => /^\s*<(p|ul|ol)[\s>]/i.test(text)

const textLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim().replace(/^[-•*]\s+/, ""))
    .filter(Boolean)

// Plain text from the first versions of the builder: one bullet per line...
export const bulletsToRich = (text) => {
  const lines = textLines(text)
  return lines.length ? `<ul>${lines.map((line) => `<li><p>${escapeText(line)}</p></li>`).join("")}</ul>` : ""
}

// ...or, for a summary, one paragraph per line.
export const paragraphsToRich = (text) =>
  textLines(text)
    .map((line) => `<p>${escapeText(line)}</p>`)
    .join("")

// Any stored value in, clean rich text out. `fromPlain` says how old plain text maps to rich text.
export const toRich = (value, fromPlain) => {
  const text = typeof value === "string" ? value : ""
  return isRich(text) ? sanitizeRich(text) : fromPlain(text)
}

export const techLine = (tech) => (tech.trim() ? `<p><strong>Tech:</strong> ${escapeText(tech.trim())}</p>` : "")
