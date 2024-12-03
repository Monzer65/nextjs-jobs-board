"use server";
import { db } from "@/db";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { generateRandomOTP } from "@/lib/utils";
import { cookies } from "next/headers";

import type { User } from "./user";
import { passwordResetSessionTable, userTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import totpCredentialTable from "@/db/schema/totpCredential";
import passkeyCredentialTable from "@/db/schema/passkeyCredential";
import securityKeyCredentialTable from "@/db/schema/securityCredential";
import { cache } from "react";

export async function createPasswordResetSession(
  token: string,
  userId: number,
  email?: string,
  phone?: string
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: PasswordResetSession = {
    id: sessionId,
    userId,
    email,
    phone,
    code: generateRandomOTP(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    emailVerified: false,
    phoneVerified: false,
    twoFactorVerified: false,
  };

  await db.insert(passwordResetSessionTable).values(session);

  return session;
}

export async function validatePasswordResetSessionToken(
  token: string
): Promise<PasswordResetSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const rows = await db
    .select({
      sessionId: passwordResetSessionTable.id,
      userId: passwordResetSessionTable.userId,
      email: passwordResetSessionTable.email,
      phone: passwordResetSessionTable.phone,
      code: passwordResetSessionTable.code,
      expiresAt: passwordResetSessionTable.expiresAt,
      emailVerified: passwordResetSessionTable.emailVerified,
      phoneVerified: passwordResetSessionTable.phoneVerified,
      twoFactorVerified: passwordResetSessionTable.twoFactorVerified,
      userIdFromUser: userTable.id,
      userEmail: userTable.email,
      userPhone: userTable.phone,
      username: userTable.username,
      userFullname: userTable.fullname,
      userEmailVerified: userTable.emailVerified,
      userPhoneVerified: userTable.phoneVerified,
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
    .from(passwordResetSessionTable)
    .innerJoin(userTable, eq(passwordResetSessionTable.userId, userTable.id))
    .leftJoin(totpCredentialTable, eq(userTable.id, totpCredentialTable.userId))
    .leftJoin(
      passkeyCredentialTable,
      eq(userTable.id, passkeyCredentialTable.userId)
    )
    .leftJoin(
      securityKeyCredentialTable,
      eq(userTable.id, securityKeyCredentialTable.userId)
    )
    .where(eq(passwordResetSessionTable.id, sessionId))
    .limit(1);

  if (rows.length < 1) {
    return { session: null, user: null };
  }
  const row = rows[0];

  // Mapping the session data
  const session: PasswordResetSession = {
    id: row.sessionId,
    userId: row.userId,
    email: row.email || undefined,
    phone: row.phone || undefined,
    code: row.code,
    expiresAt: new Date(row.expiresAt),
    emailVerified: !!row.emailVerified,
    phoneVerified: !!row.phoneVerified,
    twoFactorVerified: !!row.twoFactorVerified,
  };

  const user: User = {
    id: row.userIdFromUser,
    email: row.userEmail || undefined,
    phone: row.userPhone || undefined,
    username: row.username,
    fullname: row.userFullname || undefined,
    emailVerified: !!row.userEmailVerified,
    phoneVerified: !!row.userPhoneVerified,
    registeredTOTP: !!row.registeredTOTP,
    registeredPasskey: !!row.registeredPasskey,
    registeredSecurityKey: !!row.registeredSecurityKey,
    registered2FA: !!(
      row.registeredTOTP ||
      row.registeredPasskey ||
      row.registeredSecurityKey
    ),
  };

  if (Date.now() >= session.expiresAt.getTime()) {
    await db
      .delete(passwordResetSessionTable)
      .where(eq(passwordResetSessionTable.id, session.id));
    return { session: null, user: null };
  }
  return { session, user };
}

export async function setPasswordResetSessionAsEmailVerified(
  sessionId: string
): Promise<void> {
  await db
    .update(passwordResetSessionTable)
    .set({
      emailVerified: true,
    })
    .where(eq(passwordResetSessionTable.id, sessionId));
}
export async function setPasswordResetSessionAsPhoneVerified(
  sessionId: string
): Promise<void> {
  await db
    .update(passwordResetSessionTable)
    .set({
      phoneVerified: true,
    })
    .where(eq(passwordResetSessionTable.id, sessionId));
}

export async function setPasswordResetSessionAs2FAVerified(
  sessionId: string
): Promise<void> {
  await db
    .update(passwordResetSessionTable)
    .set({
      twoFactorVerified: true,
    })
    .where(eq(passwordResetSessionTable.id, sessionId));
}

export async function invalidateUserPasswordResetSessions(
  userId: number
): Promise<void> {
  await db
    .delete(passwordResetSessionTable)
    .where(eq(passwordResetSessionTable.userId, userId));
}

export async function validatePasswordResetSessionRequest(): Promise<PasswordResetSessionValidationResult> {
  const token = (await cookies()).get("password_reset_session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validatePasswordResetSessionToken(token);
  if (result.session === null) {
    await deletePasswordResetSessionTokenCookie();
  }
  return result;
}

export const getCurrentPasswordResetSession = cache(async () => {
  const token = (await cookies()).get("password_reset_session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validatePasswordResetSessionToken(token);
  if (result.session === null) {
    await deletePasswordResetSessionTokenCookie();
  }
  return result;
});

export async function setPasswordResetSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  (await cookies()).set("password_reset_session", token, {
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function deletePasswordResetSessionTokenCookie(): Promise<void> {
  (await cookies()).set("password_reset_session", "", {
    maxAge: 0,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

// use nodemailer here I think
export async function sendPasswordResetEmail(
  email: string,
  code: string
): Promise<void> {
  console.log(`To ${email}: Your reset code is ${code}`);
}
export async function sendPasswordResetSMS(
  phone: string,
  code: string
): Promise<void> {
  console.log(`To ${phone}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
  id: string;
  userId: number;
  email?: string;
  phone?: string;
  expiresAt: Date;
  code: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null };
