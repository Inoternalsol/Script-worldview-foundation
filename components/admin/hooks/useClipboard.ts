import { useState, useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'

export function useClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyText = useCallback((text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast({
      title: 'Copied to clipboard',
      description: `${label} copied to clipboard.`,
    })
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const copyBulk = useCallback((texts: string[], entityName: string, format: 'comma' | 'newline' = 'comma') => {
    const validTexts = texts.filter(Boolean)
    if (validTexts.length === 0) {
      toast({
        title: `No ${entityName} found`,
        description: `There are no ${entityName} matching current filters.`,
        variant: 'destructive',
      })
      return
    }
    
    const joined = validTexts.join(format === 'comma' ? ', ' : '\n')
    navigator.clipboard.writeText(joined)
    
    toast({
      title: `Copied ${entityName}`,
      description: `Copied ${validTexts.length} item(s) formatted for bulk pasting.`,
    })
  }, [])

  return { copiedId, copyText, copyBulk }
}
