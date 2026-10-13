"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Small form controls shared by the content editor and the design panels.

export function Field({ label, hint, className, children }) {
  return (
    <label className={cn("grid min-w-0 content-start gap-1.5", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground/70">{hint}</span>}
    </label>
  )
}

export function Panel({ title, count, defaultOpen = false, children }) {
  return (
    <details open={defaultOpen} className="group/panel rounded-2xl border bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex-1 text-[15px] font-medium">{title}</span>
        {count > 0 && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{count}</span>}
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open/panel:rotate-180" />
      </summary>
      <div className="grid grid-cols-1 gap-3 border-t px-4 pb-4 pt-3">{children}</div>
    </details>
  )
}

export function IconButton({ label, onClick, disabled, pressed, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        pressed && "bg-[#a8c7fa]/20 text-[#d3e3fd]",
      )}
    >
      {children}
    </button>
  )
}

// Literal class names so Tailwind can see them.
const COLUMNS = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }

// A row of mutually exclusive choices. With `cols` it wraps into a grid (rounded rectangle
// instead of a pill) so long option lists stay readable.
export function Segmented({ label, hideLabel, options, value, onChange, cols }) {
  return (
    <div className="grid gap-1.5" role="radiogroup" aria-label={label}>
      {!hideLabel && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
      <div className={cn("grid bg-secondary p-0.5", cols ? cn(COLUMNS[cols], "gap-0.5 rounded-2xl") : "auto-cols-fr grid-flow-col rounded-full")}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={value === option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "h-8 truncate rounded-full px-2 text-[13px] transition-colors",
              value === option.id ? "bg-[#a8c7fa]/20 text-[#d3e3fd]" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Slider({ label, value, onChange, range }) {
  return (
    <label className="grid gap-1">
      <span className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="tabular-nums text-foreground">
          {value}
          {range.unit}
        </span>
      </span>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#a8c7fa]"
      />
    </label>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-[#a8c7fa]" />
    </label>
  )
}

export function SelectField({ label, hint, value, onChange, children }) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none [color-scheme:dark] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {children}
      </select>
    </Field>
  )
}
