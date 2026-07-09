'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

type FormValues = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  async function onSubmit(values: FormValues) {
    setError(null)
    setLoading(true)

    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    setLoading(false)

    if (!res || res.error) {
      setError('Invalid email or password')
      return
    }

    router.replace('/admin')
  }

  return (
    <div className="flex min-h-[calc(100vh-1px)] items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              Admin Login
            </h1>
            <p className="text-sm text-brand-muted">
              Sign in to manage content, programs, and operations.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@scriptworldview.org"
                {...form.register('email')}
              />
              {form.formState.errors.email?.message ? (
                <p className="text-sm text-error">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-medium text-brand-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"

                placeholder="Your password"
                {...form.register('password')}
              />
              {form.formState.errors.password?.message ? (
                <p className="text-sm text-error">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-error">{error}</p> : null}

            <Button
              type="submit"
              className="w-full"
              variant="cta"
              disabled={loading || !form.formState.isValid}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>

            <p className="text-xs text-brand-muted">
              If you don’t have an account yet, a Super Admin can create one for you.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

