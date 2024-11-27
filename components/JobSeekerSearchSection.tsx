"use client";

import JobSeekerSearchForm from "./JobSeekerSearchForm";

export default function JobSeekerSearchSection() {
  return (
    <section className='py-16 md:py-32 bg-muted'>
      <div className='container px-6 md:px-8 m-auto'>
        <div className='grid items-center space-y-6 text-center'>
          <div className='space-y-4'>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
              یک کلیک فاصله تا یافتن موقعیت شغلی
            </h1>
            <p className='mx-auto max-w-[800px] text-muted-foreground md:text-2xl lg:text-3xl'>
              هزاران لیست شغلی از شرکت های برتر و یا پروژه‌های فریلنسری را جستجو
              کنید
            </p>
          </div>
          <JobSeekerSearchForm />
        </div>
      </div>
    </section>
  );
}
