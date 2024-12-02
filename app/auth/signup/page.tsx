import SignupForm from "./SignupForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";
import Image from "next/image";
import { get2FARedirect } from "@/lib/server/2fa";

export default async function SignupPage() {
  if (!(await globalGETRateLimit())) {
    return "تعداد درخواست های شما بیشتر از حد مجاز است";
  }
  const { session, user } = await getCurrentSession();
  if (session !== null) {
    if (!user.emailVerified) {
      return redirect("/auth/verify-email");
    }
    if (!user.registered2FA) {
      return redirect("/auth/2fa/setup");
    }
    if (!session.twoFactorVerified) {
      return redirect(await get2FARedirect(user));
    }
    return redirect("/");
  }

  return (
    <Card className='relative w-full max-w-md mx-auto shadow-lg'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-center'>
          ثبت نام
        </CardTitle>
        <CardDescription className='text-center'>
          ایجاد حساب کاربری جدید
        </CardDescription>
        <Link href='/' className='absolute left-8 top-8'>
          <Image
            src='/logo.png'
            alt='logo'
            width={50}
            height={50}
            className='w-full'
          />
        </Link>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
      <CardFooter className='flex justify-center'>
        <p className='text-sm text-muted-foreground'>
          قبلا ثبت نام کرده اید؟
          <Link
            href='/auth/login'
            className='mr-1 underline text-blue-600 underline-offset-4'
          >
            ورود
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
