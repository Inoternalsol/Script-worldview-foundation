'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud, Loader2, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { adminClientFetch } from '@/lib/admin-client'

interface ImageUploadInputProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  id?: string
}

export function ImageUploadInput({ value, onChange, placeholder = 'https://... or upload file', id }: ImageUploadInputProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (PNG, JPG, WEBP, etc.)',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string

      try {
        // Automatically save to the Media Library so it persists cleanly
        const data: any = await adminClientFetch('/media', {
          method: 'POST',
          body: JSON.stringify({
            filename: file.name,
            type: 'image',
            sizeBytes: file.size,
            url: base64Url,
          }),
        })

        const finalUrl = data?.url || base64Url
        onChange(finalUrl)
        toast({
          title: 'Image Uploaded',
          description: `${file.name} uploaded successfully.`,
        })
      } catch (err: any) {
        // If API fails, fallback to DataURL directly
        onChange(base64Url)
        toast({
          title: 'Uploaded locally',
          description: 'Image loaded directly into form.',
        })
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.onerror = () => {
      setUploading(false)
      toast({
        title: 'Error reading file',
        description: 'Failed to read image file.',
        variant: 'destructive',
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm font-mono"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          aria-label="Upload Image File"
          title="Upload Image File"
          className="hidden"
        />
        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 gap-2 border border-border"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin text-brand-primary" /> : <UploadCloud className="h-4 w-4 text-brand-primary" />}
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>

      {value && (
        <div className="relative inline-flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-2">
          <img
            src={value}
            alt="Preview"
            className="h-16 w-16 rounded-lg object-cover bg-background border"
            onError={(e) => {
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
          <div className="text-xs text-brand-muted max-w-[200px] truncate font-mono">
            {value.startsWith('data:') ? 'Base64 Image Data' : value}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange('')}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
