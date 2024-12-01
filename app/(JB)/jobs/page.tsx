import { LogoutButton } from "@/components/LogoutButton";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function JobsPage() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }
  const { session, user } = await getCurrentSession();
  if (session === null) {
    return redirect("/auth/login");
  }
  if (!user.emailVerified) {
    return redirect("/auth/verify-email");
  }
  if (!user.registered2FA) {
    return redirect("/auth/login");
    // return redirect("/2fa/setup");
  }
  if (!session.twoFactorVerified) {
    return redirect("/auth/login");
    // return redirect("/2fa");
  }
  return (
    <>
      <header>
        <Link href='/'>Home</Link>
        <Link href='/settings'>Settings</Link>
      </header>
      <main>
        <h1>Hi {user.username}!</h1>
        <LogoutButton />
      </main>
    </>
  );
}
