"use server";

// import { eq, or } from "drizzle-orm";
// import { db } from "@/db";
import { signupSchema } from "@/zod-schemas/user";
// import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "@/lib/server/request";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
// import { userTable } from "@/db/schema/user";
// import { verifyPasswordStrength } from "@/lib/server/password";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/lib/server/email-verification";
import { checkUsernameAvailability, createUser } from "@/lib/server/user";
import type { SessionFlags } from "@/lib/server/session";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { headers } from "next/headers";
import { checkEmailAvailability } from "@/lib/server/email";
import { checkPhoneAvailability } from "@/lib/server/phone";
import {
  createPhoneVerificationRequest,
  sendVerificationSMS,
  setPhoneVerificationRequestCookie,
} from "@/lib/server/phone-verification";

export interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
}

const ipBucket = new RefillingTokenBucket<string>(3, 60);

export async function signupAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  if (!(await globalPOSTRateLimit())) {
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
  console.log("fields", fields);

  if (!parsed.success) {
    console.error("Validation Error:", parsed.error.issues);
    return {
      message: "داده های ورودی نامعتبر است",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const { username, email, phone, password } = parsed.data;

  try {
    if (email && phone) {
      return {
        message:
          "لطفا فقط یکی از فیلد های ایمیل یا تلفن را وارد کنید و نه هردو",
      };
    }

    const usernameAvailable = await checkUsernameAvailability(username);
    if (!usernameAvailable) {
      return {
        message: "این نام کاربری قبلا ثبت شده است",
      };
    }

    if (email && !phone) {
      const emailAvailable = await checkEmailAvailability(email);
      if (!emailAvailable) {
        return {
          message: "این ایمیل قبلا ثبت شده است",
        };
      }
    } else if (phone && !email) {
      const phoneAvailable = await checkPhoneAvailability(phone);
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

    const user = await createUser(
      username,
      password,
      email!,
      phone!,
      undefined,
      undefined,
      undefined
    );

    if (email && !phone) {
      const emailVerificationRequest = await createEmailVerificationRequest(
        user.id,
        user.email!
      );
      await sendVerificationEmail(
        emailVerificationRequest.email,
        emailVerificationRequest.code
      );
      await setEmailVerificationRequestCookie(emailVerificationRequest);
    } else if (phone && !email) {
      const phoneVerificationRequest = await createPhoneVerificationRequest(
        user.id,
        user.phone!
      );
      await sendVerificationSMS(
        phoneVerificationRequest.phone,
        phoneVerificationRequest.code
      );
      await setPhoneVerificationRequestCookie(phoneVerificationRequest);
    }

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
  return {
    message: "ثبت نام با موفقیت انجام شد",
    success: true,
  };
}
