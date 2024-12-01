import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import userTable from "./user";
import { InferSelectModel, relations } from "drizzle-orm";

const passwordResetSessionTable = pgTable("password_reset_session", {
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
  emailVerified: boolean("email_verified").notNull().default(false),
  twoFactorVerified: boolean("two_factor_verified").notNull().default(false),
});

export type PasswordResetSession = InferSelectModel<
  typeof passwordResetSessionTable
>;

export const passwordResetSessionTableRelations = relations(
  passwordResetSessionTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [passwordResetSessionTable.userId],
      references: [userTable.id],
    }),
  })
);

export default passwordResetSessionTable;
