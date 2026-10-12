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
      className="flex items-end gap-2 rounded-[32px] bg-card py-2.5 pl-6 pr-3 transition-colors focus-within:bg-secondary"
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
        placeholder="Ask Phuc AI"
        aria-label="Message Phuc AI"
        className="max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2 text-[17px] leading-6 outline-none placeholder:text-muted-foreground"
      />
      {streaming ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generating"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90"
        >
          <Square className="size-3.5 fill-current" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-all enabled:hover:opacity-90 disabled:bg-transparent disabled:text-muted-foreground/60"
        >
          <ArrowUp className="size-5" />
        </button>
      )}
    </form>
  )
}

export function ComposerHint() {
  return (
    <p className="mt-3 text-center text-xs text-muted-foreground">
      {"Phuc AI only answers questions about Phuc's CV and can make mistakes. Check key details by email."}
    </p>
  )
}
