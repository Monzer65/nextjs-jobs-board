"use client";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectHTMLAttributes } from "react";

export type CustomSelectDataObj = {
  id: string;
  description: string;
};

type FieldProps<S> = {
  name: string;
  schemaName: keyof S & string;
  data: CustomSelectDataObj[];
  calssName?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function CustomSelectField<S>({
  name,
  schemaName,
  data,
  className,
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
          <Select {...field} onValueChange={field.onChange} dir='rtl'>
            <FormControl>
              <SelectTrigger
                id={schemaName}
                className={`border border-gray-300 rounded-lg p-2 ${className}`}
              >
                <SelectValue placeholder='انتخاب نوع کاربری' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((item) => (
                <SelectItem key={`${schemaName}_${item.id}`} value={item.id}>
                  {item.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
}
