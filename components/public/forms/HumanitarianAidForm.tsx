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
import { Loader2, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  reporterName: z.string().min(2, 'Reporter name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(8, 'Phone number is required.'),
  disasterLocation: z.string().min(5, 'Disaster location (Community, LGA, State) is required.'),
  disasterType: z.enum(['flood', 'conflict', 'drought', 'epidemic', 'displacement']),
  estimatedAffected: z.string().min(1, 'Please enter estimated number of affected people.'),
  description: z.string().min(15, 'Please describe the emergency incident (minimum 15 characters).'),
});

type FormValues = z.infer<typeof formSchema>;

export function HumanitarianAidForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reporterName: '',
      email: '',
      phone: '',
      disasterLocation: '',
      disasterType: 'flood',
      estimatedAffected: '',
      description: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const result = await apiFetch('/api/contacts', {
        method: 'POST',
        body: JSON.stringify({
          name: data.reporterName,
          email: data.email,
          phone: data.phone,
          department: 'humanitarian',
          subject: `URGENT: ${data.disasterType.toUpperCase()} Relief Request for ${data.disasterLocation}`,
          message: `Disaster Type: ${data.disasterType}\nLocation: ${data.disasterLocation}\nEstimated Affected: ${data.estimatedAffected}\n\nIncident Description:\n${data.description}`,
          type: 'humanitarian',
        }),
      });

      if (result.ok) {
        toast({
          title: 'URGENT Alert Logged',
          description: 'Emergency aid report received. Our rapid response team has been alerted immediately.',
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to submit alert. Please try again.',
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
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3 text-red-800 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 animate-bounce" />
          <div>
            <span className="font-bold">Urgent Dispatch Line:</span> This form directly triggers an immediate SMS and email notification alert to our Humanitarian Emergency Response coordinator. Please supply precise data.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="reporterName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reporter Name / Focal Point</FormLabel>
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
            name="disasterLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Site Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Shiroro LGA, Niger State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="disasterType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incident Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="flood">Flood Relief Assistance</SelectItem>
                    <SelectItem value="conflict">Conflict / Displacement</SelectItem>
                    <SelectItem value="drought">Food Aid / Drought</SelectItem>
                    <SelectItem value="epidemic">Medical Outbreak Response</SelectItem>
                    <SelectItem value="displacement">IDP Rehabilitation</SelectItem>
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Contact Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+234 ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedAffected"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Affected Persons</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 150 families, 500+ individuals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Incident & Immediate Relief Required</FormLabel>
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

        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Broadcasting Alert...
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-white" />
              Submit Urgent Emergency Request
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
