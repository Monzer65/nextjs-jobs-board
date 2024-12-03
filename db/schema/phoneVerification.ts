import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import userTable from "./user";
import { InferSelectModel, relations } from "drizzle-orm";

const phoneVerificationRequestTable = pgTable("phone_verification", {
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

export type PhoneVerification = InferSelectModel<
  typeof phoneVerificationRequestTable
>;

export const phoneVerificationRequestTableRelations = relations(
  phoneVerificationRequestTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [phoneVerificationRequestTable.userId],
      references: [userTable.id],
    }),
  })
);

export default phoneVerificationRequestTable;
