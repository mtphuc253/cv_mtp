"use client"

import { InitialsAvatar, SafeImage } from "@/components/chat/safe-image"
import { profile } from "@/data/profile"
import { cn } from "@/lib/utils"

// Phuc's photo as a circle; falls back to initials if the photo link is dead.
export function ProfileAvatar({ className, sizes, textClass = "text-sm" }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-full", className)}>
      <SafeImage
        src={profile.avatar}
        alt={profile.name}
        fill
        sizes={sizes}
        className="object-cover"
        fallback={<InitialsAvatar initials={profile.initials} className={cn("size-full", textClass)} />}
      />
    </div>
  )
}
