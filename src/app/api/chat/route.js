import { NextResponse } from "next/server"
import { buildSystemPrompt, OFF_TOPIC_REPLY } from "@/lib/chat-prompt"
import { DEFAULT_MODEL, openGeminiStream, sseToTextStream } from "@/lib/gemini"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_MESSAGES = 10
const MAX_CHARS = 500
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 10 * 60 * 1000

// Best-effort limiter to protect the free quota. In-memory, so it is per server
// instance (not shared across serverless instances) — a speed bump, not a wall.
const hits = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  if (hits.size > 1000) {
    for (const [key, entry] of hits) if (entry.resetAt < now) hits.delete(key)
  }
  const entry = hits.get(ip)
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT
}

function fail(error, status) {
  return NextResponse.json({ error }, { status })
}

function parseMessages(body) {
  if (!Array.isArray(body?.messages)) return null

  const cleaned = body.messages
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .filter((m) => m.content)

  // A failed answer leaves two user turns in a row; Gemini wants alternating roles.
  const messages = []
  for (const m of cleaned) {
    const last = messages[messages.length - 1]
    if (last?.role === m.role) last.content += `\n${m.content}`
    else messages.push({ ...m })
  }
  messages.splice(0, Math.max(0, messages.length - MAX_MESSAGES))

  // Gemini expects the conversation to start with a user turn and end with one.
  while (messages.length && messages[0].role !== "user") messages.shift()
  if (!messages.length || messages[messages.length - 1].role !== "user") return null

  return messages
}

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return fail("The AI assistant isn't configured yet. Please try again later.", 503)

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
  if (isRateLimited(ip)) return fail("You're asking a lot of questions! Please wait a few minutes and try again.", 429)

  let body
  try {
    body = await request.json()
  } catch {
    return fail("Invalid request.", 400)
  }

  const messages = parseMessages(body)
  if (!messages) return fail("Please send a question.", 400)

  let upstream
  try {
    upstream = await openGeminiStream({
      apiKey,
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      systemPrompt: buildSystemPrompt(),
      messages,
      signal: request.signal,
    })
  } catch (error) {
    if (error?.name === "AbortError") return new Response(null, { status: 499 })
    console.error("[chat] Gemini request failed:", error)
    return fail("Couldn't reach the AI service. Please try again.", 502)
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "")
    console.error(`[chat] Gemini responded ${upstream.status}:`, detail.slice(0, 500))
    if (upstream.status === 429) return fail("The AI assistant is busy right now. Please try again in a minute.", 429)
    return fail("The AI assistant ran into a problem. Please try again.", 502)
  }

  return new Response(sseToTextStream(upstream, OFF_TOPIC_REPLY), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  })
}
