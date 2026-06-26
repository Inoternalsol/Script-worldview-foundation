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

  // 1. Identity & Overview
  if (t.includes('who are you') || t.includes('what is swf') || t.includes('script worldview') || t.includes('about')) {
    return "Script Worldview Foundation is a faith-inspired Nigerian NGO focused on education, humanitarian response, and community development across Nigeria. We believe that true transformation starts with a renewed worldview."
  }

  // 2. Mission, Vision, Values
  if (t.includes('mission')) {
    return "Our Mission is to empower individuals and communities with the knowledge, resources, and support they need to build dignified and self-sustaining futures."
  }
  if (t.includes('vision')) {
    return "Our Vision is a world where every community has the capacity to thrive, driven by educated minds and compassionate hearts."
  }
  if (t.includes('value')) {
    return "Our core values are: Faith-inspired service, absolute integrity, compassionate action, and a commitment to sustainable excellence."
  }

  // 3. History & Founding
  if (t.includes('history') || t.includes('founded') || t.includes('start') || t.includes('years') || t.includes('when')) {
    return "We started in 2010 as a small literacy program for out-of-school children in rural communities. In 2015, we officially registered as an NGO and expanded into humanitarian response. By 2023, we reached nationwide scale, impacting over 2,000,000 lives across 12 communities with 5 active programs."
  }

  // 4. Leadership & Team
  if (t.includes('leader') || t.includes('founder') || t.includes('chairman') || t.includes('board') || t.includes('team') || t.includes('sati') || t.includes('nnamdi') || t.includes('adeyemi')) {
    return "Our core leadership includes:\n• Rev. Joshua Sati — Founder & Chairman, with 15+ years in faith-inspired community development.\n• Sarah Nnamdi — Executive Director, leading operational strategy.\n• David Adeyemi — Director of Programs, managing local on-the-ground project implementation."
  }

  // 5. Intervention Pillars & Departments
  if (t.includes('education') || t.includes('scholarship') || t.includes('literacy') || t.includes('school')) {
    return "Our Education department focuses on literacy campaigns, building school infrastructure, and awarding academic scholarships (over 500 scholarships awarded to date!)."
  }
  if (t.includes('humanitarian') || t.includes('emergency') || t.includes('relief') || t.includes('flood') || t.includes('food')) {
    return "Our Humanitarian department coordinates emergency relief, food security distributions, and local healthcare interventions in response to crises such as central Nigeria floods."
  }
  if (t.includes('community') || t.includes('leadership') || t.includes('peacebuilding') || t.includes('empower')) {
    return "Our Community department facilitates local empowerment, peacebuilding training, and local leadership development to ensure bottom-up sustainable progress."
  }
  if (t.includes('research') || t.includes('data') || t.includes('policy')) {
    return "Our Research department is dedicated to collecting data-driven insights, conducting local surveys, and executing policy advocacy across key humanitarian sectors."
  }
  if (t.includes('capacity') || t.includes('training') || t.includes('cbo')) {
    return "Our Capacity Building program shares frameworks, training modules, and best practices with Community-Based Organizations (CBOs), local leaders, and educators."
  }
  if (t.includes('sport') || t.includes('basketball') || t.includes('athletics')) {
    return "Our Sports & Athletics department uses basketball programs to empower youth, foster teamwork, and develop character and leadership among young people."
  }

  // 6. Donations & Payment
  if (t.includes('donat') || t.includes('paystack') || t.includes('stripe') || t.includes('money') || t.includes('contribute') || t.includes('give')) {
    return "You can securely donate on our /donate page! We support direct NGN donations via Paystack (cards, bank transfers, USSD) and international currencies via Stripe."
  }

  // 7. Volunteering
  if (t.includes('volunteer') || t.includes('apply') || t.includes('join')) {
    return "We welcome volunteers! We offer three main tracks:\n1. Field Volunteers (medical outreaches, emergency relief)\n2. Skill-Based Volunteering (tech, design, writing, photography)\n3. Remote Ambassadors (advocacy, fundraising)\nApply today on our /volunteers page!"
  }

  // 8. Contact & Location
  if (t.includes('contact') || t.includes('email') || t.includes('phone') || t.includes('office') || t.includes('address') || t.includes('where') || t.includes('headquarter') || t.includes('jos') || t.includes('plateau')) {
    return "You can reach us directly:\n• Office: 123 Foundation Way, Jos, Plateau State, Nigeria\n• Phone: +234 (0) 000 000 0000 (Mon-Fri, 9am - 5pm WAT)\n• Email: hello@scriptworldviewfoundation.org\n• Contact Form: Visit our /contact page to send a direct message!"
  }

  // 9. Partnerships
  if (t.includes('partner') || t.includes('collaboration') || t.includes('corporate')) {
    return "We actively collaborate with corporations, other NGOs, and government bodies. To explore structural partnerships, please visit our Get Involved page or contact our partnership desk at hello@scriptworldviewfoundation.org."
  }

  // 10. General Fallback
  return "Thanks for reaching out! I can guide you with exact details on our departments (Education, Humanitarian, Community, Sports), leadership (Rev. Sati, Sarah Nnamdi), office location in Jos, volunteer tracks, or donation methods (Paystack/Stripe). What can I help you with today?"
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
        <Dialog.Content className="fixed bottom-5 right-5 z-50 w-[min(420px,calc(100vw-40px))] overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
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

          <div className="flex items-center gap-2 border-t border-border px-4 py-3">
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

