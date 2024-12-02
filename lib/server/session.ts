"use server";
import { db } from "@/db";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";

import type { User } from "./user";
import sessionTable from "@/db/schema/session";
import userTable from "@/db/schema/user";
import { eq, sql } from "drizzle-orm";
import totpCredentialTable from "@/db/schema/totpCredential";
import securityKeyCredentialTable from "@/db/schema/securityCredential";
import passkeyCredentialTable from "@/db/schema/passkeyCredential";

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const rows = await db
    .select({
      sessionId: sessionTable.id,
      sessionUserId: sessionTable.userId,
      sessionExpiresAt: sessionTable.expiresAt,
      twoFactorVerified: sessionTable.twoFactorVerified,
      userId: userTable.id,
      email: userTable.email,
      phone: userTable.phone,
      username: userTable.username,
      emailVerified: userTable.emailVerified,
      phoneVerified: userTable.phoneVerified,
      registered2fa: userTable.registered2FA,
      registeredTOTP:
        sql`CASE WHEN ${totpCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredTOTP"
        ),
      registeredSecurityKey:
        sql`CASE WHEN ${securityKeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredSecurityKey"
        ),
      registeredPasskey:
        sql`CASE WHEN ${passkeyCredentialTable.id} IS NOT NULL THEN 1 ELSE 0 END`.as(
          "registeredPasskey"
        ),
    })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .leftJoin(
      totpCredentialTable,
      eq(sessionTable.userId, totpCredentialTable.userId)
    )
    .leftJoin(
      passkeyCredentialTable,
      eq(userTable.id, passkeyCredentialTable.userId)
    )
    .leftJoin(
      securityKeyCredentialTable,
      eq(userTable.id, securityKeyCredentialTable.userId)
    )
    .where(eq(sessionTable.id, sessionId))
    .limit(1);

  if (rows.length < 1) {
    return { session: null, user: null };
  }

  const row = rows[0];
  const session: Session = {
    id: row.sessionId,
    userId: row.sessionUserId,
    expiresAt: new Date(row.sessionExpiresAt),
    twoFactorVerified: Boolean(row.twoFactorVerified),
  };
  const user: User = {
    id: row.userId,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    fullname: row.username,
    username: row.username,
    emailVerified: row.emailVerified,
    phoneVerified: row.phoneVerified,
    registered2FA: row.registered2fa,
    registeredTOTP: Boolean(row.registeredTOTP),
    registeredPasskey: Boolean(row.registeredPasskey),
    registeredSecurityKey: Boolean(row.registeredSecurityKey),
  };

  if (
    user.registeredPasskey ||
    user.registeredSecurityKey ||
    user.registeredTOTP
  ) {
    user.registered2FA = true;
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({ expiresAt: new Date(Math.floor(session.expiresAt.getTime())) })
      .where(eq(sessionTable.id, session.id));
  }

  return { session, user };
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const token = (await cookies()).get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = validateSessionToken(token);
    return result;
  }
);

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateUserSessions(userId: number): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  (await cookies()).set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  (await cookies()).set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export async function generateSessionToken(): Promise<string> {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
  return token;
}

export async function createSession(
  token: string,
  userId: number,
  flags: SessionFlags
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    twoFactorVerified: flags.twoFactorVerified,
  };
  await db.insert(sessionTable).values(session);
  return session;
}

export async function setSessionAs2FAVerified(
  sessionId: string
): Promise<void> {
  await db
    .update(sessionTable)
    .set({ twoFactorVerified: true })
    .where(eq(sessionTable.id, sessionId));
}

export interface SessionFlags {
  twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
  id: string;
  expiresAt: Date;
  userId: number;
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
