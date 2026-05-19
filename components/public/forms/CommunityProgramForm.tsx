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
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(8, 'Phone number is required.'),
  communityName: z.string().min(2, 'Community or Village name is required.'),
  lga: z.string().min(2, 'Local Government Area (LGA) is required.'),
  needsDescription: z.string().min(15, 'Please describe the community needs in detail (minimum 15 characters).'),
});

type FormValues = z.infer<typeof formSchema>;

export function CommunityProgramForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      communityName: '',
      lga: '',
      needsDescription: '',
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
          department: 'community',
          subject: `Community Outreach Request for ${data.communityName} (${data.lga})`,
          message: `LGA: ${data.lga}\nCommunity/Village Name: ${data.communityName}\n\nDescription of Needs:\n${data.needsDescription}`,
          type: 'community',
        }),
      });

      if (result.ok) {
        toast({
          title: 'Request Received',
          description: 'Your community program outreach request has been logged. Our department will review the needs assessment.',
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to submit request. Please try again.',
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
                <FormLabel>Your Name</FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="communityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community / Village / Town Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Odo-Otin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local Government Area & State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Ikeja LGA, Lagos State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="needsDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Community Needs</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Outline water, primary school rehabilitation, peacebuilding, or capacity-building needs..."
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
              Submitting Outreach Proposal...
            </>
          ) : (
            'Request Community Outreach'
          )}
        </Button>
      </form>
    </Form>
  );
}
