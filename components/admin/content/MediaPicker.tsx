'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud, Image as ImageIcon, Video, FileText, CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { adminClientFetch } from '@/lib/admin-client'

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video' | 'document'
  filename: string
  sizeBytes: number
}

interface MediaPickerProps {
  onSelect: (url: string, type: 'image' | 'video' | 'document', altText?: string) => void
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MediaPicker({ onSelect, trigger, isOpen, onOpenChange }: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState('library')
  const [isUploading, setIsUploading] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)
  const { toast } = useToast()

  const open = isOpen !== undefined ? isOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const fetchMedia = async () => {
    setIsLoading(true)
    try {
      const res = await adminClientFetch('/media')
      if (res.ok) {
        const data = await res.json()
        setMediaItems(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch media:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && activeTab === 'library') {
      fetchMedia()
    }
  }, [open, activeTab])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('altText', file.name)
      
      const data: any = await adminClientFetch('/media', {
        method: 'POST',
        body: formData,
      })

      if (!data || !data.url) throw new Error('Failed to save media metadata')

      toast({
        title: 'Upload Successful',
        description: 'Your file has been uploaded securely to Cloudinary.',
      })
      
      // Select immediately after upload
      onSelect(data.url, data.type, file.name)
      setOpen(false)
      setActiveTab('library')
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Upload Failed',
        description: error.message || 'Something went wrong',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library (Cloudinary)</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="flex-1 overflow-y-auto mt-4 pr-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              </div>
            ) : mediaItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
                <p>No media found. Upload something!</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelect(item.url, item.type, item.filename)
                      setOpen(false)
                    }}
                    className="relative group cursor-pointer aspect-square rounded-lg border border-border overflow-hidden hover:border-brand-primary transition-colors bg-muted"
                  >
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.filename} className="object-cover w-full h-full" />
                    ) : item.type === 'video' ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <Video className="h-8 w-8 text-brand-muted mb-2" />
                        <span className="text-xs truncate w-full px-2 text-center">{item.filename}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <FileText className="h-8 w-8 text-brand-muted mb-2" />
                        <span className="text-xs truncate w-full px-2 text-center">{item.filename}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <CheckCircle2 className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="flex-1 flex flex-col justify-center mt-4 border-2 border-dashed border-border rounded-xl bg-muted/30">
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="p-4 bg-brand-primary/10 rounded-full">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-brand-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {isUploading ? 'Uploading to Cloudinary...' : 'Upload Media'}
                </h3>
                <p className="text-sm text-brand-muted mt-1">
                  Drag and drop or click below. Supports Images, PDFs, and Videos.
                </p>
              </div>
              <div className="relative">
                <Input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <Button disabled={isUploading} variant="outline">
                  Select File
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
