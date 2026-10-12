"use client"

import { motion } from "framer-motion"
import { ChatComposer, ComposerHint } from "@/components/chat/chat-composer"
import { suggestions } from "@/data/topics"

export function ChatHome({ onSend, onStop, streaming, onOpenTopic }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <div className="mb-9 text-center">
          <h1 className="text-[2.5rem] font-normal leading-tight tracking-tight">Hello, I&apos;m Phuc AI</h1>
          <p className="mt-2 text-xl text-muted-foreground">Ask me anything about Mai Tan Phuc.</p>
        </div>

        <ChatComposer onSend={onSend} onStop={onStop} streaming={streaming} />

        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => (s.topic ? onOpenTopic(s.topic) : onSend(s.prompt))}
              className="rounded-full bg-card px-5 py-2.5 text-[15px] text-foreground transition-colors hover:bg-secondary"
            >
              {s.label}
            </button>
          ))}
        </div>

        <ComposerHint />
      </motion.div>
    </div>
  )
}
