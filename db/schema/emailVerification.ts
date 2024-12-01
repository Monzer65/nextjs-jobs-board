import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import userTable from "./user";
import { InferSelectModel, relations } from "drizzle-orm";

const emailVerificationRequestTable = pgTable("email_verification", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  email: varchar("email").notNull(),
  code: varchar("code").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type EmailVerification = InferSelectModel<
  typeof emailVerificationRequestTable
>;

export const emailVerificationRequestTableRelations = relations(
  emailVerificationRequestTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [emailVerificationRequestTable.userId],
      references: [userTable.id],
    }),
  })
);

export default emailVerificationRequestTable;
