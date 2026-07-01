'use client'

import { useState, useEffect } from 'react'
import { Shield, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CookieConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('swf_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleConsent = (preference: 'all' | 'essential') => {
    localStorage.setItem('swf_cookie_consent', preference)
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-md transition-all sm:left-6 sm:right-6 md:bottom-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground">We Value Your Privacy</h4>
            <p className="mt-1 text-xs leading-relaxed text-brand-muted max-w-xl">
              Script Worldview Foundation uses essential cookies to ensure our site works securely, and non-intrusive analytics cookies to help us improve user experience and measure community outreach. Read our{' '}
              <Link href="/privacy" className="underline font-medium text-brand-secondary hover:text-brand-primary">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 self-end md:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleConsent('essential')}
            className="text-xs border-border hover:bg-secondary"
          >
            Essential Only
          </Button>
          <Button
            size="sm"
            onClick={() => handleConsent('all')}
            className="bg-brand-primary text-white hover:bg-brand-primary/90 text-xs px-4"
          >
            Accept All
          </Button>
          <button
            onClick={() => setShow(false)}
            aria-label="Close cookie banner"
            title="Close cookie banner"
            className="ml-1 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
