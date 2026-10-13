"use client"

import { useDeferredValue, useEffect, useRef, useState } from "react"
import { Reorder, useDragControls } from "framer-motion"
import { Check, Eye, EyeOff, GripVertical, PanelLeft, Plus, RotateCcw, Trash2 } from "lucide-react"
import { CvDocument } from "@/components/cv/cv-document"
import { IconButton, Panel, Segmented, SelectField, Slider, Toggle } from "@/components/cv/cv-controls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ACCENTS, DEFAULT_DESIGN, OPTIONS, RANGES, TEMPLATES, isPresetActive } from "@/lib/cv-design"
import { FONT_GROUPS, customFamily, customFontId, isCustomFontId, loadGoogleFont } from "@/lib/cv-fonts"
import { SECTION_PRESETS } from "@/lib/cv-sections"
import { cn } from "@/lib/utils"

// Template thumbnails are the real document, shrunk (210mm x 297mm at this zoom).
const THUMB_ZOOM = 0.14

function TemplateCard({ template, cv, active, onPick }) {
  const thumb = { ...cv, design: { ...cv.design, ...template.preset } }
  const single = template.preset.layout === "single"
  return (
    <button
      type="button"
      aria-pressed={active}
      title={template.hint}
      onClick={onPick}
      className={cn("grid justify-items-center gap-1.5 rounded-xl border p-2 transition-colors hover:bg-white/5", active && "border-[#a8c7fa] bg-[#a8c7fa]/10")}
    >
      <div
        inert
        aria-hidden
        className="pointer-events-none overflow-hidden rounded-[3px] bg-white shadow-md"
        style={{ width: `${210 * THUMB_ZOOM}mm`, height: `${297 * THUMB_ZOOM}mm` }}
      >
        <div style={{ zoom: THUMB_ZOOM }}>
          <CvDocument cv={thumb} links={false} />
        </div>
      </div>
      <span className="text-[13px] font-medium leading-tight">{template.name}</span>
      <span className={cn("rounded-full px-1.5 py-px text-[10px]", single ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-muted-foreground")}>
        {single ? "ATS-friendly" : "Two columns"}
      </span>
    </button>
  )
}

function TemplatePicker({ cv, setCv }) {
  // Thumbnails are many small documents: render them from a deferred copy so typing stays snappy.
  const deferred = useDeferredValue(cv)
  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            cv={deferred}
            active={isPresetActive(cv.design, template.preset)}
            onPick={() => setCv((c) => ({ ...c, design: { ...c.design, ...template.preset } }))}
          />
        ))}
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground/70">
        A template is a starting look; every option below can still be changed. One-column layouts are the safest for applicant tracking systems, while
        two-column designs read well for people but can confuse parsers.
      </p>
    </>
  )
}

const CUSTOM = "__custom"

// Curated fonts (all verified to support Vietnamese) plus any family from Google Fonts.
function FontPicker({ value, onChange }) {
  const [custom, setCustom] = useState(isCustomFontId(value))
  const [draft, setDraft] = useState(customFamily(value) ?? "")
  const [status, setStatus] = useState("idle") // idle | checking | invalid | missing

  const apply = async () => {
    const family = draft.trim().replace(/\s+/g, " ")
    if (!/^[A-Za-z0-9][A-Za-z0-9 ]{1,39}$/.test(family)) return setStatus("invalid")
    setStatus("checking")
    if (!(await loadGoogleFont(family))) return setStatus("missing")
    setStatus("idle")
    onChange(customFontId(family))
  }

  return (
    <div className="grid gap-2">
      <SelectField
        label="Font"
        value={custom ? CUSTOM : value}
        onChange={(next) => {
          setCustom(next === CUSTOM)
          if (next !== CUSTOM) onChange(next)
        }}
      >
        {FONT_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.fonts.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </optgroup>
        ))}
        <optgroup label="More">
          <option value={CUSTOM}>Any Google Font…</option>
        </optgroup>
      </SelectField>

      {custom && (
        <div className="grid gap-1.5">
          <div className="flex gap-2">
            <Input
              aria-label="Google Font name"
              placeholder="e.g. Open Sans"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                setStatus("idle")
              }}
              onKeyDown={(event) => event.key === "Enter" && apply()}
            />
            <Button variant="secondary" disabled={status === "checking"} onClick={apply}>
              {status === "checking" ? "Loading…" : "Use"}
            </Button>
          </div>
          <p className={cn("text-[11px]", status === "missing" || status === "invalid" ? "text-destructive" : "text-muted-foreground/70")}>
            {status === "missing"
              ? "Google Fonts doesn't have a family with that name."
              : status === "invalid"
                ? "Use the family name only (letters, numbers and spaces)."
                : "Type the exact name from fonts.google.com. Pick one that supports Vietnamese, or accents will fall back to another font."}
          </p>
        </div>
      )}
    </div>
  )
}

