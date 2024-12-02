"use server";

import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { confirmationSchema, signupSchema } from "@/zod-schemas/user";
import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "@/lib/server/request";
import {
  createSession,
  generateSessionToken,
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
import type { SessionFlags } from "@/lib/server/session";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { headers } from "next/headers";
import { checkEmailAvailability } from "@/lib/server/email";
import { checkPhoneAvailability } from "@/lib/server/phone";

export interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
}

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function signupAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  if (!globalPOSTRateLimit()) {
    return {
      message: "تعداد درخواست های شما بیش از حد مجاز است",
    };
  }

  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = (await headers()).get("X-Forwarded-For");
  // console.log("clientIP", clientIP);
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      message: "تعداد درخواست های شما بیش از حد مجاز است",
    };
  }

  const formData = Object.fromEntries(data);
  const parsed = signupSchema.safeParse(formData);
  const fields: Record<string, string> = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value.toString()])
  );

  if (!parsed.success) {
    console.error("Validation Error:", parsed.error.issues);
    return {
      message: "داده های ورودی نامعتبر است",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const { username, email, phone, password, contactMethod } = parsed.data;

  try {
    if (email && !phone) {
      const emailAvailable = checkEmailAvailability(email);
      if (!emailAvailable) {
        return {
          message: "این ایمیل قبلا ثبت شده است",
        };
      }
    } else if (phone && !email) {
      const phoneAvailable = checkPhoneAvailability(phone);
      if (!phoneAvailable) {
        return {
          message: "این تلفن قبلا ثبت شده است",
        };
      }
    }

    // const strongPassword = await verifyPasswordStrength(password);
    // if (!strongPassword) {
    //   return {
    //     message: "پسورد ضعیف است. لطفا پسورد قوی تری انتخاب کنید",
    //   };
    // }
    if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
      return {
        message: "تعداد درخواست های شما بیش از حد مجاز است",
      };
    }

    const user = await createUser(email || "", username, password);
    const emailVerificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email || ""
    );
    await sendVerificationEmail(
      emailVerificationRequest.email,
      emailVerificationRequest.code
    );
    await setEmailVerificationRequestCookie(emailVerificationRequest);

    const sessionFlags: SessionFlags = {
      twoFactorVerified: false,
    };
    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, user.id, sessionFlags);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      message: "خطا در ثبت کاربر",
      success: false,
    };
  }

  let queryParam = "";

  if (email) {
    queryParam = `email=${encodeURIComponent(email)}`;
  } else if (phone) {
    queryParam = `phone=${encodeURIComponent(phone)}`;
  }

  redirect(`/auth/verify?${queryParam}`);
}

async function checkExistingUser(
  contactMethod: string,
  email: string | undefined,
  phone: string | undefined,
  fields: Record<string, string>
): Promise<FormState | null> {
  let existingUser;
  let verifiedUser = false;

  if (contactMethod === "email" && email) {
    existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));
    verifiedUser =
      existingUser.length > 0 && existingUser[0].emailVerified === true;
  } else if (contactMethod === "phone" && phone) {
    existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.phone, phone));
    verifiedUser =
      existingUser.length > 0 && existingUser[0].phoneVerified === true;
  }

  if (existingUser && existingUser.length > 0) {
    return verifiedUser
      ? {
          message: "کاربر با این شماره موبایل یا ایمیل وجود دارد",
          fields,
          success: false,
        }
      : {
          message: "کاربر قبلا ثبت نام کرده اما هنوز تایید نشده است",
          fields,
          success: false,
        };
  }

  return null;
}
