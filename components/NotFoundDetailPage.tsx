import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className='container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>چیزی یافت نشد</h1>
      <p className='text-gray-600 mb-4'>
        The requested job could not be found.
      </p>
      <Button variant='outline' asChild>
        <Link href='/jobs'>Return to Job Listings</Link>
      </Button>
    </div>
  );
}
