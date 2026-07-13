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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api/client';
import { Loader2 } from 'lucide-react';

import { CustomFormField } from '@/components/ui/custom-form-field';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  department: z.enum(['general', 'education', 'humanitarian', 'community', 'hr', 'press', 'partnership']),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  _honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: 'general',
      subject: '',
      message: '',
      _honeypot: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsLoading(true);
    try {
      const result = await apiFetch('/api/contacts', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (result.ok) {
        toast({
          title: 'Message Sent',
          description: "We've received your message and will get back to you soon.",
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send message. Please try again.',
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <input
          type="text"
          name="_honeypot"
          className="hidden opacity-0 absolute -left-[9999px]"
          aria-hidden="true"
          aria-label="Do not fill this field"
          tabIndex={-1}
          autoComplete="off"
          onChange={(e) => form.setValue('_honeypot', e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            autoComplete="name"
          />
          <CustomFormField
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            autoComplete="email"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="phone"
            label="Phone Number (Optional)"
            placeholder="+234 ..."
            type="tel"
            autoComplete="tel"
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="education">Education & Training</SelectItem>
                    <SelectItem value="humanitarian">Humanitarian Services</SelectItem>
                    <SelectItem value="community">Community Development</SelectItem>
                    <SelectItem value="hr">Careers & HR</SelectItem>
                    <SelectItem value="press">Media & Press</SelectItem>
                    <SelectItem value="partnership">Partnerships</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <CustomFormField
          control={form.control}
          name="subject"
          label="Subject"
          placeholder="How can we help?"
        />

        <CustomFormField
          control={form.control}
          name="message"
          label="Message"
          placeholder="Tell us more about your inquiry..."
          type="textarea"
        />

        <Button type="submit" className="w-full md:w-auto bg-brand-primary text-primary-foreground hover:bg-brand-primary/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </form>
    </Form>
  );
}
