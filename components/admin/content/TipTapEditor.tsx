'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TipTapEditor({ value, onChange, placeholder = 'Write your article...' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-secondary underline font-semibold',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[250px] p-4 text-foreground bg-card rounded-b-xl border border-border border-t-0',
          'prose-headings:font-heading prose-headings:font-bold prose-headings:text-brand-primary',
          'prose-a:text-brand-secondary prose-blockquote:border-l-4 prose-blockquote:border-brand-primary prose-blockquote:pl-4 prose-blockquote:italic'
        ),
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-muted border border-border p-2 rounded-t-xl select-none">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('heading', { level: 1 }) && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('heading', { level: 2 }) && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('heading', { level: 3 }) && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-6 bg-black/10 mx-1" />

        {/* Text styling */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('bold') && 'bg-brand-primary/10 text-brand-primary font-bold'
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('italic') && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('strike') && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Strike"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('code') && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-6 bg-black/10 mx-1" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive({ textAlign: 'left' }) && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive({ textAlign: 'center' }) && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive({ textAlign: 'right' }) && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive({ textAlign: 'justify' }) && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-6 bg-black/10 mx-1" />

        {/* Lists & blocks */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('bulletList') && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('orderedList') && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('blockquote') && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-6 bg-black/10 mx-1" />

        {/* Links */}
        <button
          type="button"
          onClick={setLink}
          className={cn(
            'p-1.5 rounded-lg hover:bg-secondary/80 transition-colors',
            editor.isActive('link') && 'bg-brand-primary/10 text-brand-primary'
          )}
          title="Add Link"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className="p-1.5 rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-40"
          title="Remove Link"
        >
          <Unlink className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-6 bg-black/10 mx-1 flex-grow sm:flex-grow-0" />

        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-40 ml-auto sm:ml-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-40"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
    </div>
  )
}
