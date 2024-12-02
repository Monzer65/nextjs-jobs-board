"use server";
import { generateRandomOTP } from "@/lib/utils";
import { db } from "@/db";
import { ExpiringTokenBucket } from "./rate-limit";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { cookies } from "next/headers";
import { getCurrentSession } from "./session";
import { cache } from "react";
import { and, eq } from "drizzle-orm";
import emailVerificationRequestTable from "@/db/schema/emailVerification";
import nodemailer from "nodemailer";

export async function getUserEmailVerificationRequest(
  userId: number,
  id: string
): Promise<EmailVerificationRequest | null> {
  const rows = await db
    .select({
      id: emailVerificationRequestTable.id,
      userId: emailVerificationRequestTable.userId,
      code: emailVerificationRequestTable.code,
      email: emailVerificationRequestTable.email,
      expiresAt: emailVerificationRequestTable.expiresAt,
    })
    .from(emailVerificationRequestTable)
    .where(
      and(
        eq(emailVerificationRequestTable.id, id),
        eq(emailVerificationRequestTable.userId, userId)
      )
    );

  if (rows.length < 1) {
    return rows[0];
  }

  const row = rows[0];
  const request: EmailVerificationRequest = {
    id: row.id,
    userId: row.userId,
    code: row.code,
    email: row.email,
    expiresAt: new Date(row.expiresAt),
  };
  return request;
}

export async function createEmailVerificationRequest(
  userId: number,
  email: string
): Promise<EmailVerificationRequest> {
  deleteUserEmailVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32LowerCaseNoPadding(idBytes);

  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
  await db
    .insert(emailVerificationRequestTable)
    .values({
      id,
      userId,
      code,
      email,
      expiresAt,
    })
    .returning({ id: emailVerificationRequestTable.id });

  const request: EmailVerificationRequest = {
    id,
    userId,
    code,
    email,
    expiresAt,
  };
  return request;
}

export async function deleteUserEmailVerificationRequest(
  userId: number
): Promise<void> {
  await db
    .delete(emailVerificationRequestTable)
    .where(eq(emailVerificationRequestTable.userId, userId));
}

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<void> {
  console.log(`To ${email}: Your verification code is ${code}`);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"جابزی 👻" <exclusiveautoparts.shop@zohomail.com>`,
      to: email,
      subject: "کد تایید حساب کاربری",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Tahoma', Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">کد تایید حساب کاربری</h1>
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
              برای تایید حساب کاربری خود، کد زیر را وارد کنید:
            </p>
            <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; text-align: center;">
              <h2 style="color: #333; font-size: 20px; margin-bottom: 10px;">${code}</h2>
            </div>
            <p style="font-size: 14px; color: #777; margin-top: 20px;">
              اگر این درخواست برای شما نبود، لطفاً این ایمیل را نادیده بگیرید.
            </p>
            <p style="font-size: 14px; color: #777; margin-top: 20px;">
              با تشکر
            </p>
          </div>
        </body>
      </html>
      `,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending verification email");
  }
}

export async function setEmailVerificationRequestCookie(
  request: EmailVerificationRequest
): Promise<void> {
  (await cookies()).set("email_verification", request.id, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: request.expiresAt,
  });
}

export async function deleteEmailVerificationRequestCookie(): Promise<void> {
  (await cookies()).set("email_verification", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export const getCurrentUserEmailVerificationRequest = cache(async () => {
  const { user } = await getCurrentSession();
  if (user === null) {
    return null;
  }
  const id = (await cookies()).get("email_verification")?.value ?? null;
  if (id === null) {
    return null;
  }
  const request = getUserEmailVerificationRequest(user.id, id);
  if (request === null) {
    deleteEmailVerificationRequestCookie();
  }
  return request;
});

export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(
  3,
  60 * 10
);

export interface EmailVerificationRequest {
  id: string;
  userId: number;
  code: string;
  email: string;
  expiresAt: Date;
}
