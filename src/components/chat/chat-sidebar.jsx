"use client"

import { motion } from "framer-motion"
import { Download, ExternalLink, Github, Linkedin, SquarePen } from "lucide-react"
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
import { topics } from "@/data/topics"
import { cn } from "@/lib/utils"

const SECTION_LABEL = "px-3.5 text-sm font-medium text-muted-foreground"

// One sidebar row. The selected "pill" is shared (layoutId) so it glides from the
// previously selected row to the new one instead of jumping.
function NavItem({ active, icon: Icon, onClick, href, external, children }) {
  const content = (
    <>
      {active && (
        <motion.span
          layoutId="nav-pill"
          aria-hidden
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="absolute inset-0 rounded-full bg-[#a8c7fa]/[0.16]"
        />
      )}
      <span className="relative z-10 flex min-w-0 flex-1 items-center gap-3.5">
        {Icon && <Icon className="size-5 shrink-0" />}
        <span className="truncate">{children}</span>
      </span>
      {external && <ExternalLink className="relative z-10 size-3.5 shrink-0 opacity-40" />}
    </>
  )

  const className = cn(
    "relative h-11 gap-3 overflow-visible rounded-full px-3.5 text-[15.5px] font-medium text-[#e3e3e3] transition-colors",
    "hover:bg-white/[0.08] data-[active=true]:bg-transparent data-[active=true]:font-medium data-[active=true]:text-[#d3e3fd]",
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
      <SidebarHeader className="px-4 pb-1 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-1">
            <Logo className="size-8" />
            <span className="text-[19px] font-medium tracking-tight">Phuc AI</span>
          </div>
          <SidebarTrigger className="size-10 text-muted-foreground hover:bg-white/10 hover:text-foreground" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-3">
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <NavItem active={activeId === null} icon={SquarePen} onClick={choose(onNewChat)}>
                New chat
              </NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-5">
          <SidebarGroupLabel className={SECTION_LABEL}>About Phuc</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu className="gap-0.5">
              {topics.map((topic) => (
                <NavItem
                  key={topic.id}
                  active={activeId === topic.id}
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
              <SidebarMenu className="gap-0.5">
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
            <SidebarMenu className="gap-0.5">
              <NavItem icon={Download} href={profile.cvUrl}>
                Download CV
              </NavItem>
              <NavItem icon={Github} href={profile.socials.github} external>
                GitHub
              </NavItem>
              <NavItem icon={Linkedin} href={profile.socials.linkedin} external>
                LinkedIn
              </NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <ProfileMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
