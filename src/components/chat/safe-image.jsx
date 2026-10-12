"use client"

import { useState } from "react"
import Image from "next/image"

// next/image that never shows a broken-image icon: if the file fails to load
// it renders `fallback` instead.
export function SafeImage({ fallback = null, alt, ...props }) {
  const [failed, setFailed] = useState(false)

  if (failed) return fallback

  return <Image alt={alt} onError={() => setFailed(true)} {...props} />
}
