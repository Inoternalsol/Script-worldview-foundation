'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary/80',
      className
    )}
    {...props}
  >
    <div
      className="h-full bg-brand-primary transition-all duration-300"
      style={{ width: `${value || 0}%` }}
    />
  </div>
))
Progress.displayName = 'Progress'

export { Progress }
