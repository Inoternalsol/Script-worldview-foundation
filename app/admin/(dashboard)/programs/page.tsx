import { adminFetch } from '@/lib/admin-api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

type Program = {
  id: string
  name: string
  slug: string
  category: string
  status: string
  sortOrder: number
}

async function getPrograms(): Promise<Program[]> {
  try {
    const res = await adminFetch('/programs')
    return res.data
  } catch {
    return []
  }
}

function categoryName(cat: string) {
  switch (cat) {
    case 'education': return 'Education & Training'
    case 'humanitarian': return 'Humanitarian Services'
    case 'community': return 'Community Development'
    case 'research': return 'Research & Publications'
    case 'capacity': return 'Capacity Building'
    default: return cat
  }
}

export default async function ProgramsAdminPage() {
  const programs = await getPrograms()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Programs</h1>
          <p className="mt-1 text-sm text-brand-muted">
            {programs.length} program{programs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/programs/new">
            <Plus className="mr-2 h-4 w-4" /> New Program
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Slug</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Sort Order</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-brand-muted">
                    No programs yet. Create your first program!
                  </td>
                </tr>
              ) : (
                programs.map((prog) => (
                  <tr key={prog.id} className="border-b border-border transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {prog.name}
                    </td>
                    <td className="px-4 py-3 text-brand-muted font-mono text-xs">
                      {prog.slug}
                    </td>
                    <td className="px-4 py-3 text-brand-muted capitalize">
                      {categoryName(prog.category)}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{prog.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${prog.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-secondary text-muted-foreground'}`}>
                        {prog.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/programs/${prog.id}`}
                        className="text-sm font-medium text-brand-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
