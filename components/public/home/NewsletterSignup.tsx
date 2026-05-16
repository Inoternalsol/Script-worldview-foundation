'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    // Mock API call
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 1000)
  }

  return (
    <section className="bg-brand-primary py-24 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
          Stay Connected with Our Mission
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
          Subscribe to our newsletter for updates on our programs, impact stories, and ways you can get involved.
        </p>
        
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="home-newsletter-email" className="sr-only">Email address</label>
          <Input
            id="home-newsletter-email"
            name="email"
            autoComplete="email"
            type="email"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30"
          />
          <Button 
            type="submit" 
            variant="cta" 
            className="h-12 px-8"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Joining...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </form>
        {status === 'success' && (
          <p className="mt-4 text-sm text-brand-secondary/80">
            Thank you for subscribing! Check your inbox for a welcome email.
          </p>
        )}
      </div>
    </section>
  )
}
