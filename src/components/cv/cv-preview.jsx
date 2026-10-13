"use client"

import { useEffect, useRef, useState } from "react"
import { CvDocument } from "@/components/cv/cv-document"
import { measurePages, samePages } from "@/lib/cv-pages"

// Badge and line sizes are in screen pixels: the sheet is scaled down to fit, so they are divided by
// the scale (--s) to stay readable. The badges sit in the page margin, clear of the text.
const BADGE = "pointer-events-none absolute right-[1.2mm] rounded-full bg-brand font-semibold leading-none text-brand-foreground"
const badgeSize = (top) => ({ top, fontSize: "calc(10px / var(--s))", padding: "calc(3px / var(--s)) calc(6px / var(--s))" })

// Dashed lines where the printed pages break, each with the number of the page that starts there.
function PageGuides({ breaks }) {
  return (
    <>
      <span aria-hidden className={BADGE} style={badgeSize("calc(6px / var(--s))")}>
        P1
      </span>
      {breaks.map((y, index) => (
        <div
          key={index}
          data-page-guide={index + 2}
          title={`Page ${index + 2} starts here`}
          className="pointer-events-none absolute inset-x-0 z-10"
          style={{ top: y, borderTop: "calc(1.5px / var(--s)) dashed var(--brand)" }}
        >
          <span aria-hidden className={BADGE} style={badgeSize("calc(3px / var(--s))")}>
            P{index + 2}
          </span>
        </div>
      ))}
    </>
  )
}

// The CV as it will print, scaled to fit, with the page breaks marked. `onPageCount` reports how many
// pages it takes.
export function CvPreview({ cv, scale, onPageCount }) {
  const sheetRef = useRef(null)
  const [height, setHeight] = useState(1123)
  const [pages, setPages] = useState({ count: 1, breaks: [] })

  // Measured shortly after every change (and when the sheet resizes, e.g. a web font arrives).
  useEffect(() => {
    const sheet = sheetRef.current
    const paper = sheet.querySelector(".cv-paper")
    let timer
    const measure = () => {
      const next = measurePages(paper, cv.design.margin)
      if (next) setPages((prev) => (samePages(prev, next) ? prev : next))
    }
    const schedule = () => {
      clearTimeout(timer)
      timer = setTimeout(measure, 120)
    }
    const observer = new ResizeObserver(() => {
      setHeight(sheet.offsetHeight)
      schedule()
    })
    observer.observe(sheet)
    schedule()
    document.fonts?.ready.then(schedule)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [cv])

  useEffect(() => onPageCount?.(pages.count), [pages.count, onPageCount])

  return (
    <div className="mx-auto" style={{ width: `calc(210mm * ${scale})`, height: height * scale }} data-page-count={pages.count}>
      <div
        ref={sheetRef}
        className="relative origin-top-left shadow-[0_12px_40px_-12px_rgba(30,50,110,0.35),0_0_0_1px_rgba(23,33,58,0.05)]"
        style={{ width: "210mm", transform: `scale(${scale})`, "--s": scale }}
      >
        <CvDocument cv={cv} />
        <PageGuides breaks={pages.breaks} />
      </div>
    </div>
  )
}
