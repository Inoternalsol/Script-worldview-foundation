import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CustomFormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'textarea';
  autoComplete?: string;
  className?: string;
}

export function CustomFormField({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  className,
}: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === 'textarea' ? (
              <Textarea placeholder={placeholder} className="min-h-[120px]" {...field} />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
