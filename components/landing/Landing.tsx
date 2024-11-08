"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Briefcase, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { JobDescription } from "../JobDescription";
import useMediaQuery from "@/hooks/useMediaQuery";
import JobCard from "../JobCard";
import LocationSelector from "../LocationSelector";
import SearchForm from "../SearchForm";

export const jobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechCorp",
    bannerUrl: "/banner-placeholder.jfif",
    profileUrl: "/profile-placeholder.jfif",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "Join our team to build innovative web applications using the latest technologies. We're looking for a Software Engineer with experience in JavaScript, React, and Node.js.",
    companyRating: 4.2,
    workHours: "9:00 AM - 5:00 PM, Mon-Fri",
    workMode: "On-site with remote options",
    requiredSkills: ["JavaScript", "React", "Node.js"],
    fullDescription:
      "As a Software Engineer at TechCorp, you'll design and develop web applications, work closely with other developers, and bring projects to completion using agile methodologies.",
    responsibilities: [
      "Develop and maintain web applications",
      "Collaborate with cross-functional teams",
      "Participate in code reviews",
      "Identify and fix bugs",
    ],
    qualifications: [
      "3+ years experience in JavaScript and React",
      "Familiarity with Node.js",
      "Strong problem-solving skills",
    ],
  },
  {
    id: 2,
    title: "توسعه‌دهنده نرم‌افزار",
    company: "شرکت فناوری نوآور",
    bannerUrl: "",
    profileUrl: "",
    location: "مشهد، ایران",
    type: "تمام‌وقت",
    description:
      "به دنبال یک توسعه‌دهنده نرم‌افزار با تجربه برای ایجاد و پیاده‌سازی سیستم‌های کارآمد و پایدار هستیم.",
    companyRating: 4.6,
    workHours: "8:30 صبح تا 4:30 عصر، شنبه تا چهارشنبه",
    workMode: "حضوری",
    requiredSkills: ["جاوا", "پایتون", "MongoDB"],
    fullDescription:
      "در این نقش، شما مسئول طراحی و پیاده‌سازی سیستم‌های نرم‌افزاری خواهید بود که توسط تیم توسعه و نگهداری می‌شوند. دانش عمیق در جاوا و پایتون مورد نیاز است.",
    responsibilities: [
      "توسعه و بهینه‌سازی سیستم‌ها",
      "طراحی پایگاه داده",
      "بررسی و حل مشکلات کد",
    ],
    qualifications: [
      "تجربه در جاوا و پایتون",
      "تسلط به پایگاه داده MongoDB",
      "مهارت‌های عالی در حل مسائل",
    ],
  },
  {
    id: 3,
    title: "مدیر پروژه",
    company: "گروه ساختمانی ایران سازه",
    bannerUrl: "",
    profileUrl: "",
    location: "تهران، ایران",
    type: "پروژه‌ای",
    description:
      "نیازمند یک مدیر پروژه با تجربه برای مدیریت پروژه‌های ساختمانی و تضمین کیفیت و زمان‌بندی مناسب هستیم.",
    companyRating: 4.4,
    workHours: "شناور",
    workMode: "حضوری",
    requiredSkills: [
      "مدیریت پروژه",
      "مهارت‌های ارتباطی",
      "آشنایی با نرم‌افزارهای مدیریت",
    ],
    fullDescription:
      "به عنوان مدیر پروژه، شما بر روند اجرایی پروژه‌های ساختمانی نظارت خواهید داشت، تیم‌ها را هماهنگ کرده و اطمینان از زمان‌بندی و کیفیت خواهید داشت.",
    responsibilities: [
      "برنامه‌ریزی و نظارت بر پروژه‌ها",
      "مدیریت منابع انسانی",
      "گزارش‌دهی منظم به مدیریت",
    ],
    qualifications: [
      "5 سال تجربه در مدیریت پروژه",
      "آشنایی با نرم‌افزارهای Primavera و MS Project",
      "مهارت‌های عالی در مدیریت و هدایت تیم‌ها",
    ],
  },
  {
    id: 4,
    title: "کارشناس پشتیبانی فنی",
    company: "شرکت پردازش نوین",
    bannerUrl: "",
    profileUrl: "",
    location: "اصفهان، ایران",
    type: "پاره‌وقت",
    description:
      "نیازمند کارشناس پشتیبانی فنی برای ارائه راهکارهای سریع و موثر به مشتریان هستیم.",
    companyRating: 4.1,
    workHours: "نیمه‌وقت، شنبه تا چهارشنبه",
    workMode: "حضوری",
    requiredSkills: [
      "پشتیبانی فنی",
      "مهارت‌های ارتباطی",
      "آشنایی با سیستم‌عامل‌ها",
    ],
    fullDescription:
      "در این نقش، مسئول پاسخ‌دهی به سوالات فنی مشتریان و ارائه پشتیبانی کامل در تمامی محصولات شرکت خواهید بود.",
    responsibilities: [
      "پاسخ‌گویی به درخواست‌های پشتیبانی",
      "تجزیه و تحلیل مشکلات",
      "ارائه راهکارهای سریع و موثر",
    ],
    qualifications: [
      "1 سال تجربه در پشتیبانی فنی",
      "تسلط به سیستم‌عامل‌های ویندوز و لینوکس",
      "مهارت‌های عالی در برقراری ارتباط",
    ],
  },
  {
    id: 5,
    title: "تحلیلگر داده",
    company: "شرکت تجزیه‌وتحلیل اطلاعات",
    bannerUrl: "",
    profileUrl: "",
    location: "شیراز، ایران",
    type: "تمام‌وقت",
    description:
      "استخدام تحلیلگر داده با توانایی تحلیل و تفسیر داده‌های بزرگ به منظور تصمیم‌گیری‌های کلان.",
    companyRating: 4.3,
    workHours: "9:00 صبح تا 5:00 عصر، شنبه تا چهارشنبه",
    workMode: "دورکاری",
    requiredSkills: ["تحلیل داده", "Python", "SQL"],
    fullDescription:
      "به عنوان تحلیلگر داده، وظیفه تجزیه و تحلیل داده‌ها و ارائه گزارشات جامع جهت پشتیبانی از تصمیم‌گیری‌های مدیریتی را بر عهده دارید.",
    responsibilities: [
      "تحلیل داده‌ها و شناسایی الگوها",
      "تهیه گزارش‌های منظم",
      "پشتیبانی از تصمیمات مدیریتی",
    ],
    qualifications: [
      "تسلط به SQL و Python",
      "آشنایی با ابزارهای تحلیل داده مانند Power BI",
      "مهارت‌های قوی در تحلیل و تفسیر داده",
    ],
  },
  {
    id: 6,
    title: "کارشناس بازاریابی دیجیتال",
    company: "شرکت تبلیغات نوین",
    bannerUrl: "",
    profileUrl: "",
    location: "تبریز، ایران",
    type: "تمام‌وقت",
    description:
      "به دنبال کارشناس بازاریابی دیجیتال با تجربه و خلاقیت بالا برای توسعه استراتژی‌های بازاریابی دیجیتال هستیم.",
    companyRating: 4.2,
    workHours: "9:00 صبح تا 5:00 عصر، شنبه تا چهارشنبه",
    workMode: "حضوری و دورکاری ترکیبی",
    requiredSkills: ["SEO", "SEM", "مدیریت سوشال مدیا"],
    fullDescription:
      "در این نقش، شما استراتژی‌های بازاریابی دیجیتال را توسعه داده و به پیاده‌سازی کمپین‌های بازاریابی آنلاین کمک می‌کنید.",
    responsibilities: [
      "ایجاد و اجرای کمپین‌های تبلیغاتی",
      "مدیریت رسانه‌های اجتماعی",
      "تحلیل و بهینه‌سازی وب‌سایت",
    ],
    qualifications: [
      "2 سال تجربه در بازاریابی دیجیتال",
      "آشنایی با ابزارهای تحلیلی وب",
      "مهارت‌های قوی در ارتباطات",
    ],
  },
];

