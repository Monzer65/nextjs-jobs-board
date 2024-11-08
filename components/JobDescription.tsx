import Image from "next/image";
import { BookmarkPlus, Briefcase, Building, Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef } from "react";
import { Job } from "./landing/Landing";
import { Ratings } from "./Rating";

export function JobDescription({
  id,
  title,
  company,
  companyRating,
  bannerUrl,
  profileUrl,
  location,
  type,
  description,
  workHours,
  workMode,
  requiredSkills,
  fullDescription,
  responsibilities,
  qualifications,
}: Job) {
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]);

  return (
    <Card
      ref={descriptionRef}
      className='max-w-4xl max-h-screen mx-auto shadow-lg lg:sticky top-4 overflow-auto'
    >
      <CardHeader className='relative p-0 h-48'>
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt='Company banner'
            layout='fill'
            objectFit='cover'
            className='z-0'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-l from-primary to-secondary opacity-75' />
        )}
        <div className='absolute inset-0 bottom-2 bg-black/20 z-10' />
        <div className='absolute inset-4 flex items-end gap-4 z-20'>
          {profileUrl && (
            <Image
              src={profileUrl}
              alt='Company logo'
              width={80}
              height={80}
              className='absolute left-0 rounded-lg border-2 border-white shadow-lg'
            />
          )}
          <div>
            <h2 className='text-2xl font-bold text-white mb-1'>{title}</h2>
            <a
              href='#'
              className='text-blue-300 hover:underline font-semibold text-lg'
            >
              {company}
            </a>
            <div className=' flex items-center gap-1 text-xs w-max bg-white/90 text-primary rounded-full px-3 py-1 shadow'>
              {companyRating !== undefined && (
                <Ratings rating={companyRating} size={12} />
              )}
              {`${companyRating?.toFixed(1)}`}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-6 overflow-auto'>
        <div className='flex flex-wrap justify-between items-center mb-6 gap-y-2'>
          <div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600'>
            <div className='flex items-center gap-1'>
              <MapPin className='w-4 h-4 flex-shrink-0' />
              <span>{location}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Briefcase className='w-4 h-4 flex-shrink-0' />
              <span>{type}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='w-4 h-4 flex-shrink-0' />
              <span>{workHours}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Building className='w-4 h-4 flex-shrink-0' />
              <span>{workMode}</span>
            </div>
          </div>
        </div>
        <div className='mb-6'>
          <h4 className='font-semibold mb-2'>چکیده</h4>
          <p className='text-gray-700 mb-6'>{description}</p>
        </div>

        <div className='mb-6'>
          <h4 className='font-semibold mb-2'>مهارت‌های موردنیاز</h4>
          <div className='flex flex-wrap gap-2'>
            {requiredSkills &&
              requiredSkills.map((skill, index) => (
                <Badge key={index} variant='secondary'>
                  {skill}
                </Badge>
              ))}
          </div>
        </div>
        <Tabs dir='rtl' defaultValue='description' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 mb-4'>
            <TabsTrigger value='description'>توضیحات</TabsTrigger>
            <TabsTrigger value='responsibilities'>مسئولیت‌ها</TabsTrigger>
            <TabsTrigger value='qualifications'>شرایط احراز</TabsTrigger>
          </TabsList>
          <div className='border rounded-lg p-4 bg-gray-50'>
            <TabsContent value='description'>
              <ScrollArea className='h-64 px-4 overflow-y-auto'>
                <p className='text-gray-700'>{fullDescription}</p>{" "}
              </ScrollArea>
            </TabsContent>
            <TabsContent value='responsibilities'>
              <ScrollArea className='h-64 px-4'>
                <ul className='list-disc list-inside space-y-2 text-gray-700'>
                  {responsibilities &&
                    responsibilities.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                </ul>
              </ScrollArea>
            </TabsContent>
            <TabsContent value='qualifications'>
              <ScrollArea className='h-64 px-4'>
                <ul className='list-disc list-inside space-y-2 text-gray-700'>
                  {qualifications &&
                    qualifications.map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                </ul>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>

      <CardFooter className='flex justify-between items-center pt-4 flex-row-reverse sticky bottom-0 bg-white'>
        <Button className='px-8'>ارسال درخواست</Button>
        <Button variant='outline' size='icon' title='ذخیره'>
          <BookmarkPlus className='h-4 w-4' />
          <span className='sr-only'>ذخیره شغل</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
