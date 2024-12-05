"use server";
import db from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { normalizePhone } from "../utils";

export async function checkPhoneAvailability(phone: string): Promise<boolean> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return false; // Invalid phone number

  const results = await db
    .select({ id: userTable.id }) // Only select necessary fields
    .from(userTable)
    .where(eq(userTable.phone, normalizedPhone))
    .limit(1); // Fetch at most 1 record

  return results.length === 0; // Phone is available if no rows are returned
}
