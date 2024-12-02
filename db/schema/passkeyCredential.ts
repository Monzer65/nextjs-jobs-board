import { integer, pgTable, text } from "drizzle-orm/pg-core";
import userTable, { customBytea } from "./user";
import { InferSelectModel, relations } from "drizzle-orm";

const passkeyCredentialTable = pgTable("pass_key_credential", {
  id: customBytea("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  name: text("name").notNull(),
  algorithm: integer("algorithm").notNull(),
  publicKey: customBytea("public_key").notNull(),
});

export type PassKeyCredential = InferSelectModel<typeof passkeyCredentialTable>;

export const passkeyCredentialTableRelations = relations(
  passkeyCredentialTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [passkeyCredentialTable.userId],
      references: [userTable.id],
    }),
  })
);

export default passkeyCredentialTable;
