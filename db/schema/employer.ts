import {
  pgTable,
  serial,
  integer,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

import user from "./user";
import { relations } from "drizzle-orm";

const employer = pgTable("employer", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyWebsite: varchar("company_website"),
  companyLogo: varchar("company_logo"),
  companySize: varchar("company_size"),
  companyIndustry: varchar("company_industry"),
  location: varchar("location", { length: 256 }),
  bio: text("bio"),
  linkedinProfile: varchar("linkedin_profile"),
  githubProfile: varchar("github_profile"),
  savedCandidates: text("saved_candidates").array(),
  jobPostings: text("job_postings").array(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const employerRelations = relations(employer, ({ one }) => ({
  user: one(user, {
    fields: [employer.userId],
    references: [user.id],
  }),
}));

export default employer;
