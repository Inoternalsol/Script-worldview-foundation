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

const formSchema = z.object({
  name: z.string().min(2, 'Contact person name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().optional(),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters.'),
  partnerType: z.enum(['corporate', 'academic', 'faith_based', 'international_ngo', 'government']),
  proposal: z.string().min(15, 'Proposal description must be at least 15 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export function PartnershipForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      organizationName: '',
      partnerType: 'corporate',
      proposal: '',
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
          department: 'partnership',
          subject: `Partnership Inquiry from ${data.organizationName} (${data.partnerType})`,
          message: data.proposal,
          type: 'partnership',
        }),
      });

      if (result.ok) {
        toast({
          title: 'Partnership Inquiry Sent',
          description: 'Thank you for reaching out to partner with us. Our management team will contact you shortly.',
        });
        form.reset();
      } else {
        toast({
          title: 'Submission Error',
          description: result.error || 'Failed to submit proposal. Please try again.',
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
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Chevron Nigeria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="partnerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate / Business</SelectItem>
                    <SelectItem value="academic">Academic Institution</SelectItem>
                    <SelectItem value="faith_based">Faith-based Org</SelectItem>
                    <SelectItem value="international_ngo">International NGO</SelectItem>
                    <SelectItem value="government">Government Agency</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
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
                <FormLabel>Corporate Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="jane.doe@company.com" {...field} />
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
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="+234 ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proposal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partnership Proposal</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Outline how you would like to collaborate with us..."
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
              Submitting Proposal...
            </>
          ) : (
            'Submit Partnership Inquiry'
          )}
        </Button>
      </form>
    </Form>
  );
}
