export const stripProtocol = (url) => url.trim().replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "")

// Turn user-typed text into a link target. Anything with a scheme other than
// http(s)/mailto/tel (e.g. javascript:) is dropped, since imported JSON is untrusted.
export function toHref(value) {
  const text = typeof value === "string" ? value.trim() : ""
  if (!text) return null
  if (/^(https?:|mailto:|tel:)/i.test(text)) return text
  if (/^[a-z][a-z0-9+.-]*:/i.test(text)) return null
  return `https://${text}`
}
