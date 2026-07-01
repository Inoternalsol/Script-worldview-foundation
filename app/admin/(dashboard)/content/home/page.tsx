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
import { ImageUploadInput } from '@/components/admin/ImageUploadInput'

export default function HomePageSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: 'Shaping Minds. Transforming Communities.',
    heroSubtitle: 'Script Worldview Foundation is dedicated to empowering individuals and transforming communities across Nigeria through education, humanitarian response, and sustainable development.',
    heroBgImage: '/images/hero-bg.jpg',
    missionHighlight: 'Advancing Education & Humanitarian Response',
    missionStatement: 'We believe that lasting change starts with a renewed mindset. Through structured education, timely humanitarian intervention, and community-led development programs, we build resilient futures across Nigeria.',
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings/home_page')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setFormData({
              heroTitle: json.data.heroTitle || formData.heroTitle,
              heroSubtitle: json.data.heroSubtitle || formData.heroSubtitle,
              heroBgImage: json.data.heroBgImage || formData.heroBgImage,
              missionHighlight: json.data.missionHighlight || formData.missionHighlight,
              missionStatement: json.data.missionStatement || formData.missionStatement,
            })
          }
        }
      } catch (error) {
        console.error('Failed to load home page settings', error)
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
      const res = await fetch('/api/admin/settings/home_page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      toast({
        title: 'Settings Saved',
        description: 'The Home Page has been updated successfully.',
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
        <h1 className="font-heading text-2xl font-bold text-foreground">Home Page Content Editor</h1>
        <p className="mt-1 text-sm text-brand-muted">Update the main headlines, introductory copywriting, and background images on the public homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Hero Section & Banner Image</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                placeholder="e.g. Empowering Lives, Transforming Communities"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Textarea
                id="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="e.g. Join us in making a difference..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroBgImage" className="flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-brand-primary" /> Hero Banner Background Image URL
              </Label>
              <ImageUploadInput
                id="heroBgImage"
                value={formData.heroBgImage}
                onChange={(url) => setFormData({ ...formData, heroBgImage: url })}
                placeholder="/images/hero-bg.jpg or click Upload Image..."
              />
              <p className="text-xs text-brand-muted">Enter a relative image path or full URL to customize the landing background image.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Mission Strip</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="missionHighlight">Mission Highlight Headline (Bold text)</Label>
              <Input
                id="missionHighlight"
                value={formData.missionHighlight}
                onChange={(e) => setFormData({ ...formData, missionHighlight: e.target.value })}
                placeholder="e.g. Advancing Education & Humanitarian Response"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="missionStatement">Mission Statement Description</Label>
              <Textarea
                id="missionStatement"
                value={formData.missionStatement}
                onChange={(e) => setFormData({ ...formData, missionStatement: e.target.value })}
                placeholder="e.g. Script Worldview Foundation is dedicated to..."
                rows={4}
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
            Save Home Page Copy
          </Button>
        </div>
      </form>
    </div>
  )
}
