import { db } from "@/db";

import { ExpiringTokenBucket } from "./rate-limit";
import { decryptToString, encryptString } from "./encryption";
import { and, eq } from "drizzle-orm";
import { generateRandomRecoveryCode } from "../utils";
import { sessionTable, userTable } from "@/db/schema";
import totpCredentialTable from "@/db/schema/totpCredential";
import passkeyCredentialTable from "@/db/schema/passkeyCredential";
import securityKeyCredentialTable from "@/db/schema/securityCredential";
import { User } from "./user";

export const recoveryCodeBucket = new ExpiringTokenBucket<number>(3, 60 * 60);

export async function resetUser2FAWithRecoveryCode(
  userId: number,
  recoveryCode: string
): Promise<boolean> {
  "use server";

  const existingUser = await db
    .select({ recoveryCode: userTable.recoveryCode })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);

  if (!existingUser.length) {
    return false;
  }

  const encryptedRecoveryCode = existingUser[0].recoveryCode;
  if (!encryptedRecoveryCode) {
    return false;
  }
  const userRecoveryCode = decryptToString(encryptedRecoveryCode);

  if (recoveryCode !== userRecoveryCode) {
    return false;
  }

  const newRecoveryCode = generateRandomRecoveryCode();
  const encryptedNewRecoveryCode = encryptString(newRecoveryCode);

  try {
    await db.transaction(async (trx) => {
      const updateResult = await trx
        .update(userTable)
        .set({ recoveryCode: encryptedNewRecoveryCode })
        .where(
          and(
            eq(userTable.id, userId),
            eq(userTable.recoveryCode, encryptedRecoveryCode)
          )
        );

      if (updateResult.rowCount < 1) {
        throw new Error("Recovery code mismatch or user not found.");
      }

      await trx
        .update(sessionTable)
        .set({ twoFactorVerified: false })
        .where(eq(sessionTable.userId, userId));
      await trx
        .delete(totpCredentialTable)
        .where(eq(totpCredentialTable.userId, userId));
      await trx
        .delete(passkeyCredentialTable)
        .where(eq(passkeyCredentialTable.userId, userId));
      await trx
        .delete(securityKeyCredentialTable)
        .where(eq(securityKeyCredentialTable.userId, userId));
    });
  } catch (e) {
    console.error("Transaction failed:", e);
    return false;
  }

  return true;
}

export function get2FARedirect(user: User): string {
  if (user.registeredPasskey) {
    return "/auth/2fa/passkey";
  }
  if (user.registeredSecurityKey) {
    return "/auth/2fa/security-key";
  }
  if (user.registeredTOTP) {
    return "/auth/2fa/totp";
  }
  return "/auth/2fa/setup";
}

export function getPasswordReset2FARedirect(user: User): string {
  if (user.registeredPasskey) {
    return "/auth/reset-password/2fa/passkey";
  }
  if (user.registeredSecurityKey) {
    return "/auth/reset-password/2fa/security-key";
  }
  if (user.registeredTOTP) {
    return "/auth/reset-password/2fa/totp";
  }
  return "/auth/2fa/setup";
}
