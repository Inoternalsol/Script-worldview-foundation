import Link from 'next/link'
import { ArrowRight, BookOpen, Heart, Users, FlaskConical, GraduationCap, Activity } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ProgramCardProps = {
  title: string
  description: string
  href: string
  category?: string
}

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string; accent: string }> = {
  education:   { icon: BookOpen,       color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950/30',   accent: 'border-blue-500' },
  humanitarian:{ icon: Heart,          color: 'text-red-600 dark:text-red-400',    bg: 'bg-red-50 dark:bg-red-950/30',    accent: 'border-red-500' },
  community:   { icon: Users,          color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-950/30',  accent: 'border-green-500' },
  research:    { icon: FlaskConical,   color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30', accent: 'border-purple-500' },
  capacity:    { icon: GraduationCap,  color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950/30',  accent: 'border-amber-500' },
  sports:      { icon: Activity,       color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', accent: 'border-orange-500' },
}

const defaultConfig = { icon: BookOpen, color: 'text-brand-primary', bg: 'bg-brand-primary/10 dark:bg-brand-primary/20', accent: 'border-brand-primary' }

export function ProgramCard({ title, description, href, category }: ProgramCardProps) {
  const config = (category ? categoryConfig[category] : undefined) ?? defaultConfig
  const Icon = config.icon

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex h-full flex-col rounded-2xl border border-border dark:border-white/10 bg-card dark:bg-slate-900 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300',
        'hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
        // Category accent left border on hover
        'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:rounded-l-2xl before:transition-all before:duration-300',
        `group-hover:before:${config.accent} group-hover:before:w-1`
      )}
    >
      {/* Category icon */}
      <div className={cn('mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl', config.bg)}>
        <Icon className={cn('h-5 w-5', config.color)} />
      </div>

      {/* Category badge */}
      {category && (
        <div className={cn('mb-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest', config.bg, config.color)}>
          {category}
        </div>
      )}

      <div className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-brand-primary">
        {title}
      </div>
      <div className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
        {description}
      </div>
      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
