import {
  pgTable,
  serial,
  integer,
  timestamp,
  varchar,
  boolean,
  text,
} from "drizzle-orm/pg-core";

import user from "./user";
import { relations } from "drizzle-orm";

const jobSeeker = pgTable("job_seeker", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  online: boolean("online").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  bannerImageUrl: varchar("banner_image_url"),
  dob: timestamp("dob", { mode: "string" }),
  bio: text("bio"),
  skills: text("skills"),
  experience: text("experience"),
  education: text("education"),
  availability: text("availability"),
  location: varchar("location", { length: 256 }),
  githubProfile: varchar("github_profile"),
  linkedinProfile: varchar("linkedin_profile"),
  portfolioWebsite: varchar("portfolio_website"),
  resume: text("resume").notNull(),
  savedJobs: text("saved_jobs").array(),
  jobAlerts: boolean("job_alerts").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const jobSeekerRelations = relations(jobSeeker, ({ one }) => ({
  user: one(user, {
    fields: [jobSeeker.userId],
    references: [user.id],
  }),
}));

export default jobSeeker;
