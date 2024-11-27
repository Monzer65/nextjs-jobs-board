import { jobPostings } from "./JobPostingsPlaceholderData";
import { Employer } from "./types";

export const employers: Employer[] = [
  {
    id: 1,
    companyDetails: {
      name: "Tech Innovations Inc.",
      logo: "https://example.com/logos/tech-innovations.png",
      bannerImageUrl: "https://example.com/banners/tech-innovations-banner.png",
      description:
        "A leading tech company specializing in innovative software solutions for businesses.",
      industry: "Information Technology",
      size: "500-1000 employees",
      location: { city: "San Francisco", country: "USA" },
      website: "https://techinnovations.com",
      email: "hr@techinnovations.com",
      phone: "+1 123-456-7890",
      socialMediaLinks: [
        "https://linkedin.com/company/tech-innovations",
        "https://twitter.com/techinnovations",
      ],
      reviews: [
        "Great work-life balance!",
        "Innovative projects and supportive team.",
      ],
      clientTestimonials: [
        "Exceptional software quality!",
        "Highly professional team.",
      ],
      joinDate: new Date("2019-03-15"),
      lastActive: new Date("2024-11-10"),
    },
    jobPostings: [
      {
        jobDetails: jobPostings.find((job) => job.jobDetails.id === 101)!
          .jobDetails,
        applicationTracking: jobPostings.find(
          (job) => job.jobDetails.id === 101
        )!.applicationTracking,
      },
      {
        jobDetails: jobPostings.find((job) => job.jobDetails.id === 102)!
          .jobDetails,
        applicationTracking: jobPostings.find(
          (job) => job.jobDetails.id === 102
        )!.applicationTracking,
      },
    ],
  },
  {
    id: 2,
    companyDetails: {
      name: "GreenLeaf Analytics",
      logo: "https://example.com/logos/greenleaf-analytics.png",
      bannerImageUrl: "https://example.com/banners/greenleaf-banner.png",
      description:
        "A data analytics firm specializing in environmental and financial data insights.",
      industry: "Finance",
      size: "100-500 employees",
      location: { city: "Remote", country: "Worldwide" },
      website: "https://greenleafanalytics.com",
      email: "contact@greenleafanalytics.com",
      socialMediaLinks: [
        "https://linkedin.com/company/greenleaf-analytics",
        "https://twitter.com/greenleaf_analytics",
      ],
      clientTestimonials: [
        "A game-changer in data-driven insights!",
        "Helped us optimize our operations efficiently.",
      ],
      joinDate: new Date("2020-05-20"),
      lastActive: new Date("2024-11-11"),
    },
    jobPostings: [
      {
        jobDetails: jobPostings.find((job) => job.jobDetails.id === 103)!
          .jobDetails,
        applicationTracking: jobPostings.find(
          (job) => job.jobDetails.id === 103
        )!.applicationTracking,
      },
    ],
  },
  {
    id: 3,
    companyDetails: {
      name: "Prime Products",
      logo: "https://example.com/logos/prime-products.png",
      bannerImageUrl: "https://example.com/banners/prime-products-banner.png",
      description:
        "A leading consumer goods company with a focus on sustainable and high-quality products.",
      industry: "Consumer Goods",
      size: "1000-5000 employees",
      location: { city: "New York", country: "USA" },
      website: "https://primeproducts.com",
      email: "careers@primeproducts.com",
      phone: "+1 987-654-3210",
      socialMediaLinks: [
        "https://linkedin.com/company/prime-products",
        "https://facebook.com/primeproducts",
      ],
      reviews: [
        "Friendly work environment.",
        "Excellent benefits and supportive management.",
      ],
      clientTestimonials: [
        "Reliable and innovative products!",
        "High-quality goods with sustainable packaging.",
      ],
      joinDate: new Date("2015-07-10"),
      lastActive: new Date("2024-11-12"),
    },
    jobPostings: [
      // {
      //   jobDetails: jobPostings.find((job) => job.jobDetails.id === 104)!
      //     .jobDetails,
      //   applicationTracking: jobPostings.find(
      //     (job) => job.jobDetails.id === 104
      //   )!.applicationTracking,
      // },
    ],
  },
];
