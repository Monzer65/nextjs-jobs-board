// import { sql } from "drizzle-orm";
import {
  boolean,
  // check,
  // integer,
  // jsonb,
  // pgEnum,
  pgTable,
  // primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// export const rolesTable = pgTable("roles", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const userTypesTable = pgTable("user_types", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const workModesTable = pgTable("work_modes", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const jobTypesTable = pgTable("job_types", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const compensationsTable = pgTable("compensations", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const experienceLevelsTable = pgTable("experience_levels", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const languageLevelsTable = pgTable("language_levels", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const degreesTable = pgTable("degrees", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const communicationChannelsTable = pgTable("communication_channels", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const currenciesTable = pgTable("currencies", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const visibilityLevelsTable = pgTable("visibility_levels", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const applicationStatusesTable = pgTable("application_statuses", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const notificationStatusesTable = pgTable("notification_statuses", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const contractStatusesTable = pgTable("contract_statuses", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const paymentStatusesTable = pgTable("payment_statuses", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const jobIndustriesTable = pgTable("job_industries", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });
// export const jobCategoriesTable = pgTable("job_categories", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 50 }).notNull().unique(),
// });

// // Enums
// export const roleEnum = pgEnum("role", [
//   "super-admin",
//   "admin",
//   "moderator",
//   "support",
//   "user",
// ]);

// export enum user_types {
//   jobSeeker = "job-seeker",
//   freelancer = "freelancer",
//   employer = "employer",
// }

// export const typeEnum = pgEnum(
//   "user_type",
//   Object.values(user_types) as [string, ...string[]]
// );

// export const workModeEnum = pgEnum("work_mode", ["remote", "onsite", "hybrid"]);
// export const jobTypeEnum = pgEnum("job_type", [
//   "full-time",
//   "part-time",
//   "contract",
//   "freelance",
//   "internship",
//   "temporary",
// ]);
// export const compensationEnum = pgEnum("compensation", [
//   "hourly",
//   "salary",
//   "commission",
//   "bonuses",
//   "equity",
//   "benefits",
// ]);
// export const experienceLevelEnum = pgEnum("experience_level", [
//   "entry",
//   "junior",
//   "mid",
//   "senior",
//   "lead",
//   "executive",
// ]);
// export const languageLevelEnum = pgEnum("language_level", [
//   "basic",
//   "conversational",
//   "fluent",
//   "native",
// ]);
// export const degreeEnum = pgEnum("degree", [
//   "High School",
//   "Associate",
//   "Bachelor's",
//   "Master's",
//   "PhD",
//   "Diploma",
//   "Certificate",
// ]);
// export const communicationChannelEnum = pgEnum("communication_channel", [
//   "email",
//   "phone-call",
//   "video-call",
//   "SMS",
//   "messaging-app",
// ]);
// export const currencyEnum = pgEnum("currency", ["USD", "EUR", "IRR", "CAD"]);
// export const visibilityEnum = pgEnum("visibility", [
//   "public",
//   "private",
//   "restricted",
//   "connections",
// ]);
// export const notificationStatusEnum = pgEnum("notification_status", [
//   "unread",
//   "read",
//   "archived",
// ]);
// export const contractStatusEnum = pgEnum("contract_status", [
//   "draft",
//   "active",
//   "completed",
//   "terminated",
// ]);
// export const paymentStatusEnum = pgEnum("payment_status", [
//   "pending",
//   "completed",
//   "failed",
// ]);

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 100 }).unique(),
  email: varchar("email", { length: 255 }).unique(),
  phoneVerified: boolean("phone_verified").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  confirmationCode: varchar("confirmation_code", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  userType: text().$type<"job_seeker" | "freelancer" | "employer">(),
  role: text().$type<
    "super_admin" | "admin" | "moderator" | "support" | "user"
  >(),
  profileImageUrl: varchar("profile_image_url"),
  bannerImageUrl: varchar("banner_image_url"),
  location: varchar("location", { length: 256 }),
  bio: text("bio"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login").defaultNow(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toLocaleString()),
});

// export const freelancers = pgTable("freelancers", {
//   userId: integer("user_id")
//     .primaryKey()
//     .references(() => users.id, { onDelete: "cascade" }),
//   githubProfile: varchar("github_profile"),
//   linkedinProfile: varchar("linkedin_profile"),
//   portfolioWebsite: varchar("portfolio_website"),
//   dob: timestamp("dob"),
//   resume: text("resume").notNull(),
//   skillsSummary: text("skills_summary"),
//   hourlyRate: integer("hourly_rate"),
//   availability: varchar("availability", { length: 128 }),
//   savedJobs: text("saved_jobs").array(),
//   jobAlerts: boolean("job_alerts").default(true),
//   visibilityId: integer("visibility_id")
//     .notNull()
//     .references(() => visibilityLevelsTable.id),
//   analytics: jsonb("analytics"),
// });

