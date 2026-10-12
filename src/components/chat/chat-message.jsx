"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Logo } from "@/components/chat/logo"
import { Markdown } from "@/components/chat/markdown"
import { TopicResponse } from "@/components/chat/topic-responses"
import { useSmoothText } from "@/hooks/use-smooth-text"

const SPRING = { type: "spring", stiffness: 380, damping: 30 }

export function UserMessage({ content }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={SPRING}
      style={{ originX: 1 }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-[28px] bg-card px-6 py-3.5 text-[17px] leading-7">
        {content}
      </div>
    </motion.div>
  )
}

export function AssistantMessage({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="flex gap-3 sm:gap-4"
    >
      <Logo className="mt-0.5 size-8" />
      <div className="min-w-0 flex-1">{children}</div>
    </motion.div>
  )
}

export function ThinkingDots() {
  return (
    <div className="flex h-8 items-center gap-1.5" role="status" aria-label="Phuc AI is thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

// A pre-made answer: show the thinking dots once, then fade the rich cards in.
export function TopicAnswer({ topic, revealed, onReveal }) {
  const [ready, setReady] = useState(revealed)

  useEffect(() => {
    if (ready) return
    const timer = setTimeout(() => {
      setReady(true)
      onReveal(topic)
    }, 700)
    return () => clearTimeout(timer)
  }, [ready, onReveal, topic])

  return (
    <AnimatePresence mode="wait" initial={false}>
      {ready ? (
        <motion.div key="response" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <TopicResponse id={topic} />
        </motion.div>
      ) : (
        <motion.div key="dots" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
          <ThinkingDots />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// An answer from Gemini, typed out smoothly as Markdown.
export function TextAnswer({ message }) {
  const { content, status, error } = message
  const { text, typing } = useSmoothText(content, status === "streaming")

  return (
    <div>
      {text ? <Markdown>{text}</Markdown> : status === "streaming" ? <ThinkingDots /> : null}
      {text && (typing || status === "streaming") && (
        <span className="mt-2 inline-block size-2.5 animate-pulse rounded-full bg-muted-foreground" />
      )}
      {error && !typing && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  )
}
