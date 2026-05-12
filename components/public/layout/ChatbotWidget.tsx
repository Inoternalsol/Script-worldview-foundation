'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: number
}

function createReply(text: string) {
  const t = text.toLowerCase()
  if (t.includes('donat') || t.includes('paystack') || t.includes('stripe')) {
    return 'You can donate on the Donate page. Choose NGN for Paystack or international currencies for Stripe.'
  }
  if (t.includes('volunteer')) {
    return 'We’d love your support. Visit Get Involved to apply and tell us your skills and availability.'
  }
  if (t.includes('program') || t.includes('education') || t.includes('humanitarian') || t.includes('community')) {
    return 'Our work focuses on Education, Humanitarian Response, and Community Development. Tell me which area you care about most.'
  }
  if (t.includes('contact') || t.includes('email') || t.includes('phone')) {
    return 'You can reach us via the Contact page. If you share your name and email here, we can guide you to the right department.'
  }
  return 'Thanks for reaching out. Ask me about programs, donating, volunteering, or how to contact the right team.'
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)

  const storageKey = 'swf_chat_history'

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            'Hello. I’m here to help you find the right program, donation option, or contact path. What would you like to do today?',
          ts: Date.now(),
        },
      ])
      return
    }

    try {
      const parsed = JSON.parse(raw) as ChatMessage[]
      setMessages(parsed)
    } catch {
      localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    if (!messages.length) return
    localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [open, messages])

  const canSend = useMemo(() => input.trim().length > 0, [input])

  function send() {
    const text = input.trim()
    if (!text) return
    const now = Date.now()
    setInput('')

    const user: ChatMessage = { id: `u_${now}`, role: 'user', content: text, ts: now }
    const assistant: ChatMessage = {
      id: `a_${now}`,
      role: 'assistant',
      content: createReply(text),
      ts: now + 1,
    }

    setMessages((prev) => [...prev, user, assistant])
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cta text-white shadow-card hover:bg-brand-cta/90"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed bottom-5 right-5 z-50 w-[min(420px,calc(100vw-40px))] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate font-heading text-base font-semibold text-foreground">
                SWF Assistant
              </div>
              <div className="truncate text-xs text-brand-muted">
                Ask about programs, donations, and getting involved.
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-black/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div ref={listRef} className="max-h-[52vh] space-y-3 overflow-auto px-4 py-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6',
                  m.role === 'user'
                    ? 'ml-auto bg-brand-primary text-white'
                    : 'bg-black/5 text-foreground',
                )}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-black/10 px-4 py-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') send()
              }}
            />
            <Button type="button" variant="cta" onClick={send} disabled={!canSend} className="px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

