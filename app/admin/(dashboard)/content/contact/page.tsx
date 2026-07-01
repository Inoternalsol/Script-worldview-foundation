'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save, ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ContactPageSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: 'Contact Us',
    heroSubtitle: "We'd love to hear from you. Reach out to us for inquiries, partnerships, or support.",
    introHeadline: 'Get in Touch',
    introText: 'Whether you have a question about our programs, want to volunteer, or are interested in partnering with us, our team is ready to answer all your questions.',
    addressTitle: 'Our Office Headquarters',
    addressDetails: '123 Foundation Way, Jos, Plateau State, Nigeria',
    phoneTitle: 'Call Us Directly',
    phonePrimary: '+234 800 123 4567',
    phoneSecondary: '+234 801 987 6543',
    emailTitle: 'Send an Email',
    emailPrimary: 'info@scriptworldviewfoundation.org',
    emailSecondary: 'partnerships@scriptworldviewfoundation.org',
    hoursTitle: 'Working Hours',
    hoursDetails: 'Monday — Friday: 8:00 AM — 5:00 PM (WAT)',
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings/contact_page')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setFormData({
              heroTitle: json.data.heroTitle || formData.heroTitle,
              heroSubtitle: json.data.heroSubtitle || formData.heroSubtitle,
              introHeadline: json.data.introHeadline || formData.introHeadline,
              introText: json.data.introText || formData.introText,
              addressTitle: json.data.addressTitle || formData.addressTitle,
              addressDetails: json.data.addressDetails || formData.addressDetails,
              phoneTitle: json.data.phoneTitle || formData.phoneTitle,
              phonePrimary: json.data.phonePrimary || formData.phonePrimary,
              phoneSecondary: json.data.phoneSecondary || formData.phoneSecondary,
              emailTitle: json.data.emailTitle || formData.emailTitle,
              emailPrimary: json.data.emailPrimary || formData.emailPrimary,
              emailSecondary: json.data.emailSecondary || formData.emailSecondary,
              hoursTitle: json.data.hoursTitle || formData.hoursTitle,
              hoursDetails: json.data.hoursDetails || formData.hoursDetails,
            })
          }
        }
      } catch (error) {
        console.error('Failed to load contact page settings', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/settings/contact_page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      toast({
        title: 'Settings Saved',
        description: 'Contact details and office desk information updated successfully.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/admin/content/pages"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Website Pages
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Contact Us Page Content Editor</h1>
        <p className="mt-1 text-sm text-brand-muted">Update public office addresses, telephone lines, inquiry emails, and working hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Hero Section & Headline</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Headline</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Textarea
                id="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
              <div className="space-y-2">
                <Label htmlFor="introHeadline">Section Title</Label>
                <Input
                  id="introHeadline"
                  value={formData.introHeadline}
                  onChange={(e) => setFormData({ ...formData, introHeadline: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="introText">Introduction Paragraph</Label>
                <Textarea
                  id="introText"
                  value={formData.introText}
                  onChange={(e) => setFormData({ ...formData, introText: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-primary" /> Headquarters Address
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressTitle">Location Label</Label>
              <Input
                id="addressTitle"
                value={formData.addressTitle}
                onChange={(e) => setFormData({ ...formData, addressTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressDetails">Full Street Address</Label>
              <Textarea
                id="addressDetails"
                value={formData.addressDetails}
                onChange={(e) => setFormData({ ...formData, addressDetails: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                <Phone className="h-5 w-5 text-brand-primary" /> Telephone Numbers
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phonePrimary">Primary Telephone Line</Label>
                <Input
                  id="phonePrimary"
                  value={formData.phonePrimary}
                  onChange={(e) => setFormData({ ...formData, phonePrimary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneSecondary">Secondary Telephone Line</Label>
                <Input
                  id="phoneSecondary"
                  value={formData.phoneSecondary}
                  onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                <Mail className="h-5 w-5 text-brand-primary" /> Email Addresses
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailPrimary">Primary Inquiry Email</Label>
                <Input
                  id="emailPrimary"
                  value={formData.emailPrimary}
                  onChange={(e) => setFormData({ ...formData, emailPrimary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailSecondary">Partnerships Desk Email</Label>
                <Input
                  id="emailSecondary"
                  value={formData.emailSecondary}
                  onChange={(e) => setFormData({ ...formData, emailSecondary: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-primary" /> Working Hours
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hoursDetails">Schedule Description</Label>
              <Input
                id="hoursDetails"
                value={formData.hoursDetails}
                onChange={(e) => setFormData({ ...formData, hoursDetails: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" asChild>
            <Link href="/admin/content/pages">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving} className="gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Contact Page Copy
          </Button>
        </div>
      </form>
    </div>
  )
}
