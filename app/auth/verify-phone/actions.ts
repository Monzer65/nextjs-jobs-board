"use server";

import {
  createPhoneVerificationRequest,
  deletePhoneVerificationRequestCookie,
  deleteUserPhoneVerificationRequest,
  getCurrentUserPhoneVerificationRequest,
  sendVerificationSMS,
  sendVerificationPhoneBucket,
  setPhoneVerificationRequestCookie,
} from "@/lib/server/phone-verification";
import { invalidateUserPasswordResetSessions } from "@/lib/server/password-reset";
import { ExpiringTokenBucket } from "@/lib/server/rate-limit";
import { getCurrentSession } from "@/lib/server/session";
import { updateUserPhoneAndSetPhoneAsVerified } from "@/lib/server/user";
import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { phoneVerificationSchema } from "@/zod-schemas/user";

const bucket = new ExpiringTokenBucket<number>(5, 60 * 30);

interface ActionResult {
  message: string;
  success?: boolean;
  fields?: Record<string, string>;
  issues?: string[];
}
export async function verifyPhoneAction(
  _prev: ActionResult,
  data: FormData
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "تعداد درخواست‌های شما بیش از حد مجاز است",
      success: false,
    };
  }

  const formData = Object.fromEntries(data);
  const parsed = phoneVerificationSchema.safeParse(formData);
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

  const { code } = parsed.data;

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: "کاربر احراز هویت نشده است",
      success: false,
    };
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "ممنوع",
      success: false,
    };
  }
  if (!bucket.check(user.id, 1)) {
    return {
      message: "تعداد درخواست‌های شما بیش از حد مجاز است",
      success: false,
    };
  }

  let verificationRequest = await getCurrentUserPhoneVerificationRequest();
  if (verificationRequest === null) {
    return {
      message: "کاربر احراز هویت نشده است",
      success: false,
    };
  }
  // const code = formData.get("code");
  // if (typeof code !== "string") {
  //   return {
  //     message: "فیلدها ناقص و یا نامعتبر است",
  //     success: false,
  //   };
  // }
  // if (code === "") {
  //   return {
  //     message: "کد را وارد کنید",
  //     success: false,
  //   };
  // }
  if (!bucket.consume(user.id, 1)) {
    return {
      message: "تعداد درخواست‌های شما بیش از حد مجاز است",
      success: false,
    };
  }
  if (Date.now() >= verificationRequest.expiresAt.getTime()) {
    verificationRequest = await createPhoneVerificationRequest(
      verificationRequest.userId,
      verificationRequest.phone
    );
    // await sendVerificationSMS(
    //   verificationRequest.phone,
    //   verificationRequest.code
    // );
    return {
      message: "کد تایید منقضی شده است. یک کد دیگر برای شما ارسال شد",
      success: false,
    };
  }
  if (verificationRequest.code !== code) {
    return {
      message: "کد اشتباه است",
      success: false,
    };
  }
  await deleteUserPhoneVerificationRequest(user.id);
  await invalidateUserPasswordResetSessions(user.id);
  await updateUserPhoneAndSetPhoneAsVerified(
    user.id,
    verificationRequest.phone
  );
  await deletePhoneVerificationRequestCookie();
  if (!user.registered2FA) {
    return redirect("/auth/2fa/setup");
  }
  return redirect("/");
}

export async function resendPhoneVerificationCodeAction(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "تعداد درخواست‌های شما بیش از حد مجاز است",
      success: false,
    };
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: "کاربر احراز هویت نشده است",
      success: false,
    };
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "ممنوع",
      success: false,
    };
  }
  if (!sendVerificationPhoneBucket.check(user.id, 1)) {
    return {
      message: "تعداد درخواست‌های شما بیش از حد مجاز است",
      success: false,
    };
  }
  let verificationRequest = await getCurrentUserPhoneVerificationRequest();

  if (verificationRequest === null) {
    if (user.phoneVerified) {
      return {
        message: "ممنوع",
        success: false,
      };
    }
    if (!sendVerificationPhoneBucket.consume(user.id, 1)) {
      return {
        message: "تعداد درخواست‌های شما بیش از حد مجاز است",
        success: false,
      };
    }
    if (user.phone === null || user.phone === undefined) {
      return {
        message: "تلفن موجود نیست",
        success: false,
      };
    }
    verificationRequest = await createPhoneVerificationRequest(
      user.id,
      user.phone
    );
  } else {
    if (!sendVerificationPhoneBucket.consume(user.id, 1)) {
      return {
        message: "تعداد درخواست های شما بیش از حد مجاز است",
        success: false,
      };
    }

    if (verificationRequest.expiresAt.getTime() >= Date.now()) {
      console.log("ver-req-phone", verificationRequest);
      return {
        message: "کد شما هنوز فعال است. باید چند دقیقه صبر کنید",
        success: false,
      };
    }
    verificationRequest = await createPhoneVerificationRequest(
      user.id,
      verificationRequest.phone
    );
  }
  // await sendVerificationSMS(
  //   verificationRequest.phone,
  //   verificationRequest.code
  // );
  await setPhoneVerificationRequestCookie(verificationRequest);
  return {
    message: "کد جدید به شماره تلفن شما ارسال شد",
    success: true,
  };
}
