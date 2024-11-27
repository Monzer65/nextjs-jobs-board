import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  BookmarkPlus,
  Briefcase,
  Building,
  Clock,
  MapPin,
  Star,
  Users,
  Eye,
  Calendar,
  DollarSign,
  Mail,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/formateDate";
import { CompanyDetails, JobDetails } from "@/lib/types";

export default function JobDescriptionSideView({
  job,
  employer,
}: {
  job: JobDetails;
  employer: CompanyDetails;
}) {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActiveTab("description");
  }, [job.id]);

  return (
    <Card className='max-h-screen mx-auto shadow-lg lg:sticky top-4 overflow-hidden flex flex-col'>
      <div className='sticky top-0 z-10 bg-white'>
        {/* <div className='relative h-40'>
          {job?.recruiter?.bannerImageUrl ? (
            <Image
              src={job?.recruiter?.bannerImageUrl}
              alt={`${job?.recruiter?.company} banner`}
              layout='fill'
              objectFit='cover'
            />
          ) : (
            <div className='h-40 bg-gray-200' />
          )}
        </div> */}
        <CardHeader className='relative pt-0'>
          {/* <div className='absolute -top-8 left-4 border-4 border-background rounded-full'>
            <Avatar className='h-16 w-16'>
              {job?.recruiter?.profilePictureUrl ? (
                <AvatarImage
                  src={job?.recruiter?.profilePictureUrl}
                  alt={job?.recruiter?.company}
                />
              ) : (
                <AvatarFallback>
                  {job?.recruiter?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div> */}
          <div className='mt-8'>
            <CardTitle className='text-2xl'>{job?.title}</CardTitle>
            <CardDescription className='flex items-center mt-1'>
              <span className='font-medium'>{employer?.name}</span>
              {job?.analytics?.usageData.applicationRates && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className='flex items-center mr-2'>
                        <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                        <span className='text-sm mr-1'>
                          {job?.analytics?.usageData.applicationRates.toFixed(
                            1
                          )}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>رتبه شرکت</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <div className='px-6 py-2 border-t border-b flex justify-between items-center bg-white'>
          <div className='flex gap-2'>
            {employer.email && (
              <Button variant='outline' size='sm'>
                <Mail className='w-4 h-4 mr-2' />
                تماس
              </Button>
            )}
            <Button variant='outline' size='sm' title='Save'>
              <BookmarkPlus className='w-4 h-4 mr-2' />
              ذخیره
            </Button>
          </div>
          <Button className='px-8' asChild>
            <a
              href={job.externalApplicationUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              ارسال درخواست
            </a>
          </Button>
        </div>
      </div>

      <ScrollArea className='flex-grow overflow-auto' ref={descriptionRef}>
        <CardContent className='space-y-6 pt-6'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            {job.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 text-gray-500' />
                <span>{job.location.city}</span>
              </div>
            )}
            {job.jobType &&
              job.jobType.length > 0 &&
              job.jobType.map((type, index) => (
                <div className='flex items-center gap-2'>
                  <Briefcase className='w-4 h-4 text-gray-500' />
                  <span>{type}</span>
                </div>
              ))}
            {job.workHours && (
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4 text-gray-500' />
                <span>{job.workHours}</span>
              </div>
            )}
            {job.workMode && (
              <div className='flex items-center gap-2'>
                <Building className='w-4 h-4 text-gray-500' />
                <span>{job.workMode}</span>
              </div>
            )}
            {job.experience[0].level && (
              <div className='flex items-center gap-2'>
                <Users className='w-4 h-4 text-gray-500' />
                <span>{job.experience[0].level}</span>
              </div>
            )}
            {job.jobIndustry && (
              <div className='flex items-center gap-2'>
                <Building className='w-4 h-4 text-gray-500' />
                <span>{job.jobIndustry}</span>
              </div>
            )}
            {job.salaryRange && (
              <div className='flex items-center gap-2'>
                <DollarSign className='w-4 h-4 text-gray-500' />
                <span>
                  {job.salaryRange.min}-{job.salaryRange.max} تومان
                </span>
              </div>
            )}
            {job.postedDate && (
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4 text-gray-500' />
                <span>
                  ارسال شده در{" "}
                  {formatDate(new Date(job.postedDate), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>

          {job.skills && job.skills.length > 0 && (
            <div>
              <h4 className='font-semibold mb-2'>مهارت‌های لازم</h4>
              <div className='flex flex-wrap gap-2'>
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant='secondary'>
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
            dir='rtl'
          >
            <TabsList className='grid w-full grid-cols-3 mb-4'>
              <TabsTrigger value='description'>توضیحات</TabsTrigger>
              <TabsTrigger value='responsibilities'>وظایف</TabsTrigger>
              <TabsTrigger value='qualifications'>شرایط مورد نیاز</TabsTrigger>
            </TabsList>
            <div className='border rounded-lg p-4 bg-gray-50'>
              <TabsContent value='description'>
                <ScrollArea className='h-64 pr-4'>
                  <p className='text-gray-700'>
                    {job?.description || job?.shortDescription}
                  </p>
                </ScrollArea>
              </TabsContent>
              <TabsContent value='responsibilities'>
                <ScrollArea className='h-64 pr-4'>
                  <ul className='list-disc list-inside space-y-2 text-gray-700'>
                    {job?.responsibilities?.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
              <TabsContent value='qualifications'>
                <ScrollArea className='h-64 pr-4'>
                  <ul className='list-disc list-inside space-y-2 text-gray-700'>
                    {job.qualifications?.map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h4 className='font-semibold mb-2'>مزایا</h4>
              <ul className='list-disc list-inside space-y-1 text-gray-700'>
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {job.educationRequirements &&
            job.educationRequirements.length > 0 && (
              <div>
                <h4 className='font-semibold mb-2'>الزامات تحصیلی</h4>
                <ul className='list-disc list-inside space-y-1 text-gray-700'>
                  {job.educationRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

          <div className='flex items-center justify-between text-sm text-gray-500'>
            {job?.analytics?.usageData.jobPostViews !== undefined && (
              <div className='flex items-center gap-1'>
                <Eye className='w-4 h-4' />
                <span>{job?.analytics?.usageData.jobPostViews} بازدید</span>
              </div>
            )}
            {job?.analytics?.usageData.applicationRates !== undefined && (
              <div className='flex items-center gap-1'>
                <Users className='w-4 h-4' />
                <span>{job?.analytics?.usageData.applicationRates} متقاضی</span>
              </div>
            )}
            {job.applicationDeadline && (
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                <span>
                  انقضاء{" "}
                  {formatDate(new Date(job.applicationDeadline), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