// export const jobSeekers = pgTable("job_seekers", {
//   userId: integer("user_id")
//     .primaryKey()
//     .references(() => users.id, { onDelete: "cascade" }),
//   githubProfile: varchar("github_profile"),
//   linkedinProfile: varchar("linkedin_profile"),
//   portfolioWebsite: varchar("portfolio_website"),
//   dob: timestamp("dob"),
//   resume: text("resume").notNull(),
//   savedJobs: text("saved_jobs").array(),
//   jobAlerts: boolean("job_alerts").default(true),
//   visibilityId: integer("visibility_id")
//     .notNull()
//     .references(() => visibilityLevelsTable.id),
//   analytics: jsonb("analytics"),
// });

// export const employers = pgTable("employers", {
//   userId: integer("user_id")
//     .primaryKey()
//     .references(() => users.id, { onDelete: "cascade" }),
//   companyName: varchar("company_name", { length: 256 }).notNull(),
//   logo: varchar("logo"),
//   description: text("description").notNull(),
//   industry: varchar("industry", { length: 128 }).notNull(),
//   size: varchar("size", { length: 128 }).notNull(),
//   website: varchar("website"),
//   joinDate: timestamp("join_date").notNull().defaultNow(),
//   visibilityId: integer("visibility_id")
//     .notNull()
//     .references(() => visibilityLevelsTable.id),
// });

// export const skills = pgTable("skills", {
//   id: serial("id").primaryKey(),
//   name: varchar("skill", { length: 128 }).notNull().unique(),
// });

// export const userSkills = pgTable(
//   "user_skills",
//   {
//     userId: integer("user_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     skillId: integer("skill_id")
//       .notNull()
//       .references(() => skills.id, { onDelete: "cascade" }),
//   },
//   (table) => [{ pk: primaryKey({ columns: [table.userId, table.skillId] }) }]
// );

// export const experience = pgTable("experience", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   jobTitle: varchar("job_title").notNull(),
//   company: varchar("company").notNull(),
//   startDate: timestamp("start_date").notNull(),
//   endDate: timestamp("end_date"),
//   responsibilities: jsonb("responsibilities"),
//   achievements: jsonb("achievements"),
//   description: text("description").notNull(),
// });

// export const education = pgTable("education", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   institution: varchar("institution", { length: 256 }).notNull(),
//   degreeId: integer("degree_id")
//     .notNull()
//     .references(() => degreesTable.id),
//   fieldOfStudy: varchar("field_of_study").notNull(),
//   startDate: timestamp("start_date").notNull(),
//   endDate: timestamp("end_date"),
//   description: text("description"),
// });

// export const certifications = pgTable("certifications", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   name: varchar("name").notNull(),
//   authority: varchar("authority").notNull(),
//   issueDate: timestamp("issue_date").notNull(),
//   expirationDate: timestamp("expiration_date"),
// });

// export const projects = pgTable("projects", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => freelancers.userId, { onDelete: "cascade" }),
//   title: varchar("title", { length: 256 }).notNull(),
//   description: text("description").notNull(),
//   link: varchar("link"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });

// export const userConnections = pgTable(
//   "connections",
//   {
//     id: serial("id").primaryKey(),
//     userId: integer("user_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     connectionId: integer("connection_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//   },
//   (table) => [
//     { pk: primaryKey({ columns: [table.userId, table.connectionId] }) },
//   ]
// );

// export const reviews = pgTable(
//   "reviews",
//   {
//     id: serial("id").primaryKey(),
//     reviewerId: integer("reviewer_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     revieweeId: integer("reviewee_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     rating: integer("rating").notNull(),
//     comment: text("comment").notNull(),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//   },
//   (table) => [
//     check("rating_check", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
//   ]
// );

// // may needs revision
// export const socialMediaLinks = pgTable("social_media_links", {
//   id: serial("id").primaryKey(),
//   employerId: integer("employer_id")
//     .notNull()
//     .references(() => employers.userId, { onDelete: "cascade" }),
//   link: varchar("link").notNull(),
// });

// export const jobs = pgTable("job_postings", {
//   id: serial("id").primaryKey(),
//   employerId: integer("employer_id")
//     .notNull()
//     .references(() => employers.userId, { onDelete: "cascade" }),
//   title: varchar("title", { length: 256 }).notNull(),
//   isFreelance: boolean("is_freelance").notNull().default(true),
//   description: text("description").notNull(),
//   jobTypeId: integer("job_type_id")
//     .notNull()
//     .references(() => jobTypesTable.id),
//   workModeId: integer("work_mode_id")
//     .notNull()
//     .references(() => workModesTable.id),
//   jobIndustryId: integer("job_industry_id")
//     .notNull()
//     .references(() => jobIndustriesTable.id),
//   jobCategoryId: integer("job_category_id")
//     .notNull()
//     .references(() => jobCategoriesTable.id),
//   location: varchar("location"),
//   salaryMin: integer("salary_min"),
//   salaryMax: integer("salary_max"),
//   currencyId: integer("currency_id")
//     .notNull()
//     .references(() => currenciesTable.id),
//   applicationDeadline: timestamp("application_deadline"),
//   postedDate: timestamp("posted_date").notNull().defaultNow(),
//   isActive: boolean("is_active").default(true),
// });

