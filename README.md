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

| Variable                 | Required | Notes                                                                                   |
| ------------------------ | -------- | --------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`         | yes      | Create one at https://aistudio.google.com/apikey. Server-side only.                      |
| `GEMINI_API_KEYS`        | no       | Extra keys, comma separated. Used in turn when a key runs out of quota (see below).      |
| `GEMINI_MODEL`           | no       | Defaults to `gemini-3.1-flash-lite` (free tier). Override if retired.                    |
| `GEMINI_FALLBACK_MODELS` | no       | Defaults to `gemini-3.5-flash-lite`. Comma separated; set it empty to turn fallback off. |

If Gemini is overloaded (5xx) or out of quota (429), `src/lib/gemini.js` retries with the next model
and key, at most 4 attempts per question. Google counts quota per project and per model, so extra
keys only help when they come from different projects; a second model is the simpler extra headroom.

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
- `public/MaiTanPhuc_Fullstack_Software_Engineer.pdf` — the CV behind every "Download CV" button
  (`profile.cvUrl`). Replace the file when the CV changes, and keep `src/data/profile.js` in sync with it.
- `public/companies/*` — website screenshots shown on the "Work experience" cards (see `images` in
  `src/data/profile.js`). freshdi.com blocks automated browsers, so its screenshots are taken by hand.
- `public/tech/*` — technology logos shown on the chips. Most come from Simple Icons (dark logos are
  recoloured to stay visible on the dark chips); AWS, OpenAI, Excel (XLSX), Zustand and Sentence
  Transformers come from other sets. To add one, drop the file here and register its names in
  `src/components/chat/tech-chip.jsx`; a name without a logo renders as a plain chip.

The avatar and screenshots used to live on Firebase Storage, which now returns HTTP 402; they were
recovered from Next's image cache and are now served from `public/`.
