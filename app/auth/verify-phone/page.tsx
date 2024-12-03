import Link from "next/link";
import {
  PhoneVerificationForm,
  ResendPhoneVerificationCodeForm,
} from "./components";

import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { getCurrentUserPhoneVerificationRequest } from "@/lib/server/phone-verification";
import { globalGETRateLimit } from "@/lib/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/redirect");
  }

  // TODO: Ideally we'd sent a new verification phone automatically if the previous one is expired,
  // but we can't set cookies inside server components.
  const verificationRequest = await getCurrentUserPhoneVerificationRequest();
  if (verificationRequest === null && user.phoneVerified) {
    return redirect("/");
  }
  return (
    <>
      <h1>Verify your phone address</h1>
      <p>
        We sent an 8-digit code to {verificationRequest?.phone ?? user.phone}.
      </p>
      <PhoneVerificationForm />
      <ResendPhoneVerificationCodeForm />
      <Link href='/settings'>Change your phone</Link>
    </>
  );
}
