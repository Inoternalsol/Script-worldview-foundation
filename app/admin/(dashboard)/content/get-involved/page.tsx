'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save, ArrowLeft, Heart, Users, Target } from 'lucide-react'
import Link from 'next/link'

export default function GetInvolvedPageSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: 'Get Involved',
    heroSubtitle: 'There are many ways to be part of our mission. Partner with us to empower lives and rebuild communities across Nigeria.',
    volunteerTitle: 'Become a Volunteer',
    volunteerDesc: 'Join our dedicated team of field workers, mentors, educators, and community champions across Nigeria.',
    donateTitle: 'Support Our Work',
    donateDesc: 'Your financial support enables us to reach out-of-school children, provide humanitarian relief, and deploy clean water infrastructure.',
    partnerTitle: 'Corporate & Institutional Partnerships',
    partnerDesc: 'Collaborate with us on CSR initiatives, co-funded community development, and sustainable impact programs.',
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings/get_involved_page')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setFormData({
              heroTitle: json.data.heroTitle || formData.heroTitle,
              heroSubtitle: json.data.heroSubtitle || formData.heroSubtitle,
              volunteerTitle: json.data.volunteerTitle || formData.volunteerTitle,
              volunteerDesc: json.data.volunteerDesc || formData.volunteerDesc,
              donateTitle: json.data.donateTitle || formData.donateTitle,
              donateDesc: json.data.donateDesc || formData.donateDesc,
              partnerTitle: json.data.partnerTitle || formData.partnerTitle,
              partnerDesc: json.data.partnerDesc || formData.partnerDesc,
            })
          }
        }
      } catch (error) {
        console.error('Failed to load get involved page settings', error)
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
      const res = await fetch('/api/admin/settings/get_involved_page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      toast({
        title: 'Settings Saved',
        description: 'Get Involved engagement sections updated successfully.',
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
        <h1 className="font-heading text-2xl font-bold text-foreground">Get Involved Page Content Editor</h1>
        <p className="mt-1 text-sm text-brand-muted">Configure headlines and call-to-action descriptions for volunteering, fundraising, and partnerships.</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" /> Volunteer Section
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="volunteerTitle">Volunteer Section Title</Label>
              <Input
                id="volunteerTitle"
                value={formData.volunteerTitle}
                onChange={(e) => setFormData({ ...formData, volunteerTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volunteerDesc">Volunteer Description Copy</Label>
              <Textarea
                id="volunteerDesc"
                value={formData.volunteerDesc}
                onChange={(e) => setFormData({ ...formData, volunteerDesc: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <Heart className="h-5 w-5 text-brand-primary" /> Donation Section
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="donateTitle">Donation Call to Action Title</Label>
              <Input
                id="donateTitle"
                value={formData.donateTitle}
                onChange={(e) => setFormData({ ...formData, donateTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donateDesc">Donation Description Copy</Label>
              <Textarea
                id="donateDesc"
                value={formData.donateDesc}
                onChange={(e) => setFormData({ ...formData, donateDesc: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <Target className="h-5 w-5 text-brand-primary" /> Institutional Partnerships
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partnerTitle">Partnership Title</Label>
              <Input
                id="partnerTitle"
                value={formData.partnerTitle}
                onChange={(e) => setFormData({ ...formData, partnerTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerDesc">Partnership Description Copy</Label>
              <Textarea
                id="partnerDesc"
                value={formData.partnerDesc}
                onChange={(e) => setFormData({ ...formData, partnerDesc: e.target.value })}
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
            Save Get Involved Copy
          </Button>
        </div>
      </form>
    </div>
  )
}
