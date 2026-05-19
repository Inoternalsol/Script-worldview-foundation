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
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid corporate email.'),
  phone: z.string().min(8, 'Phone number is required.'),
  mediaOutlet: z.string().min(2, 'Media outlet or news organization is required.'),
  inquiryDetails: z.string().min(10, 'Please enter query details.'),
});

type FormValues = z.infer<typeof formSchema>;

export function MediaPressForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      mediaOutlet: '',
      inquiryDetails: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const result = await apiFetch('/api/contacts', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          department: 'press',
          subject: `Press / Media Inquiry from ${data.mediaOutlet}`,
          message: `Media Outlet: ${data.mediaOutlet}\n\nQuery Details:\n${data.inquiryDetails}`,
          type: 'press',
        }),
      });

      if (result.ok) {
        toast({
          title: 'Inquiry Submitted',
          description: "Your media press request has been received. Our PR officer will contact you within 24 hours.",
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to submit press query. Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Journalist / Reporter Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mediaOutlet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Outlet / Agency</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Channels TV, Guardian Nigeria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Corporate Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="jane@outlet.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>

        <FormField
          control={form.control}
          name="inquiryDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media Query / Interview Request Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="State your interview questions, publishing deadlines, or press brief request..."
                  className="min-h-[150px]"
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
              Submitting Press Request...
            </>
          ) : (
            'Submit Media Query'
          )}
        </Button>
      </form>
    </Form>
  );
}
