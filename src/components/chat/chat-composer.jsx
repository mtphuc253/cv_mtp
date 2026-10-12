"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, Square } from "lucide-react"
import { MAX_INPUT } from "@/hooks/use-chat"

export function ChatComposer({ onSend, onStop, streaming }) {
  const [value, setValue] = useState("")
  const textareaRef = useRef(null)

  // Focus on desktop only; on touch devices it would pop the keyboard open.
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) textareaRef.current?.focus()
  }, [])

  // Grow with the text, up to ~6 lines.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  const canSend = value.trim().length > 0 && !streaming

  const submit = () => {
    if (!canSend) return
    onSend(value)
    setValue("")
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex items-end gap-2 rounded-[28px] border border-white/10 bg-secondary/90 py-2 pl-4 pr-2 shadow-xl shadow-black/30 backdrop-blur transition-all focus-within:border-cyan-400/50 focus-within:shadow-[0_0_0_4px_rgba(34,211,238,0.10)]"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          // isComposing: don't send while a Vietnamese (Telex/VNI) syllable is still being composed.
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            submit()
          }
        }}
        id="chat-message"
        name="message"
        rows={1}
        maxLength={MAX_INPUT}
        placeholder="Ask anything about Phuc…"
        aria-label="Message Phuc AI"
        className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-base leading-6 outline-none placeholder:text-muted-foreground"
      />
      {streaming ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generating"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90"
        >
          <Square className="size-3.5 fill-current" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white transition-all enabled:hover:scale-105 disabled:bg-foreground/15 disabled:from-transparent disabled:to-transparent disabled:text-foreground/40"
        >
          <ArrowUp className="size-5" />
        </button>
      )}
    </form>
  )
}

export function ComposerHint() {
  return (
    <p className="mt-2 text-center text-xs text-muted-foreground">
      {"Phuc AI only answers questions about Phuc's CV and can make mistakes. Check key details by email."}
    </p>
  )
}
