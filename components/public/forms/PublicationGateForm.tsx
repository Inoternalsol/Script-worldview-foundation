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
import { toast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api/client';
import { Loader2, DownloadCloud } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Please enter a valid email.'),
});

type FormValues = z.infer<typeof formSchema>;

interface PublicationGateFormProps {
  publicationTitle: string;
  downloadUrl: string;
  onSuccess: () => void;
}

export function PublicationGateForm({ publicationTitle, downloadUrl, onSuccess }: PublicationGateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const result = await apiFetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' ') || '',
          preferencesJson: JSON.stringify(['research']),
        }),
      });

      if (result.ok) {
        toast({
          title: 'Access Granted',
          description: `Welcome! Downloading "${publicationTitle}" now...`,
        });
        
        // Trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        onSuccess();
      } else {
        toast({
          title: 'Access Denied',
          description: result.error || 'Failed to unlock download. Please try again.',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto p-4 bg-card rounded-lg">
        <div className="text-center space-y-1">
          <DownloadCloud className="h-8 w-8 text-brand-primary mx-auto" />
          <h3 className="font-heading font-semibold text-lg">Unlock Research Publication</h3>
          <p className="text-xs text-brand-muted">Please provide your name and email to access this PDF document.</p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" className="h-9 text-sm" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Email Address</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" className="h-9 text-sm" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-sm h-9 flex items-center justify-center gap-1.5" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Unlocking...
            </>
          ) : (
            <>
              <DownloadCloud className="h-4 w-4" />
              Unlock & Download
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
