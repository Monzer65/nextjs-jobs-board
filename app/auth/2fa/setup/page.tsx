import Link from "next/link";

import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();
  if (session === null || user === null) {
    return redirect("/auth/login");
  }
  if (user.email && !user.emailVerified) {
    return redirect("/auth/verify-email");
  } else if (user.phone && !user.phoneVerified) {
    return redirect("/auth/verify-phone");
  }
  if (user.registered2FA) {
    return redirect("/");
  }
  return (
    <>
      <h1>Set up two-factor authentication</h1>
      <ul>
        <li>
          <Link href='/auth/2fa/totp/setup'>Authenticator apps</Link>
        </li>
        <li>
          <Link href='/auth/2fa/passkey/register'>Passkeys</Link>
        </li>
        <li>
          <Link href='/auth/2fa/security-key/register'>Security keys</Link>
        </li>
      </ul>
    </>
  );
}
