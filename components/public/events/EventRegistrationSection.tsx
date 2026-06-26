'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Users } from 'lucide-react';
import { EventRegistrationForm } from '@/components/public/forms/EventRegistrationForm';

interface EventRegistrationSectionProps {
  eventId: string;
  eventTitle: string;
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
  capacity?: number;
  registrationsCount: number;
}

export function EventRegistrationSection({ 
  eventId, 
  eventTitle, 
  status, 
  capacity, 
  registrationsCount 
}: EventRegistrationSectionProps) {
  const [open, setOpen] = useState(false);

  const remaining = capacity ? capacity - registrationsCount : null;
  const isPast = status === 'past' || status === 'cancelled';
  const isFull = remaining !== null && remaining <= 0;

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="mb-6 font-heading text-xl font-bold text-brand-primary">Event Registration</h3>
      
      <div className="mb-6 space-y-4 text-sm text-brand-muted">
        {capacity && (
          <div>
            <strong className="block text-foreground">Availability</strong>
            <div className="mt-1 flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {isFull ? 'Waitlist Only' : `${remaining} seats remaining`}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        {isPast ? (
          <Button variant="secondary" disabled className="w-full">
            Event Ended
          </Button>
        ) : isFull ? (
          <Button variant="secondary" className="w-full">
            Join Waitlist
          </Button>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="cta" className="w-full">
                Register Now
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Register for {eventTitle}</DialogTitle>
                <DialogDescription>
                  Please provide your details below to confirm your attendance.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <EventRegistrationForm 
                  eventId={eventId} 
                  eventTitle={eventTitle} 
                  onSuccess={() => setOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-brand-muted">
        Registration is free but mandatory for all attendees.
      </p>
    </div>
  );
}
