import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="text-[120px] font-black leading-none text-brand-primary/8 select-none md:text-[180px]">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-primary/10 md:h-24 md:w-24">
              <Search className="h-10 w-10 text-brand-primary md:h-12 md:w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="max-w-md">
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-base text-brand-muted">
          The page you're looking for may have been moved, deleted, or doesn't exist. 
          Let's get you back on track.
        </p>
      </div>

      {/* Quick links */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="cta" size="lg" className="h-11">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="h-11">
          <Link href="/about">
            <ArrowLeft className="mr-2 h-4 w-4" />
            About Us
          </Link>
        </Button>
      </div>

      {/* Helpful links */}
      <div className="mt-12 border-t border-border pt-8 w-full max-w-lg">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Popular Pages
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {[
            { label: 'Programs', href: '/programs' },
            { label: 'Events', href: '/events' },
            { label: 'Blog', href: '/blog' },
            { label: 'Donate', href: '/donate' },
            { label: 'Volunteer', href: '/volunteers' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-brand-muted hover:text-brand-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
