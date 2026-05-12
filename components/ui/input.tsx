import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-black/40 focus:border-brand-secondary/60 focus:ring-2 focus:ring-brand-secondary/30',
        className,
      )}
      {...props}
    />
  ),
)

Input.displayName = 'Input'

