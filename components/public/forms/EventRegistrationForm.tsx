'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api/client';
import { Loader2, CheckCircle2 } from 'lucide-react';

const eventRegistrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  organization: z.string().optional(),
  roleTitle: z.string().optional(),
  dietaryNeeds: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
});

type EventRegistrationValues = z.infer<typeof eventRegistrationSchema>;

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
}

export function EventRegistrationForm({ eventId, eventTitle, onSuccess }: EventRegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<EventRegistrationValues>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      organization: '',
      roleTitle: '',
      dietaryNeeds: '',
      accessibilityNeeds: '',
    },
  });

  async function onSubmit(data: EventRegistrationValues) {
    setIsLoading(true);
    try {
      const result = await apiFetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (result.ok) {
        setIsSuccess(true);
        toast({
          title: 'Registration Successful',
          description: `You have been registered for ${eventTitle}.`,
        });
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } else {
        toast({
          title: 'Registration Failed',
          description: result.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">See You There!</h3>
        <p className="mt-2 text-brand-muted">
          Your registration for <strong>{eventTitle}</strong> has been confirmed. 
          A confirmation email has been sent to your inbox.
        </p>
        <Button className="mt-8" onClick={() => setIsSuccess(false)}>
          Register Someone Else
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+234 ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Company or NGO name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="roleTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title / Role (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Student, Manager, Volunteer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Dietary Requirements (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Vegetarian, Halal, Allergies" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessibilityNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility Needs (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us if you require any specific assistance..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#1A3A5C] hover:bg-[#1A3A5C]/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Confirm Registration'
          )}
        </Button>
      </form>
    </Form>
  );
}
