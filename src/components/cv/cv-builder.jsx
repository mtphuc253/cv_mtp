"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Check, CopyPlus, Download, Eye, FileText, FolderOpen, PencilLine } from "lucide-react"
import { CvDocument } from "@/components/cv/cv-document"
import { CvEditor } from "@/components/cv/cv-editor"
import { CvLibrary } from "@/components/cv/cv-library"
import { blankCv, emptyContent, normalizeCv, sampleCv } from "@/lib/cv-data"
import { ensureFont } from "@/lib/cv-fonts"
import {
  downloadText,
  fileSlug,
  loadLibrary,
  newDoc,
  parseImport,
  saveLibrary,
  serializeDoc,
  serializeLibrary,
  suggestName,
  uniqueName,
} from "@/lib/cv-library"
import { cn } from "@/lib/utils"
import "./cv.css"

// 210mm at 96dpi. The preview is zoomed down from this to fit its column.
const PAPER_PX = 794

export function CvBuilder() {
  const [library, setLibrary] = useState(() => {
    const doc = newDoc("My CV", sampleCv())
    return { docs: [doc], activeId: doc.id }
  })
  const [ready, setReady] = useState(false)
  const [view, setView] = useState("edit")
  const [scale, setScale] = useState(0.7)
  const [notice, setNotice] = useState("")
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [printRequest, setPrintRequest] = useState(0)
  const previewRef = useRef(null)
  const noticeTimer = useRef(null)

  const { docs, activeId } = library
  const active = docs.find((doc) => doc.id === activeId) ?? docs[0]
  const cv = active.cv

  // The editor works on "the current CV": it passes either a new CV or an updater.
  const setCv = useCallback(
    (update) =>
      setLibrary((lib) => ({
        ...lib,
        docs: lib.docs.map((doc) =>
          doc.id === lib.activeId ? { ...doc, cv: typeof update === "function" ? update(doc.cv) : update, updatedAt: Date.now() } : doc,
        ),
      })),
    [],
  )

  // Load once on mount (not in the initial state, so SSR and hydration match).
  useEffect(() => {
    const saved = loadLibrary()
    if (saved) setLibrary(saved)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => saveLibrary(docs, activeId), 300)
    return () => clearTimeout(timer)
  }, [docs, activeId, ready])

  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      if (width > 0) setScale(Math.min(1, width / PAPER_PX))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => clearTimeout(noticeTimer.current), [])

  const flash = (message) => {
    setNotice(message)
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(""), 4000)
  }

  // The browser uses document.title as the default PDF file name.
  const printPdf = async () => {
    // Web fonts must be ready, or the PDF would be rendered in the fallback font.
    await ensureFont(cv.design.font)
    const previous = document.title
    document.title = `${cv.basics.name || active.name || "CV"} - CV`
    window.addEventListener("afterprint", () => (document.title = previous), { once: true })
    window.print()
  }

  // "Download PDF" on a card: switch to that CV, wait for the drawer to close, then print.
  // The effect runs after the switch has rendered, so printPdf sees the right CV.
  useEffect(() => {
    if (printRequest) printPdf()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only a new request should print
  }, [printRequest])

  const addDocs = (added, message) => {
    setLibrary((lib) => ({ docs: [...lib.docs, ...added], activeId: added[0].id }))
    if (message) flash(message)
  }

  // Shared by file import and "paste to import". `replace` swaps the whole library for the
  // imported CVs (what you want on a fresh browser); otherwise they are added to it.
  const importText = (text, { replace = false, source = "pasted text" } = {}) => {
    try {
      const imported = parseImport(text)
      if (replace) {
        if (!window.confirm(`Replace all ${docs.length} CV${docs.length > 1 ? "s" : ""} in this browser with the ${imported.length} imported?`)) {
          return { ok: false, message: "Cancelled. Nothing was changed." }
        }
        setLibrary({ docs: imported, activeId: imported[0].id })
      } else {
        // Same name as one already here ("Alex Nguyen" again)? Number it so the two stay apart.
        const taken = [...docs]
        addDocs(
          imported.map((doc) => {
            const named = { ...doc, name: uniqueName(taken, doc.name) }
            taken.push(named)
            return named
          }),
        )
      }
      const message = `Imported ${imported.length} CV${imported.length > 1 ? "s" : ""} from ${source}.`
      flash(message)
      return { ok: true, message }
    } catch {
      return { ok: false, message: "That isn't CV data exported from this builder." }
    }
  }

  // New CVs start with the current design, so a second version only needs its content changed.
  const libraryActions = {
    open: (id) => {
      setLibrary((lib) => ({ ...lib, activeId: id }))
      setLibraryOpen(false)
    },
    newBlank: () => {
      const blank = { ...blankCv(), design: cv.design, sections: cv.sections, content: emptyContent(cv.sections) }
      addDocs([newDoc(suggestName(docs), blank)])
      setLibraryOpen(false)
    },
    newSample: () => {
      addDocs([newDoc(suggestName(docs), { ...sampleCv(), design: cv.design })])
      setLibraryOpen(false)
    },
    duplicate: (id) => {
      const source = docs.find((doc) => doc.id === id)
      addDocs([newDoc(uniqueName(docs, `${source.name} copy`.slice(0, 55)), normalizeCv(source.cv))], `Duplicated “${source.name}”`)
    },
    // Keeps the current CV as it is and continues in a new copy, e.g. one CV per job application.
    saveAsNew: () => {
      const name = uniqueName(docs, `${active.name} copy`.slice(0, 55))
      addDocs([newDoc(name, normalizeCv(cv))], `Saved as “${name}”`)
      setLibraryOpen(true)
    },
    rename: (id, name) => setLibrary((lib) => ({ ...lib, docs: lib.docs.map((doc) => (doc.id === id ? { ...doc, name } : doc)) })),
    remove: (id) => {
      const doc = docs.find((d) => d.id === id)
      if (docs.length < 2 || !window.confirm(`Delete “${doc.name}”? This can't be undone.`)) return
      setLibrary((lib) => {
        const remaining = lib.docs.filter((d) => d.id !== id)
        return { docs: remaining, activeId: lib.activeId === id ? remaining[0].id : lib.activeId }
      })
    },
    downloadJson: (id) => {
      const doc = docs.find((d) => d.id === id)
      downloadText(`${fileSlug(doc.name)}.json`, serializeDoc(doc))
    },
    downloadAll: () => downloadText("cv-builder-all.json", serializeLibrary(docs)),
    downloadPdf: (id) => {
      setLibrary((lib) => ({ ...lib, activeId: id }))
      setLibraryOpen(false)
      setTimeout(() => setPrintRequest((n) => n + 1), 450)
    },
    // Copies every CV as one line of text. Where the clipboard is blocked the caller gets the
    // text back so it can be shown for a manual copy.
    copyAll: async () => {
      const text = serializeLibrary(docs, 0)
      try {
        await navigator.clipboard.writeText(text)
        return { ok: true, text, count: docs.length }
      } catch {
        return { ok: false, text, count: docs.length }
      }
    },
    importText,
    importFile: async (file) => {
      const result = importText(await file.text(), { source: file.name })
      if (result.ok) setLibraryOpen(false)
      else flash(result.message)
    },
  }

  return (
    <>
      <div className={cn("flex h-dvh flex-col bg-background transition-opacity print:hidden", !ready && "opacity-0")}>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3 sm:px-4">
          <FileText className="size-5 text-[#a8c7fa]" />
          <h1 className="text-[17px] font-medium tracking-tight">CV Builder</h1>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            title="All your saved CVs"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-3.5 text-sm transition-colors hover:bg-accent"
          >
            <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
            <span className="hidden sm:inline">My CVs</span>
            <span className="rounded-full bg-white/10 px-1.5 text-xs text-muted-foreground">{docs.length}</span>
          </button>
          <button
            type="button"
            onClick={libraryActions.saveAsNew}
            title="Keep this CV and continue in a new copy"
            className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <CopyPlus className="size-4 shrink-0" />
            <span className="hidden md:inline">Save as new</span>
          </button>
          <p aria-live="polite" className="hidden min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground lg:flex">
            <Check className="size-3.5 shrink-0" />
            <span className="truncate">{notice || `Editing “${active.name}” · autosaved`}</span>
          </p>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-full bg-secondary p-0.5 lg:hidden" role="tablist">
              {[
                { id: "edit", label: "Edit", icon: PencilLine },
                { id: "preview", label: "Preview", icon: Eye },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={view === id}
                  onClick={() => setView(id)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm transition-colors",
                    view === id ? "bg-[#a8c7fa]/20 text-[#d3e3fd]" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={printPdf}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#004a77] px-4 text-sm font-medium text-[#c2e7ff] transition-colors hover:bg-[#005a92] sm:px-5"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <motion.aside
            layoutScroll
            className={cn(
              "min-h-0 w-full shrink-0 overflow-y-auto p-3 sm:p-4 lg:block lg:w-[460px] lg:border-r",
              view === "edit" ? "block" : "hidden",
            )}
          >
            <CvEditor
              cv={cv}
              setCv={setCv}
              onExport={() => libraryActions.downloadJson(active.id)}
              onImport={libraryActions.importFile}
              onOpenLibrary={() => setLibraryOpen(true)}
            />
            <p className="px-1 pt-4 text-[11px] leading-relaxed text-muted-foreground/70">
              Tip: in the print dialog choose &ldquo;Save as PDF&rdquo; and turn off &ldquo;Headers and footers&rdquo;.
            </p>
          </motion.aside>

          <main
            ref={previewRef}
            className={cn("min-h-0 min-w-0 flex-1 overflow-auto bg-[#1b1b1c] p-4 sm:p-6", view === "preview" ? "block" : "hidden", "lg:block")}
          >
            <div className="mx-auto shadow-[0_8px_40px_rgba(0,0,0,0.5)]" style={{ width: "210mm", zoom: scale }}>
              <CvDocument cv={cv} />
            </div>
          </main>
        </div>

        <CvLibrary open={libraryOpen} onOpenChange={setLibraryOpen} docs={docs} activeId={active.id} actions={libraryActions} />
      </div>

      {/* Printing uses its own copy: the screen layout scrolls and is scaled, which would clip pages. */}
      <div className="cv-print hidden print:block">
        {/* @page can't use CSS variables, so the margin is injected here. */}
        <style>{`@page { size: A4; margin: ${cv.design.margin}mm; }`}</style>
        <CvDocument cv={cv} />
      </div>
    </>
  )
}
