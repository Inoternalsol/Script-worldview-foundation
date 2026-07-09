'use client'

import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

interface SocialShareButtonsProps {
  title: string
  url?: string
  description?: string
}

export function SocialShareButtons({ title, url, description }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return url || window.location.href
    }
    return url || 'https://scriptworldview.org'
  }

  const shareUrl = getShareUrl()
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: shareUrl,
        })
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share error:', err)
        }
      }
    }
  }

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({ title: 'Link Copied', description: 'Page link copied to clipboard!' })
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border mt-6">
      <span className="text-xs font-bold uppercase tracking-wider text-brand-muted mr-2 flex items-center gap-1.5">
        <Share2 className="h-3.5 w-3.5 text-brand-primary" /> Share This Impact:
      </span>

      {/* Native Web Share API if supported */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="rounded-full px-3 py-1 text-xs border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10"
        >
          Share...
        </Button>
      )}

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
        className="inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 text-xs font-semibold transition-colors gap-1.5"
      >
        <MessageCircle className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" /> WhatsApp
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        title="Share on X (Twitter)"
        className="inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 text-xs font-semibold transition-colors"
      >
        𝕏 Post
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
        className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 text-xs font-semibold transition-colors"
      >
        LinkedIn
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        title="Share on Facebook"
        className="inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 text-xs font-semibold transition-colors"
      >
        Facebook
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        type="button"
        aria-label="Copy Page Link"
        title="Copy Page Link"
        className="inline-flex items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80 border border-border px-3 py-1.5 text-xs font-medium transition-colors gap-1.5"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  )
}
