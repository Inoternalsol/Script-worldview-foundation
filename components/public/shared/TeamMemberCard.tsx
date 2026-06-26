import Image from 'next/image'

export type TeamMemberCardProps = {
  name: string
  title: string
  imageUrl: string
  bio: string
}

export function TeamMemberCard({ name, title, imageUrl, bio }: TeamMemberCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border dark:border-white/10 bg-card dark:bg-slate-900 shadow-card">
      <div className="relative h-48 w-full">
        <Image src={imageUrl} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="font-heading text-lg font-semibold text-foreground">{name}</div>
        <div className="mt-1 text-sm text-brand-muted">{title}</div>
        <div className="mt-3 line-clamp-4 text-sm leading-6 text-brand-muted">{bio}</div>
      </div>
    </div>
  )
}

