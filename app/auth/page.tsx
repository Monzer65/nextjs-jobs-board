import Link from "next/link";

export default function AuthPage() {
  return (
    <div className='container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>اینجا چیزی نیست</h1>
      <p className='text-gray-600 mb-4'>
        می‌توانید به صفحات ورود و ثبت‌نام بروید
      </p>
      <div className=' flex gap-x-4'>
        <Link href={"/auth/signup"} className='text-blue-500 hover:underline '>
          ثبت نام
        </Link>
        <Link href={"/auth/login"} className='text-blue-500 hover:underline '>
          ورود
        </Link>
      </div>
    </div>
  );
}
