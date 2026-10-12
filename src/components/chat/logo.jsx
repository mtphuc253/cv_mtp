import Image from "next/image"
import { cn } from "@/lib/utils"

// Phuc's own MTP monogram (public/logo.png, cropped from src/app/favicon.ico).
// The mark is dark on a transparent background, so it sits on a white tile to stay
// readable on the dark UI; size it with `size-*` classes.
export function Logo({ className }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[26%] bg-white ring-1 ring-white/20",
        className,
      )}
    >
      <Image src="/logo.png" alt="Phuc AI" width={128} height={128} className="size-full object-contain p-[6%]" />
    </span>
  )
}
