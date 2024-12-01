import { LoginForm } from "./LoginForm";
import Link from "next/link";

import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";

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
    <>
      <h1>Sign in</h1>
      <LoginForm />
      <Link href='/auth/signup'>Create an account</Link>
      <Link href='/forgot-password'>Forgot password?</Link>
      <Link href='/auth/login/google'>Sign in with Google</Link>
    </>
  );
}
