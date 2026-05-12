import { cn } from '@/lib/utils/cn'

export type DonationProgressBarProps = {
  raised: number
  goal: number
  label?: string
}

export function DonationProgressBar({ raised, goal, label }: DonationProgressBarProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="font-medium text-foreground">{label ?? 'Progress'}</div>
        <div className="text-brand-muted">{pct}%</div>
      </div>
      <div className="h-3 w-full rounded-full bg-black/10">
        <div
          className={cn('h-3 rounded-full bg-brand-secondary transition-all')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

