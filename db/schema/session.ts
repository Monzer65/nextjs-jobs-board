import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import user from "./user";
import userTable from "./user";

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  twoFactorVerified: boolean("two_factor_verified").notNull().default(false),
});

export type Session = InferSelectModel<typeof sessionTable>;

export const sessionTableRelations = relations(sessionTable, ({ one }) => ({
  user: one(user, {
    fields: [sessionTable.userId],
    references: [user.id],
  }),
}));

export default sessionTable;
