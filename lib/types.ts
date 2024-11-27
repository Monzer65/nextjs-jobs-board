export enum JobType {
  FullTime = "full-time",
  PartTime = "part-time",
  Contract = "contract",
  Freelance = "freelance",
  Internship = "internship",
  Temporary = "temporary",
  Volunteer = "volunteer",
  Apprenticeship = "apprenticeship",
  Seasonal = "seasonal",
  ContractToHire = "contract-to-hire",
  ProjectBased = "project-based",
  Hourly = "hourly",
}

export enum WorkMode {
  Remote = "remote",
  Onsite = "onsite",
  Hybrid = "hybrid",
}

export enum CompensationModel {
  Hourly = "hourly",
  Salary = "salary",
  Commission = "commission",
  Bonuses = "bonuses",
  Equity = "equity",
  Benefits = "benefits",
}

export enum ExperienceLevel {
  Entry = "entry",
  Junior = "junior",
  Mid = "mid",
  Senior = "senior",
  Lead = "lead",
  Director = "director",
  Executive = "executive",
  VP = "vp",
  CSuite = "c-suite",
}

export enum Visibility {
  Public = "public", // Visible to everyone
  Private = "private", // Visible only to the owner/admin
  Restricted = "restricted", // Visible to owner & admin & recruiters
  Connections = "connections", // Visible to owner & admin & recruiters & users with a direct connection to the owner
}

export enum JobCategory {
  Accounting = "Accounting",
  Administrative = "Administrative",
  Agriculture = "Agriculture",
  ArtsAndDesign = "Arts & Design",
  BusinessAndManagement = "Business & Management",
  Communications = "Communications",
  CustomerService = "Customer Service",
  DataScienceAndAnalytics = "Data Science & Analytics",
  EducationAndTraining = "Education & Training",
  Engineering = "Engineering",
  Finance = "Finance",
  Healthcare = "Healthcare",
  Hospitality = "Hospitality",
  HumanResources = "Human Resources",
  InformationTechnology = "Information Technology",
  Legal = "Legal",
  Manufacturing = "Manufacturing",
  Marketing = "Marketing",
  MediaAndEntertainment = "Media & Entertainment",
  Operations = "Operations",
  ProductManagement = "Product Management",
  ProjectManagement = "Project Management",
  QualityAssurance = "Quality Assurance",
  RealEstate = "Real Estate",
  ResearchAndDevelopment = "Research & Development",
  Retail = "Retail",
  Sales = "Sales",
  ScienceAndBiotechnology = "Science & Biotechnology",
  SecurityAndPublicSafety = "Security & Public Safety",
  SocialServices = "Social Services",
  SoftwareDevelopment = "Software Development",
  SupplyChainAndLogistics = "Supply Chain & Logistics",
  Telecommunications = "Telecommunications",
  Transportation = "Transportation",
  WritingAndEditing = "Writing & Editing",
}

export enum JobIndustry {
  AgricultureAndForestry = "Agriculture & Forestry",
  Automotive = "Automotive",
  Banking = "Banking",
  Biotechnology = "Biotechnology",
  Construction = "Construction",
  ConsumerGoods = "Consumer Goods",
  Education = "Education",
  Energy = "Energy",
  Entertainment = "Entertainment",
  EnvironmentalServices = "Environmental Services",
  Finance = "Finance",
  FoodAndBeverage = "Food & Beverage",
  Government = "Government",
  Healthcare = "Healthcare",
  Hospitality = "Hospitality",
  InformationTechnology = "Information Technology",
  Insurance = "Insurance",
  LegalServices = "Legal Services",
  Manufacturing = "Manufacturing",
  Media = "Media",
  NonProfit = "Non-Profit",
  Pharmaceuticals = "Pharmaceuticals",
  RealEstate = "Real Estate",
  Retail = "Retail",
  Telecommunications = "Telecommunications",
  TransportationAndLogistics = "Transportation & Logistics",
  TravelAndTourism = "Travel & Tourism",
  Utilities = "Utilities",
  WasteManagement = "Waste Management",
}

interface Language {
  name: string;
  proficiency: "basic" | "conversational" | "fluent" | "native";
}

type CommunicationChannel = "email" | "phone" | "videoCall" | "messagingApp";

interface SalaryRange {
  min: number;
  max: number;
  currency: Currency;
  currencySymbol?: string;
}

type Currency = "USD" | "EUR" | "IRR" | "TOM";

// until here .....
interface Location {
  city: string;
  country: string;
}

interface RelocationSupport {
  provided: boolean;
  description?: string;
}

