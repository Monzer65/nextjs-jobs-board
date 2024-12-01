"use server";
import { db } from "@/db";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { generateRandomOTP } from "@/lib/utils";
import { cookies } from "next/headers";

import type { User } from "./user";
import { passwordResetSessionTable, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createPasswordResetSession(
  token: string,
  userId: number,
  email: string
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: PasswordResetSession = {
    id: sessionId,
    userId,
    email,
    code: generateRandomOTP(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    emailVerified: false,
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
      passwordResetSessionId: passwordResetSessionTable.id,
      passwordResetSessionUserId: passwordResetSessionTable.userId,
      passwordResetSessionEmail: passwordResetSessionTable.email,
      passwordResetSessionCode: passwordResetSessionTable.code,
      passwordResetSessionExpiresAt: passwordResetSessionTable.expiresAt,
      passwordResetSessionEmailVerified:
        passwordResetSessionTable.emailVerified,
      passwordResetSessionTwoFactorVerified:
        passwordResetSessionTable.twoFactorVerified,
      userId: userTable.id,
      userEmail: userTable.email,
      userUsername: userTable.username,
      userEmailVerified: userTable.emailVerified,
      userTotpKey: userTable.totpKey,
    })
    .from(passwordResetSessionTable)
    .innerJoin(userTable, eq(userTable.id, passwordResetSessionTable.userId))
    .where(eq(passwordResetSessionTable.id, sessionId));

  if (rows.length < 1) {
    return { session: null, user: null };
  }
  const row = rows[0];

  // Mapping the session data
  const session: PasswordResetSession = {
    id: row.passwordResetSessionId,
    userId: row.passwordResetSessionUserId,
    email: row.passwordResetSessionEmail,
    code: row.passwordResetSessionCode,
    expiresAt: new Date(row.passwordResetSessionExpiresAt),
    emailVerified: Boolean(row.passwordResetSessionEmailVerified),
    twoFactorVerified: Boolean(row.passwordResetSessionTwoFactorVerified),
  };

  // Mapping the user data
  const user: User = {
    id: row.userId,
    email: row.userEmail || "",
    username: row.userUsername,
    emailVerified: Boolean(row.userEmailVerified),
    registered2FA: Boolean(row.userTotpKey),
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
  const result = validatePasswordResetSessionToken(token);
  if ((await result).session === null) {
    deletePasswordResetSessionTokenCookie();
  }
  return result;
}

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

export interface PasswordResetSession {
  id: string;
  userId: number;
  email: string;
  expiresAt: Date;
  code: string;
  emailVerified: boolean;
  twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null };
