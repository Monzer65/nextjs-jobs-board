"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Bookmark,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Session } from "@/lib/server/session";
import { LogoutButton } from "./LogoutButton";
import Image from "next/image";

export default function Header({ session, user }: { session: any; user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  console.log("user:", user);
  return (
    <Card className='rounded-none shadow-sm'>
      <header className='px-4 md:px-6 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-x-4'>
          <Link className='flex items-center justify-center gap-x-2' href='#'>
            <Briefcase className='h-6 w-6 text-primary' />
            <span className='text-xl font-bold text-primary'>جابزی</span>
          </Link>

          <nav className='hidden md:flex items-center gap-x-4'>
            <Link
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
              href='#'
            >
              شغل‌ها و پروژه‌ها
            </Link>
            <Link
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
              href='#'
            >
              ارسال شغل یا پروژه
            </Link>
            <Link
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
              href='#'
            >
              رزومه ساز
            </Link>
            <Link
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
              href='#'
            >
              بلاگ آموزشی
            </Link>
            <Link
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
              href='#'
            >
              درباره‌ ما
            </Link>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-7 w-7' />
                <span className='sr-only'>Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-[300px] sm:w-[400px] font-[family-name:var(--font-vazirmatn-regular)]'
            >
              <SheetHeader className='absolute top-2 left-4'>
                <SheetTitle>
                  <Link
                    className='flex items-center justify-center gap-x-2'
                    href='#'
                  >
                    <Briefcase className='h-6 w-6 text-primary' />
                    <span className='text-xl font-bold text-primary'>
                      جابزی
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-y-4 mt-4 py-4 h-full overflow-y-auto'>
                <Link
                  className='text-lg font-medium text-muted-foreground hover:text-primary transition-colors'
                  href='#'
                  onClick={() => setIsOpen(false)}
                >
                  شغل‌ها و پروژه‌ها
                </Link>
                <Link
                  className='text-lg font-medium text-muted-foreground hover:text-primary transition-colors'
                  href='#'
                  onClick={() => setIsOpen(false)}
                >
                  ارسال شغل یا پروژه
                </Link>
                <Link
                  className='text-lg font-medium text-muted-foreground hover:text-primary transition-colors'
                  href='#'
                  onClick={() => setIsOpen(false)}
                >
                  رزومه ساز
                </Link>

                <Link
                  className='text-lg font-medium text-muted-foreground hover:text-primary transition-colors'
                  href='#'
                  onClick={() => setIsOpen(false)}
                >
                  بلاگ آموزشی
                </Link>
                <Link
                  className='text-lg font-medium text-muted-foreground hover:text-primary transition-colors'
                  href='#'
                  onClick={() => setIsOpen(false)}
                >
                  درباره‌ ما
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className='flex items-center gap-x-4'>
          <Button variant='ghost' size='icon' className='relative'>
            <Bell className='h-5 w-5' />
            <Badge
              variant='destructive'
              className='absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px]'
            >
              3
            </Badge>
          </Button>
          {!session ? (
            <div>
              <Link href='/auth/login'>
                <Button variant='outline'>ورود</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-8 w-8 rounded-full'
                >
                  <Avatar className='h-8 w-8'>
                    {user.picture ? (
                      <AvatarImage src={user.picture} alt='@username' />
                    ) : (
                      <AvatarFallback>{user ? user.name : "NA"}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-56 font-[family-name:var(--font-vazirmatn-regular)]'
                align='start'
                forceMount
              >
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        نام کاربری
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {user ? user.name || user.username : "NA"}
                      </p>
                    </div>
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt='avatar'
                        width={70}
                        height={70}
                        className='rounded-md'
                      />
                    ) : (
                      <div className='w-5 h-5 border rounded-full'></div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className='mr-2 h-4 w-4' />
                  شغل‌های ذخیره‌شده
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ClipboardList className='mr-2 h-4 w-4' />
                  شغل‌های درخواست‌شده
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  تنظیمات
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogoutButton />
                  <LogOut className='mr-2 h-4 w-4' />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    </Card>
  );
}
