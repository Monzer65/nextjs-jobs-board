import db from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const phoneRegex = /^(?:\+98|0098|98|0)?(9[0-9]{9})$/;

export function verifyPhoneInput(phone: string): boolean {
  return phoneRegex.test(phone) && phone.length < 256;
}

export async function checkPhoneAvailability(phone: string): Promise<boolean> {
  "use server";

  const results = await db
    .select({ id: userTable.id }) // Only select necessary fields
    .from(userTable)
    .where(eq(userTable.phone, phone))
    .limit(1); // Fetch at most 1 record

  return results.length === 0; // Phone is available if no rows are returned
}
