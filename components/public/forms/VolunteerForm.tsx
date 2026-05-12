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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api/client';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const volunteerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  location: z.string().min(2, { message: 'Please enter your location.' }),
  skills: z.array(z.string()).min(1, { message: 'Please select at least one skill.' }),
  motivation: z.string().min(20, { message: 'Please tell us more about your motivation (min 20 chars).' }),
  languages: z.string().optional(),
  howDidYouHear: z.string().optional(),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

const SKILLS_OPTIONS = [
  { id: 'teaching', label: 'Teaching & Mentoring' },
  { id: 'medical', label: 'Medical & Healthcare' },
  { id: 'logistics', label: 'Logistics & Distribution' },
  { id: 'admin', label: 'Administration' },
  { id: 'creative', label: 'Creative (Photo/Video/Design)' },
  { id: 'tech', label: 'IT & Technology' },
  { id: 'counseling', label: 'Counseling & Support' },
  { id: 'other', label: 'Other' },
];

export function VolunteerForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      skills: [],
      motivation: '',
      languages: '',
      howDidYouHear: '',
    },
  });

  async function onSubmit(values: VolunteerFormValues) {
    setIsLoading(true);
    try {
      // Convert skills array to JSON string for D1
      const submissionData = {
        ...values,
        skillsJson: JSON.stringify(values.skills),
      };

      const result = await apiFetch('/api/volunteers', {
        method: 'POST',
        body: JSON.stringify(submissionData),
      });

      if (result.ok) {
        toast({
          title: 'Application Submitted',
          description: "Thank you for your interest! We'll review your application and get back to you.",
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to submit application. Please try again.',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
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
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="jane@example.com" {...field} />
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
            render={({ field }: { field: any }) => (
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
            name="location"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Current Location (City, State)</FormLabel>
                <FormControl>
                  <Input placeholder="Lagos, Nigeria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Areas of Expertise / Skills</FormLabel>
                <FormDescription>
                  Select all the areas where you would like to contribute.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILLS_OPTIONS.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="skills"
                    render={({ field }: { field: any }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked: any) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: any) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages Spoken</FormLabel>
              <FormControl>
                <Input placeholder="English, Yoruba, Hausa, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to volunteer with us?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your passion and how you want to make an impact..."
                  className="min-height-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="howDidYouHear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you hear about us?</FormLabel>
              <FormControl>
                <Input placeholder="Social media, Word of mouth, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto bg-[#2E7D32] hover:bg-[#2E7D32]/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </form>
    </Form>
  );
}
