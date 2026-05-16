'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewJobPostingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const body = {
      title: form.get('title') as string,
      department: (form.get('department') as string) || undefined,
      location: (form.get('location') as string) || undefined,
      type: form.get('type') as string,
      description: form.get('description') as string,
      requirements: (form.get('requirements') as string) || undefined,
      deadline: form.get('deadline') ? new Date(form.get('deadline') as string).getTime() : undefined,
      status: (form.get('status') as string) || 'open',
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const res = await fetch(`${apiUrl}/api/admin/careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create job posting')
      }

      router.push('/admin/careers')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/careers"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Careers
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">New Job Posting</h1>
        <p className="mt-1 text-sm text-brand-muted">Create a new career opportunity.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" name="title" required placeholder="e.g. Program Manager" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" placeholder="e.g. Programs" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g. Jos, Plateau State" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Employment Type *</Label>
            <select
              id="type"
              name="type"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="volunteer">Volunteer</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input id="deadline" name="deadline" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Job Description * (HTML)</Label>
            <Textarea id="description" name="description" rows={8} required placeholder="Full job description..." />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="requirements">Requirements (HTML)</Label>
            <Textarea id="requirements" name="requirements" rows={5} placeholder="Qualifications and requirements..." />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="cta" disabled={loading}>
            {loading ? 'Creating...' : 'Create Posting'}
          </Button>
        </div>
      </form>
    </div>
  )
}
