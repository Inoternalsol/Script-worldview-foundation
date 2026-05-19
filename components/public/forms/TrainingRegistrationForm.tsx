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
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(8, 'Phone number is required.'),
  selectedCourse: z.string().min(1, 'Please select a training program.'),
  highestEducation: z.string().min(1, 'Education background is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function TrainingRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      selectedCourse: '',
      highestEducation: '',
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
          department: 'education',
          subject: `Training Registration: ${data.selectedCourse}`,
          message: `Highest Level of Education: ${data.highestEducation}\nSelected Workshop/Course: ${data.selectedCourse}`,
          type: 'contact',
        }),
      });

      if (result.ok) {
        toast({
          title: 'Enrollment Submitted',
          description: "Your training registration request has been successfully submitted! We'll email you the schedule details.",
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to submit registration. Please try again.',
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
                <FormLabel>Your Full Name</FormLabel>
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
            name="selectedCourse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selected Training Program</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="literacy_drive">Primary Literacy Workshop</SelectItem>
                    <SelectItem value="peace_mediation">Peacebuilding & Conflict Mediation</SelectItem>
                    <SelectItem value="youth_vocational">Youth Vocational & Digital Skills</SelectItem>
                    <SelectItem value="leaders_capacity">NGO Capacity Building</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="highestEducation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Highest Level of Education</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="high_school">Secondary / High School</SelectItem>
                  <SelectItem value="undergraduate">University Undergraduate</SelectItem>
                  <SelectItem value="graduate">BSc / BA Graduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate (MSc / PhD)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#1A3A5C] hover:bg-[#1A3A5C]/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Registration...
            </>
          ) : (
            'Enroll in Training Program'
          )}
        </Button>
      </form>
    </Form>
  );
}
