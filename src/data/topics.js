import { Award, BriefcaseBusiness, FolderGit2, GraduationCap, Mail, UserRound, Wrench } from "lucide-react"

// Each topic gets its own colour so the sidebar reads like a coloured table of
// contents. Class names are written out in full so Tailwind can see them.
const TONES = {
  cyan: { chip: "bg-cyan-500/10 text-cyan-300", pill: "from-cyan-500/15 via-cyan-500/5 to-transparent ring-cyan-400/25" },
  blue: { chip: "bg-blue-500/10 text-blue-300", pill: "from-blue-500/15 via-blue-500/5 to-transparent ring-blue-400/25" },
  violet: { chip: "bg-violet-500/10 text-violet-300", pill: "from-violet-500/15 via-violet-500/5 to-transparent ring-violet-400/25" },
  emerald: { chip: "bg-emerald-500/10 text-emerald-300", pill: "from-emerald-500/15 via-emerald-500/5 to-transparent ring-emerald-400/25" },
  amber: { chip: "bg-amber-500/10 text-amber-300", pill: "from-amber-500/15 via-amber-500/5 to-transparent ring-amber-400/25" },
  rose: { chip: "bg-rose-500/10 text-rose-300", pill: "from-rose-500/15 via-rose-500/5 to-transparent ring-rose-400/25" },
  sky: { chip: "bg-sky-500/10 text-sky-300", pill: "from-sky-500/15 via-sky-500/5 to-transparent ring-sky-400/25" },
}

export const NEUTRAL_TONE = {
  chip: "bg-white/[0.07] text-white/75",
  pill: "from-white/10 via-white/[0.03] to-transparent ring-white/20",
}

// Each topic is a pre-made conversation in the sidebar: the visitor's question
// on the right, Phuc's answer (rich cards from topic-responses.jsx) on the left.
export const topics = [
  {
    id: "about",
    title: "Who is Phuc?",
    icon: UserRound,
    tone: TONES.cyan,
    question: "Hi! Can you introduce Phuc to me?",
  },
  {
    id: "experience",
    title: "Work experience",
    icon: BriefcaseBusiness,
    tone: TONES.blue,
    question: "Tell me about Phuc's work experience.",
  },
  {
    id: "projects",
    title: "Highlight projects",
    icon: FolderGit2,
    tone: TONES.violet,
    question: "What projects has Phuc built?",
  },
  {
    id: "skills",
    title: "Tech stack & skills",
    icon: Wrench,
    tone: TONES.emerald,
    question: "What is Phuc's tech stack and what skills does he have?",
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
    tone: TONES.amber,
    question: "Where did Phuc study?",
  },
  {
    id: "certificates",
    title: "Certificates",
    icon: Award,
    tone: TONES.rose,
    question: "Does Phuc have any certificates?",
  },
  {
    id: "contact",
    title: "Get in touch",
    icon: Mail,
    tone: TONES.sky,
    question: "How can I get in touch with Phuc?",
  },
]

export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]))

// Quick prompts on the home screen. `topic` opens a pre-made conversation,
// the others are sent to the AI like any typed question.
export const suggestions = [
  { label: "Introduce Phuc", topic: "about" },
  { label: "Show me his projects", topic: "projects" },
  { label: "Work experience", topic: "experience" },
  { label: "Is Phuc a good fit for a Next.js role?", prompt: "Is Phuc a good fit for a Next.js role?" },
]
