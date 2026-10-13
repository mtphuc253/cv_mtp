import Image from "next/image"
import { Bot, Gauge, MessageSquareText, Network, Search, Sparkles } from "lucide-react"

// Brand logos are static files in public/tech (mostly from Simple Icons, recoloured for the dark
// chips). Names are matched loosely: "Next.js", "NextJS" and "next.js" all find the same logo.
const BRAND_ICONS = {
  "react.svg": ["React", "ReactJS"],
  "nextjs.svg": ["Next.js", "NextJS"],
  "typescript.svg": ["TypeScript"],
  "redux.svg": ["Redux", "Redux Toolkit"],
  "tanstack-query.svg": ["TanStack Query"],
  "zustand.png": ["Zustand"],
  "astro.svg": ["Astro"],
  "react-hook-form.svg": ["React Hook Form"],
  "shadcnui.svg": ["ShadcnUI", "Shadcn/ui"],
  "nodejs.svg": ["Node.js", "NodeJS"],
  "express.svg": ["Express", "Express.js"],
  "python.svg": ["Python", "Python (Frappe)"],
  "dotnet.svg": ["ASP.NET"],
  "jwt.svg": ["JWT"],
  "postgresql.svg": ["PostgreSQL"],
  "mongodb.svg": ["MongoDB"],
  "redis.svg": ["Redis"],
  "firebase.svg": ["Firebase"],
  "cloudinary.svg": ["Cloudinary"],
  "aws.svg": ["AWS"],
  "excel.svg": ["XLSX"],
  "git.svg": ["Git"],
  "google-analytics.svg": ["Google Analytics"],
  "openai.svg": ["OpenAI API", "ChatGPT"],
  "gemini.svg": ["Gemini", "Gemini API"],
  "claude.svg": ["Claude", "Claude API"],
  "claude-code.svg": ["Claude Code"],
  "mcp.svg": ["MCP", "MCP servers"],
  "sentence-transformers.png": ["Sentence Transformer AI"],
}

// Skills that are practices rather than products have no logo; they get a plain icon instead.
const GENERIC_ICONS = [
  [Network, ["RESTful API"]],
  [Bot, ["AI agents"]],
  [MessageSquareText, ["Prompt engineering"]],
  [Sparkles, ["AI-assisted development"]],
  [Search, ["Technical SEO"]],
  [Gauge, ["Core Web Vitals"]],
]

const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "")

const BRAND_BY_NAME = new Map(
  Object.entries(BRAND_ICONS).flatMap(([file, names]) => names.map((name) => [normalize(name), file])),
)
const GENERIC_BY_NAME = new Map(
  GENERIC_ICONS.flatMap(([Icon, names]) => names.map((name) => [normalize(name), Icon])),
)

export function TechChip({ children: name }) {
  const file = BRAND_BY_NAME.get(normalize(name))
  const GenericIcon = GENERIC_BY_NAME.get(normalize(name))
  const hasIcon = Boolean(file || GenericIcon)

  return (
    <span
      className={
        hasIcon
          ? "inline-flex items-center gap-1.5 rounded-full bg-secondary py-1 pl-2.5 pr-3 text-[13px] font-medium text-white"
          : "inline-flex items-center rounded-full bg-secondary px-3 py-1 text-[13px] font-medium text-white"
      }
    >
      {file && <Image src={`/tech/${file}`} alt="" width={16} height={16} unoptimized className="size-4 shrink-0 object-contain" />}
      {GenericIcon && <GenericIcon className="size-4 shrink-0 text-[#a8c7fa]" />}
      {name}
    </span>
  )
}
