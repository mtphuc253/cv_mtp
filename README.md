# Phuc AI — interactive portfolio

Mai Tan Phuc's portfolio, presented as a ChatGPT-style chat. The sidebar holds pre-made
conversations (about, experience, projects, skills, education, certificates, contact) and visitors
can also type questions, which a Gemini model answers from the CV — and only from the CV.

Built with Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui, framer-motion.

## Run locally

```bash
npm install
cp .env.example .env   # then put your Gemini key in .env
npm run dev
```

Open http://localhost:3000.

| Variable         | Required | Notes                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| `GEMINI_API_KEY` | yes      | Create one at https://aistudio.google.com/apikey. Server-side only.     |
| `GEMINI_MODEL`   | no       | Defaults to `gemini-3.5-flash-lite` (free tier). Override if retired.   |

## Where things live

- `src/data/profile.js` — all CV content. Edit here; the cards and the AI both read it.
- `src/data/topics.js` — sidebar conversations and the visitor's question for each.
- `src/components/chat/` — chat UI (sidebar, messages, composer, rich answer cards).
- `src/app/api/chat/route.js` — streams Gemini's answer. Validates input, rate-limits per IP.
- `src/lib/chat-prompt.js` — system prompt that keeps the assistant on-topic.

## Roadmap

- Visitor tracking (who visits, which sections they open, what they ask) with Neon: not started, design in
  [docs/tracking-plan.md](docs/tracking-plan.md).

## Deploy (Vercel)

The chat needs a server (`/api/chat`), so this app can't be a static export / GitHub Pages site.
Import the repo in Vercel and add `GEMINI_API_KEY` under Settings → Environment Variables.

## Assets

- `public/avatar.webp` — portrait used in the profile card and the sidebar.
- `public/projects/*` — project screenshots shown in the "Highlight projects" answer.
- `public/logo.png` — the MTP logo (cropped from `src/app/favicon.ico`).

The avatar and screenshots used to live on Firebase Storage, which now returns HTTP 402; they were
recovered from Next's image cache and are now served from `public/`.

**Still broken:** `profile.cvUrl` in `src/data/profile.js` points at a PDF on that same Firebase bucket,
so "Download CV" fails. Host the PDF again (e.g. `public/cv.pdf`) and set `cvUrl: "/cv.pdf"`.
