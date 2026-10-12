"use client"

import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { Download } from "lucide-react"
import { ChatHome } from "@/components/chat/chat-home"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatThread } from "@/components/chat/chat-thread"
import { Logo } from "@/components/chat/logo"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { profile } from "@/data/profile"
import { useChat } from "@/hooks/use-chat"

// Soft drifting colour behind the conversation so the page has some atmosphere.
function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="ambient-blob -left-[10%] -top-[15%] size-[34rem] bg-cyan-500/20"
        style={{ animation: "drift-a 28s ease-in-out infinite" }}
      />
      <div
        className="ambient-blob -right-[12%] top-[20%] size-[30rem] bg-violet-500/[0.16]"
        style={{ animation: "drift-b 34s ease-in-out infinite" }}
      />
      <div
        className="ambient-blob -bottom-[20%] left-[25%] size-[32rem] bg-blue-500/[0.14]"
        style={{ animation: "drift-c 40s ease-in-out infinite" }}
      />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
    </div>
  )
}

function ChatHeader() {
  const { open, isMobile } = useSidebar()
  const sidebarHidden = isMobile || !open

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center gap-2 px-3 sm:px-4">
      {sidebarHidden && (
        <>
          <SidebarTrigger className="size-9 text-muted-foreground" />
          <div className="flex items-center gap-2 pl-1">
            <Logo className="size-7" />
            <span className="text-lg font-semibold tracking-tight">Phuc AI</span>
          </div>
        </>
      )}
      <Button
        asChild
        size="sm"
        className="ml-auto h-9 rounded-full border-0 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-400"
      >
        <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
          <Download />
          Download CV
        </a>
      </Button>
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
          <AmbientBackground />
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
