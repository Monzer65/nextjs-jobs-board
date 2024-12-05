"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  resendPhoneVerificationCodeAction,
  verifyPhoneAction,
} from "./actions";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PhoneVerificationSchemaType } from "@/zod-schemas/user";
import {
  AlertCircle,
  CheckCircle,
  CheckSquare,
  Forward,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatTime } from "@/lib/utils";

const phoneVerificationInitialState = {
  message: "",
  success: false,
  fields: {},
};

export function PhoneVerificationForm() {
  const [state, action, isPending] = useActionState(
    verifyPhoneAction,
    phoneVerificationInitialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<PhoneVerificationSchemaType>({
    defaultValues: {
      code: "",
      ...(state?.fields ?? {}),
    },
  });

  const onSubmit = async (data: PhoneVerificationSchemaType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <Form {...form}>
      <form
        action={action}
        onSubmit={form.handleSubmit(onSubmit)}
        ref={formRef}
        dir='ltr'
      >
        {state?.message && (
          <Alert
            variant={state.success ? "default" : "destructive"}
            className='mt-4 text-right'
            dir='rtl'
          >
            {state.success ? (
              <CheckCircle className='ml-2 h-4 w-4 text-green-500' />
            ) : (
              <AlertCircle className='ml-2 h-4 w-4 text-red-500' />
            )}
            <AlertTitle className='flex items-center'>
              {state.success ? "موفق" : "خطا"}
            </AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>کد تایید</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  className='flex justify-center gap-2'
                >
                  <InputOTPGroup className='m-auto w-full [&>*]:flex-1'>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage dir='rtl' />
              <FormDescription className='mt-2' dir='rtl'>
                برای تایید حساب کاربری، کد شش رقمی را در کادر فوق وارد کنید
              </FormDescription>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 my-4 ${
            isPending ? "opacity-75" : "opacity-100"
          }`}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <CheckSquare className='h-4 w-4' />
          )}
          تایید
        </Button>
      </form>
    </Form>
  );
}

const resendPhoneInitialState = {
  message: "",
};

export function ResendPhoneVerificationCodeForm({
  remainingSeconds,
}: {
  remainingSeconds: number;
}) {
  const [state, action, isPending] = useActionState(
    resendPhoneVerificationCodeAction,
    resendPhoneInitialState
  );

  const [seconds, setSeconds] = useState(remainingSeconds);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setSeconds(remainingSeconds);
  }, [remainingSeconds]);

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prev) => Math.max(prev - 1, 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [seconds]);

  useEffect(() => {
    if (state.message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [state.message]);

  return (
    <div className='space-y-4'>
      <form
        action={action}
        className='flex items-center space-x-2 rtl:space-x-reverse'
      >
        <Button
          type='submit'
          variant='outline'
          className={`${isPending ? "opacity-75" : "opacity-100"}`}
          disabled={seconds > 0 || isPending}
        >
          {isPending ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Forward className='h-4 w-4' />
          )}
          دریافت مجدد کد
        </Button>
        {seconds > 0 && (
          <p className='text-sm text-muted-foreground'>{formatTime(seconds)}</p>
        )}
      </form>
      {showMessage && (
        <p className='text-sm text-primary animate-fade-in-out'>
          {state.message}
        </p>
      )}
    </div>
  );
}

// "use client";

// import {
//   startTransition,
//   useActionState,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button, buttonVariants } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   ArrowRight,
//   RefreshCw,
//   CheckCircle,
//   Loader2,
//   AlertCircle,
//   Verified,
//   Phone,
//   Mail,
//   Edit,
// } from "lucide-react";
// import { verifyOtpAction } from "@/actions/auth";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { confirmationSchema, ConfirmationSchemaType } from "@/zod-schemas/user";
// import CustomInputField from "./CustomInputField";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function VerificationForm() {
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");
//   const phone = searchParams.get("phone");
//   const otp = searchParams.get("otp");
//   const [state, formAction, isPending] = useActionState(verifyOtpAction, {
//     message: "",
//     fields: {},
//     success: false,
//   });
//   const [contactType, setContactType] = useState<"email" | "phone">("phone");
//   const [isEditing, setIsEditing] = useState(false);

//   const formRef = useRef<HTMLFormElement>(null);

//   const form = useForm<ConfirmationSchemaType>({
//     resolver: zodResolver(confirmationSchema),
//     defaultValues: {
//       otp: "",
//       email: "",
//       phone: "",
//     },
//   });

//   useEffect(() => {
//     if (email) {
//       form.setValue("email", email);
//       setContactType("email");
//     } else if (phone) {
//       form.setValue("phone", phone);
//       setContactType("phone");
//     }
//     if (otp) {
//       form.setValue("otp", otp);
//     }
//   }, [email, phone, otp, form]);

//   useEffect(() => {
//     const subscription = form.watch((value, { name }) => {
//       if (name === "email" && value.email) {
//         form.setValue("phone", "");
//       } else if (name === "phone" && value.phone) {
//         form.setValue("email", "");
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [form]);

//   useEffect(() => {
//     const errors = form.formState.errors;

//     if (errors.email || errors.phone) {
//       setIsEditing(true);
//     }
//   }, [form.formState.errors]);

//   const onSubmit = useCallback(
//     async (data: ConfirmationSchemaType) => {
//       const formData = new FormData();

//       if (!data[contactType]) {
//         setIsEditing(true);
//         return;
//       }

//       formData.append("otp", data.otp);
//       formData.append(contactType, data[contactType] || "");
//       for (const pair of formData.entries()) {
//         console.log(`${pair[0]}: ${pair[1]}`);
//       }

//       startTransition(() => {
//         formAction(formData);
//       });
//     },
//     [contactType, formAction]
//   );

//   useEffect(() => {
//     if (state.success || state.message) {
//       console.log("Submission skipped due to state success or message.");
//       return;
//     }
//     if (otp && (email || phone) && !isPending) {
//       console.log("Triggering form submission...");
//       const timer = setTimeout(() => {
//         form.handleSubmit(onSubmit)();
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [
//     otp,
//     email,
//     phone,
//     state.success,
//     state.message,
//     isPending,
//     form,
//     onSubmit,
//   ]);

//   const handleResendCode = () => {
//     alert("این قسمت هنوز پیاده سازی نشده است");
//   };

//   return (
//     <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4'>
//       <Card className='w-full max-w-md mx-auto shadow-lg'>
//         <CardHeader className='text-center'>
//           <CardTitle className='text-2xl font-bold'>
//             تایید حساب کاربری
//           </CardTitle>
//           {(email || phone) && (
//             <CardDescription className='mt-2'>
//               کد تایید به {email ? "ایمیل" : "شماره تلفن"}{" "}
//               <span className='font-semibold'>{email || phone}</span> ارسال شده
//               است
//             </CardDescription>
//           )}
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               action={formAction}
//               onSubmit={form.handleSubmit(onSubmit)}
//               className='space-y-6'
//               dir='ltr'
//               ref={formRef}
//             >
//               {state?.message && (
//                 <Alert
//                   variant={state.success ? "default" : "destructive"}
//                   className='mt-4 text-right'
//                   dir='rtl'
//                 >
//                   {state.success ? (
//                     <CheckCircle className='ml-2 h-4 w-4 text-green-500' />
//                   ) : (
//                     <AlertCircle className='ml-2 h-4 w-4 text-red-500' />
//                   )}
//                   <AlertTitle className='flex items-center'>
//                     {state.success ? "موفق" : "خطا"}
//                   </AlertTitle>
//                   <AlertDescription>{state.message}</AlertDescription>
//                 </Alert>
//               )}
//               <FormField
//                 control={form.control}
//                 name='otp'
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className='sr-only'>کد تایید</FormLabel>
//                     <FormControl>
//                       <InputOTP
//                         maxLength={6}
//                         {...field}
//                         className='flex justify-center gap-2'
//                       >
//                         <InputOTPGroup className='m-auto w-full [&>*]:flex-1'>
//                           <InputOTPSlot index={0} />
//                           <InputOTPSlot index={1} />
//                           <InputOTPSlot index={2} />
//                           <InputOTPSlot index={3} />
//                           <InputOTPSlot index={4} />
//                           <InputOTPSlot index={5} />
//                         </InputOTPGroup>
//                       </InputOTP>
//                     </FormControl>
//                     <FormMessage dir='rtl' />
//                     <FormDescription className='mt-2' dir='rtl'>
//                       برای تایید حساب کاربری، کد شش رقمی را در کادر فوق وارد
//                       کنید
//                     </FormDescription>
//                   </FormItem>
//                 )}
//               />
//               {(email || phone) && !isEditing ? (
//                 <div className='flex items-center'>
//                   <span className='font-semibold'>{email || phone}</span>
//                   <Button
//                     variant='ghost'
//                     onClick={() => setIsEditing(true)}
//                     title='ویرایش'
//                   >
//                     <Edit className='h-4 w-4' />
//                     <span className='sr-only'>edit</span>
//                   </Button>
//                 </div>
//               ) : (
//                 <div>
//                   <RadioGroup
//                     onValueChange={(value) => {
//                       setContactType(value as "email" | "phone");
//                     }}
//                     defaultValue={contactType}
//                     className='flex space-x-4 rtl:space-x-reverse'
//                     dir='rtl'
//                   >
//                     <div className='flex items-center space-x-2 space-y-0 rtl:space-x-reverse'>
//                       <RadioGroupItem value='phone' id='phone' />
//                       <Label htmlFor='phone'>تایید تلفن</Label>
//                     </div>
//                     <div className='flex items-center space-x-2 space-y-0 rtl:space-x-reverse'>
//                       <RadioGroupItem value='email' id='email' />
//                       <Label htmlFor='email'>تایید ایمیل</Label>
//                     </div>
//                   </RadioGroup>

//                   {contactType === "email" && (
//                     <CustomInputField
//                       name='ایمیل'
//                       schemaName='email'
//                       inputDir='ltr'
//                       textDir='rtl'
//                       labelClassName='sr-only'
//                       className={`rtl-placeholder`}
//                       placeholder='ایمیلی که با آن ثبت نام کرده‌اید'
//                       type='email'
//                       icon={<Mail className='h-4 w-4 text-gray-500' />}
//                     />
//                   )}
//                   {contactType === "phone" && (
//                     <CustomInputField
//                       name='تلفن'
//                       schemaName='phone'
//                       inputDir='ltr'
//                       textDir='rtl'
//                       labelClassName='sr-only'
//                       className={`rtl-placeholder`}
//                       placeholder='شماره تلفنی که با آن ثبت نام کرده‌اید'
//                       type='tel'
//                       icon={<Phone className='h-4 w-4 text-gray-500' />}
//                     />
//                   )}
//                 </div>
//               )}
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter className='flex flex-col space-y-4'>
//           <div className='flex justify-between w-full gap-2'>
//             <Link
//               href='/auth/signup'
//               className={`${buttonVariants({
//                 variant: "outline",
//               })} w-1/3`}
//             >
//               <ArrowRight className='h-4 w-4' />
//               بازگشت
//             </Link>
//             <Button
//               type='submit'
//               onClick={form.handleSubmit(onSubmit)}
//               className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300'
//             >
//               {isPending ? (
//                 <Loader2 className='h-4 w-4 animate-spin' />
//               ) : (
//                 <Verified className='h-4 w-4' />
//               )}
//               {isPending ? "در حال ارسال..." : "ارسال کد"}
//             </Button>
//           </div>
//           <Button
//             type='button'
//             variant='link'
//             onClick={handleResendCode}
//             className='w-full hover:bg-blue-50'
//           >
//             <RefreshCw className='h-4 w-4' /> ارسال مجدد کد
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
