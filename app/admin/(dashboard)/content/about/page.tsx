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

export default function AboutPageSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: 'Who We Are',
    heroSubtitle: 'We are a faith-inspired organization committed to shaping minds and transforming communities across Nigeria through education, humanitarian response, and sustainable development.',
    heroBgImage: '/images/about-hero.png',
    missionText: 'To empower individuals and communities with the knowledge, resources, and support they need to build dignified and self-sustaining futures.',
    visionText: 'A world where every community has the capacity to thrive, driven by educated minds and compassionate hearts.',
    valuesText: 'Faith-inspired service, absolute integrity, compassionate action, and a commitment to sustainable excellence.',
    quoteText: '"Faith-inspired, values-driven. We believe that true transformation starts with a renewed worldview."',
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings/about_page')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setFormData({
              heroTitle: json.data.heroTitle || formData.heroTitle,
              heroSubtitle: json.data.heroSubtitle || formData.heroSubtitle,
              heroBgImage: json.data.heroBgImage || formData.heroBgImage,
              missionText: json.data.missionText || formData.missionText,
              visionText: json.data.visionText || formData.visionText,
              valuesText: json.data.valuesText || formData.valuesText,
              quoteText: json.data.quoteText || formData.quoteText,
            })
          }
        }
      } catch (error) {
        console.error('Failed to load about page settings', error)
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
      const res = await fetch('/api/admin/settings/about_page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      toast({
        title: 'Settings Saved',
        description: 'The About Us page has been updated successfully.',
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
        <h1 className="font-heading text-2xl font-bold text-foreground">About Us Page Content Editor</h1>
        <p className="mt-1 text-sm text-brand-muted">Customize hero copywriting, institutional pillars, vision statements, and identity quote.</p>
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
                placeholder="Who We Are"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle Description</Label>
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
                placeholder="/images/about-hero.png"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Mission, Vision & Core Values</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="missionText">Our Mission Statement</Label>
              <Textarea
                id="missionText"
                value={formData.missionText}
                onChange={(e) => setFormData({ ...formData, missionText: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visionText">Our Vision Statement</Label>
              <Textarea
                id="visionText"
                value={formData.visionText}
                onChange={(e) => setFormData({ ...formData, visionText: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valuesText">Our Core Values</Label>
              <Textarea
                id="valuesText"
                value={formData.valuesText}
                onChange={(e) => setFormData({ ...formData, valuesText: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Identity Statement Banner</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quoteText">Highlighted Identity Quote</Label>
              <Textarea
                id="quoteText"
                value={formData.quoteText}
                onChange={(e) => setFormData({ ...formData, quoteText: e.target.value })}
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
            Save About Us Copy
          </Button>
        </div>
      </form>
    </div>
  )
}