// One draggable row of the "Sections" list. Dragging starts only from the grip, so the
// title input stays a normal text field; arrow keys on the grip reorder for keyboard users.
function SectionRow({ section, index, count, sidebar, onPatch, onMove, onDelete }) {
  const controls = useDragControls()
  const grip = useRef(null)
  const refocus = useRef(false)

  // Moving a row re-inserts its DOM node, which drops focus: put it back on the grip.
  useEffect(() => {
    if (refocus.current) {
      refocus.current = false
      grip.current?.focus()
    }
  }, [index])

  const onKeyDown = (event) => {
    const direction = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0
    if (!direction) return
    event.preventDefault()
    if (index + direction < 0 || index + direction >= count) return
    refocus.current = true
    onMove(index, direction)
  }

  return (
    <Reorder.Item
      as="div"
      value={section}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)" }}
      className="relative flex items-center gap-0.5 rounded-xl bg-card"
    >
      <button
        ref={grip}
        type="button"
        aria-label={`Reorder ${section.title}: drag, or use the up and down arrow keys`}
        title="Drag to reorder"
        onPointerDown={(event) => controls.start(event)}
        onKeyDown={onKeyDown}
        className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      <Input
        aria-label="Section title"
        value={section.title}
        onChange={(event) => onPatch(section.id, { title: event.target.value })}
        className={cn("mx-1 min-w-0 flex-1", !section.visible && "opacity-50")}
      />
      {sidebar && (
        <IconButton label="Show in sidebar" pressed={section.side} onClick={() => onPatch(section.id, { side: !section.side })}>
          <PanelLeft className="size-4" />
        </IconButton>
      )}
      <IconButton label={section.visible ? "Hide section" : "Show section"} onClick={() => onPatch(section.id, { visible: !section.visible })}>
        {section.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </IconButton>
      <IconButton label="Delete section" onClick={() => onDelete(section)}>
        <Trash2 className="size-4" />
      </IconButton>
    </Reorder.Item>
  )
}

export function AddSection({ onAdd }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="grid gap-2">
      <Button variant="secondary" size="sm" className="justify-self-start" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Plus /> Add section
      </Button>
      {open && (
        <div className="flex flex-wrap gap-1.5">
          {SECTION_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => {
                onAdd(preset)
                setOpen(false)
              }}
              className="rounded-full border px-3 py-1 text-[13px] transition-colors hover:bg-white/10"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Everything that changes how the CV looks, as opposed to what it says (plus the section list).
export function CvDesignPanels({ cv, setCv, onAddSection, onDeleteSection }) {
  const { design, sections } = cv
  const single = design.layout === "single"

  const setDesign = (patch) => setCv((c) => ({ ...c, design: { ...c.design, ...patch } }))

  const slider = (key) => <Slider label={RANGES[key].label} range={RANGES[key]} value={design[key]} onChange={(value) => setDesign({ [key]: value })} />

  const choice = (key, label, cols) => (
    <Segmented label={label} cols={cols} options={OPTIONS[key]} value={design[key]} onChange={(value) => setDesign({ [key]: value })} />
  )

  const patchSection = (id, patch) =>
    setCv((c) => ({ ...c, sections: c.sections.map((section) => (section.id === id ? { ...section, ...patch } : section)) }))

  const moveSection = (index, direction) =>
    setCv((c) => {
      const list = [...c.sections]
      const target = index + direction
      if (target < 0 || target >= list.length) return c
      ;[list[index], list[target]] = [list[target], list[index]]
      return { ...c, sections: list }
    })

  return (
    <>
      <Panel title="Template" defaultOpen>
        <TemplatePicker cv={cv} setCv={setCv} />
      </Panel>

      <Panel title="Color & typography">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-muted-foreground">Accent</span>
          {ACCENTS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Accent ${color}`}
              aria-pressed={design.accent === color}
              onClick={() => setDesign({ accent: color })}
              className={cn("grid size-7 place-items-center rounded-full border-2 border-transparent transition-transform hover:scale-110", design.accent === color && "border-white")}
              style={{ backgroundColor: color }}
            >
              {design.accent === color && <Check className="size-3.5 text-white" />}
            </button>
          ))}
          <label className="relative grid size-7 cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed text-muted-foreground" title="Custom color">
            <Plus className="size-3.5" />
            <input
              type="color"
              aria-label="Custom accent color"
              value={design.accent}
              onChange={(event) => setDesign({ accent: event.target.value })}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
        {/* Keyed by font so its draft state follows template picks and CV switches. */}
        <FontPicker key={design.font} value={design.font} onChange={(font) => setDesign({ font })} />
        {slider("fontSize")}
        {slider("lineHeight")}
        {choice("headingStyle", "Section headings", 3)}
        <Toggle label="Uppercase headings" checked={design.uppercase} onChange={(uppercase) => setDesign({ uppercase })} />
        {choice("bulletStyle", "Bullets", 4)}
        {choice("skillStyle", "Skills")}
      </Panel>

      <Panel title="Layout & spacing">
        {choice("layout", "Layout")}
        {single ? (
          <>
            {choice("headerStyle", "Header")}
            {design.headerStyle !== "split" && choice("headerAlign", "Header alignment")}
            {design.headerStyle !== "band" && <Toggle label="Line under header" checked={design.headerRule} onChange={(headerRule) => setDesign({ headerRule })} />}
            {choice("sectionLayout", "Section titles")}
          </>
        ) : (
          <>
            {choice("sidebarSide", "Sidebar position")}
            {choice("sidebarStyle", "Sidebar style")}
            {slider("sidebarWidth")}
          </>
        )}
        {choice("photoShape", "Photo shape")}
        {slider("margin")}
        {slider("sectionGap")}
        {slider("entryGap")}
        <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => setCv((c) => ({ ...c, design: { ...DEFAULT_DESIGN } }))}>
          <RotateCcw /> Reset design
        </Button>
      </Panel>

      <Panel title="Sections">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Drag the handle to reorder sections. You can also rename, hide or delete them.
          {!single && " Use the panel icon to move a section into the sidebar."}
        </p>
        <Reorder.Group as="div" axis="y" values={sections} onReorder={(next) => setCv((c) => ({ ...c, sections: next }))} className="grid gap-1.5">
          {sections.map((section, index) => (
            <SectionRow
              key={section.id}
              section={section}
              index={index}
              count={sections.length}
              sidebar={!single}
              onPatch={patchSection}
              onMove={moveSection}
              onDelete={onDeleteSection}
            />
          ))}
        </Reorder.Group>
        <AddSection onAdd={onAddSection} />
      </Panel>
    </>
  )
}
