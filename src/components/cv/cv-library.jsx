"use client"

import { useEffect, useRef, useState } from "react"
import { ClipboardCopy, ClipboardPaste, Copy, Download, FilePlus2, FileUp, Printer, Sparkles, Trash2 } from "lucide-react"
import { CvDocument } from "@/components/cv/cv-document"
import { IconButton } from "@/components/cv/cv-controls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { TEMPLATES, isPresetActive } from "@/lib/cv-design"
import { cn } from "@/lib/utils"

const THUMB_ZOOM = 0.16

function DocCard({ doc, active, canDelete, onOpen, onRename, onDuplicate, onDelete, onJson, onPdf }) {
  const look = TEMPLATES.find((template) => isPresetActive(doc.cv.design, template.preset))?.name ?? "Custom design"
  const updated = new Date(doc.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })

  return (
    <div className={cn("flex gap-3 rounded-2xl border bg-card p-3", active && "border-brand bg-brand-soft/40")}>
      <button type="button" onClick={onOpen} aria-label={`Open ${doc.name}`} className="shrink-0 self-start">
        <div
          inert
          aria-hidden
          className="pointer-events-none overflow-hidden rounded-[3px] bg-white shadow-[0_2px_10px_-2px_rgba(23,33,58,0.25),0_0_0_1px_rgba(23,33,58,0.06)]"
          style={{ width: `${210 * THUMB_ZOOM}mm`, height: `${297 * THUMB_ZOOM}mm` }}
        >
          <div style={{ zoom: THUMB_ZOOM }}>
            <CvDocument cv={doc.cv} links={false} />
          </div>
        </div>
      </button>

      <div className="grid min-w-0 flex-1 content-start gap-1.5">
        <Input
          aria-label="CV name"
          value={doc.name}
          maxLength={60}
          onChange={(event) => onRename(event.target.value)}
          onBlur={() => !doc.name.trim() && onRename("Untitled CV")}
          className="h-8 text-sm font-medium"
        />
        <p className="text-xs text-muted-foreground">
          {look}
          <br />
          {updated}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-0.5">
          {active ? (
            <span className="mr-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-ink">Editing</span>
          ) : (
            <Button variant="secondary" size="sm" className="mr-1" onClick={onOpen}>
              Open
            </Button>
          )}
          <IconButton label="Download PDF" onClick={onPdf}>
            <Printer className="size-4" />
          </IconButton>
          <IconButton label="Download JSON" onClick={onJson}>
            <Download className="size-4" />
          </IconButton>
          <IconButton label="Duplicate" onClick={onDuplicate}>
            <Copy className="size-4" />
          </IconButton>
          <IconButton label="Delete" disabled={!canDelete} onClick={onDelete}>
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

// CVs live in this browser only. This moves them to another one through the clipboard (or a file).
function TransferPanel({ actions }) {
  const [pasteOpen, setPasteOpen] = useState(false)
  const [text, setText] = useState("")
  const [replace, setReplace] = useState(false)
  const [manual, setManual] = useState(null) // the text to copy by hand when the clipboard is blocked
  const [status, setStatus] = useState(null) // { ok, message }
  const importInput = useRef(null)
  const manualBox = useRef(null)

  useEffect(() => {
    if (manual) manualBox.current?.select()
  }, [manual])

  const copy = async () => {
    setPasteOpen(false)
    const result = await actions.copyAll()
    if (result.ok) {
      setManual(null)
      setStatus({
        ok: true,
        message: `Copied ${result.count} CV${result.count > 1 ? "s" : ""}. In the other browser open this page, then My CVs, Paste to import.`,
      })
    } else {
      setManual(result.text)
      setStatus({ ok: false, message: "The browser blocked clipboard access. Select the text below and copy it yourself." })
    }
  }

  const runImport = () => {
    const result = actions.importText(text, { replace })
    setStatus(result)
    if (result.ok) {
      setText("")
      setPasteOpen(false)
    }
  }

  return (
    <div className="grid gap-2.5 rounded-2xl border p-3">
      <div>
        <p className="text-sm font-medium">Move to another browser</p>
        <p className="text-xs text-muted-foreground">Copy all your CVs here, then paste them in the other browser to keep working.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={copy}>
          <ClipboardCopy /> Copy all CVs
        </Button>
        <Button
          variant="secondary"
          size="sm"
          aria-expanded={pasteOpen}
          onClick={() => {
            setPasteOpen((open) => !open)
            setManual(null)
          }}
        >
          <ClipboardPaste /> Paste to import
        </Button>
        <Button variant="ghost" size="sm" onClick={actions.downloadAll}>
          <Download /> Download file
        </Button>
        <Button variant="ghost" size="sm" onClick={() => importInput.current?.click()}>
          <FileUp /> Import file
        </Button>
        <input
          ref={importInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (file) actions.importFile(file)
          }}
        />
      </div>

      {manual && <Textarea ref={manualBox} readOnly rows={4} aria-label="CV data to copy" value={manual} className="font-mono text-xs" />}

      {pasteOpen && (
        <div className="grid gap-2">
          <Textarea
            rows={5}
            aria-label="Pasted CV data"
            placeholder="Paste the copied CV data here (Ctrl+V)"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="font-mono text-xs"
          />
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={replace} onChange={(event) => setReplace(event.target.checked)} className="size-4 accent-brand" />
            Replace the CVs in this browser (otherwise they are added to them)
          </label>
          <Button size="sm" className="justify-self-start" disabled={!text.trim()} onClick={runImport}>
            Import
          </Button>
        </div>
      )}

      {status && (
        <p role="status" className={cn("text-xs", status.ok ? "text-emerald-700" : "text-destructive")}>
          {status.message}
        </p>
      )}
    </div>
  )
}

// Drawer listing every CV saved in this browser. Each one keeps its own content and design.
export function CvLibrary({ open, onOpenChange, docs, activeId, actions }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* The drawer is rendered in a portal, outside the page's .cv-app, so it sets the light theme itself. */}
      <SheetContent side="left" className="cv-app w-full gap-0 sm:max-w-lg print:hidden">
        <SheetHeader className="pr-12">
          <SheetTitle className="text-lg">My CVs</SheetTitle>
          <SheetDescription>Saved in this browser only. Each CV keeps its own template and design.</SheetDescription>
        </SheetHeader>

        <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={actions.newBlank}>
              <FilePlus2 /> New blank
            </Button>
            <Button variant="secondary" size="sm" onClick={actions.newSample}>
              <Sparkles /> New from sample
            </Button>
          </div>
          <TransferPanel actions={actions} />
          {docs.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              active={doc.id === activeId}
              canDelete={docs.length > 1}
              onOpen={() => actions.open(doc.id)}
              onRename={(name) => actions.rename(doc.id, name)}
              onDuplicate={() => actions.duplicate(doc.id)}
              onDelete={() => actions.remove(doc.id)}
              onJson={() => actions.downloadJson(doc.id)}
              onPdf={() => actions.downloadPdf(doc.id)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
