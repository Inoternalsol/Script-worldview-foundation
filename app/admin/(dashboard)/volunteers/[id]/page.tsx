'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminClientFetch } from '@/lib/admin-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, CheckCircle, XCircle, Heart } from 'lucide-react'
import { VolunteerStatusActions } from '@/components/admin/VolunteerStatusActions'
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb'
import { toast } from '@/components/ui/use-toast'

export default function VolunteerDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [volunteer, setVolunteer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const res: any = await adminClientFetch(`/volunteers/${id}`)
        const volunteerData = res?.data || (res && res.id ? res : null) || res
        if (volunteerData && volunteerData.id) setVolunteer(volunteerData)
        else throw new Error(res?.error || 'Volunteer not found')
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' })
        router.push('/admin/volunteers')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchVolunteer()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  if (!volunteer) return null

  const skills = volunteer.skillsJson ? JSON.parse(volunteer.skillsJson) : []
  const availability = volunteer.availabilityJson ? JSON.parse(volunteer.availabilityJson) : {}

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{volunteer.name}</h1>
          <p className="mt-1 text-sm text-brand-muted">Applied on {new Date(volunteer.appliedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push('/admin/volunteers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
          <VolunteerStatusActions id={volunteer.id} currentStatus={volunteer.status} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3 border-b border-border">
            <h3 className="font-heading font-semibold text-lg">Contact Information</h3>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-brand-muted" />
              <a href={`mailto:${volunteer.email}`} className="text-brand-primary hover:underline">{volunteer.email}</a>
            </div>
            {volunteer.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-brand-muted" />
                <a href={`tel:${volunteer.phone}`} className="text-foreground hover:underline">{volunteer.phone}</a>
              </div>
            )}
            {volunteer.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-brand-muted" />
                <span className="text-foreground">{volunteer.location}</span>
              </div>
            )}
            {volunteer.languages && (
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-brand-muted shrink-0 w-4">🗣️</span>
                <span className="text-foreground">{volunteer.languages}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3 border-b border-border">
            <h3 className="font-heading font-semibold text-lg">Application Details</h3>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Skills & Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill: string, i: number) => (
                    <span key={i} className="bg-secondary text-foreground text-xs px-2.5 py-1 rounded-full border border-border">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-brand-muted italic">No skills listed.</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Availability
              </h4>
              <div className="bg-secondary/50 rounded-lg p-3 text-sm text-foreground">
                <p><strong>Days:</strong> {availability.days ? availability.days.join(', ') : 'Flexible'}</p>
                <p className="mt-1"><strong>Hours:</strong> {availability.hours || 'Flexible'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-brand-cta" />
                Motivation
              </h4>
              <div className="bg-secondary/50 rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap">
                {volunteer.motivation || <span className="italic text-brand-muted">No motivation provided.</span>}
              </div>
            </div>

            {volunteer.howDidYouHear && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">How did they hear about us?</h4>
                <p className="text-sm text-brand-muted">{volunteer.howDidYouHear}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
