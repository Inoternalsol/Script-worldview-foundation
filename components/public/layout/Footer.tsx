import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div className="space-y-4">
          <div className="font-heading text-lg font-semibold text-brand-primary">
            Script Worldview Foundation
          </div>
          <div className="text-sm text-brand-muted">
            Shaping Minds. Transforming Communities.
          </div>
          <div className="flex items-center gap-3">
            <a className="text-brand-muted hover:text-brand-primary" href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a className="text-brand-muted hover:text-brand-primary" href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a className="text-brand-muted hover:text-brand-primary" href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a className="text-brand-muted hover:text-brand-primary" href="#" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a className="text-brand-muted hover:text-brand-primary" href="#" aria-label="YouTube">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">Quick Links</div>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="text-brand-muted hover:text-brand-primary" href="/about">
              About
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/programs">
              Programs
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/donate">
              Donate
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/volunteers">
              Volunteer
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/careers">
              Careers
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/blog">
              Blog
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">Programs</div>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="text-brand-muted hover:text-brand-primary" href="/programs/education">
              Education
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/programs/humanitarian">
              Humanitarian
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/programs/community">
              Community
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/programs/research">
              Research
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/programs/capacity">
              Capacity
            </Link>
            <Link className="text-brand-muted hover:text-brand-primary" href="/programs/sports">
              Sports
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">Contact</div>
          <div className="space-y-2 text-sm text-brand-muted">
            <div>Jos, Plateau State</div>
            <div>+234 (0) 000 000 0000</div>
            <div>hello@scriptworldviewfoundation.org</div>
          </div>
          <div className="pt-2">
            <label htmlFor="footer-newsletter-email" className="text-sm font-semibold text-foreground block">Newsletter</label>
            <div className="mt-2 flex gap-2">
              <Input id="footer-newsletter-email" name="email" autoComplete="email" placeholder="Email address" type="email" />
              <Button type="button" variant="secondary">
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-brand-muted md:flex-row md:items-center md:justify-between md:px-8">
          <div>© {new Date().getFullYear()} Script Worldview Foundation. All rights reserved.</div>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-brand-primary" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:text-brand-primary" href="/terms">
              Terms of Use
            </Link>
            <Link className="hover:text-brand-primary" href="/accessibility">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

