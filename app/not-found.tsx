import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <div className="font-heading text-9xl font-bold text-brand-primary/10">404</div>
      <h1 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-brand-muted">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild variant="cta">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
