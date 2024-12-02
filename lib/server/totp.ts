"use server";

import { db } from "@/db";
import { decrypt, encrypt } from "./encryption";
import { ExpiringTokenBucket, RefillingTokenBucket } from "./rate-limit";
import { eq } from "drizzle-orm";
import totpCredentialTable from "@/db/schema/totpCredential";

export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);
export const totpUpdateBucket = new RefillingTokenBucket<number>(3, 60 * 10);

export async function getUserTOTPKey(
  userId: number
): Promise<Uint8Array | null> {
  const rows = await db
    .select({
      key: totpCredentialTable.key,
    })
    .from(totpCredentialTable)
    .where(eq(totpCredentialTable.userId, userId));

  if (rows.length < 1) {
    throw new Error("آیدی نامعتبر است");
  }
  const encrypted = rows[0].key;
  if (encrypted === null) {
    return null;
  }
  return decrypt(encrypted);
}

export async function updateUserTOTPKey(
  userId: number,
  key: Uint8Array
): Promise<void> {
  const encrypted = encrypt(key);
  const encryptedBuffer = encrypted;

  try {
    await db.transaction(async (trx) => {
      await trx
        .delete(totpCredentialTable)
        .where(eq(totpCredentialTable.userId, userId));

      await trx.insert(totpCredentialTable).values({
        userId: userId,
        key: encryptedBuffer,
      });
    });
  } catch (e) {
    throw e;
  }
}

export async function deleteUserTOTPKey(userId: number): Promise<void> {
  await db
    .delete(totpCredentialTable)
    .where(eq(totpCredentialTable.userId, userId));
}
