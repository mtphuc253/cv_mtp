import { Award, BriefcaseBusiness, FolderGit2, GraduationCap, Mail, UserRound, Wrench } from "lucide-react"

// Each topic is a pre-made conversation in the sidebar: the visitor's question
// on the right, Phuc's answer (rich cards from topic-responses.jsx) on the left.
export const topics = [
  {
    id: "about",
    title: "Who is Phuc?",
    icon: UserRound,
    question: "Hi! Can you introduce Phuc to me?",
  },
  {
    id: "experience",
    title: "Work experience",
    icon: BriefcaseBusiness,
    question: "Tell me about Phuc's work experience.",
  },
  {
    id: "projects",
    title: "Highlight projects",
    icon: FolderGit2,
    question: "What projects has Phuc built?",
  },
  {
    id: "skills",
    title: "Tech stack & skills",
    icon: Wrench,
    question: "What is Phuc's tech stack and what skills does he have?",
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
    question: "Where did Phuc study?",
  },
  {
    id: "certificates",
    title: "Certificates",
    icon: Award,
    question: "Does Phuc have any certificates?",
  },
  {
    id: "contact",
    title: "Get in touch",
    icon: Mail,
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
