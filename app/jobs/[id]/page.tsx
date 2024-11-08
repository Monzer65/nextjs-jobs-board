"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { JobDescription } from "@/components/JobDescription";
import { jobs } from "@/components/landing/Landing";

export default function JobPage() {
  const params = useParams();
  const router = useRouter();
  const job = jobs.find((j) => j.id === parseInt(params.id as string));

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className='container px-4 py-8'>
      <Button variant='outline' onClick={() => router.back()} className='mb-4'>
        Back to Jobs
      </Button>
      <JobDescription {...job} />
    </div>
  );
}
