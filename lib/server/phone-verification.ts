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
  "use server";

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
  "use server";

  await deleteUserPhoneVerificationRequest(userId);
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
  "use server";

  await db
    .delete(phoneVerificationRequestTable)
    .where(eq(phoneVerificationRequestTable.userId, userId));
}

export async function sendVerificationSMS(
  phone: string,
  code: string
): Promise<void> {
  const SMS_USERNAME = process.env.SMS_USERNAME;
  const SMS_PASSWORD = process.env.SMS_PASSWORD;
  try {
    const url = "https://webone-sms.ir/SMSInOutBox/Send";
    const data = {
      UserName: SMS_USERNAME,
      Password: SMS_PASSWORD,
      From: "10002147",
      To: phone,
      Message: `کد تایید شما ${code} جابزی`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to send SMS");
    }
  } catch (error) {
    console.error("Error sending text:", error);
    throw new Error("Error sending verification code to the phone");
  }
}

export async function setPhoneVerificationRequestCookie(
  request: PhoneVerificationRequest
): Promise<void> {
  "use server";

  (await cookies()).set("phone_verification", request.id, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: request.expiresAt,
  });
}

export async function deletePhoneVerificationRequestCookie(): Promise<void> {
  "use server";

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
  const request = await getUserPhoneVerificationRequest(user.id, id);
  if (request === null) {
    await deletePhoneVerificationRequestCookie();
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
