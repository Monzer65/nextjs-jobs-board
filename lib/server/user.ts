"use server";
import { db } from "@/db";
import { decrypt, decryptToString, encrypt, encryptString } from "./encryption";
import { hashPassword } from "./password";
import { generateRandomRecoveryCode, normalizePhone } from "@/lib/utils";
import userTable from "@/db/schema/user";
import { and, eq, sql } from "drizzle-orm";
import totpCredentialTable from "@/db/schema/totpCredential";
import passkeyCredentialTable from "@/db/schema/passkeyCredential";
import securityKeyCredentialTable from "@/db/schema/securityCredential";

export interface User {
  id: number;
  email?: string | null;
  phone?: string | null;
  username: string;
  fullname?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  registeredTOTP: boolean;
  registeredSecurityKey: boolean;
  registeredPasskey: boolean;
  registered2FA: boolean;
}

export async function createUser(
  username: string,
  password: string,
  email?: string,
  phone?: string,
  fullname?: string,
  googleId?: string,
  picture?: string
): Promise<User> {
  const normalizedPhone = phone ? normalizePhone(phone) : null;
  if (phone && !normalizedPhone) {
    throw new Error("تلفن نامعتبر است");
  }
  const passwordHash = await hashPassword(password);
  const recoveryCode = generateRandomRecoveryCode();
  const encryptedRecoveryCode = encryptString(recoveryCode);
  const values = {
    email: email?.toLowerCase() ?? null,
    phone: normalizedPhone,
    username,
    password: passwordHash,
    fullname: fullname ?? null,
    googleId: googleId ?? null,
    picture: picture ?? null,
    recoveryCode: encryptedRecoveryCode,
    emailVerified: false,
    phoneVerified: false,
    registeredTOTP: false,
    registeredSecurityKey: false,
    registeredPasskey: false,
    registered2FA: false,
  };

  const rows = await db.insert(userTable).values(values).returning();

  if (rows.length === 0) {
    throw new Error("خطا در ثبت کاربر");
  }

  const user: User = {
    id: rows[0].id,
    email: rows[0].email,
    phone: rows[0].phone,
    username: rows[0].username,
    fullname: rows[0].fullname,
    emailVerified: rows[0].emailVerified,
    phoneVerified: rows[0].phoneVerified,
    registeredTOTP: rows[0].registeredTOTP,
    registeredSecurityKey: rows[0].registeredSecurityKey,
    registeredPasskey: rows[0].registeredPasskey,
    registered2FA: rows[0].registered2FA,
  };

  return user;
}

export async function updateUserPassword(
  userId: number,
  password: string
): Promise<void> {
  const passwordHash = await hashPassword(password);

  await db
    .update(userTable)
    .set({ password: passwordHash })
    .where(eq(userTable.id, userId));
}

export async function updateUserEmailAndSetEmailAsVerified(
  userId: number,
  email: string
): Promise<void> {
  await db
    .update(userTable)
    .set({
      email,
      emailVerified: true,
    })
    .where(eq(userTable.id, userId));
}

export async function updateUserPhoneAndSetPhoneAsVerified(
  userId: number,
  phone: string
): Promise<void> {
  const normalizedPhone = normalizePhone(phone);
  await db
    .update(userTable)
    .set({
      phone: normalizedPhone,
      phoneVerified: true,
    })
    .where(eq(userTable.id, userId));
}

export async function setUserAsEmailVerifiedIfEmailMatches(
  userId: number,
  email: string
): Promise<boolean> {
  const result = await db
    .update(userTable)
    .set({
      emailVerified: true,
    })
    .where(and(eq(userTable.id, userId), eq(userTable.email, email)));
  return result.rowCount > 0;
}

