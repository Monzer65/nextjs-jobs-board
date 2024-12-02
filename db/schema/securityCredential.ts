import { integer, pgTable, text } from "drizzle-orm/pg-core";
import userTable, { customBytea } from "./user";
import { InferSelectModel, relations } from "drizzle-orm";

const securityKeyCredentialTable = pgTable("security_key_credential", {
  id: customBytea("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  name: text("name").notNull(),
  algorithm: integer("algorithm").notNull(),
  publicKey: customBytea("public_key").notNull(),
});

export type SecurityKeyCredential = InferSelectModel<
  typeof securityKeyCredentialTable
>;

export const securityKeyCredentialTableRelations = relations(
  securityKeyCredentialTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [securityKeyCredentialTable.userId],
      references: [userTable.id],
    }),
  })
);

export default securityKeyCredentialTable;
