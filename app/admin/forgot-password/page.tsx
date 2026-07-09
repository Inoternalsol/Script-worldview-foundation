'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  async function onSubmit(values: FormValues) {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setError(data.error || 'Failed to send password reset request')
        return
      }

      setSuccess('If the account exists, a password reset link has been sent to your email.')
      form.reset()
    } catch (err) {
      setLoading(false)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-1px)] items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              Forgot Password
            </h1>
            <p className="text-sm text-brand-muted">
              Enter your email to receive a password reset link.
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
                placeholder="admin@scriptworldview.org"
                {...form.register('email')}
              />
              {form.formState.errors.email?.message ? (
                <p className="text-sm text-error">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-error">{error}</p> : null}
            {success ? <p className="text-sm text-green-600">{success}</p> : null}

            <Button
              type="submit"
              className="w-full"
              variant="cta"
              disabled={loading || !form.formState.isValid}
            >
              {loading ? 'Sending link…' : 'Send Reset Link'}
            </Button>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-sm font-semibold text-brand-primary hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
