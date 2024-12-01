import { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  customType,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const customBytea = customType<{
  data: Buffer; // The type used in application code
  driverData: Buffer; // The type stored in the database
}>({
  dataType() {
    return "bytea"; // PostgreSQL's bytea type
  },
  toDriver(value: Buffer): Buffer {
    return value; // Directly pass the buffer to the database
  },
  fromDriver(value: Buffer): Buffer {
    return value; // Return the buffer from the database
  },
});

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).notNull(),
  picture: varchar("picture", { length: 255 }),
  phone: varchar("phone", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).unique(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  emailVerified: boolean("email_verified").notNull().default(false),
  confirmationCode: varchar("confirmation_code", { length: 255 }),
  registered2FA: boolean("registered_2fa").notNull().default(false),
  password: varchar("password", { length: 255 }).notNull(),
  totpKey: customBytea("totp_key"),
  recoveryCode: customBytea("recovery_code"),
  role: text()
    .$type<"super_admin" | "admin" | "moderator" | "support" | "user">()
    .notNull()
    .default("user"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login").defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = InferSelectModel<typeof userTable>;

export default userTable;
