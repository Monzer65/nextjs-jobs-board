"use server";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const results = await db
    .select({ id: userTable.id }) // Only select necessary fields
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1); // Fetch at most 1 record

  return results.length === 0; // Email is available if no rows are returned
}
