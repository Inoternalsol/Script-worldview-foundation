'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function AdminTopProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // Whenever pathname or searchParams change, we have finished navigating
    setIsNavigating(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a')
      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin + '/admin') &&
        anchor.target !== '_blank' &&
        !anchor.href.includes('#') &&
        anchor.pathname !== window.location.pathname
      ) {
        setIsNavigating(true)
      }
    }

    window.addEventListener('click', handleAnchorClick, true)
    return () => window.removeEventListener('click', handleAnchorClick, true)
  }, [])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-emerald-500/20 overflow-hidden">
      <div className="h-full w-full bg-emerald-500 animate-[progress_1s_ease-in-out_infinite]" />
      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
