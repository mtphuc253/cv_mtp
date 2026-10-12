const API_BASE = "https://generativelanguage.googleapis.com/v1beta"

// Free-tier model; override with GEMINI_MODEL in .env if Google retires it.
export const DEFAULT_MODEL = "gemini-3.5-flash-lite"

/** Open a streaming generateContent request. Returns the raw upstream Response. */
export function openGeminiStream({ apiKey, model, systemPrompt, messages, signal }) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  return fetch(`${API_BASE}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.2, maxOutputTokens: 700 },
    }),
    signal,
  })
}

function textFromEvent(data) {
  let json
  try {
    json = JSON.parse(data)
  } catch {
    return ""
  }
  const parts = json?.candidates?.[0]?.content?.parts ?? []
  return parts.map((p) => p.text ?? "").join("")
}

/**
 * Turn Gemini's SSE body into a plain-text stream the browser can read with
 * a simple reader. If Gemini produced no text (e.g. safety block) the stream
 * ends with `fallback` so the visitor never sees an empty answer.
 */
export function sseToTextStream(upstream, fallback) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const reader = upstream.body.getReader()
  let buffer = ""
  let emitted = 0

  const flushEvent = (rawEvent, controller) => {
    for (const line of rawEvent.split(/\r?\n/)) {
      if (!line.startsWith("data:")) continue
      const text = textFromEvent(line.slice(5).trim())
      if (text) {
        emitted += 1
        controller.enqueue(encoder.encode(text))
      }
    }
  }

  return new ReadableStream({
    // pull() is only called again after it enqueues something, so keep reading
    // until we do — a network chunk can end mid-event and yield no text.
    async pull(controller) {
      const emittedBefore = emitted

      for (;;) {
        const { done, value } = await reader.read()

        if (done) {
          if (buffer.trim()) flushEvent(buffer, controller)
          if (emitted === 0) controller.enqueue(encoder.encode(fallback))
          controller.close()
          return
        }

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split(/\r?\n\r?\n/)
        buffer = events.pop() ?? ""
        for (const event of events) flushEvent(event, controller)

        if (emitted > emittedBefore) return
      }
    },
    cancel(reason) {
      return reader.cancel(reason)
    },
  })
}
