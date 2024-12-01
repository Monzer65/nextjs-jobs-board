import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getCurrentSession } from "@/lib/server/session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Jobsy",
    default: "Jobsy",
  },
  description: "Jobsy - Jobs Made Easy",
  applicationName: "Jobsy",
  keywords: [
    "jobsy",
    "کاریابی",
    "پیدا",
    "پیدا کردن",
    "شغل",
    "پیدا کردن شغل",
    "پیدا کردن کار",
    "کار",
    "فریلنسر",
    "فریلنسری",
    "پروژه",
    "پروژه فریلنسری",
    "پروژه های فریلنسری",
  ],
};

export default async function JBLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getCurrentSession();

  return (
    <div className='font-[family-name:var(--font-vazirmatn-regular)]'>
      <Header session={session} user={user} />
      {children}
      <Footer />
    </div>
  );
}
