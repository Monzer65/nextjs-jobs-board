"use server";

import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { confirmationSchema, signupSchema } from "@/zod-schemas/user";
import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "@/lib/server/request";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  SessionFlags,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { userTable } from "@/db/schema/user";
import { verifyPasswordStrength } from "@/lib/server/password";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/lib/server/email-verification";
import { createUser } from "@/lib/server/user";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
};

// const sendVerificationEmail = async (contact: string, otp: string) => {
//   try {
//     const verificationLink = `http://localhost:3000/auth/verify?email=${encodeURIComponent(
//       contact
//     )}&otp=${otp}`;

//     const transporter = nodemailer.createTransport({
//       host: "smtp.zoho.com",
//       port: 465,
//       auth: {
//         user: process.env.EMAIL_ADDRESS,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: `"جابزی 👻" <exclusiveautoparts.shop@zohomail.com>`,
//       to: contact,
//       subject: "کد تایید حساب کاربری",
//       html: `
//       <!DOCTYPE html>
//       <html lang="fa" dir="rtl">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>تایید حساب کاربری جابزی</title>
//         <style>
//           body {
//             font-family: 'Tahoma', Arial, sans-serif;
//             background-color: #f4f4f9;
//             color: #333;
//             margin: 0;
//             padding: 0;
//           }
//           .container {
//             max-width: 600px;
//             margin: 30px auto;
//             padding: 20px;
//             background-color: #ffffff;
//             border-radius: 8px;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//             text-align: right;
//           }
//           .header {
//             text-align: center;
//             padding: 10px 0;
//           }
//           .header h1 {
//             font-size: 24px;
//             color: #333;
//           }
//           .message {
//             font-size: 16px;
//             line-height: 1.6;
//             color: #555;
//             margin-bottom: 20px;
//           }
//           .otp {
//             display: inline-block;
//             font-size: 22px;
//             font-weight: bold;
//             color: #ffffff;
//             background-color: #007bff;
//             padding: 10px 20px;
//             border-radius: 4px;
//             margin: 20px 0;
//             text-align: center;
//           }
//           .link {
//             display: block;
//             text-align: center;
//             font-size: 16px;
//             font-weight: bold;
//             color: #ffffff;
//             background-color: #28a745;
//             padding: 10px 15px;
//             border-radius: 4px;
//             text-decoration: none;
//             margin-top: 20px;
//           }
//           .footer {
//             text-align: center;
//             font-size: 12px;
//             color: #999;
//             margin-top: 20px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>تایید حساب کاربری جابزی</h1>
//           </div>
//           <div class="message">
//             <p>این ایمیل برای تایید حساب کاربری شما در جابزی ارسال شده است.</p>
//             <p>برای تکمیل فرایند ثبت‌نام، از کد زیر استفاده کنید:</p>
//           </div>
//           <div class="otp">${otp}</div>
//           <p>یا می‌توانید با کلیک بر روی لینک زیر، حساب کاربری خود را تایید کنید:</p>
//           <a href="${verificationLink}" class="link">تایید حساب کاربری</a>
//           <div class="footer">
//             <p>اگر این درخواست توسط شما انجام نشده، این ایمیل را نادیده بگیرید.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//       `,
//     });
//     return info.messageId;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Error sending verification email");
//   }
// };

export async function verifyOtpAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const fields: Record<string, string> = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value.toString()])
  );
  const parsed = confirmationSchema.safeParse(formData);
  console.log("data:", parsed.data);
  if (!parsed.success) {
    console.error("Validation Error:", parsed.error.issues);
    return {
      message: "داده های ورودی نامعتبر است",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const { email, phone, otp } = parsed.data;

  const conditions = [];

  if (email) {
    conditions.push(eq(userTable.email, email));
  }

  if (phone) {
    conditions.push(eq(userTable.phone, phone));
  }

  if (conditions.length === 0) {
    return { message: "ایمیل و یا تلفن باید موجود باشد" };
  }

  const queryCondition =
    conditions.length > 1 ? or(...conditions) : conditions[0];
  try {
    const existingUser = await db
      .select()
      .from(userTable)
      .where(queryCondition);

    if (existingUser.length === 0) {
      if (email) {
        return {
          message: "کاربری با این ایمیل وجود ندارد",
          fields,
          success: false,
        };
      }
      return {
        message: "کاربری با این شماره موبایل وجود ندارد",
        fields,
        success: false,
      };
    }

    if (
      (email && existingUser[0].emailVerified === true) ||
      (phone && existingUser[0].phoneVerified === true)
    ) {
      return {
        message: `این ${
          email ? `ایمیل: ${email}` : `تلفن: ${phone}`
        } قبلا تایید شده است`,
      };
    }

    if (existingUser[0].confirmationCode === otp) {
      if (phone && existingUser[0].phone === phone) {
        await db
          .update(userTable)
          .set({ phoneVerified: true, confirmationCode: null })
          .where(eq(userTable.id, existingUser[0].id));
      } else if (email && existingUser[0].email === email) {
        await db
          .update(userTable)
          .set({ emailVerified: true, confirmationCode: null })
          .where(eq(userTable.id, existingUser[0].id));
      }

      return {
        message: "تایید شد",
        success: true,
      };
    } else {
      return {
        message: "کد تایید نامعتبر است",
        success: false,
      };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      message: "خطا در تایید کد",
      success: false,
    };
  }
}

interface ActionResult {
  message: string;
}

export async function logoutAction(
  prevState: FormState,
  data: FormData
): Promise<ActionResult> {
  console.log("logoutData", data);
  console.log("logoutPrevState", prevState);

  if (!globalPOSTRateLimit()) {
    return {
      message: "Too many requests",
    };
  }
  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }
  invalidateSession(session.id);
  deleteSessionTokenCookie();
  return redirect("/auth/login");
}

// import { TokenBucket } from "@/lib/server/rate-limit";
// import { createWebAuthnChallenge } from "@/lib/server/webauthn";
// import { encodeBase64 } from "@oslojs/encoding";
// import { headers } from "next/headers";

// const webauthnChallengeRateLimitBucket = new TokenBucket<string>(30, 10);

// export async function createWebAuthnChallengeAction(): Promise<string> {
//   console.log("create");
//   const clientIP = (await headers()).get("X-Forwarded-For");
//   if (
//     clientIP !== null &&
//     !webauthnChallengeRateLimitBucket.consume(clientIP, 1)
//   ) {
//     throw new Error("Too many requests");
//   }
//   const challenge = createWebAuthnChallenge();
//   return encodeBase64(challenge);
// }
