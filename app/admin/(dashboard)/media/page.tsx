'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image, File, Video, Trash2, Link as LinkIcon, Search, UploadCloud } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

type MediaItem = {
  id: string
  filename: string
  url: string
  type: 'image' | 'video' | 'document'
  sizeBytes: number | null
  createdAt: string | number
}

export default function MediaLibraryPage() {
  const { toast } = useToast()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchMedia() {
    try {
      const res = await fetch('/api/admin/media')
      if (!res.ok) throw new Error('Failed to load media assets')
      const data = await res.json()
      setMediaList(data.data || [])
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const filteredMedia = mediaList.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter
    const matchesSearch = item.filename.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  function handleCopyUrl(url: string) {
    const absoluteUrl = url.startsWith('http') ? url : window.location.origin + url
    navigator.clipboard.writeText(absoluteUrl)
    toast({
      title: 'Copied!',
      description: 'Media public URL copied to clipboard.',
    })
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete media asset')
      setMediaList((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: 'Deleted',
        description: 'Asset removed from media library.',
        variant: 'destructive',
      })
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const type = file.type.startsWith('image/') 
      ? 'image' 
      : file.type.startsWith('video/') 
        ? 'video' 
        : 'document'

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string

      try {
        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            type,
            sizeBytes: file.size,
            url: base64Url
          }),
        })

        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        setMediaList((prev) => [data.data, ...prev])
        toast({
          title: 'Uploaded',
          description: `${file.name} uploaded successfully.`,
        })
      } catch (err: any) {
        toast({
          title: 'Upload Failed',
          description: err.message,
          variant: 'destructive',
        })
      }
    }
    reader.readAsDataURL(file)
  }

  function formatBytes(bytes: number | null) {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
            <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border px-4 py-8 text-center transition-colors hover:bg-black/5 cursor-pointer">
              <UploadCloud className="h-10 w-10 text-brand-muted" />
              <p className="mt-2 text-sm font-semibold">Drag & drop files</p>
              <p className="mt-1 text-xs text-brand-muted">Images, PDFs or Videos up to 20MB</p>
              <span className="mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 text-xs font-semibold">
                Select Files
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,video/*,application/pdf,.doc,.docx"
              />
            </label>
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

          {loading ? (
            <div className="p-12 text-center text-brand-muted">Loading media assets...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="p-12 text-center text-brand-muted">No files found matching the criteria.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative flex aspect-video items-center justify-center bg-secondary">
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
                      <span>{formatBytes(item.sizeBytes)}</span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
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
          )}
        </div>
      </div>
    </div>
  )
}
