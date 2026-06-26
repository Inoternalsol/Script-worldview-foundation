'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save } from 'lucide-react'

export default function HomePageSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    missionStatement: '',
    missionHighlight: '',
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings/home_page')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setFormData({
              heroTitle: json.data.heroTitle || '',
              heroSubtitle: json.data.heroSubtitle || '',
              missionStatement: json.data.missionStatement || '',
              missionHighlight: json.data.missionHighlight || '',
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
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Home Page Settings</h1>
        <p className="mt-1 text-sm text-brand-muted">Update the main text sections on the public homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Hero Section</h3>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold leading-none tracking-tight">Mission Strip</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="missionHighlight">Mission Highlight (Bold text)</Label>
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

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
