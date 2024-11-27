"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobSeekerSearchSection from "./JobSeekerSearchSection";
import FeaturedJobsSection from "./FeaturedJobsSection";
import FeaturedJobSeekersSection from "./FeaturedJobSeekersSection";
import { cn } from "@/lib/utils";
import EmployerSearchSection from "./EmployerSearchSection";

const TABS = {
  JOB_SEEKER: "job-seeker",
  RECRUITER: "recruiter",
};

export default function SearchTypeTabs() {
  const [activeTab, setActiveTab] = useState(TABS.JOB_SEEKER);

  return (
    <div className='my-8'>
      <Tabs
        defaultValue={TABS.JOB_SEEKER}
        onValueChange={setActiveTab}
        className='w-full'
      >
        <TabsList className='grid h-14 w-full max-w-4xl grid-cols-2 rounded-xl bg-slate-800 p-1 shadow-lg mx-auto my-8'>
          {Object.entries(TABS).map(([label, value]) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "relative rounded-lg text-lg font-semibold transition-all flex items-center justify-center h-full w-full",
                activeTab === value
                  ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white"
                  : "hover:bg-slate-700 text-slate-400"
              )}
            >
              <span
                className={cn(
                  "transition-all duration-150",
                  activeTab === value ? "text-white" : "text-slate-300"
                )}
              >
                {label === "JOB_SEEKER"
                  ? "برای جویندگان کار"
                  : " برای کارفرمایان"}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className='mt-6'>
        {activeTab === TABS.JOB_SEEKER ? (
          <>
            <JobSeekerSearchSection />
            <FeaturedJobsSection />
          </>
        ) : (
          <>
            <EmployerSearchSection />
            <FeaturedJobSeekersSection />
          </>
        )}
      </div>
    </div>
  );
}