interface SkillForJob {
  name: string;
  isRequired: boolean;
  isPreferred?: boolean;
}

export interface ExperienceForJob {
  level: ExperienceLevel;
  isRequired: boolean;
  isPreferred?: boolean;
}

// Job seeker
interface PersonalDetails {
  name: string;
  bio: string;
  email?: string;
  phoneNumber?: string;
  location: Location;
  githubProfile?: string;
  linkedinProfile?: string;
  portfolioWebsite?: string;
}

interface ProfessionalDetails {
  jobTitle: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  // coverLetter: will be added later
}

interface Experience {
  jobTitle: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: string;
  responsibilities?: string[];
  achievements?: string[];
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

interface Certification {
  name: string;
  authority: string;
  issueDate: Date;
  expirationDate: Date;
}

interface Resume {
  fileUrl: string;
  summary: string;
}

interface Portfolio {
  projects: Project[];
}

interface Project {
  title: string;
  description: string;
  link: string;
}

interface JobPreferences {
  jobType: JobType;
  jobCategory: JobCategory;
  jobIndustry: JobIndustry;
  desiredRoles: string[];
  salaryExpectation: number;
  preferredLocation: Location;
}

export interface JobApplication {
  jobId: number;
  applicationStatus:
    | "Applied"
    | "Initial accept"
    | "Interview"
    | "Accepted"
    | "Rejected";
  applicationDate: Date;
}

export interface JobSeeker {
  id: number;
  personalDetails: PersonalDetails;
  professionalDetails: ProfessionalDetails;
  resume: Resume;
  portfolio: Portfolio;
  preferences: JobPreferences;
  jobApplications: JobApplication[];
  savedJobs: string[]; // array of job IDs
  jobAlerts: boolean;
  profilePictureUrl?: string;
  bannerImageUrl?: string;
  joinDate: string;
  lastActive: string;
  visibility: Visibility;
  connections: number[];
  analytics?: Analytics;
}

// employer
export interface CompanyDetails {
  name: string;
  logo: string;
  bannerImageUrl?: string;
  description: string;
  industry: string;
  size: string;
  location: Location;
  website: string;
  email: string;
  phone?: string;
  socialMediaLinks?: string[];
  reviews?: string[]; // User reviews of the recruiter's services
  clientTestimonials?: string[]; // Testimonials from clients
  joinDate: Date;
  lastActive: Date;
}

export interface JobDetails {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  jobType: JobType[];
  jobCategory: JobCategory;
  jobIndustry: JobIndustry;
  requiredGender: "male" | "female" | "any";
  preferredGender: "male" | "female" | "any";
  skills: SkillForJob[];
  experience: ExperienceForJob[];
  qualifications?: string[];
  educationRequirements?: string[];
  responsibilities?: string[];
  compensationModel: CompensationModel;
  workMode: WorkMode[];
  workHours?: string;
  benefits: string[];
  salaryRange: SalaryRange;
  salaryBudget?: string;
  location: Location;
  applicationDeadline: Date;
  postedDate: Date;
  hiringUrgency: "immediate" | "urgent" | "standard";
  preferredCommunicationChannels: CommunicationChannel[];
  visaSponsorship: boolean;
  relocationSupport: RelocationSupport;
  equalOpportunityEmployer: boolean;
  diversityAndInclusionStatement?: string;
  externalApplicationUrl?: string;
  analytics?: Analytics;
}

export interface ApplicationTracking {
  applicantId: number;
  status: "Pending" | "Reviewed" | "Interviewed" | "Hired" | "Rejected";
  feedback: string;
  lastUpdated?: Date;
}

export interface JobPosting {
  jobDetails: JobDetails;
  applicationTracking: ApplicationTracking[];
}

export interface Employer {
  id: number;
  companyDetails: CompanyDetails;
  jobPostings: JobPosting[];
}

// General
export interface UserAccount {
  userId: number;
  email: string;
  passwordHash: string;
  role: "Admin" | "Employer" | "Job Seeker";
}

interface UsageData {
  pageViews: number;
  jobPostViews: number;
  applicationRates: number;
}

interface PerformanceMetrics {
  responseTimes: number[];
  successRates: number;
}

interface Analytics {
  usageData: UsageData;
  performanceMetrics: PerformanceMetrics;
}

interface Notification {
  id: number;
  userId: number;
  type: "JobAlert" | "ApplicationUpdate" | "Message";
  content: string;
  timestamp: Date;
  readStatus: boolean;
}

interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

export interface Conversation {
  conversationId: number;
  participants: number[]; // User IDs involved in the conversation
  messages: Message[];
  lastUpdated: string;
}
