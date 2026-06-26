'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle({ isTransparent }: { isTransparent?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" disabled>
        <span className="sr-only">Toggle theme</span>
        <div className="h-4.5 w-4.5 animate-pulse rounded bg-secondary/80 dark:bg-gray-700" />
      </Button>
    )
  }

  // Use resolvedTheme to correctly detect dark/light even when set to 'system'
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`h-9 w-9 rounded-lg transition-colors ${
        isTransparent 
          ? 'text-white hover:bg-white/10' 
          : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'
      }`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px] text-amber-400 animate-fade-in" />
      ) : (
        <Moon className={`h-[18px] w-[18px] animate-fade-in ${isTransparent ? 'text-white' : 'text-brand-primary'}`} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
