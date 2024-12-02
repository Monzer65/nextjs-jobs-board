import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import userTable, { customBytea } from "./user";
import { InferSelectModel, relations } from "drizzle-orm";

const totpCredentialTable = pgTable("totp_credential", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  key: customBytea("key").notNull(),
});

export type TotpCredential = InferSelectModel<typeof totpCredentialTable>;

export const totpCredentialTableRelations = relations(
  totpCredentialTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [totpCredentialTable.userId],
      references: [userTable.id],
    }),
  })
);

export default totpCredentialTable;
