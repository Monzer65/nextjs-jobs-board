"use server";
import db from "@/db";
import { userTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const phoneRegex = /^(?:\+98|0098|98|0)?(9[0-9]{9})$/;

export async function verifyPhoneInput(phone: string): Promise<boolean> {
  return phoneRegex.test(phone) && phone.length < 256;
}

export async function checkPhoneAvailability(phone: string): Promise<boolean> {
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(userTable)
    .where(eq(userTable.phone, phone));

  return count[0].count === 0; // Phone is available if count is 0
}
