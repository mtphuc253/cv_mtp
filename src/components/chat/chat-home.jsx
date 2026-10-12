"use client"

import { motion } from "framer-motion"
import { ChatComposer, ComposerHint } from "@/components/chat/chat-composer"
import { Logo } from "@/components/chat/logo"
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
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo className="size-14 shadow-xl shadow-black/40" />
          <h1 className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
            Where should we start?
          </h1>
          <p className="text-base text-muted-foreground">
            Ask anything about Mai Tan Phuc — his experience, projects and skills.
          </p>
        </div>

        <ChatComposer onSend={onSend} onStop={onStop} streaming={streaming} />

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => (s.topic ? onOpenTopic(s.topic) : onSend(s.prompt))}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-foreground/75 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-foreground"
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
