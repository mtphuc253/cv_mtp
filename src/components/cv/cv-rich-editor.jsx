"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, Link2, List, ListOrdered, Redo2, Underline, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toHref } from "@/lib/cv-url"
import { cn } from "@/lib/utils"

// What the sheet can show (see cv-rich.js): paragraphs, bold / italic / underline, lists, links.
const EXTENSIONS = [
  StarterKit.configure({
    heading: false,
    blockquote: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    trailingNode: false,
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
  }),
]

function ToolButton({ label, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the selection in the editor when a button is pressed.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        active && "bg-brand-soft text-brand-ink hover:bg-brand-soft",
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [url, setUrl] = useState("")

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      bullets: e.isActive("bulletList"),
      numbers: e.isActive("orderedList"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  const openLink = () => {
    setUrl(editor.getAttributes("link").href ?? "")
    setLinkOpen((open) => !open)
  }

  const applyLink = () => {
    const text = url.trim()
    if (!text) editor.chain().focus().extendMarkRange("link").unsetLink().run()
    else {
      const href = toHref(text)
      if (!href) return
      if (editor.state.selection.empty && !state.link) {
        // Nothing selected: insert the address itself as the link text.
        editor.chain().focus().insertContent({ type: "text", text, marks: [{ type: "link", attrs: { href } }] }).run()
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href }).run()
      }
    }
    setLinkOpen(false)
  }

  const chain = () => editor.chain().focus()

  return (
    <div className="border-b bg-secondary/50">
      <div className="flex flex-wrap items-center gap-0.5 p-1">
        <ToolButton label="Bold (Ctrl+B)" active={state.bold} onClick={() => chain().toggleBold().run()}>
          <Bold className="size-4" />
        </ToolButton>
        <ToolButton label="Italic (Ctrl+I)" active={state.italic} onClick={() => chain().toggleItalic().run()}>
          <Italic className="size-4" />
        </ToolButton>
        <ToolButton label="Underline (Ctrl+U)" active={state.underline} onClick={() => chain().toggleUnderline().run()}>
          <Underline className="size-4" />
        </ToolButton>
        <span aria-hidden className="mx-1 h-4 w-px bg-border" />
        <ToolButton label="Bullet list" active={state.bullets} onClick={() => chain().toggleBulletList().run()}>
          <List className="size-4" />
        </ToolButton>
        <ToolButton label="Numbered list" active={state.numbers} onClick={() => chain().toggleOrderedList().run()}>
          <ListOrdered className="size-4" />
        </ToolButton>
        <ToolButton label="Link" active={state.link || linkOpen} onClick={openLink}>
          <Link2 className="size-4" />
        </ToolButton>
        <span aria-hidden className="mx-1 h-4 w-px bg-border" />
        <ToolButton label="Undo (Ctrl+Z)" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
          <Undo2 className="size-4" />
        </ToolButton>
        <ToolButton label="Redo (Ctrl+Shift+Z)" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
          <Redo2 className="size-4" />
        </ToolButton>
      </div>

      {linkOpen && (
        <div className="flex items-center gap-2 border-t p-1.5">
          <Input
            autoFocus
            aria-label="Link address"
            placeholder="https://example.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                applyLink()
              } else if (event.key === "Escape") setLinkOpen(false)
            }}
            className="h-8 bg-card"
          />
          <Button size="sm" onClick={applyLink}>
            {url.trim() ? "Apply" : "Remove"}
          </Button>
        </div>
      )}
    </div>
  )
}

// A small rich-text editor. `value` and `onChange` use the HTML subset described above; an empty
// editor reports "". The editor keeps its own state while typing and only loads `value` again when
// it was changed from outside (another CV was opened, a file imported).
export function CvRichEditor({ value, onChange, label, rows = 4 }) {
  const emitted = useRef(value)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { role: "textbox", "aria-multiline": "true", "aria-label": label } },
    onUpdate: ({ editor: e }) => {
      emitted.current = e.isEmpty ? "" : e.getHTML()
      onChangeRef.current(emitted.current)
    },
  })

  useEffect(() => {
    if (!editor || value === emitted.current) return
    emitted.current = value
    editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  return (
    <div
      className="cv-editor overflow-hidden rounded-md border border-input bg-card shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"
      style={{ "--rows": rows }}
    >
      {editor ? <Toolbar editor={editor} /> : <div className="h-[37px] border-b bg-secondary/50" />}
      <EditorContent editor={editor} />
    </div>
  )
}
