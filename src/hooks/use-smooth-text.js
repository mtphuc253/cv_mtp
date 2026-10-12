"use client"

import { useEffect, useReducer, useRef } from "react"

// Network chunks arrive in lumps; this reveals the text a few characters per frame
// so it reads like typing. It chases the target quickly when far behind and slows
// down as it catches up. `animate: false` shows the text immediately (old messages).
export function useSmoothText(text, animate) {
  const shownRef = useRef(animate ? 0 : text.length)
  const [, rerender] = useReducer((n) => n + 1, 0)
  const length = text.length

  useEffect(() => {
    if (shownRef.current >= length) return

    let frame
    const tick = () => {
      const gap = length - shownRef.current
      shownRef.current = Math.min(length, shownRef.current + Math.max(2, Math.ceil(gap / 40)))
      rerender()
      if (shownRef.current < length) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [length])

  const shown = Math.min(shownRef.current, length)
  return { text: text.slice(0, shown), typing: shown < length }
}
