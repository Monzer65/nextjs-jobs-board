import { FC } from "react";
import {
  Bookmark,
  EllipsisVertical,
  Flag,
  MapPin,
  Clock,
  Briefcase,
  Star,
  Users,
  Eye,
  Calendar1,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/formateDate";
import { CompanyDetails, JobDetails } from "@/lib/types";

interface JobCardProps {
  job: JobDetails;
  employer: CompanyDetails;
  onSelect: (job: JobDetails) => void;
  isSelected: boolean;
}

const JobCard: FC<JobCardProps> = ({ job, employer, onSelect, isSelected }) => {
  return (
    <Card
      className={`cursor-pointer overflow-hidden group ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(job)}
    >
      <CardHeader className='relative pt-0'>
        <div className='flex justify-between items-start mt-8'>
          <div>
            <CardTitle className='text-xl group-hover:underline group-hover:underline-offset-4'>
              {job.title}
            </CardTitle>
            <CardDescription className='mt-2'>
              <span>{employer?.name}</span>
              {job?.analytics?.performanceMetrics.successRates && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      aria-label={`امتیاز ${job?.analytics?.performanceMetrics.successRates.toFixed(
                        1
                      )} از پنج`}
                      role='img'
                    >
                      <span className='flex mr-2'>
                        <Star className='text-sm w-4 h-4 text-gray-400 fill-gray-500' />
                        <span className='mr-1 text-sm'>
                          {job?.analytics?.performanceMetrics.successRates.toFixed(
                            1
                          )}
                        </span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>امتیاز شرکت</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <EllipsisVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem>
                <Bookmark className='mr-2 h-4 w-4' />
                <span>ذخیره</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className='mr-2 h-4 w-4 text-destructive' />
                <span>گزارش</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2 mb-4'>
          {job.location && (
            <Badge variant='secondary'>
              <MapPin className='ml-1 h-3 w-3' />
              <span>{job.location.city}</span>
            </Badge>
          )}

          {job.jobType &&
            job.jobType.map((type, index) => (
              <Badge key={index} variant='secondary' className='mr-2'>
                <Briefcase className='ml-1 h-3 w-3' />
                {type}
              </Badge>
            ))}

          {job.workMode && (
            <Badge variant='secondary'>
              <Clock className='ml-1 h-3 w-3' />
              {job.workMode}
            </Badge>
          )}
        </div>
        {job.description && (
          <p className='text-sm text-muted-foreground mb-4'>
            {job.description}
          </p>
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
      </CardContent>
      <CardFooter className='flex flex-col items-start lg:flex-row lg:flex-wrap lg:items-center text-sm text-muted-foreground lg:gap-y-2 gap-x-6'>
        {job.analytics?.usageData.pageViews !== undefined && (
          <div className='flex items-center gap-x-2'>
            <Eye className='h-4 w-4' />
            <span>
              <span className='text-green-600'>
                {job.analytics?.usageData.pageViews}{" "}
              </span>
              بازدید
            </span>
          </div>
        )}
        {job.analytics?.usageData.applicationRates !== undefined && (
          <div className='flex items-center gap-x-2'>
            <Users className='h-4 w-4' />
            <span>
              <span className='text-green-600'>
                {job.analytics?.usageData.applicationRates}{" "}
              </span>
              متقاضی
            </span>
          </div>
        )}
        {job.postedDate && (
          <div className='flex items-center gap-x-2'>
            <Calendar1 className='h-4 w-4' />
            <span>
              تاریخ انتشار {""}
              {formatDate(new Date(job.postedDate), "MMM d, yyyy")}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
