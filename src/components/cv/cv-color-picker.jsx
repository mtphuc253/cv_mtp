"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ACCENTS, hexToRgb, isHex, rgbToHex } from "@/lib/cv-design"
import { cn } from "@/lib/utils"

const CHANNELS = [
  { label: "R", name: "Red", thumb: "#e5484d" },
  { label: "G", name: "Green", thumb: "#30a46c" },
  { label: "B", name: "Blue", thumb: "#3e63dd" },
]

// "#abc" -> "#aabbcc"; anything that is not a hex colour comes back as null.
function parseHex(text) {
  const value = text.trim().replace(/^#?/, "#")
  if (/^#[0-9a-f]{3}$/i.test(value)) return `#${[...value.slice(1)].map((c) => c + c).join("")}`.toLowerCase()
  return isHex(value) ? value.toLowerCase() : null
}

// One 0-255 channel: a slider whose track shows the colours it can reach, plus a number box.
function Channel({ channel, rgb, index, onChange }) {
  const value = rgb[index]
  const [draft, setDraft] = useState(String(value))

  // Follow the value when it changes elsewhere (slider, hex box, preset).
  useEffect(() => setDraft(String(value)), [value])

  const edge = (level) => `rgb(${rgb.map((v, i) => (i === index ? level : v)).join(",")})`

  const commit = (next) => {
    const number = Math.min(255, Math.max(0, Math.round(next)))
    onChange(rgb.map((v, i) => (i === index ? number : v)))
  }

  return (
    <div className="grid grid-cols-[1rem_minmax(0,1fr)_3.75rem] items-center gap-3">
      <span className="text-xs font-semibold text-muted-foreground" title={channel.name}>
        {channel.label}
      </span>
      <input
        type="range"
        min={0}
        max={255}
        step={1}
        value={value}
        aria-label={`${channel.name} (0-255)`}
        onChange={(event) => commit(Number(event.target.value))}
        className="cv-rgb w-full"
        style={{ "--track": `linear-gradient(to right, ${edge(0)}, ${edge(255)})`, "--thumb": channel.thumb }}
      />
      <Input
        type="text"
        inputMode="numeric"
        aria-label={`${channel.name} value`}
        value={draft}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "").slice(0, 3)
          setDraft(digits)
          if (digits) commit(Number(digits))
        }}
        onBlur={() => setDraft(String(value))}
        className="h-8 px-2 text-center tabular-nums"
      />
    </div>
  )
}

// Accent colour: a few presets, then a free RGB mixer (sliders, numbers or a hex code).
export function CvColorPicker({ value, onChange }) {
  const rgb = hexToRgb(value)
  const [hexDraft, setHexDraft] = useState(value)

  useEffect(() => setHexDraft(value), [value])

  const preset = ACCENTS.includes(value)

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-muted-foreground">Accent</span>
        {ACCENTS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Accent ${color}`}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
            className={cn(
              "grid size-7 place-items-center rounded-full border-2 border-transparent shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-transform hover:scale-110",
              value === color && "border-card ring-2 ring-brand",
            )}
            style={{ backgroundColor: color }}
          >
            {value === color && <Check className="size-3.5 text-white" />}
          </button>
        ))}
      </div>

      <div className="grid gap-3 rounded-xl border bg-secondary/40 p-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={cn("size-10 shrink-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]", !preset && "ring-2 ring-brand ring-offset-2 ring-offset-card")}
            style={{ backgroundColor: value }}
          />
          <div className="grid min-w-0 flex-1 gap-1">
            <span className="text-xs font-medium text-muted-foreground">Custom colour (RGB)</span>
            <Input
              aria-label="Hex colour"
              spellCheck={false}
              maxLength={7}
              value={hexDraft}
              onChange={(event) => {
                setHexDraft(event.target.value)
                // A full code applies as you type; the 3-digit shorthand waits for blur.
                const code = event.target.value.trim().replace(/^#?/, "#")
                if (isHex(code)) onChange(code.toLowerCase())
              }}
              onBlur={() => {
                const hex = parseHex(hexDraft)
                if (hex) onChange(hex)
                setHexDraft(hex ?? value)
              }}
              className="h-8 font-mono uppercase"
            />
          </div>
          <span className="shrink-0 self-end pb-1.5 text-xs tabular-nums text-muted-foreground">rgb({rgb.join(", ")})</span>
        </div>
        {CHANNELS.map((channel, index) => (
          <Channel key={channel.label} channel={channel} rgb={rgb} index={index} onChange={(next) => onChange(rgbToHex(next))} />
        ))}
      </div>
    </div>
  )
}
