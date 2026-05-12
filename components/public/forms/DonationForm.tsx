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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api/client';
import { Loader2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const donationSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be greater than 0.' }),
  currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']),
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  type: z.enum(['one-time', 'monthly']),
  isAnonymous: z.boolean().default(false),
});

type DonationValues = z.infer<typeof donationSchema>;

const PRESET_AMOUNTS: Record<string, number[]> = {
  NGN: [5000, 10000, 25000, 50000, 100000],
  USD: [25, 50, 100, 250, 500],
  GBP: [20, 40, 80, 200, 400],
  EUR: [25, 50, 100, 250, 500],
};

export function DonationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'USD' | 'GBP' | 'EUR'>('NGN');
  const [activeAmount, setActiveAmount] = useState<number | null>(null);

  const form = useForm<DonationValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 5000,
      currency: 'NGN',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      type: 'one-time',
      isAnonymous: false,
    },
  });

  const onAmountClick = (amount: number) => {
    setActiveAmount(amount);
    form.setValue('amount', amount);
  };

  const handleCurrencyChange = (val: string) => {
    const currency = val as any;
    setSelectedCurrency(currency);
    form.setValue('currency', currency);
    // Set default amount for currency
    const defaultAmount = PRESET_AMOUNTS[currency][0];
    form.setValue('amount', defaultAmount);
    setActiveAmount(defaultAmount);
  };

  async function onSubmit(data: DonationValues) {
    setIsLoading(true);
    try {
      // Determine gateway based on currency
      const paymentGateway = data.currency === 'NGN' ? 'paystack' : 'stripe';

      const result = (await apiFetch('/api/donations', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          paymentGateway,
        }),
      })) as any;

      if (result.ok) {
        // Handle redirect
        if (paymentGateway === 'paystack' && result.paymentData.authorization_url) {
          window.location.href = result.paymentData.authorization_url;
        } else if (paymentGateway === 'stripe' && result.paymentData.clientSecret) {
          // In a full implementation, we'd mount Stripe Elements here
          // For now, we'll notify the user
          toast({
            title: 'Stripe Initialized',
            description: 'Proceeding to secure international payment...',
          });
          // Simulating redirect to a stripe checkout/elements page
          window.location.href = `/donate/stripe?clientSecret=${result.paymentData.clientSecret}`;
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to initialize donation. Please try again.',
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
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-50 rounded-full">
          <Heart className="h-6 w-6 text-red-600 fill-red-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#1A3A5C]">Make a Donation</h3>
          <p className="text-gray-500">Your contribution changes lives.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Donation Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }: { field: any }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0 cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="one-time" />
                      </FormControl>
                      <FormLabel className="font-medium">One-time</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0 cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="monthly" />
                      </FormControl>
                      <FormLabel className="font-medium">Monthly</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Currency Selection */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
            {['NGN', 'USD', 'GBP', 'EUR'].map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => handleCurrencyChange(curr)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-semibold transition-all",
                  selectedCurrency === curr ? "bg-white text-[#1A3A5C] shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Amount Selection */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {PRESET_AMOUNTS[selectedCurrency].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onAmountClick(amt)}
                className={cn(
                  "py-3 px-2 border rounded-xl text-sm font-bold transition-all",
                  activeAmount === amt 
                    ? "border-[#1A3A5C] bg-[#1A3A5C] text-white shadow-md" 
                    : "border-gray-200 text-gray-600 hover:border-[#1A3A5C] hover:bg-gray-50"
                )}
              >
                {selectedCurrency === 'NGN' ? '₦' : selectedCurrency === 'USD' ? '$' : selectedCurrency === 'GBP' ? '£' : '€'}{amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Custom Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      {selectedCurrency === 'NGN' ? '₦' : selectedCurrency === 'USD' ? '$' : selectedCurrency === 'GBP' ? '£' : '€'}
                    </span>
                    <Input 
                      placeholder="Enter custom amount" 
                      className="pl-10 h-14 text-lg font-bold"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setActiveAmount(null);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Donor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-[#1A3A5C]/20" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Donate ${selectedCurrency === 'NGN' ? '₦' : selectedCurrency === 'USD' ? '$' : selectedCurrency === 'GBP' ? '£' : '€'}${form.watch('amount')?.toLocaleString() || '0'}`
            )}
          </Button>

          <p className="text-center text-xs text-gray-400">
            Secure payment powered by {selectedCurrency === 'NGN' ? 'Paystack' : 'Stripe'}.
          </p>
        </form>
      </Form>
    </div>
  );
}
