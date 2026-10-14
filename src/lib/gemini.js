const API_BASE = "https://generativelanguage.googleapis.com/v1beta"

// Free-tier models. Quota is counted per model, so the second one is both a fallback for
// outages and extra headroom. Override with GEMINI_MODEL / GEMINI_FALLBACK_MODELS.
export const DEFAULT_MODEL = "gemini-3.1-flash-lite"
export const DEFAULT_FALLBACK_MODELS = ["gemini-3.5-flash-lite"]

// Every attempt that fails with a 5xx still risks counting against the free quota, so the
// total is capped instead of retrying until something works.
const MAX_ATTEMPTS = 4

const list = (value) =>
  (value ?? "")
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)

const unique = (items) => [...new Set(items)]

/** API keys from GEMINI_API_KEYS (comma separated) and GEMINI_API_KEY. Server-side only. */
export const getApiKeys = (env = process.env) => unique([...list(env.GEMINI_API_KEYS), ...list(env.GEMINI_API_KEY)])

/** Models to try, in order: GEMINI_MODEL, then GEMINI_FALLBACK_MODELS (set it empty to turn fallback off). */
export const getModels = (env = process.env) =>
  unique([
    env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
    ...(env.GEMINI_FALLBACK_MODELS === undefined ? DEFAULT_FALLBACK_MODELS : list(env.GEMINI_FALLBACK_MODELS)),
  ])

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

const abortError = () => new DOMException("Aborted", "AbortError")

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError())
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer)
        reject(abortError())
      },
      { once: true },
    )
  })
}

// What a failed attempt tells us to do next:
//   "quota"     this key has used up this model         -> another key, else another model
//   "key"       this key is rejected                    -> another key
//   "model"     this model does not exist (any more)    -> another model
//   "transient" Google or the network had a hiccup      -> another model, after a short wait
//   "fatal"     our request itself is wrong             -> stop, retrying cannot help
async function classify(response) {
  const { status } = response
  if (status === 429) return "quota"
  if (status === 401 || status === 403) return "key"
  if (status === 404) return "model"
  if (status >= 500) return "transient"
  // An invalid key comes back as a plain 400.
  if (status === 400) return /api key/i.test(await response.clone().text().catch(() => "")) ? "key" : "fatal"
  return "fatal"
}

/**
 * Open the stream, trying other keys and models when Gemini is overloaded or out of quota.
 * Returns the first successful Response, or the last failed one (or throws the last network
 * error) once the attempts run out. Keys are rotated from a random start so load spreads out.
 */
export async function openGemini({ apiKeys, models, systemPrompt, messages, signal, backoffMs = 250 }) {
  const start = Math.floor(Math.random() * apiKeys.length)
  const keyOrder = apiKeys.map((_, i) => (start + i) % apiKeys.length)

  const deadKeys = new Set()
  const spentPairs = new Set() // "model|keyIndex" that hit its quota
  const deadModels = new Set()
  const cooling = new Set() // models that just had a transient error; try the others first

  const pick = () => {
    const live = models.filter((m) => !deadModels.has(m))
    const ordered = [...live.filter((m) => !cooling.has(m)), ...live.filter((m) => cooling.has(m))]
    for (const model of ordered) {
      for (const keyIndex of keyOrder) {
        if (!deadKeys.has(keyIndex) && !spentPairs.has(`${model}|${keyIndex}`)) return { model, keyIndex }
      }
    }
    return null
  }

  let last = null
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const choice = pick()
    if (!choice) break
    const { model, keyIndex } = choice

    let response
    try {
      response = await openGeminiStream({ apiKey: apiKeys[keyIndex], model, systemPrompt, messages, signal })
    } catch (error) {
      if (error?.name === "AbortError") throw error
      last = { error }
      console.warn(`[gemini] attempt ${attempt} ${model} key#${keyIndex}: network error`, error)
      cooling.add(model)
      if (cooling.size >= models.length) cooling.clear()
      if (attempt < MAX_ATTEMPTS) await sleep(backoffMs * attempt, signal)
      continue
    }

    if (response.ok) {
      if (attempt > 1) console.warn(`[gemini] attempt ${attempt} succeeded with ${model} key#${keyIndex}`)
      return response
    }

    last = { response }
    const kind = await classify(response)
    console.warn(`[gemini] attempt ${attempt} ${model} key#${keyIndex}: HTTP ${response.status} (${kind})`)
    if (kind === "fatal") return response

    if (kind === "quota") spentPairs.add(`${model}|${keyIndex}`)
    else if (kind === "key") deadKeys.add(keyIndex)
    else if (kind === "model") deadModels.add(model)
    else {
      cooling.add(model)
      if (cooling.size >= models.length) cooling.clear()
      if (attempt < MAX_ATTEMPTS) await sleep(backoffMs * attempt, signal)
    }
  }

  if (last?.response) return last.response
  throw last?.error ?? new Error("No Gemini key and model left to try")
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
