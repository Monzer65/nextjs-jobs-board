import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Users,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { JobSeeker } from "@/lib/types";

export default function JobSeekerProfileSideView({
  jobseeker,
}: {
  jobseeker: JobSeeker;
}) {
  const profileRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (profileRef.current) {
      profileRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActiveTab("about");
  }, [jobseeker.id]);

  return (
    <Card className='max-h-screen mx-auto shadow-lg lg:sticky top-4 overflow-hidden flex flex-col'>
      <div className='sticky top-0 z-10 bg-white'>
        <div className='relative h-40'>
          {/* {jobseeker.bannerImageUrl ? (
            <Image
              src={jobseeker.bannerImageUrl}
              alt={`${jobseeker.personalDetails.name}'s background`}
              layout='fill'
              objectFit='cover'
            />
          ) : (
            <div className='h-40 bg-gray-200' />
          )} */}
        </div>
        <CardHeader className='relative pt-0'>
          <div className='absolute -top-8 left-4 border-4 border-background rounded-full'>
            {/* <Avatar className='h-16 w-16'>
              {jobseeker.profilePictureUrl ? (
                <AvatarImage
                  src={jobseeker.profilePictureUrl}
                  alt={jobseeker.personalDetails.name}
                />
              ) : (
                <AvatarFallback>
                  {jobseeker.personalDetails.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar> */}
          </div>
          <div className='mt-8'>
            <CardTitle className='text-2xl'>
              {jobseeker.personalDetails.name}
            </CardTitle>
            <CardDescription className='flex items-center mt-1'>
              {/* <span className='font-medium'>{jobseeker.profession}</span> */}
              Profession goes here
            </CardDescription>
          </div>
        </CardHeader>
      </div>

      <ScrollArea className='flex-grow overflow-auto' ref={profileRef}>
        <CardContent className='space-y-6 pt-6'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            {jobseeker.personalDetails.location.city && (
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 text-gray-500' />
                <span>{jobseeker.personalDetails.location.city}</span>
              </div>
            )}
            {jobseeker.professionalDetails.experience.length > 0 && (
              <div className='flex items-center gap-2'>
                <Briefcase className='w-4 h-4 text-gray-500' />
                {jobseeker.professionalDetails.experience.map((e, i) => (
                  <p className='text-muted-foreground' key={i}>
                    {e.jobTitle} at:
                    {e.company}
                  </p>
                ))}
              </div>
            )}

            {jobseeker.professionalDetails.education.length > 0 && (
              <div className='flex items-center gap-2'>
                <GraduationCap className='w-4 h-4 text-gray-500' />
                {jobseeker.professionalDetails.education.map((e, i) => (
                  <p className='text-muted-foreground' key={i}>
                    {e.degree} at:
                    {e.fieldOfStudy}
                  </p>
                ))}
              </div>
            )}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3 mb-4'>
              <TabsTrigger value='about'>About</TabsTrigger>
              <TabsTrigger value='experience'>Experience</TabsTrigger>
              <TabsTrigger value='education'>Education</TabsTrigger>
            </TabsList>
            <div className='border rounded-lg p-4 bg-gray-50'>
              <TabsContent value='about'>
                <ScrollArea className='h-64 pr-4'>
                  <p className='text-gray-700'>
                    {jobseeker.personalDetails.bio}
                  </p>
                </ScrollArea>
              </TabsContent>
              <TabsContent value='experience'>
                <ScrollArea className='h-64 pr-4'>
                  <ul className='list-disc list-inside space-y-2 text-gray-700'>
                    {jobseeker.professionalDetails.experience.map(
                      (exp, index) => (
                        <li key={index}>
                          {exp.jobTitle} at {exp.company} ({exp.endDate} -{" "}
                          {exp.endDate || "Present"})
                        </li>
                      )
                    )}
                  </ul>
                </ScrollArea>
              </TabsContent>
              <TabsContent value='education'>
                <ScrollArea className='h-64 pr-4'>
                  <ul className='list-disc list-inside space-y-2 text-gray-700'>
                    {jobseeker.professionalDetails.education.map(
                      (edu, index) => (
                        <li key={index}>
                          {edu.degree} in {edu.fieldOfStudy} from{" "}
                          {edu.institution} ({edu.startDate.getDate()} -{" "}
                          {edu.endDate?.getDate()})
                        </li>
                      )
                    )}
                  </ul>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>

          <div className='flex flex-wrap gap-2 mb-4'>
            {jobseeker.professionalDetails.skills.map((skill, index) => (
              <Badge key={index} variant='secondary'>
                {skill}
              </Badge>
            ))}
          </div>

          <div className='flex items-center justify-between text-sm text-gray-500'>
            {jobseeker.analytics?.usageData.pageViews !== undefined && (
              <div className='flex items-center gap-1'>
                <Eye className='w-4 h-4' />
                <span>{jobseeker.analytics?.usageData.pageViews} views</span>
              </div>
            )}
            {jobseeker.connections.length !== undefined && (
              <div className='flex items-center gap-1'>
                <Users className='w-4 h-4' />
                <span>{jobseeker.connections.length} connections</span>
              </div>
            )}
            {jobseeker.joinDate && (
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                <span>
                  Joined {new Date(jobseeker.joinDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
