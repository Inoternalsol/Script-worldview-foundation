'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { DonationForm } from '@/components/public/forms/DonationForm'

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000]

export function DonateSection() {
  const [amount, setAmount] = useState<number | 'custom'>(10000)
  const [customAmount, setCustomAmount] = useState('')
  const [isMonthly, setIsMonthly] = useState(false)

  return (
    <section className="bg-brand-primary dark:bg-slate-950 py-20 text-white border-y border-border dark:border-white/5">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h2 className="font-heading text-4xl font-bold md:text-5xl">
              Your support creates lasting change
            </h2>
            <p className="text-lg text-white/90">
              Every contribution helps us reach more communities, educate more children, and provide vital humanitarian relief when it's needed most.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">1</div>
                <p>Choose an amount to give today.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">2</div>
                <p>Fill in your details securely.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">3</div>
                <p>Make a real impact immediately.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card dark:bg-slate-900 border dark:border-white/10 p-6 text-foreground shadow-xl md:p-8">
            <DonationForm noCardStyle={true} />
          </div>
        </div>
      </div>
    </section>
  )
}
