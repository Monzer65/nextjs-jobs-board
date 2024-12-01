"use server";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function verifyEmailInput(email: string): Promise<boolean> {
  return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(userTable)
    .where(eq(userTable.email, email));

  return count[0].count === 0; // Email is available if count is 0
}