// export const jobApplications = pgTable("job_applications", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   jobId: integer("job_id")
//     .notNull()
//     .references(() => jobs.id, { onDelete: "cascade" }),
//   statusId: integer("status_id")
//     .notNull()
//     .references(() => applicationStatusesTable.id),
//   coverLetter: text("cover_letter"),
//   applicationDate: timestamp("application_date").notNull().defaultNow(),
// });

// export const contracts = pgTable("contracts", {
//   id: serial("id").primaryKey(),
//   jobId: integer("job_id")
//     .notNull()
//     .references(() => jobs.id, { onDelete: "cascade" }),
//   freelancerId: integer("freelancer_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   employerId: integer("employer_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   statusId: integer("status_id")
//     .notNull()
//     .references(() => contractStatusesTable.id),
//   startDate: timestamp("start_date"),
//   endDate: timestamp("end_date"),
//   paymentTerms: text("payment_terms"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at").notNull().defaultNow(),
// });

// export const payments = pgTable("payments", {
//   id: serial("id").primaryKey(),
//   contractId: integer("contract_id")
//     .notNull()
//     .references(() => contracts.id, { onDelete: "cascade" }),
//   amount: integer("amount").notNull(),
//   currencyId: integer("currency_id")
//     .notNull()
//     .references(() => currenciesTable.id),
//   statusId: integer("status_id")
//     .notNull()
//     .references(() => paymentStatusesTable.id),
//   paymentDate: timestamp("payment_date"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });

// export const messages = pgTable("messages", {
//   id: serial("id").primaryKey(),
//   senderId: integer("sender_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   receiverId: integer("receiver_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   content: text("content").notNull(),
//   sentAt: timestamp("sent_at").notNull().defaultNow(),
//   isRead: boolean("is_read").default(false),
// });

// export const notifications = pgTable("notifications", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   message: text("message").notNull(),
//   statusId: integer("status_id")
//     .notNull()
//     .references(() => notificationStatusesTable.id),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const userActivityLogs = pgTable("user_activity_logs", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   activityType: varchar("activity_type", { length: 128 }),
//   timestamp: timestamp("timestamp").defaultNow(),
// });

// export type Freelancer = typeof freelancers.$inferSelect;
// export type NewFreelancer = typeof freelancers.$inferInsert;

// export type JobApplication = typeof jobApplications.$inferSelect;
// export type NewJobApplication = typeof jobApplications.$inferInsert;

// export type Employer = typeof employers.$inferSelect;
// export type NewEmployer = typeof employers.$inferInsert;

// export type Contract = typeof contracts.$inferSelect;
// export type NewContract = typeof contracts.$inferInsert;

// export type Role = typeof rolesTable.$inferSelect;
// export type UserType = typeof userTypesTable.$inferSelect;
// export type JobType = typeof jobTypesTable.$inferSelect;
// export type WorkMode = typeof workModesTable.$inferSelect;

// export type UserSkill = typeof userSkills.$inferSelect;
// export type NewUserSkill = typeof userSkills.$inferInsert;

// export type UserConnection = typeof userConnections.$inferSelect;
// export type NewUserConnection = typeof userConnections.$inferInsert;

// export type Payment = typeof payments.$inferSelect;
// export type NewPayment = typeof payments.$inferInsert;

// export type Notification = typeof notifications.$inferSelect;
// export type NewNotification = typeof notifications.$inferInsert;

// export type SocialMediaLink = typeof socialMediaLinks.$inferSelect;
// export type NewSocialMediaLink = typeof socialMediaLinks.$inferInsert;

// export type UserActivityLog = typeof userActivityLogs.$inferSelect;
// export type NewUserActivityLog = typeof userActivityLogs.$inferInsert;

// export type Project = typeof projects.$inferSelect;
// export type NewProject = typeof projects.$inferInsert;

// export type Experience = typeof experience.$inferSelect;
// export type NewExperience = typeof experience.$inferInsert;

// export type Education = typeof education.$inferSelect;
// export type NewEducation = typeof education.$inferInsert;

// export type Certification = typeof certifications.$inferSelect;
// export type NewCertification = typeof certifications.$inferInsert;

// export type Message = typeof messages.$inferSelect;
// export type NewMessage = typeof messages.$inferInsert;

// export type Review = typeof reviews.$inferSelect;
// export type NewReview = typeof reviews.$inferInsert;
