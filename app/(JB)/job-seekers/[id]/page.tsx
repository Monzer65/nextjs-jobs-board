import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { jobSeekers } from "@/lib/jobseekersPlaceholderData";
import Link from "next/link";
// import { fetchJob } from '@/lib/api' // Assume we have an API function to fetch job data

import type { Metadata, ResolvingMetadata } from "next";
import JobseekerProfilePageView from "@/components/JobSeekerProfilePageView";
import { getUser } from "@/lib/queries/getUser";
import BackButton from "@/components/BackButton";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  // fetch data
  // const job = await fetch(`https://.../${id}`).then((res) => res.json())
  const jobseeker = jobSeekers.find((j) => j.id === parseInt(id));

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: jobseeker?.personalDetails.name,
    description: jobseeker?.personalDetails.bio,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
  };
}

export default async function JobSeekerPage({ params }: Props) {
  try {
    const id = (await params).id;

    if (id) {
      const jobseeker = await getUser(parseInt(id));
      if (!jobseeker) {
        return (
          <div className='min-h-screen'>
            <h2 className='text-2xl font-bold m-4'>
              کارجو با آیدی {id} یافت نشد
            </h2>
            <BackButton title='بازگشت' className='mx-4 mb-2' />
          </div>
        );
      }
      return (
        <div className='min-h-screen flex flex-col'>
          <main className='flex-grow'>
            <div className='container mx-auto px-4 py-8'>
              <Link href='/' className='mb-6 flex items-center'>
                <ArrowRight className='ml-2 h-4 w-4' /> بازگشت
              </Link>
              <pre dir='ltr'>{JSON.stringify(jobseeker, null, 2)}</pre>
            </div>
          </main>
        </div>
      );
    } else {
      // link to login if the user is not admin or link the admin to create new job seeker
    }
  } catch (error) {}

  // Fetch job-seeker data
}

{
  /* <JobseekerProfilePageView jobseeker={jobseeker} /> */
}
