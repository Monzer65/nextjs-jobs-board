import Link from "next/link";
import Image from "next/image";
import { Smartphone } from "lucide-react";
import { redirect } from "next/navigation";

import {
  PhoneVerificationForm,
  ResendPhoneVerificationCodeForm,
} from "./components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/server/session";
import { getCurrentUserPhoneVerificationRequest } from "@/lib/server/phone-verification";
import { globalGETRateLimit } from "@/lib/server/request";

export default async function VerifyPhonePage() {
  if (!(await globalGETRateLimit())) {
    return <RateLimitExceeded />;
  }

  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/auth/signup");
  }

  const verificationRequest = await getCurrentUserPhoneVerificationRequest();
  if (user.phoneVerified && !verificationRequest) {
    redirect("/"); // Already verified or no pending verification
  }

  const remainingSeconds = verificationRequest?.expiresAt
    ? Math.max(
        Math.floor(
          (verificationRequest.expiresAt.getTime() - Date.now()) / 1000
        ),
        0
      )
    : 0;

  const phoneNumber = verificationRequest?.phone ?? user.phone;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='space-y-1 relative pb-2'>
          <Link href='/' className='absolute left-4 top-4'>
            <Image
              src='/logo.png'
              alt='logo'
              width={40}
              height={40}
              // className='w-10 h-10'
            />
          </Link>
          <CardTitle className='text-2xl font-bold text-center mt-6'>
            تایید حساب کاربری
          </CardTitle>
          <CardDescription className='text-center'>
            <p className='text-center text-sm text-muted-foreground'>
              یک کد 6 رقمی به شماره{" "}
              <span dir='ltr' className=''>
                {phoneNumber}
              </span>{" "}
              ارسال کردیم
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <PhoneVerificationForm />
        </CardContent>
        <CardFooter className='flex flex-col items-center space-y-4'>
          <div className='flex gap-2 justify-center w-full'>
            <ResendPhoneVerificationCodeForm
              remainingSeconds={remainingSeconds}
            />
            <Button variant='outline' asChild>
              <Link href='/settings'>
                <Smartphone className='h-4 w-4' />
                تغییر تلفن
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function RateLimitExceeded() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            درخواست بیش از حد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-center'>
            لطفاً چند دقیقه صبر کنید و دوباره امتحان کنید.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
