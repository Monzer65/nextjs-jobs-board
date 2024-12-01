"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";

const initialState = {
  message: "",
};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <form action={action}>
      <label htmlFor='form-login.email'>Email</label>
      <input
        type='email'
        id='form-login.email'
        name='email'
        autoComplete='username'
        required
      />
      <br />
      <label htmlFor='form-login.password'>Password</label>
      <input
        type='password'
        id='form-login.password'
        name='password'
        autoComplete='current-password'
        required
      />
      <br />
      <button>Continue</button>
      <p>{state.message}</p>
    </form>
  );
}

export function PasskeyLoginButton() {
  const [message, setMessage] = useState("");
  return (
    <>
      <button
        onClick={async () => {
          setMessage("result");
        }}
      >
        Sign in with passkey
      </button>
      <p>{message}</p>
    </>
  );
}

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
// import {
//   confirmationSchema,
//   ConfirmationSchemaType,
//   loginSchema,
//   LoginSchemaType,
// } from "@/zod-schemas/user";
// import CustomInputField from "./CustomInputField";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function LoginForm() {
//   const [state, formAction, isPending] = useActionState(verifyOtpAction);
//   const formRef = useRef<HTMLFormElement>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const form = useForm<LoginSchemaType>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       password: "",
//       email: "",
//       phone: "",
//     },
//   });

//   return (
//     <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4'>
//       <Card className='w-full max-w-md mx-auto shadow-lg'>
//         <CardHeader className='text-center'>
//           <CardTitle className='text-2xl font-bold'>
//             ورود به حساب کاربری
//           </CardTitle>
//           <CardDescription className='mt-2'>
//             برای ورود به حساب کاربری خود ایمیل یا شماره تلفن خود را وارد کنید
//           </CardDescription>
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
