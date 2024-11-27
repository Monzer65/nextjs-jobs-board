import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "@/db/schema";

config({ path: ".env" });

export const connection = neon(process.env.DATABASE_URL!);
export const db = drizzle(connection, { schema, logger: false });
export type Db = typeof db;

export default db;
