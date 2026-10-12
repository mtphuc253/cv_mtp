"use client"

import { motion } from "framer-motion"
import { Download, ExternalLink, Github, Linkedin, SquarePen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/chat/logo"
import { ProfileMenu } from "@/components/chat/profile-menu"
import { profile } from "@/data/profile"
import { NEUTRAL_TONE, topics } from "@/data/topics"
import { cn } from "@/lib/utils"

const SECTION_LABEL = "px-3 text-[13px] font-medium uppercase tracking-wider text-white/40"

// One sidebar row. The highlighted "pill" is shared (layoutId) so it glides from
// the previously selected row to the new one instead of jumping.
function NavItem({ active, tone = NEUTRAL_TONE, icon: Icon, onClick, href, children }) {
  const content = (
    <>
      {active && (
        <motion.span
          layoutId="nav-pill"
          aria-hidden
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className={cn("absolute inset-0 rounded-xl bg-gradient-to-r ring-1 ring-inset", tone.pill)}
        />
      )}
      <span className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
        {Icon && (
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tone.chip)}>
            <Icon className="size-[18px]" />
          </span>
        )}
        <span className="truncate">{children}</span>
      </span>
      {href && <ExternalLink className="relative z-10 size-3.5 shrink-0 text-white/30" />}
    </>
  )

  const className = cn(
    "relative h-11 gap-3 overflow-visible rounded-xl px-2.5 text-[15.5px] font-medium text-white/70 transition-colors",
    "hover:bg-white/[0.05] hover:text-white data-[active=true]:bg-transparent data-[active=true]:font-medium data-[active=true]:text-white",
  )

  return (
    <SidebarMenuItem>
      {href ? (
        <SidebarMenuButton asChild className={className}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton className={className} isActive={active} onClick={onClick}>
          {content}
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}

export function ChatSidebar({ activeId, recentThreads, onNewChat, onOpenThread }) {
  const { isMobile, setOpenMobile } = useSidebar()

  // On mobile the sidebar is a drawer: close it once a choice is made.
  const choose = (action) => () => {
    action()
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="offcanvas">
      {/* Decorative glow behind the content (the sidebar itself is a solid indigo). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_55%_at_0%_0%,rgba(6,182,212,0.09),transparent_60%),radial-gradient(100%_45%_at_100%_100%,rgba(139,92,246,0.09),transparent_60%)]"
      />

      <SidebarHeader className="relative z-10 px-4 pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="size-10 shadow-md shadow-black/30" />
            <div className="leading-tight">
              <div className="text-xl font-medium tracking-tight">Phuc AI</div>
              <div className="text-[13px] font-medium text-white/45">Interactive portfolio</div>
            </div>
          </div>
          <SidebarTrigger className="size-9 text-white/60 hover:bg-white/10 hover:text-white" />
        </div>
      </SidebarHeader>

      <SidebarContent className="relative z-10 px-3 pt-2">
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <NavItem active={activeId === null} icon={SquarePen} onClick={choose(onNewChat)}>
                New chat
              </NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-5">
          <SidebarGroupLabel className={SECTION_LABEL}>About Phuc</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu className="gap-1">
              {topics.map((topic) => (
                <NavItem
                  key={topic.id}
                  active={activeId === topic.id}
                  tone={topic.tone}
                  icon={topic.icon}
                  onClick={choose(() => onOpenThread(topic.id))}
                >
                  {topic.title}
                </NavItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {recentThreads.length > 0 && (
          <SidebarGroup className="pt-3">
            <SidebarGroupLabel className={SECTION_LABEL}>Recent</SidebarGroupLabel>
            <SidebarGroupContent className="mt-1">
              <SidebarMenu className="gap-1">
                {recentThreads.map((thread) => (
                  <NavItem
                    key={thread.id}
                    active={activeId === thread.id}
                    onClick={choose(() => onOpenThread(thread.id))}
                  >
                    {thread.title}
                  </NavItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="pt-3">
          <SidebarGroupLabel className={SECTION_LABEL}>Links</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu className="gap-1">
              <NavItem icon={Github} href={profile.socials.github}>
                GitHub
              </NavItem>
              <NavItem icon={Linkedin} href={profile.socials.linkedin}>
                LinkedIn
              </NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="relative z-10 gap-3 border-t border-white/10 p-4">
        <ProfileMenu />
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-full border-white/15 bg-white/[0.06] text-[15px] font-medium text-white/90 hover:bg-white/10 hover:text-white"
        >
          <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
            <Download />
            Download CV
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
