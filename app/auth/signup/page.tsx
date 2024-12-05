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
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function SignupPage() {
  if (!(await globalGETRateLimit())) {
    return "تعداد درخواست های شما بیشتر از حد مجاز است";
  }
  const { session, user } = await getCurrentSession();
  if (session !== null) {
    if (user.email && !user.emailVerified) {
      return redirect("/auth/verify-email");
    } else if (user.phone && !user.phoneVerified) {
      return redirect("/auth/verify-phone");
    }
    if (!user.registered2FA) {
      return redirect("/auth/2fa/setup");
    }
    if (!session.twoFactorVerified) {
      return redirect(get2FARedirect(user));
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

      <CardFooter className='flex flex-col gap-2 justify-center'>
        <Separator />
        <div className='flex flex-col sm:flex-row text-center justify-center gap-2 [&>*]:w-full'>
          <Link
            href='/auth/login/google'
            passHref
            className={`${buttonVariants({ variant: "outline" })} w-full`}
          >
            <Image src='/G-logo.svg' alt='Google Logo' width={20} height={20} />
            ورود با گوگل
          </Link>
        </div>
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