export async function setUserAsPhoneVerifiedIfPhoneMatches(
  userId: number,
  phone: string
): Promise<boolean> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    throw new Error("تلفن نامعتبر است");
  }
  const result = await db
    .update(userTable)
    .set({
      phoneVerified: true,
    })
    .where(and(eq(userTable.id, userId), eq(userTable.phone, normalizedPhone)));
  return result.rowCount > 0;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
  const row = await db
    .select({ password: userTable.password })
    .from(userTable)
    .where(eq(userTable.id, userId));
  if (row.length === 0) {
    throw new Error("آیدی کاربر معتبر نیست");
  }
  return row[0].password;
}

export async function getUserRecoverCode(userId: number): Promise<string> {
  const row = await db
    .select({ recoveryCode: userTable.recoveryCode })
    .from(userTable)
    .where(eq(userTable.id, userId));
  if (row.length === 0) {
    throw new Error("آیدی کاربر نامعتبر است");
  }
  const recoveryCode = row[0].recoveryCode;
  if (recoveryCode === null) {
    throw new Error("کد بازیابی یافت نشد");
  }
  return decryptToString(recoveryCode);
}

export async function getUserTOTPKey(
  userId: number
): Promise<Uint8Array | null> {
  const row = await db
    .select({ totpKey: userTable.totpKey })
    .from(userTable)
    .where(eq(userTable.id, userId));
  if (row.length === 0) {
    throw new Error("آیدی کاربر نامعتبر است");
  }
  const encrypted = row[0].totpKey;
  return encrypted ? decrypt(encrypted) : null;
}

export async function updateUserTOTPKey(
  userId: number,
  key: Uint8Array
): Promise<void> {
  const encrypted = encrypt(key);
  await db
    .update(userTable)
    .set({ totpKey: encrypted })
    .where(eq(userTable.id, userId));
}

export async function resetUserRecoveryCode(userId: number): Promise<string> {
  const recoveryCode = generateRandomRecoveryCode();
  const encrypted = encryptString(recoveryCode);
  await db
    .update(userTable)
    .set({ recoveryCode: encrypted })
    .where(eq(userTable.id, userId));
  return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const rows = await db
    .select({
      userId: userTable.id,
      email: userTable.email,
      username: userTable.username,
      emailVerified: userTable.emailVerified,
      phone: userTable.phone,
      phoneVerified: userTable.phoneVerified,
      fullname: userTable.fullname,
      registered2FA: userTable.registered2FA,
      registeredTOTP:
        sql`CASE WHEN ${totpCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredTOTP"
        ),
      registeredPasskey:
        sql`CASE WHEN ${passkeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredPasskey"
        ),
      registeredSecurityKey:
        sql`CASE WHEN ${securityKeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredSecurityKey"
        ),
    })
    .from(userTable)
    .leftJoin(totpCredentialTable, eq(userTable.id, totpCredentialTable.userId))
    .leftJoin(
      passkeyCredentialTable,
      eq(userTable.id, passkeyCredentialTable.userId)
    )
    .leftJoin(
      securityKeyCredentialTable,
      eq(userTable.id, securityKeyCredentialTable.userId)
    )
    .where(eq(userTable.email, email))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }
  const user: User = {
    id: rows[0].userId,
    email: rows[0].email ?? undefined,
    username: rows[0].username,
    emailVerified: rows[0].emailVerified,
    phone: rows[0].phone ?? undefined,
    phoneVerified: rows[0].phoneVerified,
    fullname: rows[0].fullname ?? undefined,
    registered2FA: rows[0].registered2FA,
    registeredTOTP: Boolean(rows[0].registeredTOTP),
    registeredPasskey: Boolean(rows[0].registeredPasskey),
    registeredSecurityKey: Boolean(rows[0].registeredSecurityKey),
  };
  if (
    user.registeredPasskey ||
    user.registeredSecurityKey ||
    user.registeredTOTP
  ) {
    user.registered2FA = true;
  }
  return user;
}

export async function getUserFromPhone(phone: string): Promise<User | null> {
  const rows = await db
    .select({
      userId: userTable.id,
      email: userTable.email,
      username: userTable.username,
      emailVerified: userTable.emailVerified,
      phone: userTable.phone,
      phoneVerified: userTable.phoneVerified,
      fullname: userTable.fullname,
      registered2FA: userTable.registered2FA,
      registeredTOTP:
        sql`CASE WHEN ${totpCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredTOTP"
        ),
      registeredPasskey:
        sql`CASE WHEN ${passkeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredPasskey"
        ),
      registeredSecurityKey:
        sql`CASE WHEN ${securityKeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredSecurityKey"
        ),
    })
    .from(userTable)
    .leftJoin(totpCredentialTable, eq(userTable.id, totpCredentialTable.userId))
    .leftJoin(
      passkeyCredentialTable,
      eq(userTable.id, passkeyCredentialTable.userId)
    )
    .leftJoin(
      securityKeyCredentialTable,
      eq(userTable.id, securityKeyCredentialTable.userId)
    )
    .where(eq(userTable.phone, phone))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }
  const user: User = {
    id: rows[0].userId,
    email: rows[0].email ?? undefined,
    username: rows[0].username,
    emailVerified: rows[0].emailVerified,
    phone: rows[0].phone ?? undefined,
    phoneVerified: rows[0].phoneVerified,
    fullname: rows[0].fullname ?? undefined,
    registered2FA: rows[0].registered2FA,
    registeredTOTP: Boolean(rows[0].registeredTOTP),
    registeredPasskey: Boolean(rows[0].registeredPasskey),
    registeredSecurityKey: Boolean(rows[0].registeredSecurityKey),
  };

  if (
    user.registeredPasskey ||
    user.registeredSecurityKey ||
    user.registeredTOTP
  ) {
    user.registered2FA = true;
  }

  return user;
}

