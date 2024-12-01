import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import userTable from "./user";
import { InferSelectModel, relations } from "drizzle-orm";

const phoneVerificationTable = pgTable("phone_verification", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  phone: varchar("phone").notNull(),
  code: varchar("code").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type PhoneVerification = InferSelectModel<typeof phoneVerificationTable>;

export const phoneVerificationTableRelations = relations(
  phoneVerificationTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [phoneVerificationTable.userId],
      references: [userTable.id],
    }),
  })
);

export default phoneVerificationTable;
