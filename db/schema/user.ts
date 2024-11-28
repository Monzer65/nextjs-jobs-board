import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const user = pgTable("user", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).unique(),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  emailVerified: boolean("email_verified").notNull().default(false),
  confirmationCode: varchar("confirmation_code", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
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

export default user;
