import { relations } from "drizzle-orm";
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

const freelancer = pgTable("freelancer", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  online: boolean("online").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  bannerImageUrl: varchar("banner_image_url"),
  bio: text("bio"),
  skills: text("skills"),
  hourlyRate: integer("hourly_rate"),
  experience: text("experience"),
  education: text("education"),
  availability: text("availability"),
  location: varchar("location", { length: 256 }),
  githubProfile: varchar("github_profile"),
  linkedinProfile: varchar("linkedin_profile"),
  portfolioWebsite: varchar("portfolio_website"),
  resume: text("resume"),
  savedProjects: text("saved_projects").array(),
  projectAlerts: boolean("project_alerts").default(true),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const freelancerRelations = relations(freelancer, ({ one }) => ({
  user: one(user, {
    fields: [freelancer.userId],
    references: [user.id],
  }),
}));

export default freelancer;
