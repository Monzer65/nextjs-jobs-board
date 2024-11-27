"use client";

import { useRef, useActionState, use, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ConfirmationSchemaType, confirmatioSchema } from "@/zod-schemas/user";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ArrowRight, RefreshCw, CheckCircle, XCircle, X } from "lucide-react";
import { verifyOtpAction } from "@/actions/auth";

export default function VerificationForm({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { email, phone } = use(searchParams);

  const [state, formAction, isPending] = useActionState(verifyOtpAction, {
    message: "",
  });

  const form = useForm<ConfirmationSchemaType>({
    resolver: zodResolver(confirmatioSchema),
    defaultValues: {
      phone: "",
      email: "",
      otp: "",
      ...(state?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (data: ConfirmationSchemaType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Ensure both email and phone are always present
    if (email) {
      formData.set("email", email.toString());
      formData.set("phone", "");
    } else if (phone) {
      formData.set("phone", phone.toString());
      formData.set("email", "");
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4'>
      <Card className='w-full max-w-md mx-auto shadow-lg'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>
            تایید حساب کاربری
          </CardTitle>
          <CardDescription className='mt-2'>
            کد تایید به {email ? "ایمیل" : "شماره تلفن"}{" "}
            <span className='font-semibold'>{email ? email : phone}</span> ارسال
            شده است
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              action={formAction}
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
              dir='ltr'
              ref={formRef}
            >
              {state?.message && !state.issues && (
                // <div
                //   className={`border ${
                //     state.success === true
                //       ? "border-green-400 text-green-700 bg-green-100"
                //       : "border-red-400 text-red-700 bg-red-100"
                //   }   px-4 py-3 rounded relative`}
                //   role='alert'
                // >
                //   <span className='block sm:inline'>{state.message}</span>

                // </div>
                <Alert
                  variant={state.success === true ? "default" : "destructive"}
                  className='mt-4'
                >
                  <AlertTitle className='flex items-center'>
                    {state.success === true ? (
                      <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                    ) : (
                      <XCircle className='mr-2 h-4 w-4 text-red-500' />
                    )}
                    {state.success === true ? "موفق" : "خطا"}
                  </AlertTitle>
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
              <FormField
                control={form.control}
                name='otp'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='sr-only'>کد تایید</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        className='flex justify-center gap-2'
                      >
                        <InputOTPGroup className='m-auto'>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription className='text-center mt-2'>
                      برای تایید حساب کاربری، کد شش رقمی را در کادر فوق وارد
                      کنید
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='flex justify-between w-full gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => console.log("kk")}
              className='w-1/3'
            >
              <ArrowRight className='ml-2 h-4 w-4' /> بازگشت
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              onClick={form.handleSubmit(onSubmit)}
              className='w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300'
            >
              {isPending ? "در حال ارسال..." : "تایید کد"}
            </Button>
          </div>
          <Button
            type='button'
            variant='ghost'
            onClick={() => console.log("handlereset")}
            className='w-full hover:bg-blue-50'
          >
            <RefreshCw className='ml-2 h-4 w-4' /> ارسال مجدد کد
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
