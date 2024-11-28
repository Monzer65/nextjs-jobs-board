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
import { signupAction } from "@/actions/auth";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import CustomSelectField, { CustomSelectDataObj } from "./CustomSelectField";
import CustomInputField from "./CustomInputField";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  X,
  Mail,
  Phone,
  User,
  Lock,
  UserPlus,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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

  const router = useRouter();
  const redirectToVerify = () => {
    // Ensure state.fields exists and has values for email or phone
    const contactValue = state.fields?.phone || state.fields?.email;
    if (!contactValue) {
      console.error(
        "Redirect Error: No valid contact information found in state.fields."
      );
      return; // Avoid redirecting if no valid contact information is available
    }

    // Safely construct the URL and encode parameters
    const queryParam = encodeURIComponent(contactValue);
    const queryKey = state.fields?.phone ? "phone" : "email";
    console.log("keys and values", state.fields, queryParam, queryKey);

    // Redirect to the verify page with the correct parameters
    router.push(`/auth/verify?${queryKey}=${queryParam}`);
  };

  const redirectToLogin = () => {
    router.push(`/auth/login`);
  };

  return (
    <Card className='w-full max-w-md mx-auto shadow-lg'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-center'>
          ثبت نام
        </CardTitle>
        <CardDescription className='text-center'>
          ایجاد حساب کاربری جدید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            className='space-y-6'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {state?.message && !state.issues && (
              <Alert
                variant={state.success === true ? "default" : "destructive"}
                className='mt-4'
                dir='rtl'
              >
                {state.success === true ? (
                  <CheckCircle className='ml-2 h-4 w-4 text-green-500' />
                ) : (
                  <AlertCircle className='ml-2 h-4 w-4 text-red-500' />
                )}
                <AlertTitle className='flex items-center'>
                  {state.success === true ? "موفق" : "خطا"}
                </AlertTitle>
                <AlertDescription>
                  {state.message}
                  {state.message ===
                    "کاربر قبلا ثبت نام کرده اما هنوز تایید نشده است" && (
                    <Button onClick={redirectToVerify} className='ml-2 mt-2'>
                      صفحه تایید
                    </Button>
                  )}
                  {state.message ===
                    "کاربر با این شماره موبایل یا ایمیل وجود دارد" && (
                    <Button onClick={redirectToLogin} className='ml-2 mt-2'>
                      {" "}
                      صفحه ورود
                    </Button>
                  )}
                </AlertDescription>
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
                  icon={<Mail className='h-4 w-4 text-gray-500' />}
                />
              )}
              {form.watch("contactMethod") === "phone" && (
                <CustomInputField
                  name='تلفن'
                  schemaName='phone'
                  type='tel'
                  icon={<Phone className='h-4 w-4 text-gray-500' />}
                />
              )}

              <div className='relative'>
                <CustomInputField
                  name='پسورد'
                  schemaName='password'
                  type={"password"}
                  icon={<Lock className='h-4 w-4 text-gray-500' />}
                />
              </div>

              <div className='relative'>
                <CustomInputField
                  name='تکرار پسورد'
                  schemaName='confirmPassword'
                  type={"password"}
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
              ثبت نام
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
