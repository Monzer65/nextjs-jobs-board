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

export const customBytea = customType<{
  data: Uint8Array; // The type used in application code
  driverData: Buffer; // The type stored in the database
}>({
  dataType() {
    return "bytea"; // PostgreSQL's bytea type
  },
  toDriver(value: Uint8Array): Buffer {
    return Buffer.from(value); // Convert Uint8Array to Buffer for storage
  },
  fromDriver(value: Buffer): Uint8Array {
    return new Uint8Array(value); // Convert Buffer to Uint8Array when retrieving
  },
});

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  fullname: varchar("fullname", { length: 255 }),
  username: varchar("username", { length: 255 }).notNull().unique(),
  picture: varchar("picture", { length: 255 }),
  phone: varchar("phone", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).unique(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  emailVerified: boolean("email_verified").notNull().default(false),
  registeredTOTP: boolean("registered_totp").notNull().default(false),
  registeredPasskey: boolean("registered_passkey").notNull().default(false),
  registeredSecurityKey: boolean("registered_securitykey")
    .notNull()
    .default(false),
  registered2FA: boolean("registered_2fa").notNull().default(false),
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
