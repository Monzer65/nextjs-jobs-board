import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  companyRating: number;
  workHours: string;
  workMode: string;
  requiredSkills: string[];
  fullDescription: string;
  responsibilities: string[];
  qualifications: string[];
}

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  isSelected: boolean;
}

const JobCard: FC<JobCardProps> = ({ job, onSelect, isSelected }) => {
  return (
    <Card
      className={`cursor-pointer ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={() => onSelect(job)}
    >
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>{job.company}</p>
        <p className='text-sm text-muted-foreground flex items-center mt-2'>
          <MapPin className='h-4 w-4 ml-2' />
          {job.location}
        </p>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <span className='text-sm font-medium'>{job.type}</span>
        <Button variant='outline'>ثبت درخواست</Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
