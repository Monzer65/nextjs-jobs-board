import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes, ReactNode } from "react";

type FieldProps<S> = {
  name: string;
  schemaName: keyof S & string;
  type: string;
  className?: string;
  icon?: ReactNode; // Add an `icon` prop for rendering
} & InputHTMLAttributes<HTMLInputElement>;

export default function CustomInputField<S>({
  name,
  schemaName,
  type,
  className,
  icon,
  ...props
}: FieldProps<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={schemaName}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={schemaName} className={`text-base ${className}`}>
            {name}
          </FormLabel>
          <FormControl>
            <div className='relative flex items-center'>
              {icon && (
                <div className='absolute right-3 flex items-center justify-center'>
                  {icon}
                </div>
              )}
              <Input
                id={schemaName}
                type={type}
                {...field}
                {...props}
                dir='rtl'
                className={`disabled:opacity-75 pr-10 ${className}`}
                value={field.value ?? ""}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
}
