"use server";
import { generateRandomOTP } from "@/lib/utils";
import { db } from "@/db";
import { ExpiringTokenBucket } from "./rate-limit";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { cookies } from "next/headers";
import { getCurrentSession } from "./session";
import { cache } from "react";
import { and, eq } from "drizzle-orm";
import phoneVerificationRequestTable from "@/db/schema/phoneVerification";

export async function getUserPhoneVerificationRequest(
  userId: number,
  id: string
): Promise<PhoneVerificationRequest | null> {
  const rows = await db
    .select({
      id: phoneVerificationRequestTable.id,
      userId: phoneVerificationRequestTable.userId,
      code: phoneVerificationRequestTable.code,
      phone: phoneVerificationRequestTable.phone,
      expiresAt: phoneVerificationRequestTable.expiresAt,
    })
    .from(phoneVerificationRequestTable)
    .where(
      and(
        eq(phoneVerificationRequestTable.id, id),
        eq(phoneVerificationRequestTable.userId, userId)
      )
    );

  if (rows.length < 1) {
    return rows[0];
  }

  const row = rows[0];
  const request: PhoneVerificationRequest = {
    id: row.id,
    userId: row.userId,
    code: row.code,
    phone: row.phone,
    expiresAt: new Date(row.expiresAt),
  };
  return request;
}

export async function createPhoneVerificationRequest(
  userId: number,
  phone: string
): Promise<PhoneVerificationRequest> {
  deleteUserPhoneVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32LowerCaseNoPadding(idBytes);

  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
  await db
    .insert(phoneVerificationRequestTable)
    .values({
      id,
      userId,
      code,
      phone,
      expiresAt,
    })
    .returning({ id: phoneVerificationRequestTable.id });

  const request: PhoneVerificationRequest = {
    id,
    userId,
    code,
    phone,
    expiresAt,
  };
  return request;
}

export async function deleteUserPhoneVerificationRequest(
  userId: number
): Promise<void> {
  await db
    .delete(phoneVerificationRequestTable)
    .where(eq(phoneVerificationRequestTable.userId, userId));
}

export async function sendVerificationPhone(
  phone: string,
  code: string
): Promise<void> {
  console.log(`To ${phone}: Your verification code is ${code}`);
  try {
    console.log("code sent to the phone:");
  } catch (error) {
    console.error("Error sending text:", error);
    throw new Error("Error sending verification code to the phone");
  }
}

export async function setPhoneVerificationRequestCookie(
  request: PhoneVerificationRequest
): Promise<void> {
  (await cookies()).set("phone_verification", request.id, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: request.expiresAt,
  });
}

export async function deletePhoneVerificationRequestCookie(): Promise<void> {
  (await cookies()).set("phone_verification", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export const getCurrentUserPhoneVerificationRequest = cache(async () => {
  const { user } = await getCurrentSession();
  if (user === null) {
    return null;
  }
  const id = (await cookies()).get("phone_verification")?.value ?? null;
  if (id === null) {
    return null;
  }
  const request = getUserPhoneVerificationRequest(user.id, id);
  if (request === null) {
    deletePhoneVerificationRequestCookie();
  }
  return request;
});

export const sendVerificationPhoneBucket = new ExpiringTokenBucket<number>(
  3,
  60 * 10
);

export interface PhoneVerificationRequest {
  id: string;
  userId: number;
  code: string;
  phone: string;
  expiresAt: Date;
}
