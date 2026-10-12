import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

// react-markdown passes the hast `node` to every renderer; drop it so it never reaches the DOM.
const tag = (Tag, className) =>
  function MarkdownElement({ node, ...props }) {
    return <Tag className={className} {...props} />
  }

const components = {
  p: tag("p", "leading-7 [&:not(:first-child)]:mt-3"),
  ul: tag("ul", "mt-3 list-disc space-y-1.5 pl-5 marker:text-cyan-400"),
  ol: tag("ol", "mt-3 list-decimal space-y-1.5 pl-5 marker:text-cyan-400"),
  li: tag("li", "leading-7"),
  strong: tag("strong", "font-semibold text-foreground"),
  h1: tag("h3", "mt-4 text-lg font-semibold"),
  h2: tag("h3", "mt-4 text-lg font-semibold"),
  h3: tag("h3", "mt-4 font-semibold"),
  code: tag("code", "rounded bg-secondary px-1.5 py-0.5 font-mono text-[13px]"),
  a: function MarkdownLink({ node, ...props }) {
    return (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
      />
    )
  },
}

export function Markdown({ children, className }) {
  return (
    <div className={cn("text-base text-white", className)}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  )
}
