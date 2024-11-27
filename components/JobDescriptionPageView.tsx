"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
  Users,
  Eye,
  AlertCircle,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { formatDate } from "@/lib/formateDate";
import { CompanyDetails, JobDetails } from "@/lib/types";

export default function JobDescriptionPageView({
  job,
  employer,
}: {
  job: JobDetails;
  employer: CompanyDetails;
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (job.applicationDeadline) {
      const expiry = new Date(job.applicationDeadline);
      const today = new Date();
      const diffInTime = expiry.getTime() - today.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffInDays >= 0 ? diffInDays : 0); // Set to 0 if already expired
    }
  }, [job.applicationDeadline]);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 2000);
  };

  const similarJobs = [
    {
      title: "Full Stack Engineer",
      company: "InnovateTech",
      location: "New York, NY",
    },
    {
      title: "Senior Backend Developer",
      company: "DataDrive Systems",
      location: "Austin, TX",
    },
    {
      title: "Frontend Specialist",
      company: "UX Wizards",
      location: "Seattle, WA",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <Card className='bg-white shadow-lg rounded-lg overflow-hidden'>
          {/* Warning for expired job */}
          {job.applicationDeadline &&
            new Date(job.applicationDeadline) < new Date() && (
              <div className='flex items-center gap-2 p-4 mb-4 bg-red-100 text-red-800 rounded-md'>
                <AlertCircle className='w-5 h-5' />
                <span>این آگهی منقضی شده است</span>
              </div>
            )}

          {/* Header */}
          {/* <div
            className='text-white p-6 sm:p-8'
            style={{
              backgroundImage: job.recruiter.bannerImageUrl
                ? `url(${job.recruiter.bannerImageUrl})`
                : "none",
              backgroundColor: job.recruiter.bannerImageUrl
                ? "transparent"
                : "#2563eb", // Hex code for bg-blue-600
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {job.recruiter.profilePictureUrl && (
              <Image
                src={job.recruiter.profilePictureUrl}
                alt={`${job.recruiter.company} logo`}
                width={80}
                height={80}
                className='rounded-full bg-white p-1'
              />
            )}
          </div> */}

          <div className='flex items-center justify-between p-6 sm:p-8'>
            <div>
              <h1 className='text-3xl font-bold'>{job.title}</h1>
              <div className='mt-2 flex items-center'>
                <Building2 className='h-5 w-5 ml-2' />
                {/* <span>{job.recruiter.company}</span> */}
                company name
              </div>
              <div className='mt-1 flex items-center'>
                <MapPin className='h-5 w-5 ml-2' />
                <span>{job.location?.city || "دورکاری"}</span>
              </div>
            </div>
          </div>
          {/* Job Details */}
          <div className='p-6 sm:p-8'>
            <div className='lg:flex lg:gap-8'>
              {/* Sidebar with key information */}
              <div className='lg:w-1/3 space-y-6'>
                <div className='flex flex-wrap gap-4 mb-6'>
                  <Badge variant='secondary' className='flex items-center'>
                    <DollarSign className='h-4 w-4 ml-1' />
                    {`${job.salaryRange?.min}-${job.salaryRange?.max} ${job.salaryRange?.currency}` ||
                      "قابل مذاکره"}
                  </Badge>

                  {job.jobType &&
                    job.jobType.map((type, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='flex items-center mr-2'
                      >
                        <Briefcase className='ml-1 h-4 w-4' />
                        {type}
                      </Badge>
                    ))}
                  <Badge variant='secondary' className='flex items-center'>
                    <Clock className='h-4 w-4 ml-1' />
                    {job.workHours || "تمام وقت"}
                  </Badge>
                </div>

                <Separator />

                {/* Job Details */}
                <div className='space-y-4'>
                  <div className='flex items-center gap-x-2'>
                    <Building2 className='w-5 h-5 text-muted-foreground' />
                    <span>{job.jobIndustry || "نامشخص"}</span>
                  </div>
                  <div className='flex items-center gap-x-2'>
                    <Briefcase className='w-5 h-5 text-muted-foreground' />
                    <span>
                      {(job.experience && job.experience[0].level) ||
                        "همه سطوح"}
                    </span>
                  </div>
                  {job.educationRequirements && (
                    <div className='flex items-center gap-x-2'>
                      <GraduationCap className='w-5 h-5 text-muted-foreground' />
                      <span>{job.educationRequirements.join(", ")}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className='space-y-2'>
                  {job.postedDate && (
                    <p className='text-sm text-muted-foreground'>
                      تاریخ انتشار:
                      <span>
                        {" "}
                        {formatDate(new Date(job.postedDate), "MMM d, yyyy")}
                      </span>
                    </p>
                  )}
                  {job.applicationDeadline && (
                    <p className='text-sm text-muted-foreground'>
                      تاریخ انقضاء:
                      <span>
                        {" "}
                        {formatDate(
                          new Date(job.applicationDeadline),
                          "MMM d, yyyy"
                        )}
                      </span>
                      {daysRemaining !== null && (
                        <span className='ml-2'>({daysRemaining} روز)</span>
                      )}
                    </p>
                  )}
                  {job.analytics?.usageData.pageViews !== undefined && (
                    <div className='flex items-center gap-x-2'>
                      <Eye className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm text-muted-foreground'>
                        {job.analytics?.usageData.pageViews} بازدید
                      </span>
                    </div>
                  )}
                  {job.analytics?.usageData.applicationRates !== undefined && (
                    <div className='flex items-center gap-x-2'>
                      <Users className='w-4 h-4 text-muted-foreground' />
                      <span className='text-sm text-muted-foreground'>
                        {job.analytics?.usageData.applicationRates} درخواست
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Main content */}
              <div className='lg:w-2/3 mt-8 lg:mt-0 space-y-6'>
                <div className='prose max-w-none mb-8'>
                  <h2 className='text-xl font-semibold mb-4'>توضیحات شغل</h2>
                  <p>
                    {job.description ||
                      job.shortDescription ||
                      "توضیحات موجود نیست"}
                  </p>
                </div>

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className='mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>مسئولیت‌ها</h2>
                    <ul className='list-disc pr-5 space-y-2'>
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.qualifications && job.qualifications.length > 0 && (
                  <div className='mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>شرایط لازم</h2>
                    <ul className='list-disc pr-5 space-y-2'>
                      {job.qualifications.map((qualification, index) => (
                        <li key={index}>{qualification}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className='mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>
                      مهارت‌های مورد نیاز
                    </h2>
                    <div className='flex flex-wrap gap-2'>
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant='secondary'>
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* {job.skills && job.skills.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {job.skills.map((skill, index) => (
              <>
                {skill.isRequired ? (
                  <>
                    <span>required:</span>
                    <Badge key={index} variant='outline'>
                      {skill.name}
                    </Badge>
                  </>
                ) : (
                  <>
                    <span>prefered:</span>
                    <Badge key={index} variant='outline'>
                      {skill.name}
                    </Badge>
                  </>
                )}
              </>
            ))}
          </div>
        )} */}

                {job.benefits && job.benefits && (
                  <div className='mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>مزایا</h2>
                    <ul className='list-disc pr-5 space-y-2'>
                      {job.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className='flex justify-between items-center'>
                  {job.externalApplicationUrl && (
                    <Button
                      size='lg'
                      onClick={handleApply}
                      disabled={isApplying}
                    >
                      {isApplying ? "در حال ارسال..." : "ارسال درخواست"}
                    </Button>
                  )}
                  {/* {job. && (
                    <Button variant='outline' size='lg' asChild>
                      <Link href={`mailto:${job.contactEmail}`}>
                        درباره استخدام کننده
                      </Link>
                    </Button>
                  )} */}
                  <Button variant='outline' size='icon'>
                    <Share2 className='h-4 w-4' />
                    <span className='sr-only'>Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Similar Jobs */}
        <div className='mt-8'>
          <h2 className='text-2xl font-bold mb-4'>شغل‌های مشابه</h2>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {similarJobs.map((job, index) => (
              <Card key={index}>
                <CardContent className='p-4'>
                  <h3 className='font-semibold'>{job.title}</h3>
                  <p className='text-sm text-gray-600'>{job.company}</p>
                  <div className='flex items-center mt-2 text-sm text-gray-500'>
                    <MapPin className='h-4 w-4 ml-1' />
                    {job.location}
                  </div>
                  <Button variant='link' className='mt-2 p-0'>
                    جزئیات <ChevronLeft className='h-4 w-4 ml-1' />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
