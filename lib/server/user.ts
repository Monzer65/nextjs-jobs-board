"use server";
import { db } from "@/db";
import { decrypt, decryptToString, encrypt, encryptString } from "./encryption";
import { hashPassword } from "./password";
import { generateRandomRecoveryCode } from "@/lib/utils";
import userTable from "@/db/schema/user";
import { and, eq } from "drizzle-orm";

export interface User {
  id: number;
  email: string;
  phone?: string;
  username: string;
  name?: string;
  emailVerified: boolean;
  registered2FA: boolean;
  googleId?: string;
  picture?: string;
}

export async function verifyUsernameInput(username: string): Promise<boolean> {
  return (
    username.length > 3 && username.length < 32 && username.trim() === username
  );
}

export async function createUser(
  email: string,
  username: string,
  password: string,
  name?: string,
  googleId?: string,
  picture?: string
): Promise<User> {
  const passwordHash = await hashPassword(password);
  const recoveryCode = generateRandomRecoveryCode();
  const encryptedRecoveryCode = encryptString(recoveryCode);

  const rows = await db
    .insert(userTable)
    .values({
      email,
      username,
      password: passwordHash,
      name,
      googleId,
      picture,
      recoveryCode: Buffer.from(encryptedRecoveryCode),
    })
    .returning({ id: userTable.id });

  if (rows.length === 0) {
    throw new Error("Unexpected error");
  }

  const row = rows[0];
  const user = {
    id: row.id,
    email,
    username,
    name,
    googleId,
    picture,
    emailVerified: false,
    registered2FA: false,
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

export async function getUserPasswordHash(userId: number): Promise<string> {
  const row = await db
    .select({ password: userTable.password })
    .from(userTable)
    .where(eq(userTable.id, userId));
  if (row.length === 0) {
    throw new Error("Invalid user ID");
  }
  return row[0].password;
}

export async function getUserRecoverCode(
  userId: number
): Promise<string | null> {
  const row = await db
    .select({ recoveryCode: userTable.recoveryCode })
    .from(userTable)
    .where(eq(userTable.id, userId));
  if (row.length === 0) {
    throw new Error("Invalid user ID");
  }
  const recoveryCode = row[0].recoveryCode;
  if (recoveryCode === null) {
    return null;
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
    throw new Error("Invalid user ID");
  }
  const encrypted = row[0].totpKey;
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
  await db
    .update(userTable)
    .set({ totpKey: Buffer.from(encrypted) })
    .where(eq(userTable.id, userId));
}

export async function resetUserRecoveryCode(userId: number): Promise<string> {
  const recoveryCode = generateRandomRecoveryCode();
  const encrypted = encryptString(recoveryCode);
  await db
    .update(userTable)
    .set({ recoveryCode: Buffer.from(encrypted) })
    .where(eq(userTable.id, userId));
  return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const rows = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      username: userTable.username,
      email: userTable.email,
      picture: userTable.picture,
      emailVerified: userTable.emailVerified,
      registered2FA: userTable.registered2FA,
    })
    .from(userTable)
    .where(eq(userTable.email, email));
  if (rows.length === 0) {
    return null;
  }
  const user: User = {
    id: rows[0].id,
    username: rows[0].username || "",
    name: rows[0].name || "",
    email: rows[0].email || "",
    picture: rows[0].picture || "",
    emailVerified: rows[0].emailVerified,
    registered2FA: rows[0].registered2FA,
  };
  return user;
}

export async function getUserFromGoogleId(
  googleId: string
): Promise<User | null> {
  const rows = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      username: userTable.username,
      email: userTable.email,
      googleId: userTable.googleId,
      picture: userTable.picture,
      emailVerified: userTable.emailVerified,
      registered2FA: userTable.registered2FA,
    })
    .from(userTable)
    .where(eq(userTable.googleId, googleId));
  if (rows.length === 0) {
    return null;
  }

  const user: User = {
    id: rows[0].id,
    username: rows[0].username || "",
    name: rows[0].name || "",
    googleId: rows[0].googleId || "",
    email: rows[0].email || "",
    picture: rows[0].picture || "",
    emailVerified: rows[0].emailVerified,
    registered2FA: rows[0].registered2FA,
  };
  return user;
}
