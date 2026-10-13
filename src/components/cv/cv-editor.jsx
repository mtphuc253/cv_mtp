"use client"

import { useRef, useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Download, FileUp, FolderOpen, ImagePlus, Plus, Trash2, X } from "lucide-react"
import { Field, IconButton, Panel, Segmented } from "@/components/cv/cv-controls"
import { AddSection, CvDesignPanels } from "@/components/cv/cv-design-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { withSection, withoutSection } from "@/lib/cv-data"
import { newItem, newSection } from "@/lib/cv-sections"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "content", label: "Content" },
  { id: "design", label: "Design" },
]

const BASIC_FIELDS = [
  { key: "name", label: "Full name", full: true },
  { key: "role", label: "Job title", full: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location", full: true },
  { key: "website", label: "Website", placeholder: "yoursite.com" },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/you" },
  { key: "github", label: "GitHub", placeholder: "github.com/you", full: true },
]

const BULLETS_HINT = "One bullet per line."

// How each kind of section is edited. `label` is the collapsed row's title.
const KIND_EDITORS = {
  entries: {
    noun: "entry",
    label: (item) => [item.title, item.company].filter(Boolean).join(" · "),
    fields: [
      { key: "title", label: "Title" },
      { key: "company", label: "Organization" },
      { key: "period", label: "Period", placeholder: "SEP 2024 — SEP 2025" },
      { key: "location", label: "Location" },
      { key: "bullets", label: "Highlights", type: "textarea", rows: 6, hint: BULLETS_HINT, full: true },
      { key: "tech", label: "Technologies", placeholder: "React, Node.js, PostgreSQL", full: true },
    ],
  },
  projects: {
    noun: "project",
    label: (item) => item.name,
    fields: [
      { key: "name", label: "Project name", full: true },
      { key: "role", label: "Your role" },
      { key: "link", label: "Link", placeholder: "github.com/you/project" },
      { key: "bullets", label: "Description", type: "textarea", rows: 5, hint: BULLETS_HINT, full: true },
      { key: "tech", label: "Technologies", placeholder: "Next.js, PostgreSQL", full: true },
    ],
  },
  education: {
    noun: "school",
    label: (item) => [item.degree, item.school].filter(Boolean).join(" · "),
    fields: [
      { key: "degree", label: "Degree", full: true },
      { key: "school", label: "School" },
      { key: "period", label: "Period", placeholder: "09/2021 - Present" },
      { key: "location", label: "Location", full: true },
      { key: "bullets", label: "Highlights", type: "textarea", rows: 3, hint: BULLETS_HINT, full: true },
    ],
  },
  skills: {
    noun: "row",
    label: (item) => item.title || item.items,
    fields: [
      { key: "title", label: "Label", placeholder: "Front-end", full: true },
      { key: "items", label: "Details", type: "textarea", rows: 2, hint: "Comma separated, or a short phrase (e.g. Fluent).", full: true },
    ],
  },
  list: {
    noun: "item",
    label: (item) => item.title,
    fields: [
      { key: "title", label: "Title", full: true },
      { key: "detail", label: "Details", placeholder: "Issuer, year", full: true },
    ],
  },
}

const PHOTO_SIZE = 320

// Center-crops to a square and downsizes so the photo fits comfortably in localStorage.
async function toSquareDataUrl(file) {
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = PHOTO_SIZE
  canvas
    .getContext("2d")
    .drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE)
  bitmap.close()
  return canvas.toDataURL("image/jpeg", 0.85)
}

function ItemFields({ config, item, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 border-t px-3 pb-3 pt-3">
      {config.fields.map((field) => (
        <Field key={field.key} label={field.label} hint={field.hint} className={field.full ? "col-span-2" : undefined}>
          {field.type === "textarea" ? (
            <Textarea rows={field.rows} value={item[field.key]} onChange={(event) => onChange(item.id, field.key, event.target.value)} />
          ) : (
            <Input value={item[field.key]} placeholder={field.placeholder} onChange={(event) => onChange(item.id, field.key, event.target.value)} />
          )}
        </Field>
      ))}
    </div>
  )
}

function ListSection({ title, config, items, defaultOpen, openIds, onToggle, onAdd, onChange, onRemove, onMove }) {
  return (
    <Panel title={title} count={items.length} defaultOpen={defaultOpen}>
      {items.map((item, index) => {
        const open = openIds.has(item.id)
        const label = config.label(item)
        return (
          <div key={item.id} className="rounded-xl border bg-secondary/40">
            <div className="flex items-center gap-0.5 p-1">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => onToggle(item.id)}
                className="flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-left text-sm"
              >
                <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
                <span className={cn("truncate", !label && "text-muted-foreground")}>{label || `New ${config.noun}`}</span>
              </button>
              <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(index, -1)}>
                <ArrowUp className="size-4" />
              </IconButton>
              <IconButton label="Move down" disabled={index === items.length - 1} onClick={() => onMove(index, 1)}>
                <ArrowDown className="size-4" />
              </IconButton>
              <IconButton label={`Delete ${config.noun}`} onClick={() => onRemove(item.id)}>
                <Trash2 className="size-4" />
              </IconButton>
            </div>
            {open && <ItemFields config={config} item={item} onChange={onChange} />}
          </div>
        )
      })}
      <Button variant="secondary" size="sm" className="justify-self-start" onClick={onAdd}>
        <Plus /> Add {config.noun}
      </Button>
    </Panel>
  )
}

