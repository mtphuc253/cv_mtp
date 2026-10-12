"use client"

import { Logo } from "@/components/chat/logo"
import { SafeImage } from "@/components/chat/safe-image"
import { profile } from "@/data/profile"
import { cn } from "@/lib/utils"

// Phuc's portrait as a circle; falls back to the MTP logo if the photo can't load.
export function ProfileAvatar({ className, sizes }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-full", className)}>
      <SafeImage
        src={profile.avatar}
        alt={profile.name}
        fill
        sizes={sizes}
        // The face sits a little above the middle of the portrait.
        className="object-cover object-[center_40%]"
        fallback={<Logo className="size-full rounded-none ring-0" />}
      />
    </div>
  )
}
