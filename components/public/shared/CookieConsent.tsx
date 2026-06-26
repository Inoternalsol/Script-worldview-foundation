'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Shield, Settings, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type CookiePreferences = {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  })

  const storageKey = 'swf_cookie_consent'

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem(storageKey)
    if (!consent) {
      // Delay showing the banner slightly for a smoother entry
      const timer = setTimeout(() => setOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function handleAcceptAll() {
    const allAccepted = { essential: true, analytics: true, marketing: true }
    localStorage.setItem(storageKey, JSON.stringify(allAccepted))
    setOpen(false)
  }

  function handleSavePreferences() {
    localStorage.setItem(storageKey, JSON.stringify(preferences))
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed bottom-5 left-5 z-[100] w-[min(480px,calc(100vw-40px))] overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl backdrop-blur-md transition-all duration-300 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-sm font-bold text-foreground">
            Privacy Consent & Cookies 🍪
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-brand-muted">
            We use cookies to optimize your experience, analyze site traffic, and deliver personalized materials. Learn more in our <a href="/privacy" className="underline hover:text-brand-primary">Privacy Policy</a>.
          </p>

          {!showPreferences ? (
            <div className="mt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-brand-muted hover:bg-secondary"
              >
                <Settings className="mr-1.5 h-3.5 w-3.5" />
                Customize
              </button>
              <Button
                type="button"
                variant="cta"
                onClick={handleAcceptAll}
                className="h-9 px-4 text-xs font-bold"
              >
                Accept All
              </Button>
            </div>
          ) : (
            <div className="mt-5 space-y-3.5 border-t border-border pt-4">
              {/* Essential */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-foreground">Essential Cookies</div>
                  <div className="text-[10px] text-brand-muted">Required for core functionalities and site security.</div>
                </div>
                <Switch checked={true} disabled={true} aria-label="Always on" />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-foreground">Analytics Cookies</div>
                  <div className="text-[10px] text-brand-muted">Helps us understand how visitors interact with the site.</div>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences((p) => ({ ...p, analytics: checked }))}
                  aria-label="Toggle analytics cookies"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-foreground">Marketing Cookies</div>
                  <div className="text-[10px] text-brand-muted">Enables personalized announcements and campaign recommendations.</div>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences((p) => ({ ...p, marketing: checked }))}
                  aria-label="Toggle marketing cookies"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold text-brand-muted hover:bg-secondary"
                >
                  Back
                </button>
                <Button
                  type="button"
                  variant="cta"
                  onClick={handleSavePreferences}
                  className="h-9 px-4 text-xs font-bold"
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Save Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