export function CvEditor({ cv, setCv, onExport, onImport, onOpenLibrary }) {
  const [tab, setTab] = useState("content")
  const [openIds, setOpenIds] = useState(() => new Set())
  const [openSection, setOpenSection] = useState(null)
  const photoInput = useRef(null)
  const importInput = useRef(null)
  const { basics } = cv

  const setBasic = (key, value) => setCv((c) => ({ ...c, basics: { ...c.basics, [key]: value } }))

  const setContent = (sectionId, update) => setCv((c) => ({ ...c, content: { ...c.content, [sectionId]: update(c.content[sectionId]) } }))

  const changeItem = (sectionId) => (id, key, value) =>
    setContent(sectionId, (list) => list.map((item) => (item.id === id ? { ...item, [key]: value } : item)))

  const toggleItem = (id) =>
    setOpenIds((ids) => {
      const next = new Set(ids)
      if (!next.delete(id)) next.add(id)
      return next
    })

  // A freshly added entry opens straight away so it can be filled in.
  const addItem = (section) => () => {
    const item = newItem(section.kind)
    setOpenIds((ids) => new Set(ids).add(item.id))
    setContent(section.id, (list) => [...list, item])
  }

  const removeItem = (sectionId) => (id) => setContent(sectionId, (list) => list.filter((item) => item.id !== id))

  const moveItem = (sectionId) => (index, direction) =>
    setContent(sectionId, (list) => {
      const target = index + direction
      if (target < 0 || target >= list.length) return list
      const next = [...list]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })

  const addSection = (preset) => {
    const section = newSection(preset)
    setOpenSection(section.id)
    setCv((c) => withSection(c, section, preset))
  }

  const deleteSection = (section) => {
    const content = cv.content[section.id]
    const filled = typeof content === "string" ? content.trim() !== "" : content?.length > 0
    if (filled && !window.confirm(`Delete “${section.title}” and everything in it?`)) return
    setCv((c) => withoutSection(c, section.id))
  }

  const pickPhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    try {
      const photo = await toSquareDataUrl(file)
      setCv((c) => ({ ...c, basics: { ...c.basics, photo, showPhoto: true } }))
    } catch {
      // Not a decodable image: leave the current photo alone.
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      <Segmented hideLabel label="Editor tab" options={TABS} value={tab} onChange={setTab} />

      {/* Both tabs stay mounted so open/closed panels and typed text survive switching. */}
      <div className={cn("grid grid-cols-1 gap-3", tab !== "design" && "hidden")}>
        <CvDesignPanels cv={cv} setCv={setCv} onAddSection={addSection} onDeleteSection={deleteSection} />
      </div>

      <div className={cn("grid grid-cols-1 gap-3", tab !== "content" && "hidden")}>
        <Panel title="Personal details" defaultOpen>
          <div className="grid grid-cols-2 gap-3">
            {BASIC_FIELDS.map((field) => (
              <Field key={field.key} label={field.label} className={field.full ? "col-span-2" : undefined}>
                <Input value={basics[field.key]} placeholder={field.placeholder} onChange={(event) => setBasic(field.key, event.target.value)} />
              </Field>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-secondary/40 p-3">
            {basics.photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- local asset or data URL chosen by the user
              <img src={basics.photo} alt="" className="size-12 rounded-full object-cover" />
            ) : (
              <span className="grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
                <ImagePlus className="size-5" />
              </span>
            )}
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => photoInput.current?.click()}>
                <ImagePlus /> {basics.photo ? "Change" : "Upload"} photo
              </Button>
              {basics.photo && (
                <Button variant="ghost" size="sm" onClick={() => setCv((c) => ({ ...c, basics: { ...c.basics, photo: "", showPhoto: false } }))}>
                  <X /> Remove
                </Button>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={basics.showPhoto}
                disabled={!basics.photo}
                onChange={(event) => setBasic("showPhoto", event.target.checked)}
                className="size-4 accent-[#a8c7fa]"
              />
              Show on CV
            </label>
            <input ref={photoInput} type="file" accept="image/*" hidden onChange={pickPhoto} />
          </div>
          <p className="text-[11px] text-muted-foreground/70">Photos are optional and some ATS ignore them. A one-column template is the safest.</p>
        </Panel>

        {cv.sections.map((section) => {
          const title = section.visible ? section.title : `${section.title} (hidden)`
          const open = section.id === openSection
          if (section.kind === "text") {
            return (
              <Panel key={section.id} title={title} defaultOpen={open}>
                <Textarea
                  rows={5}
                  aria-label={section.title}
                  value={cv.content[section.id] ?? ""}
                  onChange={(event) => setCv((c) => ({ ...c, content: { ...c.content, [section.id]: event.target.value } }))}
                />
              </Panel>
            )
          }
          return (
            <ListSection
              key={section.id}
              title={title}
              config={KIND_EDITORS[section.kind]}
              items={cv.content[section.id] ?? []}
              defaultOpen={open}
              openIds={openIds}
              onToggle={toggleItem}
              onAdd={addItem(section)}
              onChange={changeItem(section.id)}
              onRemove={removeItem(section.id)}
              onMove={moveItem(section.id)}
            />
          )
        })}

        <AddSection onAdd={addSection} />

        <Panel title="Your data">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Everything is stored in this browser only. Nothing is uploaded. Export a JSON file to back a CV up or move it to another device.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={onExport}>
              <Download /> Export this CV
            </Button>
            <Button variant="secondary" size="sm" onClick={() => importInput.current?.click()}>
              <FileUp /> Import JSON
            </Button>
            <Button variant="ghost" size="sm" onClick={onOpenLibrary}>
              <FolderOpen /> My CVs
            </Button>
          </div>
          <input
            ref={importInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (file) onImport(file)
            }}
          />
        </Panel>
      </div>
    </div>
  )
}
