import { LoginForm } from "./LoginForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";
import Image from "next/image";
import { Fingerprint } from "lucide-react";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();
  if (session !== null) {
    if (!user.emailVerified) {
      return redirect("/auth/verify-email");
    }
    if (!user.registered2FA) {
      return redirect("/");
    }
    if (!session.twoFactorVerified) {
      return redirect("/");
    }
    return redirect("/");
  }

  return (
    <Card className='relative w-full max-w-md mx-auto shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-center'>ورود</CardTitle>
        <CardDescription className='text-center'>
          ورود به حساب کاربری
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
        <LoginForm />
        <Separator className='my-4' />
        <div className='flex flex-col sm:flex-row text-center justify-center gap-2 [&>*]:w-full'>
          <Link
            href='/auth/login/google'
            passHref
            className={buttonVariants({ variant: "outline" })}
          >
            <Image src='/G-logo.svg' alt='Google Logo' width={20} height={20} />
            ورود با گوگل
          </Link>
          <Link
            href='/auth/login/google'
            passHref
            className={buttonVariants({ variant: "outline" })}
          >
            <Fingerprint className='h-5 w-5' />
            ورود با کلید عبور
          </Link>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className='flex flex-col sm:flex-row gap-4 justify-between mt-2'>
        <p className='text-sm text-muted-foreground flex flex-col'>
          حساب کاربری ندارید؟
          <Link
            href='/auth/signup'
            className='mr-1 underline text-blue-600 underline-offset-4'
          >
            ثبت نام
          </Link>
        </p>
        <p className='text-sm text-muted-foreground flex flex-col'>
          رمز عبور خود را فراموش کرده اید؟
          <Link
            href='/auth/forgot-password'
            className='mr-1 text-blue-600 hover:underline underline-offset-4'
          >
            بازیابی رمز عبور
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
