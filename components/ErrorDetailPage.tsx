"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold text-red-600 mb-4'>Error</h1>
      <p className='text-gray-600 mb-4'>
        Failed to load job details. Please try again later.
      </p>
      <div className='space-x-4'>
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant='outline' asChild>
          <Link href='/jobs'>Return to Job Listings</Link>
        </Button>
      </div>
    </div>
  );
}
