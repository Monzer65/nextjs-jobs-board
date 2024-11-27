export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='font-[family-name:var(--font-vazirmatn-regular)]'>
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8'>
          {children}
        </div>
      </div>
    </div>
  );
}
