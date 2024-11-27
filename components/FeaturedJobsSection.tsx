"use client";

import JobCard from "./JobCard";
import Link from "next/link";
import { useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import JobDescriptionSideView from "./JobDescriptionSideView";
import { JobDetails, Employer } from "@/lib/types";
import { employers } from "@/lib/employersPlaceholderData";

export default function FeaturedJobsSection() {
  const [selectedJob, setSelectedJob] = useState<{
    job: JobDetails;
    employer: Employer;
  } | null>(null);
  const isLargeScreen = useMediaQuery(1024);

  // Flatten job postings and include employer information
  const featuredJobs = employers.flatMap((employer) =>
    employer.jobPostings.map((posting) => ({
      job: posting.jobDetails,
      employer: employer,
    }))
  );

  return (
    <section className='py-8 md:py-16 lg:py-24'>
      <div className='max-w-[2600px] m-auto px-4 md:px-6'>
        <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8'>
          شغل‌ها و پروژه‌های برگزیده
        </h2>
        <div className='lg:flex lg:gap-8'>
          <div className='lg:w-2/5 grid md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8 lg:mb-0'>
            {featuredJobs.map(({ job, employer }) =>
              isLargeScreen ? (
                <JobCard
                  key={job.id}
                  job={job}
                  employer={employer.companyDetails}
                  onSelect={() => setSelectedJob({ job, employer })}
                  isSelected={selectedJob?.job.id === job.id}
                />
              ) : (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <JobCard
                    job={job}
                    employer={employer.companyDetails}
                    onSelect={() => {}}
                    isSelected={false}
                  />
                </Link>
              )
            )}
          </div>
          {isLargeScreen && (
            <div className='lg:w-3/5'>
              {selectedJob ? (
                <JobDescriptionSideView
                  job={selectedJob.job}
                  employer={selectedJob.employer.companyDetails}
                />
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
