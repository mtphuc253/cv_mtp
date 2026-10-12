"use client"

import { useCallback, useEffect, useReducer, useRef } from "react"
import { topicById, topics } from "@/data/topics"

export const MAX_INPUT = 500

const GENERIC_ERROR = "Couldn't reach the AI assistant. Please check your connection and try again."

let counter = 0
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${counter++}`

// Topic threads are pre-made: a visitor question + Phuc's rich answer.
// Anything the visitor types is appended to the active thread (or starts a new one).
function createInitialState() {
  const threads = {}
  for (const topic of topics) {
    threads[topic.id] = {
      id: topic.id,
      title: topic.title,
      topicId: topic.id,
      messages: [
        { id: `${topic.id}-q`, role: "user", content: topic.question },
        { id: `${topic.id}-a`, role: "assistant", topic: topic.id },
      ],
    }
  }
  // Land on the introduction ("Who is Phuc?"); the empty home screen is only reached via "New chat".
  return { threads, customIds: [], activeId: topics[0].id, revealed: {}, streaming: false }
}

function patchMessage(state, threadId, messageId, patch) {
  const thread = state.threads[threadId]
  if (!thread) return state
  const messages = thread.messages.map((m) => (m.id === messageId ? { ...m, ...patch(m) } : m))
  return { ...state, threads: { ...state.threads, [threadId]: { ...thread, messages } } }
}

function reducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { ...state, activeId: action.id }

    case "REVEAL":
      return state.revealed[action.id] ? state : { ...state, revealed: { ...state.revealed, [action.id]: true } }

    case "START": {
      const { threadId, title, userMessage, assistantMessage } = action
      const existing = state.threads[threadId]
      const thread = existing ?? { id: threadId, title, messages: [] }
      return {
        ...state,
        activeId: threadId,
        streaming: true,
        customIds: existing ? state.customIds : [threadId, ...state.customIds],
        threads: {
          ...state.threads,
          [threadId]: { ...thread, messages: [...thread.messages, userMessage, assistantMessage] },
        },
      }
    }

    case "CHUNK":
      return patchMessage(state, action.threadId, action.messageId, (m) => ({ content: m.content + action.text }))

    case "FINISH": {
      const next = patchMessage(state, action.threadId, action.messageId, (m) => ({
        status: action.error ? "error" : "done",
        error: action.error ?? (m.content ? undefined : "Response stopped."),
      }))
      return { ...next, streaming: false }
    }

    default:
      return state
  }
}

// Only text goes to the API. Rich topic answers are summarised as a one-liner;
// Gemini already has the full CV in its system prompt.
function toHistory(messages) {
  return messages.flatMap((m) => {
    if (m.role === "user") return [{ role: "user", content: m.content }]
    if (m.topic) return [{ role: "assistant", content: `(Showed the "${topicById[m.topic].title}" section of Phuc's portfolio.)` }]
    if (m.content) return [{ role: "assistant", content: m.content }]
    return []
  })
}

export function useChat() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const stateRef = useRef(state)
  const abortRef = useRef(null)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => () => abortRef.current?.abort(), [])

  const openThread = useCallback((id) => dispatch({ type: "OPEN", id }), [])
  const newChat = useCallback(() => dispatch({ type: "OPEN", id: null }), [])
  const reveal = useCallback((id) => dispatch({ type: "REVEAL", id }), [])
  const stop = useCallback(() => abortRef.current?.abort(), [])

  const send = useCallback(async (raw) => {
    const content = raw.trim().slice(0, MAX_INPUT)
    const { activeId, threads, streaming } = stateRef.current
    if (!content || streaming) return

    const existing = activeId ? threads[activeId] : null
    const threadId = existing ? existing.id : uid("chat")
    const messageId = uid("msg")
    const history = [...toHistory(existing?.messages ?? []), { role: "user", content }]

    dispatch({
      type: "START",
      threadId,
      title: content,
      userMessage: { id: uid("msg"), role: "user", content },
      assistantMessage: { id: messageId, role: "assistant", content: "", status: "streaming" },
    })

    const controller = new AbortController()
    abortRef.current = controller
    const finish = (error) => dispatch({ type: "FINISH", threadId, messageId, error })

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null)
        finish(data?.error || GENERIC_ERROR)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        if (text) dispatch({ type: "CHUNK", threadId, messageId, text })
      }
      finish()
    } catch (error) {
      finish(error?.name === "AbortError" ? undefined : GENERIC_ERROR)
    } finally {
      abortRef.current = null
    }
  }, [])

  const activeThread = state.activeId ? state.threads[state.activeId] : null
  const recentThreads = state.customIds.map((id) => state.threads[id])

  return {
    activeThread,
    recentThreads,
    revealed: state.revealed,
    streaming: state.streaming,
    openThread,
    newChat,
    reveal,
    send,
    stop,
  }
}
