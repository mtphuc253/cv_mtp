"use client"

import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { Download } from "lucide-react"
import { ChatGlow } from "@/components/chat/chat-glow"
import { ChatHome } from "@/components/chat/chat-home"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatThread } from "@/components/chat/chat-thread"
import { Logo } from "@/components/chat/logo"
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { profile } from "@/data/profile"
import { useChat } from "@/hooks/use-chat"

function ChatHeader() {
  const { open, isMobile } = useSidebar()
  const sidebarHidden = isMobile || !open

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center gap-2 px-3 sm:px-4">
      {sidebarHidden && (
        <>
          <SidebarTrigger className="size-10 text-muted-foreground hover:bg-white/10" />
          <div className="flex items-center gap-2.5 pl-1">
            <Logo className="size-7" />
            <span className="text-[17px] font-medium tracking-tight">Phuc AI</span>
          </div>
        </>
      )}
      {/* Same pill Gemini uses for its "Sign in" button. */}
      <a
        href={profile.cvUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-[#004a77] px-5 text-sm font-medium text-[#c2e7ff] transition-colors hover:bg-[#005a92]"
      >
        <Download className="size-4" />
        Download CV
      </a>
    </header>
  )
}

export function ChatApp() {
  const chat = useChat()
  const { activeThread } = chat

  return (
    <MotionConfig reducedMotion="user">
      <SidebarProvider>
        <ChatSidebar
          activeId={activeThread?.id ?? null}
          recentThreads={chat.recentThreads}
          onNewChat={chat.newChat}
          onOpenThread={chat.openThread}
        />
        <SidebarInset className="h-svh min-w-0 overflow-hidden">
          <ChatGlow />
          <ChatHeader />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeThread?.id ?? "home"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative z-10 flex min-h-0 flex-1 flex-col"
            >
              {activeThread ? (
                <ChatThread
                  thread={activeThread}
                  revealed={chat.revealed}
                  onReveal={chat.reveal}
                  onSend={chat.send}
                  onStop={chat.stop}
                  streaming={chat.streaming}
                />
              ) : (
                <ChatHome
                  onSend={chat.send}
                  onStop={chat.stop}
                  streaming={chat.streaming}
                  onOpenTopic={chat.openThread}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </SidebarInset>
      </SidebarProvider>
    </MotionConfig>
  )
}
