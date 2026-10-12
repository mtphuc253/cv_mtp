"use client"

import * as Menu from "@radix-ui/react-dropdown-menu"
import { ChevronsUpDown, Facebook, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { ProfileAvatar } from "@/components/chat/profile-avatar"
import { profile } from "@/data/profile"

const ROW = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] outline-none"
const LINK_ROW = `${ROW} cursor-pointer data-[highlighted]:bg-accent`

const links = [
  { label: profile.phone, href: profile.phoneHref, icon: Phone },
  { label: profile.email, href: `mailto:${profile.email}`, icon: Mail },
]

const socials = [
  { label: "GitHub", href: profile.socials.github, icon: Github },
  { label: "LinkedIn", href: profile.socials.linkedin, icon: Linkedin },
  { label: "Facebook", href: profile.socials.facebook, icon: Facebook },
]

// Replaces ChatGPT's account button: Phuc's name + role, opening his basic info.
export function ProfileMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-left outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=open]:bg-white/10"
        >
          <ProfileAvatar className="size-11 border border-white/20" sizes="44px" textClass="text-sm" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[15.5px] font-medium">{profile.name}</div>
            <div className="truncate text-[13px] font-medium text-white/45">{profile.role}</div>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-white/50" />
        </button>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content
          side="top"
          align="start"
          sideOffset={8}
          className="z-[60] w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className={`${ROW} text-muted-foreground`}>
            <MapPin className="size-4 shrink-0" />
            <span>{profile.location}</span>
          </div>

          {links.map(({ label, href, icon: Icon }) => (
            <Menu.Item key={href} asChild>
              <a href={href} className={LINK_ROW}>
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{label}</span>
              </a>
            </Menu.Item>
          ))}

          <Menu.Separator className="my-1.5 h-px bg-border" />

          {socials.map(({ label, href, icon: Icon }) => (
            <Menu.Item key={href} asChild>
              <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_ROW}>
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                {label}
              </a>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
