import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { JobSeeker } from "@/lib/types";

interface JobseekerCardProps {
  jobseeker: JobSeeker;
  onSelect: (jobseeker: JobSeeker) => void;
  isSelected: boolean;
}

const JobseekerCard: FC<JobseekerCardProps> = ({
  jobseeker,
  onSelect,
  isSelected,
}) => {
  return (
    <Card
      className={`cursor-pointer overflow-hidden group ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(jobseeker)}
    >
      <CardHeader className='relative pt-0'>
        <div className='flex items-center mt-8'>
          <Avatar className='mr-4 h-16 w-16'>
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
          </Avatar>
          <div>
            <CardTitle className='text-xl'>
              {jobseeker.personalDetails.name}
            </CardTitle>
            <p className='text-muted-foreground'>
              {jobseeker.personalDetails.location.city ||
                "Location not specified"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2 mb-4'>
          <p className='font-medium'>مهارت:</p>
          {jobseeker.professionalDetails.skills.map((skill, index) => (
            <Badge key={index} variant='outline'>
              {skill}
            </Badge>
          ))}
        </div>
        {jobseeker.professionalDetails.experience.length > 0 && (
          <div className='mb-4'>
            <p className='font-medium'>تجربه:</p>
            {jobseeker.professionalDetails.experience.map((e, i) => (
              <p className='text-muted-foreground' key={i}>
                {e.jobTitle} در: {e.company}
              </p>
            ))}
          </div>
        )}
        {jobseeker.professionalDetails.education.length > 0 && (
          <div>
            <p className='font-medium'>تحصیلات:</p>
            {jobseeker.professionalDetails.education.map((e, i) => (
              <p className='text-muted-foreground' key={i}>
                {e.degree} در: {e.fieldOfStudy}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobseekerCard;
