import {
  JobCategory,
  JobIndustry,
  JobSeeker,
  JobType,
  Visibility,
} from "./types";

export const jobSeekers: JobSeeker[] = [
  {
    id: 1,
    personalDetails: {
      name: "Alice Johnson",
      bio: "Experienced software developer with a passion for front-end development and user experience design.",
      email: "alice.johnson@example.com",
      phoneNumber: "+123456789",
      location: { city: "San Francisco", country: "USA" },
      githubProfile: "https://github.com/alicejohnson",
      linkedinProfile: "https://linkedin.com/in/alicejohnson",
      portfolioWebsite: "https://alicejohnson.dev",
    },
    professionalDetails: {
      jobTitle: "Front-End Developer",
      skills: ["JavaScript", "React", "CSS", "HTML", "TypeScript"],
      experience: [
        {
          jobTitle: "Front-End Developer",
          company: "Tech Solutions",
          position: "Full-Time",
          startDate: new Date("2020-05-01"),
          endDate: "Present",
          responsibilities: [
            "Developed responsive web applications",
            "Led UI/UX improvements",
          ],
          achievements: [
            "Reduced load time by 30%",
            "Enhanced accessibility for visually impaired users",
          ],
          description:
            "Worked with a team to develop and optimize front-end applications for various clients.",
        },
      ],
      education: [
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: new Date("2015-09-01"),
          endDate: new Date("2019-06-15"),
        },
      ],
      certifications: [
        {
          name: "Certified JavaScript Developer",
          authority: "JavaScript Institute",
          issueDate: new Date("2021-08-10"),
          expirationDate: new Date("2027-08-10"),
        },
      ],
      languages: [
        { name: "English", proficiency: "native" },
        { name: "Spanish", proficiency: "conversational" },
      ],
      coverLetter: [
        {
          jobId: 101,
          fileUrl: "https://example.com/coverletter_alice_johnson.pdf",
        },
      ],
    },
    resume: {
      fileUrl: "https://example.com/resume_alice_johnson.pdf",
      summary:
        "Proficient front-end developer with 3+ years of experience specializing in React-based applications.",
    },
    portfolio: {
      projects: [
        {
          title: "E-commerce Web App",
          description:
            "Developed a full-featured e-commerce application with user authentication, product listings, and cart management.",
          link: "https://alicejohnson.dev/ecommerce-project",
        },
      ],
    },
    preferences: {
      jobType: JobType.FullTime,
      jobCategory: JobCategory.SoftwareDevelopment,
      jobIndustry: JobIndustry.InformationTechnology,
      desiredRoles: ["Front-End Developer", "UI/UX Developer"],
      salaryExpectation: 80000,
      preferredLocation: { city: "San Francisco", country: "USA" },
    },
    jobApplications: [
      {
        jobId: 101,
        applicationStatus: "Interview",
        applicationDate: new Date("2024-08-12"),
      },
    ],
    savedJobs: ["102", "103", "104"],
    jobAlerts: true,
    profilePictureUrl: "https://example.com/profile_picture_alice.jpg",
    bannerImageUrl: "https://example.com/banner_alice.jpg",
    joinDate: "2023-06-15",
    lastActive: "2024-11-01",
    visibility: Visibility.Public,
    connections: [2, 3, 4],
  },
  {
    id: 2,
    personalDetails: {
      name: "John Doe",
      bio: "Data scientist specializing in machine learning and data analysis.",
      email: "john.doe@example.com",
      phoneNumber: "+987654321",
      location: { city: "New York", country: "USA" },
      githubProfile: "https://github.com/johndoe",
      linkedinProfile: "https://linkedin.com/in/johndoe",
    },
    professionalDetails: {
      jobTitle: "Data Scientist",
      skills: [
        "Python",
        "Machine Learning",
        "Data Analysis",
        "SQL",
        "TensorFlow",
      ],
      experience: [
        {
          jobTitle: "Data Scientist",
          company: "Data Insights",
          position: "Full-Time",
          startDate: new Date("2019-03-01"),
          responsibilities: [
            "Developed predictive models",
            "Analyzed complex datasets",
          ],
          achievements: [
            "Improved model accuracy by 15%",
            "Reduced processing time by 25%",
          ],
          description:
            "Collaborated with teams to provide data-driven insights and predictive solutions.",
        },
      ],
      education: [
        {
          institution: "Massachusetts Institute of Technology",
          degree: "Master of Science",
          fieldOfStudy: "Data Science",
          startDate: new Date("2016-09-01"),
          endDate: new Date("2018-06-15"),
        },
      ],
      certifications: [
        {
          name: "Certified Data Scientist",
          authority: "Data Science Academy",
          issueDate: new Date("2020-05-15"),
          expirationDate: new Date("2030-05-15"),
        },
      ],
      languages: [
        { name: "English", proficiency: "native" },
        { name: "French", proficiency: "conversational" },
      ],
      coverLetter: [
        {
          jobId: 102,
          fileUrl: "https://example.com/coverletter_john_doe.pdf",
        },
      ],
    },
    resume: {
      fileUrl: "https://example.com/resume_john_doe.pdf",
      summary:
        "Experienced data scientist with a strong background in machine learning and statistical analysis.",
    },
    portfolio: {
      projects: [
        {
          title: "Predictive Sales Model",
          description:
            "Built a predictive model to forecast sales based on historical data.",
          link: "https://johndoe.dev/sales-forecasting",
        },
      ],
    },
    preferences: {
      jobType: JobType.Contract,
      jobCategory: JobCategory.DataScienceAndAnalytics,
      jobIndustry: JobIndustry.Finance,
      desiredRoles: ["Data Scientist", "Machine Learning Engineer"],
      salaryExpectation: 90000,
      preferredLocation: { city: "Remote", country: "Worldwide" },
    },
    jobApplications: [
      {
        jobId: 102,
        applicationStatus: "Applied",
        applicationDate: new Date("2024-09-01"),
      },
    ],
    savedJobs: ["105", "106"],
    jobAlerts: false,
    profilePictureUrl: "",
    bannerImageUrl: "",
    joinDate: "2023-07-20",
    lastActive: "2024-10-20",
    visibility: Visibility.Restricted,
    connections: [1, 3],
  },
];
