'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function ProgramsPageSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: 'Our Programs',
    heroSubtitle: 'Explore our impactful initiatives across education, humanitarian response, community empowerment, and environmental sustainability.',
    heroBgImage: '/images/programs-hero.jpg',
    introTitle: 'Comprehensive Community Intervention',
    introText: 'Our programs are carefully designed in collaboration with community stakeholders to ensure sustainable impact and long-term empowerment.',
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings/programs_page')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setFormData({
              heroTitle: json.data.heroTitle || formData.heroTitle,
              heroSubtitle: json.data.heroSubtitle || formData.heroSubtitle,
              heroBgImage: json.data.heroBgImage || formData.heroBgImage,
              introTitle: json.data.introTitle || formData.introTitle,
              introText: json.data.introText || formData.introText,
            })
          }
        }
      } catch (error) {
        console.error('Failed to load programs page settings', error)
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
      const res = await fetch('/api/admin/settings/programs_page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      toast({
        title: 'Settings Saved',
        description: 'Programs Hub copywriting and header banner updated successfully.',
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
        <h1 className="font-heading text-2xl font-bold text-foreground">Programs Hub Content Editor</h1>
        <p className="mt-1 text-sm text-brand-muted">Configure hero copy and banner introduction for the public Programs &amp; Initiatives directory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Hero Section & Banner</h3>
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
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroBgImage" className="flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-brand-primary" /> Banner Background Image URL
              </Label>
              <Input
                id="heroBgImage"
                value={formData.heroBgImage}
                onChange={(e) => setFormData({ ...formData, heroBgImage: e.target.value })}
                placeholder="/images/programs-hero.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Directory Introduction Strip</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="introTitle">Section Title</Label>
              <Input
                id="introTitle"
                value={formData.introTitle}
                onChange={(e) => setFormData({ ...formData, introTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="introText">Introduction Description</Label>
              <Textarea
                id="introText"
                value={formData.introText}
                onChange={(e) => setFormData({ ...formData, introText: e.target.value })}
                rows={3}
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
            Save Programs Page Copy
          </Button>
        </div>
      </form>
    </div>
  )
}
