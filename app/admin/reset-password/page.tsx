'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  })

  async function onSubmit(values: FormValues) {
    if (!token) {
      setError('Invalid reset link: missing token')
      return
    }

    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        return
      }

      setSuccess('Your password has been reset successfully. Redirecting to login…')
      setTimeout(() => {
        router.push('/admin/login')
      }, 3000)
    } catch (err) {
      setLoading(false)
      setError('An error occurred. Please try again.')
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="font-heading text-2xl font-semibold text-error">Invalid Link</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-brand-muted">
            The password reset link is invalid or expired. Please request a new link.
          </p>
          <Link href="/admin/forgot-password" className="block text-center">
            <Button className="w-full" variant="cta">Request New Link</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Reset Password
          </h1>
          <p className="text-sm text-brand-muted">
            Choose a new secure password for your account.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 8 characters"
              {...form.register('password')}
            />
            {form.formState.errors.password?.message ? (
              <p className="text-sm text-error">{form.formState.errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword?.message ? (
              <p className="text-sm text-error">
                {form.formState.errors.confirmPassword.message}
              </p>
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
            {loading ? 'Resetting…' : 'Reset Password'}
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
  )
}


export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-1px)] items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={<div className="text-sm text-brand-muted">Loading reset form…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
