"use client"

import { useState } from "react"
import Image from "next/image"

// next/image that never shows a broken-image icon: if the file fails to load
// (e.g. an expired Firebase/GitHub link) it renders `fallback` instead.
export function SafeImage({ fallback = null, onFail, alt, ...props }) {
  const [failed, setFailed] = useState(false)

  if (failed) return fallback

  return (
    <Image
      alt={alt}
      onError={() => {
        setFailed(true)
        onFail?.()
      }}
      {...props}
    />
  )
}

// Round initials badge used when the profile photo can't be loaded.
export function InitialsAvatar({ initials, className }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 font-semibold text-white ${className ?? ""}`}
    >
      {initials}
    </div>
  )
}
