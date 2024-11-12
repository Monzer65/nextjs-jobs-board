import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import JobDescriptionPageView from "@/components/JobDescriptionPageView";
import Footer from "@/components/Footer";
import { jobs } from "@/lib/dataPlaceholder";
import Link from "next/link";
// import { fetchJob } from '@/lib/api' // Assume we have an API function to fetch job data

import type { Metadata, ResolvingMetadata } from "next";

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
  const job = jobs.find((j) => j.id === parseInt(id));

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: job?.title,
    description: job?.description,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
  };
}

export default async function JobPage({ params }: Props) {
  const id = (await params).id;
  // Fetch job data
  // const job = await fetchJob(params.id)
  const job = jobs.find((j) => j.id === parseInt(id));

  if (!job) {
    notFound();
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-grow'>
        <div className='container mx-auto px-4 py-8'>
          <Link href='/' className='mb-6 flex items-center'>
            <ArrowRight className='ml-2 h-4 w-4' /> بازگشت
          </Link>
          <JobDescriptionPageView job={job} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