export async function getUserFromUsername(
  username: string
): Promise<User | null> {
  const rows = await db
    .select({
      userId: userTable.id,
      email: userTable.email,
      username: userTable.username,
      emailVerified: userTable.emailVerified,
      phone: userTable.phone,
      phoneVerified: userTable.phoneVerified,
      fullname: userTable.fullname,
      registered2FA: userTable.registered2FA,
      registeredTOTP:
        sql`CASE WHEN ${totpCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredTOTP"
        ),
      registeredPasskey:
        sql`CASE WHEN ${passkeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredPasskey"
        ),
      registeredSecurityKey:
        sql`CASE WHEN ${securityKeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredSecurityKey"
        ),
    })
    .from(userTable)
    .leftJoin(totpCredentialTable, eq(userTable.id, totpCredentialTable.userId))
    .leftJoin(
      passkeyCredentialTable,
      eq(userTable.id, passkeyCredentialTable.userId)
    )
    .leftJoin(
      securityKeyCredentialTable,
      eq(userTable.id, securityKeyCredentialTable.userId)
    )
    .where(eq(userTable.username, username))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }
  const user: User = {
    id: rows[0].userId,
    email: rows[0].email ?? undefined,
    username: rows[0].username,
    emailVerified: rows[0].emailVerified,
    phone: rows[0].phone ?? undefined,
    phoneVerified: rows[0].phoneVerified,
    fullname: rows[0].fullname ?? undefined,
    registered2FA: rows[0].registered2FA,
    registeredTOTP: Boolean(rows[0].registeredTOTP),
    registeredPasskey: Boolean(rows[0].registeredPasskey),
    registeredSecurityKey: Boolean(rows[0].registeredSecurityKey),
  };

  if (
    user.registeredPasskey ||
    user.registeredSecurityKey ||
    user.registeredTOTP
  ) {
    user.registered2FA = true;
  }

  return user;
}

export async function checkUsernameAvailability(
  username: string
): Promise<boolean> {
  const results = await db
    .select({ id: userTable.id }) // Only select necessary fields
    .from(userTable)
    .where(eq(userTable.username, username))
    .limit(1); // Fetch at most 1 record

  return results.length === 0; // Username is available if no rows are returned
}
