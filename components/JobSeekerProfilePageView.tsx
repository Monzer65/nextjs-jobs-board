import { Card } from "./ui/card";
import Image from "next/image";
import { Eye, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { JobSeeker } from "@/lib/types";

export default function JobseekerProfilePageView({
  jobseeker,
}: {
  jobseeker: JobSeeker;
}) {
  return (
    <div className='min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <Card className='bg-white shadow-lg rounded-lg overflow-hidden'>
          {/* Header Section */}
          {/* <div
            className='text-white p-6 sm:p-8'
            style={{
              backgroundImage: jobseeker.bannerImageUrl
                ? `url(${jobseeker.bannerImageUrl})`
                : "none",
              backgroundColor: jobseeker.bannerImageUrl
                ? "transparent"
                : "#2563eb",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {jobseeker.profilePictureUrl && (
              <Image
                src={jobseeker.profilePictureUrl}
                alt={`${jobseeker.personalDetails.name} profile picture`}
                width={80}
                height={80}
                className='rounded-full bg-white p-1'
              />
            )}
            <h1 className='text-3xl font-bold mt-4'>
              {jobseeker.personalDetails.name}
            </h1>
            <p>{jobseeker.personalDetails.bio || "No bio available"}</p>
          </div> */}

          {/* Jobseeker Information */}
          <div className='p-6 sm:p-8'>
            <div className='lg:flex lg:gap-8'>
              {/* Sidebar with Contact & Location */}
              <div className='lg:w-1/3 space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-x-2'>
                    <MapPin className='w-5 h-5 text-muted-foreground' />
                    <span>
                      {jobseeker.personalDetails.location.city ||
                        "Location not specified"}
                    </span>
                  </div>
                  <div className='flex items-center gap-x-2'>
                    <Eye className='w-5 h-5 text-muted-foreground' />
                    <span>
                      {jobseeker.analytics?.usageData.pageViews} Profile Views
                    </span>
                  </div>
                  <p>
                    Contact Email:{" "}
                    <a href={`mailto:${jobseeker.personalDetails.email}`}>
                      {jobseeker.personalDetails.email}
                    </a>
                  </p>
                  {jobseeker.personalDetails.phoneNumber && (
                    <p>Phone: {jobseeker.personalDetails.phoneNumber}</p>
                  )}
                </div>

                {/* Skills and Languages */}
                <div className='mb-6'>
                  <h2 className='text-xl font-semibold'>Skills</h2>
                  <div className='flex flex-wrap gap-2'>
                    {jobseeker.professionalDetails.skills.map(
                      (skill, index) => (
                        <Badge key={index} variant='secondary'>
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                  <h2 className='text-xl font-semibold mt-6'>Languages</h2>
                  <div className='flex flex-wrap gap-2'>
                    {jobseeker.professionalDetails.languages.map(
                      (language, index) => (
                        <Badge key={index} variant='secondary'>
                          {language.name} ({language.proficiency})
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content with Experience & Education */}
              <div className='lg:w-2/3 mt-8 lg:mt-0 space-y-6'>
                {/* Experience Section */}
                <div className='mb-8'>
                  <h2 className='text-xl font-semibold mb-4'>Experience</h2>
                  {jobseeker.professionalDetails.experience.map(
                    (exp, index) => (
                      <div key={index} className='mb-4'>
                        <h3 className='font-bold'>
                          {exp.jobTitle} at {exp.company}
                        </h3>
                        <p>
                          {exp.startDate.toLocaleDateString()} -{" "}
                          {exp.endDate || "Present"}
                        </p>
                        <ul className='list-disc pl-5 space-y-2'>
                          {exp.responsibilities?.map((res, i) => (
                            <li key={i}>{res}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>

                {/* Education Section */}
                <div className='mb-8'>
                  <h2 className='text-xl font-semibold mb-4'>Education</h2>
                  {jobseeker.professionalDetails.education.map((edu, index) => (
                    <div key={index} className='mb-4'>
                      <h3 className='font-bold'>
                        {edu.degree} in {edu.fieldOfStudy}
                      </h3>
                      <p>{edu.institution}</p>
                      <p>
                        {edu.startDate.toLocaleDateString()} -{" "}
                        {edu?.endDate
                          ? edu?.endDate.toLocaleDateString()
                          : "Ongoing"}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Certifications Section */}
                {jobseeker.professionalDetails.certifications && (
                  <div className='mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>
                      Certifications
                    </h2>
                    {jobseeker.professionalDetails.certifications.map(
                      (cert, index) => (
                        <p key={index}>
                          {cert.name} from {cert.authority} (
                          {cert.issueDate.toLocaleDateString()})
                        </p>
                      )
                    )}
                  </div>
                )}

                {/* Links to Resume and Portfolio */}
                <div className='space-y-2'>
                  {jobseeker.resume.fileUrl && (
                    <a
                      href={jobseeker.resume.fileUrl}
                      className='text-blue-500 underline'
                    >
                      View Resume
                    </a>
                  )}
                  {jobseeker.portfolio && (
                    <a
                      href={jobseeker.portfolio.projects[0].link}
                      className='text-blue-500 underline'
                    >
                      View Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
