// Footer.tsx
import Link from "next/link";

const Footer = () => (
  <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
    <p className='text-xs text-muted-foreground'>
      © شرکت جابزی 2024. تمام حقوق محفوظ است
    </p>
    <nav className='sm:mr-auto flex gap-4 sm:gap-6'>
      <Link className='text-xs hover:underline underline-offset-4' href='#'>
        شرایط استفاده از خدمات
      </Link>
      <Link className='text-xs hover:underline underline-offset-4' href='#'>
        حریم خصوصی
      </Link>
    </nav>
  </footer>
);

export default Footer;
