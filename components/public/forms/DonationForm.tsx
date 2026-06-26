'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api/client';
import { Loader2, Heart, ShieldCheck, CreditCard } from 'lucide-react';
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
  paymentGateway: z.enum(['paystack', 'stripe']),
});

type DonationValues = z.infer<typeof donationSchema>;

const PRESET_AMOUNTS: Record<string, number[]> = {
  NGN: [5000, 10000, 25000, 50000, 100000],
  USD: [25, 50, 100, 250, 500],
  GBP: [20, 40, 80, 200, 400],
  EUR: [25, 50, 100, 250, 500],
};

const getCurrencySymbol = (curr: string) => {
  switch (curr) {
    case 'NGN': return '₦';
    case 'USD': return '$';
    case 'GBP': return '£';
    case 'EUR': return '€';
    default: return '';
  }
};

interface DonationFormProps {
  defaultAmount?: number;
  defaultType?: 'one-time' | 'monthly';
  noCardStyle?: boolean;
  className?: string;
}

export function DonationForm({
  defaultAmount,
  defaultType = 'one-time',
  noCardStyle = false,
  className,
}: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'USD' | 'GBP' | 'EUR'>('NGN');
  const [activeAmount, setActiveAmount] = useState<number | null>(defaultAmount ?? 10000);

  const form = useForm<DonationValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: defaultAmount ?? 10000,
      currency: 'NGN',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      type: defaultType,
      isAnonymous: false,
      paymentGateway: 'paystack',
    },
  });

  // Detect timezone and pre-select Stripe/USD for international users
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz && !tz.toLowerCase().startsWith('africa/')) {
        setSelectedCurrency('USD')
        form.setValue('currency', 'USD')
        form.setValue('paymentGateway', 'stripe')
        const defaultUsd = defaultAmount ?? 50
        form.setValue('amount', defaultUsd)
        setActiveAmount(defaultUsd)
      }
    } catch (e) {
      console.warn('Failed to auto-detect timezone for payment selector:', e)
    }
  }, [form, defaultAmount])

  const onAmountClick = (amount: number) => {
    setActiveAmount(amount);
    form.setValue('amount', amount);
  };

  const handleCurrencyChange = (val: string) => {
    const currency = val as any;
    setSelectedCurrency(currency);
    form.setValue('currency', currency);
    const defaultVal = PRESET_AMOUNTS[currency][1]; // Select the 2nd tier by default
    form.setValue('amount', defaultVal);
    setActiveAmount(defaultVal);
    form.setValue('paymentGateway', currency === 'NGN' ? 'paystack' : 'stripe');
  };

  async function onSubmit(data: DonationValues) {
    setIsLoading(true);
    try {
      const result = (await apiFetch('/api/donations', {
        method: 'POST',
        body: JSON.stringify(data),
      })) as any;

      if (result.ok) {
        if (data.paymentGateway === 'paystack' && result.paymentData.authorization_url) {
          window.location.href = result.paymentData.authorization_url;
        } else if (data.paymentGateway === 'stripe' && result.paymentData.clientSecret) {
          toast({
            title: 'Stripe Checkout Initialized',
            description: 'Redirecting to secure gateway...',
          });
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

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Donation Type Toggles */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-2 gap-2 bg-secondary dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => form.setValue('type', 'one-time')}
                    className={cn(
                      "py-2.5 rounded-lg text-sm font-semibold transition-all",
                      field.value === 'one-time'
                        ? "bg-card dark:bg-slate-950 text-brand-primary dark:text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white"
                    )}
                  >
                    One-Time Gift
                  </button>
                  <button
                    type="button"
                    onClick={() => form.setValue('type', 'monthly')}
                    className={cn(
                      "py-2.5 rounded-lg text-sm font-semibold transition-all",
                      field.value === 'monthly'
                        ? "bg-card dark:bg-slate-950 text-brand-primary dark:text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white"
                    )}
                  >
                    Monthly Gift
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Currency Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Currency</label>
          <div className="flex gap-1 p-1 bg-secondary dark:bg-slate-800 rounded-xl w-full sm:w-fit">
            {['NGN', 'USD', 'GBP', 'EUR'].map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => handleCurrencyChange(curr)}
                className={cn(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  selectedCurrency === curr
                    ? "bg-card dark:bg-slate-950 text-brand-primary dark:text-white shadow-sm"
                    : "text-muted-foreground hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                )}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Amount Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Choose Amount</label>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {PRESET_AMOUNTS[selectedCurrency].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onAmountClick(amt)}
                className={cn(
                  "py-3 border rounded-xl text-xs sm:text-sm font-bold transition-all duration-200",
                  activeAmount === amt
                    ? "border-brand-primary bg-brand-primary text-white shadow-md shadow-brand-primary/10"
                    : "border-gray-200 dark:border-slate-800 bg-card dark:bg-slate-950 text-muted-foreground dark:text-gray-300 hover:border-brand-primary dark:hover:border-brand-primary hover:text-brand-primary dark:hover:text-brand-primary hover:bg-brand-primary/5 dark:hover:bg-brand-primary/5"
                )}
              >
                {getCurrencySymbol(selectedCurrency)}{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-400">Or Enter Custom Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                    {getCurrencySymbol(selectedCurrency)}
                  </span>
                  <Input
                    type="number"
                    placeholder="Other amount"
                    className="pl-10 h-12 text-base font-bold rounded-xl border-gray-200 dark:border-slate-800 bg-card dark:bg-slate-950 focus-visible:ring-brand-primary focus-visible:border-brand-primary"
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

        {/* Gateway Selector */}
        <FormField
          control={form.control}
          name="paymentGateway"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-400">Payment Gateway</FormLabel>
              <FormControl>
                <div className="grid gap-3">
                  {selectedCurrency === 'NGN' ? (
                    <div
                      onClick={() => form.setValue('paymentGateway', 'paystack')}
                      className={cn(
                        "flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all",
                        field.value === 'paystack'
                          ? "border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 ring-1 ring-brand-primary"
                          : "border-gray-200 dark:border-slate-800 hover:border-brand-primary/40 bg-card dark:bg-slate-950"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-brand-primary" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">Paystack Checkout</div>
                          <div className="text-xs text-gray-400">Supports NGN Cards, Bank Transfer, USSD</div>
                        </div>
                      </div>
                      <div className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center",
                        field.value === 'paystack' ? "border-brand-primary bg-brand-primary" : "border-gray-300 dark:border-slate-700"
                      )}>
                        {field.value === 'paystack' && <div className="h-1.5 w-1.5 rounded-full bg-card" />}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => form.setValue('paymentGateway', 'stripe')}
                      className={cn(
                        "flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all",
                        field.value === 'stripe'
                          ? "border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 ring-1 ring-brand-primary"
                          : "border-gray-200 dark:border-slate-800 hover:border-brand-primary/40 bg-card dark:bg-slate-950"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-[#635BFF]" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">Stripe Gateway</div>
                          <div className="text-xs text-gray-400">Supports International Cards & Wallets</div>
                        </div>
                      </div>
                      <div className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center",
                        field.value === 'stripe' ? "border-[#635BFF] bg-[#635BFF]" : "border-gray-300 dark:border-slate-700"
                      )}>
                        {field.value === 'stripe' && <div className="h-1.5 w-1.5 rounded-full bg-card" />}
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Donor Info Grid */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Details</label>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" className="rounded-xl border-gray-200 dark:border-slate-800" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" className="rounded-xl border-gray-200 dark:border-slate-800" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" className="rounded-xl border-gray-200 dark:border-slate-800" {...field} />
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
                <FormLabel className="text-xs">Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+234..." className="rounded-xl border-gray-200 dark:border-slate-800" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-gray-100 dark:border-slate-800 p-4 bg-gray-50/50 dark:bg-slate-900/50">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                    Donate anonymously
                  </FormLabel>
                  <p className="text-xs text-gray-400">
                    Your name will not be shown on public campaigns or walls.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white font-bold h-13 text-base rounded-xl shadow-lg shadow-brand-primary/10 transition-all flex items-center justify-center gap-2 mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing secure payment...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 fill-white" />
              Donate {getCurrencySymbol(selectedCurrency)}{Number(form.watch('amount') || 0).toLocaleString()} Now
            </>
          )}
        </Button>

        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
          Secured by {selectedCurrency === 'NGN' ? 'Paystack' : 'Stripe'}. SSL Encrypted.
        </p>
      </form>
    </Form>
  );

  if (noCardStyle) {
    return <div className={className}>{formContent}</div>;
  }

  return (
    <div className={cn("bg-card dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl text-red-600 dark:text-red-400">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1A3A5C] dark:text-white">Make a Donation</h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">Your contribution changes lives today.</p>
        </div>
      </div>
      {formContent}
    </div>
  );
}