export interface Job {
  id: number;
  title: string;
  company: string;
  companyRating?: number;
  bannerUrl?: string;
  profileUrl?: string;
  location: string;
  type: string;
  description: string;
  workHours?: string;
  workMode?: string;
  requiredSkills?: string[];
  fullDescription?: string;
  responsibilities?: string[];
  qualifications?: string[];
}

export default function Landing() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const isLargeScreen = useMediaQuery(1024);

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='px-4 lg:px-6 h-14 flex items-center'>
        <Link className='flex items-center justify-center' href='#'>
          <Briefcase className='h-6 w-6' />
          <span className='mr-2 text-lg font-bold'>جابزی</span>
        </Link>
        <nav className='mr-auto flex gap-4 sm:gap-6'>
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            شغل‌ها و پروژه‌ها
          </Link>
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            ارسال شغل یا پروژه
          </Link>
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            درباره‌ ما
          </Link>
        </nav>
      </header>
      <main className='flex-1'>
        <section className='w-full py-16 md:py-32 bg-muted'>
          <div className='container px-6 md:px-8 m-auto'>
            <div className='grid items-center space-y-6 text-center'>
              <div className='space-y-4'>
                <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
                  یک کلیک فاصله تا یافتن موقعیت شغلی
                </h1>
                <p className='mx-auto max-w-[800px] text-muted-foreground md:text-2xl lg:text-3xl'>
                  هزاران لیست شغلی از شرکت های برتر و یا پروژه‌های فریلنسری را
                  جستجو کنید
                </p>
              </div>
              <SearchForm />
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8'>
              شغل‌ها و پروژه‌های برگزیده
            </h2>
            <div className='lg:flex lg:gap-8'>
              <div className='lg:w-1/2 grid gap-6 md:grid-cols-2 lg:grid-cols-1 mb-8 lg:mb-0'>
                {jobs.map((job) =>
                  isLargeScreen ? (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSelect={setSelectedJob}
                      isSelected={selectedJob?.id === job.id}
                    />
                  ) : (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <JobCard
                        job={job}
                        onSelect={() => {}}
                        isSelected={false}
                      />
                    </Link>
                  )
                )}
              </div>
              {isLargeScreen && (
                <div className='lg:w-1/2'>
                  {selectedJob ? (
                    <JobDescription {...selectedJob} />
                  ) : (
                    <div className='sticky top-4 flex items-center justify-center text-gray-500'>
                      از سمت راست یک شغل را انتخاب کنید
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
        <p className='text-xs text-muted-foreground'>
          © شرکت جابزی 2024. تمام حقوق محفوظ است
        </p>
        <nav className='sm:mr-auto flex gap-4 sm:gap-6'>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            شرایط استفاده از خدمات
          </Link>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            حریم خصوصی
          </Link>
        </nav>
      </footer>
    </div>
  );
}
