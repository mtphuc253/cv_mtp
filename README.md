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

## Deploy (Vercel)

The chat needs a server (`/api/chat`), so this app can't be a static export / GitHub Pages site.
Import the repo in Vercel and add `GEMINI_API_KEY` under Settings → Environment Variables.

## Assets to re-host

`profile.avatar`, `profile.cvUrl` and the project screenshots in `src/data/profile.js` pointed at
Firebase Storage buckets that now return HTTP 402. The UI hides dead images, but the "Download CV"
link is broken until you host the PDF again (e.g. `public/cv.pdf` and `cvUrl: "/cv.pdf"`).
