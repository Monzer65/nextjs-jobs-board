import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Regular.woff2",
  variable: "--font-vazirmatn-regular",
  weight: "400, 700",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='fa' dir='rtl'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
