'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, User, Briefcase, Tag, Loader2 } from 'lucide-react'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import { toast } from '@/components/ui/use-toast'
import { ImageUploadInput } from '@/components/admin/ImageUploadInput'

type TeamMember = {
  id: string
  name: string
  role: string
  bio: string | null
  photoUrl: string | null
  category: 'executive' | 'board' | 'volunteer_lead'
  orderIndex: number
  createdAt: string | number
}

const CATEGORY_LABELS: Record<string, string> = {
  executive: 'Executive Team',
  board: 'Board of Trustees',
  volunteer_lead: 'Volunteer Lead',
}

const CATEGORY_COLORS: Record<string, string> = {
  executive: 'bg-blue-100 text-blue-800 border-blue-200',
  board: 'bg-purple-100 text-purple-800 border-purple-200',
  volunteer_lead: 'bg-emerald-100 text-emerald-800 border-emerald-200',
}

export function TeamManagerClient({ initialMembers }: { initialMembers: TeamMember[] }) {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form Fields
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [category, setCategory] = useState<'executive' | 'board' | 'volunteer_lead'>('executive')
  const [photoUrl, setPhotoUrl] = useState('')
  const [bio, setBio] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)

  const openNewModal = () => {
    setEditingMember(null)
    setName('')
    setRole('')
    setCategory('executive')
    setPhotoUrl('')
    setBio('')
    setOrderIndex(0)
    setIsModalOpen(true)
  }

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member)
    setName(member.name)
    setRole(member.role)
    setCategory(member.category)
    setPhotoUrl(member.photoUrl || '')
    setBio(member.bio || '')
    setOrderIndex(member.orderIndex || 0)
    setIsModalOpen(true)
  }

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase()
      const matchesSearch = !search || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
      const matchesCat = !categoryFilter || m.category === categoryFilter
      return matchesSearch && matchesCat
    })
  }, [members, search, categoryFilter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !role) {
      toast({ title: 'Missing fields', description: 'Name and Role are required.', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        name,
        role,
        category,
        photoUrl: photoUrl || undefined,
        bio: bio || undefined,
        orderIndex: Number(orderIndex) || 0,
      }

      const url = editingMember ? `/api/admin/team/${editingMember.id}` : `/api/admin/team`
      const method = editingMember ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to save team member')
      }

      const saved = await res.json()
      toast({
        title: editingMember ? 'Member Updated' : 'Member Added',
        description: `${name} has been successfully saved to the team directory.`,
      })

      setIsModalOpen(false)
      router.refresh()
      // Optimistic state update
      if (editingMember) {
        setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? saved.data : m)))
      } else {
        setMembers((prev) => [...prev, saved.data])
      }
    } catch (err: any) {
      toast({ title: 'Save Error', description: err.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Team & Leadership Directory</h1>
          <p className="mt-1 text-sm text-brand-muted">
            Manage executive leadership, board of trustees, and volunteer lead profiles displayed across public pages.
          </p>
        </div>
        <Button onClick={openNewModal} className="bg-brand-primary text-white hover:bg-brand-primary/90 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <input
          type="text"
          aria-label="Search team members by name or role"
          title="Search team members by name or role"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <select
          aria-label="Filter by team category"
          title="Filter by team category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option value="">All Categories</option>
          <option value="executive">Executive Team</option>
          <option value="board">Board of Trustees</option>
          <option value="volunteer_lead">Volunteer Leads</option>
        </select>
      </div>

      {/* Grid Display */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/50">
          <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-heading text-lg font-semibold text-foreground">No Team Members Found</h3>
          <p className="mt-1 text-sm text-brand-muted max-w-sm mx-auto">
            Get started by adding your organization&apos;s executive directors, board members, or volunteer coordinators.
          </p>
          <Button onClick={openNewModal} variant="outline" className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Add First Member
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-brand-primary/20"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-heading font-bold text-base text-foreground leading-tight">{member.name}</h3>
                      <p className="text-xs text-brand-muted mt-0.5 font-medium">{member.role}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[member.category] || ''}`}>
                    {CATEGORY_LABELS[member.category] || member.category}
                  </span>
                </div>

                {member.bio && (
                  <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed border-t border-border/50 pt-3">
                    {member.bio}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-[11px] font-mono text-muted-foreground">Order: #{member.orderIndex}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-brand-primary hover:bg-brand-primary/10 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <DeleteConfirmButton
                    id={member.id}
                    endpoint="/api/admin/team"
                    label="Team Member"
                    onSuccess={() => setMembers((prev) => prev.filter((m) => m.id !== member.id))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isLoading && setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border overflow-y-auto max-h-[90vh]">
            <h2 className="font-heading text-lg font-bold text-foreground mb-1">
              {editingMember ? 'Edit Profile' : 'New Profile'}
            </h2>
            <p className="text-xs text-brand-muted mb-6">Complete profile details for team leadership directory.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="team-name" className="block text-xs font-semibold text-foreground mb-1">Full Name *</label>
                <input
                  id="team-name"
                  type="text"
                  required
                  aria-label="Full Name"
                  title="Full Name"
                  placeholder="e.g. Dr. Amara Okafor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-role" className="block text-xs font-semibold text-foreground mb-1">Role / Job Title *</label>
                  <input
                    id="team-role"
                    type="text"
                    required
                    aria-label="Role or Job Title"
                    title="Role or Job Title"
                    placeholder="e.g. Executive Director"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label htmlFor="team-category" className="block text-xs font-semibold text-foreground mb-1">Category *</label>
                  <select
                    id="team-category"
                    aria-label="Team Category"
                    title="Team Category"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="executive">Executive Team</option>
                    <option value="board">Board of Trustees</option>
                    <option value="volunteer_lead">Volunteer Lead</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="team-photo" className="block text-xs font-semibold text-foreground mb-1">Headshot Photo</label>
                  <ImageUploadInput
                    id="team-photo"
                    value={photoUrl}
                    onChange={(url: string) => setPhotoUrl(url)}
                    placeholder="Enter URL or upload headshot photo..."
                  />
                </div>
                <div className="w-1/3">
                  <label htmlFor="team-order" className="block text-xs font-semibold text-foreground mb-1">Sort Order Index</label>
                  <input
                    id="team-order"
                    type="number"
                    aria-label="Sort Order Index"
                    title="Sort Order Index"
                    placeholder="0"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="team-bio" className="block text-xs font-semibold text-foreground mb-1">Biography</label>
                <textarea
                  id="team-bio"
                  rows={4}
                  aria-label="Biography"
                  title="Biography"
                  placeholder="Short professional summary and foundation background..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-brand-primary text-white hover:bg-brand-primary/90">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
