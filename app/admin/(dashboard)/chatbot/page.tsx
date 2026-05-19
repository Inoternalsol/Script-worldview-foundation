'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { MessageSquare, Save, Settings, Database, Plus, Trash2 } from 'lucide-react'

// Mock FAQ chunks
const initialFaqs = [
  { id: '1', question: 'How can I donate NGN?', answer: 'You can contribute NGN directly via our Paystack gateway using cards, bank transfers or USSD.' },
  { id: '2', question: 'What is your core mission?', answer: 'We are a faith-inspired NGO focused on shaping minds, transforming communities, education, and humanitarian services.' },
  { id: '3', question: 'Are volunteer applications open?', answer: 'Yes! Applications are always open. You can apply on our Volunteer form page.' }
]

export default function ChatbotConfigurationPage() {
  const { toast } = useToast()
  const [faqs, setFaqs] = useState(initialFaqs)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [greeting, setGreeting] = useState("Hello! I am the Script Worldview Foundation Assistant. How can I help you shape minds and transform communities today?")

  function handleSaveSystemPrompt() {
    toast({
      title: 'Chatbot Saved',
      description: 'System instructions and welcome greeting updated successfully.',
    })
  }

  function handleAddFaq() {
    if (!newQuestion || !newAnswer) return
    setFaqs((prev) => [
      ...prev,
      { id: Date.now().toString(), question: newQuestion, answer: newAnswer }
    ])
    setNewQuestion('')
    setNewAnswer('')
    toast({
      title: 'Knowledge FAQ Added',
      description: 'The query chunk is now indexable by the RAG fallback engine.',
    })
  }

  function handleDeleteFaq(id: string) {
    setFaqs((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: 'Item Removed',
      description: 'FAQ context deleted.',
      variant: 'destructive',
    })
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">AI Chatbot Management</h1>
        <p className="mt-1 text-sm text-brand-muted">Configure prompt behaviors and maintain RAG knowledge-base directories.</p>
      </div>

      <div className="grid gap-6">
        {/* Core Behavior */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-black/5 pb-4">
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
                defaultValue="You are the official SWF Assistant representing the NGO Script Worldview Foundation. You are warm, professional, helpful and values-driven. Provide brief, elegant responses. Refer users to /donate, /volunteers, and /careers pages."
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
          <CardHeader className="flex flex-row items-center gap-3 border-b border-black/5 pb-4">
            <Database className="h-5 w-5 text-brand-secondary" />
            <div>
              <h2 className="font-heading text-lg font-semibold">RAG FAQ Knowledge Base</h2>
              <p className="text-xs text-brand-muted">Dynamic contextual queries parsed by the Assistant.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* FAQ List */}
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="flex items-start justify-between gap-4 rounded-lg bg-gray-50 p-4 border border-black/5">
                  <div className="space-y-1">
                    <div className="font-semibold text-sm">{faq.question}</div>
                    <div className="text-xs text-brand-muted">{faq.answer}</div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50 shrink-0" onClick={() => handleDeleteFaq(faq.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add FAQ form */}
            <div className="border-t border-black/5 pt-4 space-y-4">
              <h3 className="font-semibold text-sm">Add Context Chunk</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newQ">Question/Trigger</Label>
                  <Input id="newQ" placeholder="e.g. Where is your headquarters?" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newA">Answer/Context</Label>
                  <Input id="newA" placeholder="e.g. Lagos, Nigeria." value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
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
