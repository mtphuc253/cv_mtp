"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { ChatComposer, ComposerHint } from "@/components/chat/chat-composer"
import { AssistantMessage, TextAnswer, TopicAnswer, UserMessage } from "@/components/chat/chat-message"

const STICK_THRESHOLD = 120

export function ChatThread({ thread, revealed, onReveal, onSend, onStop, streaming }) {
  const scrollRef = useRef(null)
  const contentRef = useRef(null)
  const stickRef = useRef(false)
  const count = thread.messages.length
  const prevCount = useRef(count)

  // Opening a pre-made topic starts at the top (the question); a chat the visitor
  // has been typing in starts at the latest message.
  useLayoutEffect(() => {
    const el = scrollRef.current
    const isUntouchedTopic = Boolean(thread.topicId) && count === 2
    stickRef.current = !isUntouchedTopic
    el.scrollTop = isUntouchedTopic ? 0 : el.scrollHeight
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per opened thread (parent keys by thread id)
  }, [])

  // Follow the bottom whenever the content grows (typing, cards appearing, images
  // loading) unless the visitor scrolled up to read.
  useEffect(() => {
    const scroller = scrollRef.current
    const observer = new ResizeObserver(() => {
      if (stickRef.current) scroller.scrollTop = scroller.scrollHeight
    })
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [])

  // A new message always snaps back to following the conversation (the observer above scrolls).
  useEffect(() => {
    if (count > prevCount.current) stickRef.current = true
    prevCount.current = count
  }, [count])

  const handleScroll = () => {
    const el = scrollRef.current
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < STICK_THRESHOLD
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div ref={contentRef} className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-10 pt-4">
          {thread.messages.map((message) =>
            message.role === "user" ? (
              <UserMessage key={message.id} content={message.content} />
            ) : (
              <AssistantMessage key={message.id} delay={message.topic ? 0.25 : 0}>
                {message.topic ? (
                  <TopicAnswer topic={message.topic} revealed={Boolean(revealed[message.topic])} onReveal={onReveal} />
                ) : (
                  <TextAnswer message={message} />
                )}
              </AssistantMessage>
            ),
          )}
        </div>
      </div>

      <div className="px-4 pb-3 pt-1">
        <div className="mx-auto w-full max-w-3xl">
          <ChatComposer onSend={onSend} onStop={onStop} streaming={streaming} />
          <ComposerHint />
        </div>
      </div>
    </div>
  )
}
