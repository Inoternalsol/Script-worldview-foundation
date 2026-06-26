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
import { Loader2, Upload } from 'lucide-react';

const careerFormSchema = z.object({
  jobId: z.string().min(1),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  yearsExperience: z.coerce.number().min(0),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  coverLetter: z.string().min(20, { message: 'Cover letter must be at least 20 characters.' }),
  // In a real app, we'd handle file upload to R2 and get a URL.
  // For this implementation, we'll simulate the URL after 'uploading'.
  cvUrl: z.string().url({ message: 'Please upload your CV.' }),
});

type CareerFormValues = z.infer<typeof careerFormSchema>;

interface CareerApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export function CareerApplicationForm({ jobId, jobTitle }: CareerApplicationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CareerFormValues>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: {
      jobId: jobId,
      name: '',
      email: '',
      phone: '',
      yearsExperience: 0,
      linkedinUrl: '',
      coverLetter: '',
      cvUrl: '',
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/careers/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await res.json()
      form.setValue('cvUrl', data.url);
      
      toast({
        title: 'CV Uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload CV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: CareerFormValues) {
    setIsLoading(true);
    try {
      const result = await apiFetch('/api/careers/applications', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      if (result.ok) {
        toast({
          title: 'Application Received',
          description: `Your application for ${jobTitle} has been submitted successfully.`,
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
    <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-[#1A3A5C] mb-6">Apply for {jobTitle}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="yearsExperience"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Years of Relevant Experience</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Upload CV (PDF or Word)</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#1A3A5C] transition-colors w-full h-24"
                >
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-[#1A3A5C]" />
                  ) : form.getValues('cvUrl') ? (
                    <span className="text-green-600 font-medium">CV Uploaded ✓</span>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-muted-foreground text-sm">Click to upload CV</span>
                    </>
                  )}
                </label>
              </div>
            </FormControl>
            <FormMessage>{form.formState.errors.cvUrl?.message}</FormMessage>
          </FormItem>

          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Cover Letter / Statement of Interest</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Why are you a good fit for this role?"
                    className="min-height-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold h-12" disabled={isLoading || isUploading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
