"use client";
import Link from "next/link";
import { jobSeekers } from "@/lib/jobseekersPlaceholderData";
import { useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import JobseekerCard from "./JobSeekerCard";
import JobSeekerProfileSideView from "./JobSeekerProfileSideView";
import { JobSeeker } from "@/lib/types";

export default function FeaturedJobSeekersSection() {
  const [selectedJobSeeker, setSelectedJobSeeker] = useState<JobSeeker | null>(
    null
  );
  const isLargeScreen = useMediaQuery(1024);
  return (
    <section className='py-8 md:py-16 lg:py-24'>
      <div className='max-w-[2600px] m-auto px-4 md:px-6'>
        <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8'>
          کارجوهای برگزیده
        </h2>
        <div className='lg:flex lg:gap-8'>
          <div className='lg:w-2/5 grid md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8 lg:mb-0'>
            {jobSeekers.map((jobseeker) =>
              isLargeScreen ? (
                <JobseekerCard
                  key={jobseeker.id}
                  jobseeker={jobseeker}
                  onSelect={setSelectedJobSeeker}
                  isSelected={selectedJobSeeker?.id === jobseeker.id}
                />
              ) : (
                <Link key={jobseeker.id} href={`/job-seekers/${jobseeker.id}`}>
                  <JobseekerCard
                    jobseeker={jobseeker}
                    onSelect={() => {}}
                    isSelected={false}
                  />
                </Link>
              )
            )}
          </div>
          {isLargeScreen && (
            <div className='lg:w-3/5'>
              {selectedJobSeeker ? (
                <JobSeekerProfileSideView jobseeker={selectedJobSeeker} />
              ) : (
                <div className='sticky top-4 flex items-center justify-center text-gray-500'>
                  از سمت راست یک کارجو را انتخاب کنید
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
