"use server";
import { db } from "@/db";
import { decryptToString, encryptString } from "./encryption";
import { ExpiringTokenBucket } from "./rate-limit";
import { generateRandomRecoveryCode } from "@/lib/utils";
import { sessionTable, userTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const totpBucket = new ExpiringTokenBucket(5, 60 * 30);
export const recoveryCodeBucket = new ExpiringTokenBucket(3, 60 * 60);

export async function resetUser2FAWithRecoveryCode(
  userId: number,
  recoveryCode: string
): Promise<boolean> {
  // Note: In Postgres and MySQL, these queries should be done in a transaction using SELECT FOR UPDATE
  const rows = await db
    .select({
      recoveryCode: userTable.recoveryCode,
    })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);

  if (rows.length < 1) {
    return false;
  }

  const row = rows[0];

  const encryptedRecoveryCode = row.recoveryCode;
  if (!encryptedRecoveryCode) {
    return false;
  }
  const userRecoveryCode = decryptToString(encryptedRecoveryCode);
  if (recoveryCode !== userRecoveryCode) {
    return false;
  }

  const newRecoveryCode = generateRandomRecoveryCode();
  const encryptedNewRecoveryCode = encryptString(newRecoveryCode);
  await db
    .update(sessionTable)
    .set({
      twoFactorVerified: false,
    })
    .where(eq(sessionTable.userId, userId));

  const result = await db
    .update(userTable)
    .set({
      recoveryCode: Buffer.from(encryptedNewRecoveryCode),
      totpKey: null,
    })
    .where(
      and(
        eq(userTable.id, userId),
        eq(userTable.recoveryCode, encryptedRecoveryCode)
      )
    );

  return result.rowCount > 0;
}
