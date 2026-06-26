'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { MessageSquare, Save, Settings, Database, Plus, Trash2 } from 'lucide-react'

type FaqItem = {
  id: string
  question: string
  answer: string
}

type ChatbotConfig = {
  greeting: string
  systemPrompt: string
  faqs: FaqItem[]
}

const defaultGreeting = "Hello! I am the Script Worldview Foundation Assistant. How can I help you shape minds and transform communities today?"
const defaultPrompt = "You are the official SWF Assistant representing the NGO Script Worldview Foundation. You are warm, professional, helpful and values-driven. Provide brief, elegant responses. Refer users to /donate, /volunteers, and /careers pages."

export default function ChatbotConfigurationPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [greeting, setGreeting] = useState(defaultGreeting)
  const [systemPrompt, setSystemPrompt] = useState(defaultPrompt)

  async function loadConfig() {
    try {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('Failed to load settings')
      const data = await res.json()
      
      const config = data.data?.chatbot as ChatbotConfig | undefined
      if (config) {
        setGreeting(config.greeting || defaultGreeting)
        setSystemPrompt(config.systemPrompt || defaultPrompt)
        setFaqs(config.faqs || [])
      }
    } catch (err: any) {
      toast({
        title: 'Load Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  async function saveConfig(updatedFaqs = faqs, updatedGreeting = greeting, updatedPrompt = systemPrompt) {
    try {
      // First get existing settings
      const getRes = await fetch('/api/admin/settings')
      const currentSettings = getRes.ok ? (await getRes.json()).data : {}

      const nextSettings = {
        ...currentSettings,
        chatbot: {
          greeting: updatedGreeting,
          systemPrompt: updatedPrompt,
          faqs: updatedFaqs,
        }
      }

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextSettings),
      })

      if (!res.ok) throw new Error('Failed to save chatbot settings')
      toast({
        title: 'Configuration Updated',
        description: 'Chatbot behavior settings saved to database.',
      })
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  function handleSaveSystemPrompt() {
    saveConfig(faqs, greeting, systemPrompt)
  }

  function handleAddFaq() {
    if (!newQuestion || !newAnswer) return
    const updated = [
      ...faqs,
      { id: Date.now().toString(), question: newQuestion, answer: newAnswer }
    ]
    setFaqs(updated)
    setNewQuestion('')
    setNewAnswer('')
    saveConfig(updated)
  }

  function handleDeleteFaq(id: string) {
    const updated = faqs.filter((item) => item.id !== id)
    setFaqs(updated)
    saveConfig(updated)
  }

  if (loading) return <div className="p-12 text-center text-brand-muted">Loading configuration...</div>

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">AI Chatbot Management</h1>
        <p className="mt-1 text-sm text-brand-muted">Configure prompt behaviors and maintain RAG knowledge-base directories.</p>
      </div>

      <div className="grid gap-6">
        {/* Core Behavior */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-border pb-4">
            <Settings className="h-5 w-5 text-brand-primary" />
            <div>
              <h2 className="font-heading text-lg font-semibold">Assistant Identity</h2>
              <p className="text-xs text-brand-muted">Greetings and system prompts.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="greetingText">Welcome Greeting Message</Label>
              <Textarea
                id="greetingText"
                rows={3}
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">Personality & Instructions</Label>
              <Textarea
                id="systemPrompt"
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={handleSaveSystemPrompt} className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save System Prompts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQs Knowledge Base RAG */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-border pb-4">
            <Database className="h-5 w-5 text-brand-secondary" />
            <div>
              <h2 className="font-heading text-lg font-semibold">RAG FAQ Knowledge Base</h2>
              <p className="text-xs text-brand-muted">Dynamic contextual queries parsed by the Assistant.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* FAQ List */}
            <div className="space-y-3">
              {faqs.length === 0 ? (
                <div className="p-6 text-center text-xs text-brand-muted">No FAQ context chunks in the knowledge base. Add some triggers below!</div>
              ) : (
                faqs.map((faq) => (
                  <div key={faq.id} className="flex items-start justify-between gap-4 rounded-lg bg-muted p-4 border border-border">
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">{faq.question}</div>
                      <div className="text-xs text-brand-muted">{faq.answer}</div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50 shrink-0" onClick={() => handleDeleteFaq(faq.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Add FAQ form */}
            <div className="border-t border-border pt-4 space-y-4">
              <h3 className="font-semibold text-sm">Add Context Chunk</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newQ">Question/Trigger</Label>
                  <Input id="newQ" placeholder="e.g. Where is your headquarters?" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newA">Answer/Context</Label>
                  <Input id="newA" placeholder="e.g. Jos, Nigeria." value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
                </div>
              </div>
              <Button size="sm" onClick={handleAddFaq} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add to Knowledge Base
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
