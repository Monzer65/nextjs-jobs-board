"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { signupSchema, type SignupSchemaType } from "@/zod-schemas/user";
import { signupAction } from "./actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomSelectField, {
  CustomSelectDataObj,
} from "@/components/CustomSelectField";
import CustomInputField from "@/components/CustomInputField";

import {
  X,
  Mail,
  Phone,
  User,
  Lock,
  UserPlus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Array definition
export const UserTypesArr: CustomSelectDataObj[] = [
  {
    id: "job_seeker",
    description: "کارجوی کار دائمی",
  },
  {
    id: "freelancer",
    description: "فریلنسر",
  },
  {
    id: "employer",
    description: "کارفرما",
  },
];

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, {
    message: "",
  });

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userType: "",
      contactMethod: "email",
      ...(state?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (data: SignupSchemaType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Ensure both email and phone are always present
    if (data.contactMethod === "email") {
      formData.set("phone", "");
    } else if (data.contactMethod === "phone") {
      formData.set("email", "");
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        className='space-y-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {state?.message && !state.issues && (
          <Alert variant='destructive' className='mt-4' dir='rtl'>
            <AlertCircle className='ml-2 h-4 w-4 text-red-500' />
            <AlertTitle className='flex items-center'>خطا</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state?.issues && (
          <div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
            role='alert'
          >
            <ul className='list-disc list-inside'>
              {state.issues.map((issue) => (
                <li key={issue} className='flex items-center gap-2'>
                  <X className='h-4 w-4' />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className='space-y-4'>
          <CustomInputField
            name='نام کاربری'
            schemaName='username'
            type='text'
            autoComplete='username'
            icon={<User className='h-4 w-4 text-gray-500' />}
          />

          <CustomSelectField<SignupSchemaType>
            name='نوع کاربری'
            schemaName='userType'
            data={UserTypesArr}
          />

          <FormField
            control={form.control}
            name='contactMethod'
            render={({ field }) => (
              <FormItem>
                <FormLabel>روش ثبت نام</FormLabel>
                <FormControl>
                  <RadioGroup
                    dir='rtl'
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("email", "");
                      form.setValue("phone", "");
                    }}
                    className='flex space-x-4 rtl:space-x-reverse'
                  >
                    <FormItem className='flex items-center space-x-2 space-y-0 rtl:space-x-reverse'>
                      <FormControl>
                        <RadioGroupItem value='email' />
                      </FormControl>
                      <FormLabel className='font-normal'>ایمیل</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-2 space-y-0 rtl:space-x-reverse'>
                      <FormControl>
                        <RadioGroupItem value='phone' />
                      </FormControl>
                      <FormLabel className='font-normal'>تلفن</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("contactMethod") === "email" && (
            <CustomInputField
              name='ایمیل'
              schemaName='email'
              type='email'
              autoComplete='email'
              icon={<Mail className='h-4 w-4 text-gray-500' />}
            />
          )}
          {form.watch("contactMethod") === "phone" && (
            <CustomInputField
              name='تلفن'
              schemaName='phone'
              type='tel'
              autoComplete='tel'
              icon={<Phone className='h-4 w-4 text-gray-500' />}
            />
          )}

          <div className='relative'>
            <CustomInputField
              name='پسورد'
              schemaName='password'
              type='password'
              autoComplete='new-password'
              icon={<Lock className='h-4 w-4 text-gray-500' />}
            />
          </div>

          <div className='relative'>
            <CustomInputField
              name='تکرار پسورد'
              schemaName='confirmPassword'
              type='password'
              icon={<Lock className='h-4 w-4 text-gray-500' />}
            />
          </div>
        </div>
        <Button
          type='submit'
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 ${
            isPending ? "opacity-75" : "opacity-100"
          }`}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className='ml-2 h-4 w-4 animate-spin' />
          ) : (
            <UserPlus className='ml-2 h-4 w-4' />
          )}
          ادامه
        </Button>
      </form>
    </Form>
  );
}
