"use client"

import { motion } from "framer-motion"

// The soft blue glow behind the chat area, modelled on Gemini's. Gemini paints a flat
// #1f3b9b blob through a blurred mask; here a few overlapping radial gradients get the
// same cloud-like falloff. It stays put behind every conversation (the messages scroll
// over it) and grows in once, over a second, when the page opens.
// Peak opacity ~0.7 over the #0f0f0f page reproduces Gemini's measured centre colour (~rgb(27, 42, 110)).
const BODY = "rgba(31, 59, 155, 0.7)"
const SOFT = "rgba(31, 59, 155, 0.38)"
const CLEAR = "rgba(31, 59, 155, 0)"

const GLOW = [
  `radial-gradient(42% 50% at 52% 80%, ${BODY} 0%, ${SOFT} 50%, ${CLEAR} 100%)`, // main body, low and centred
  `radial-gradient(22% 28% at 72% 54%, ${SOFT} 0%, ${CLEAR} 100%)`, // right lobe
  `radial-gradient(24% 30% at 28% 76%, ${SOFT} 0%, ${CLEAR} 100%)`, // left lobe
  "radial-gradient(22% 18% at 50% 84%, rgba(66, 103, 220, 0.28) 0%, rgba(66, 103, 220, 0) 100%)", // brighter bloom
].join(", ")

export function ChatGlow() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.2, 0, 0, 1] }}
      style={{ originY: 0.8 }}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="absolute -inset-[5%]" style={{ background: GLOW, filter: "blur(36px)" }} />
    </motion.div>
  )
}
