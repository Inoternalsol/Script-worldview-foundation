'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image, File, Video, Trash2, Link as LinkIcon, Search, UploadCloud } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

// Static mock media library items for development
const mockMedia = [
  { id: '1', filename: 'home-hero.png', type: 'image', size: '874 KB', url: '/images/home-hero.png', date: '2026-05-19' },
  { id: '2', filename: 'about-hero.png', type: 'image', size: '874 KB', url: '/images/about-hero.png', date: '2026-05-19' },
  { id: '3', filename: 'education-flyer.pdf', type: 'document', size: '1.2 MB', url: '#', date: '2026-05-18' },
  { id: '4', filename: 'flood-relief.png', type: 'image', size: '937 KB', url: '/images/blog/flood-relief.png', date: '2026-05-17' },
  { id: '5', filename: 'intro-video.mp4', type: 'video', size: '18.4 MB', url: '#', date: '2026-05-15' },
]

export default function MediaLibraryPage() {
  const { toast } = useToast()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [mediaList, setMediaList] = useState(mockMedia)

  const filteredMedia = mediaList.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter
    const matchesSearch = item.filename.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url)
    toast({
      title: 'Copied!',
      description: 'Media public URL copied to clipboard.',
    })
  }

  function handleDelete(id: string) {
    setMediaList((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: 'Deleted',
      description: 'Asset removed from media library.',
      variant: 'destructive',
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Media Library</h1>
        <p className="mt-1 text-sm text-brand-muted">Upload and manage visual assets and documents.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Upload Zone */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="font-heading text-lg font-semibold">Upload File</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-black/10 px-4 py-8 text-center transition-colors hover:bg-black/5">
              <UploadCloud className="h-10 w-10 text-brand-muted" />
              <p className="mt-2 text-sm font-semibold">Drag & drop files</p>
              <p className="mt-1 text-xs text-brand-muted">Images, PDFs or Videos up to 20MB</p>
              <Button size="sm" className="mt-4" variant="secondary">
                Select Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        <div className="space-y-4 lg:col-span-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {['all', 'image', 'video', 'document'].map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative flex aspect-video items-center justify-center bg-gray-100">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.filename} className="h-full w-full object-cover" />
                  ) : item.type === 'video' ? (
                    <Video className="h-10 w-10 text-brand-primary" />
                  ) : (
                    <File className="h-10 w-10 text-brand-secondary" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="truncate font-semibold text-sm">{item.filename}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-brand-muted">
                    <span>{item.size}</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2 border-t border-black/5 pt-3">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopyUrl(item.url)}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
