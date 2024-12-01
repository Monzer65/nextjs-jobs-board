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
import { eq } from "drizzle-orm";

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const rows = await db
    .select({
      sessionId: sessionTable.id,
      sessionUserId: sessionTable.userId,
      sessionExpiresAt: sessionTable.expiresAt,
      session2FAVerified: sessionTable.twoFactorVerified,
      userId: userTable.id,
      userEmail: userTable.email,
      userUsername: userTable.username,
      userEmailVerified: userTable.emailVerified,
      userRegistered2FA: userTable.registered2FA,
      userHasTOTPKey: userTable.totpKey,
      googleId: userTable.googleId,
      name: userTable.name,
      picture: userTable.picture,
    })
    .from(sessionTable)
    .innerJoin(userTable, eq(userTable.id, sessionTable.userId))
    .where(eq(sessionTable.id, sessionId));

  if (rows.length < 1) {
    return { session: null, user: null };
  }

  const row = rows[0];
  const session: Session = {
    id: row.sessionId,
    userId: row.sessionUserId,
    expiresAt: new Date(row.sessionExpiresAt),
    twoFactorVerified: Boolean(row.session2FAVerified),
  };
  const user: User = {
    id: row.userId,
    email: row.userEmail || "",
    username: row.userUsername,
    emailVerified: Boolean(row.userEmailVerified),
    registered2FA: Boolean(row.userRegistered2FA),
    googleId: row.googleId || "",
    name: row.name || "",
    picture: row.picture || "",
  };

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    // Add 30 days (in milliseconds)
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    // Update the session expiration in the database
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
