// Where the printed pages end. The browser's own page breaking does the work, so every rule of the
// print layout applies (no break inside a list item, no heading left alone at the bottom of a page,
// orphans and widows). The sheet is cloned into a hidden box that is one page's content area tall and
// flows into columns, one column per page. Each text line of the clone is matched with the same line
// of the live sheet (same width and fonts, so the same wrapping), which turns "this line is on page 2"
// into a position on the preview.

const MM = 96 / 25.4

export const A4 = { width: 210, height: 297 } // mm

// Every line of text under `root`, one list per text node, in document order. A line is its line box
// (the CSS line-height, centred on the text), not the taller glyph box, so neighbouring lines touch
// instead of overlapping. `factor` is the scale the root is shown at.
function textLines(root, factor) {
  const lines = []
  const range = document.createRange()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.nodeValue.trim()) continue
    const lineHeight = parseFloat(getComputedStyle(node.parentElement).lineHeight)
    range.selectNodeContents(node)
    lines.push(
      [...range.getClientRects()]
        .filter((rect) => rect.width > 0 && rect.height > 0)
        .map((rect) => {
          const middle = (rect.top + rect.bottom) / 2
          const half = Number.isFinite(lineHeight) ? (lineHeight * factor) / 2 : rect.height / 2
          return { left: rect.left, width: rect.width, top: middle - half, bottom: middle + half }
        }),
    )
  }
  return lines
}

// `sheet` is the live .cv-paper element (it may be scaled with a transform). Returns the number of
// pages and the y of each page break in the sheet's own pixels (unscaled), or null while it is hidden.
export function measurePages(sheet, marginMm) {
  if (!sheet.offsetWidth) return null

  const scale = sheet.getBoundingClientRect().width / sheet.offsetWidth
  const columnWidth = (A4.width - 2 * marginMm) * MM
  const columnHeight = (A4.height - 2 * marginMm) * MM
  const gap = 64

  const box = document.createElement("div")
  box.className = "cv-measure"
  Object.assign(box.style, {
    position: "absolute",
    left: "-100000px",
    top: "0",
    width: `${columnWidth}px`,
    height: `${columnHeight}px`,
    columnWidth: `${columnWidth}px`,
    columnGap: `${gap}px`,
    columnFill: "auto",
    visibility: "hidden",
    pointerEvents: "none",
  })
  const copy = sheet.cloneNode(true)
  box.append(copy)
  document.body.append(box)

  try {
    const live = textLines(sheet, scale)
    const cloned = textLines(copy, 1)
    const origin = sheet.getBoundingClientRect().top
    const left = box.getBoundingClientRect().left

    // Top and bottom of the text on each page, in sheet pixels.
    const pages = []
    for (let i = 0; i < Math.min(live.length, cloned.length); i++) {
      for (let j = 0; j < Math.min(live[i].length, cloned[i].length); j++) {
        const rect = cloned[i][j]
        const page = Math.max(0, Math.floor((rect.left + rect.width / 2 - left) / (columnWidth + gap)))
        const top = (live[i][j].top - origin) / scale
        const bottom = (live[i][j].bottom - origin) / scale
        const entry = pages[page]
        if (entry) {
          entry.top = Math.min(entry.top, top)
          entry.bottom = Math.max(entry.bottom, bottom)
        } else pages[page] = { top, bottom }
      }
    }

    const used = pages.filter(Boolean)
    // The break sits in the white space between the last line of one page and the first of the next.
    const breaks = used.slice(1).map((page, index) => {
      const above = used[index].bottom
      return above < page.top ? (above + page.top) / 2 : page.top
    })
    return { count: Math.max(1, used.length), breaks }
  } finally {
    box.remove()
  }
}

export const samePages = (a, b) => a.count === b.count && a.breaks.length === b.breaks.length && a.breaks.every((y, i) => Math.abs(y - b.breaks[i]) < 0.5)
