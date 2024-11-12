"use client";
import JobCard from "./JobCard";
import Link from "next/link";
import { jobs } from "@/lib/dataPlaceholder";
import { Job } from "@/lib/types";
import { useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import JobDescriptionSideView from "./JobDescriptionSideView";

export default function FeaturedJobsSection() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const isLargeScreen = useMediaQuery(1024);
  return (
    <section className='py-8 md:py-16 lg:py-24'>
      <div className='max-w-[2600px] m-auto px-4 md:px-6'>
        <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8'>
          شغل‌ها و پروژه‌های برگزیده
        </h2>
        <div className='lg:flex lg:gap-8'>
          <div className='lg:w-2/5 grid md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8 lg:mb-0'>
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
                  <JobCard job={job} onSelect={() => {}} isSelected={false} />
                </Link>
              )
            )}
          </div>
          {isLargeScreen && (
            <div className='lg:w-3/5'>
              {selectedJob ? (
                <JobDescriptionSideView job={selectedJob} />
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
  );
}
