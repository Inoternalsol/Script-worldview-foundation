import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function SearchPage() {
  return (
    <div className="min-h-[70vh] bg-background">
      <div className="bg-card py-12 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h1 className="mb-6 font-heading text-3xl font-bold text-brand-primary">Search</h1>
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search programs, articles, events..." 
                className="pl-10 h-12 text-lg" 
              />
            </div>
            <Button type="submit" variant="cta" className="h-12 px-8">Search</Button>
          </form>
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <p className="text-brand-muted">Enter a search term above to find content across the website. In Phase 5, this will query the Cloudflare Workers API.</p>
        </div>
      </div>
    </div>
  )
}
