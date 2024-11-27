import Footer from "@/components/Footer";
import Header from "@/components/Header";
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

export default function JBLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='font-[family-name:var(--font-vazirmatn-regular)]'>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
