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

const bucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export async function verifyPhoneAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "Forbidden",
    };
  }
  if (!bucket.check(user.id, 1)) {
    return {
      message: "Too many requests",
    };
  }

  let verificationRequest = await getCurrentUserPhoneVerificationRequest();
  if (verificationRequest === null) {
    return {
      message: "Not authenticated",
    };
  }
  const code = formData.get("code");
  if (typeof code !== "string") {
    return {
      message: "Invalid or missing fields",
    };
  }
  if (code === "") {
    return {
      message: "Enter your code",
    };
  }
  if (!bucket.consume(user.id, 1)) {
    return {
      message: "Too many requests",
    };
  }
  if (Date.now() >= verificationRequest.expiresAt.getTime()) {
    verificationRequest = await createPhoneVerificationRequest(
      verificationRequest.userId,
      verificationRequest.phone
    );
    await sendVerificationSMS(
      verificationRequest.phone,
      verificationRequest.code
    );
    return {
      message:
        "The verification code was expired. We sent another code to your inbox.",
    };
  }
  if (verificationRequest.code !== code) {
    return {
      message: "Incorrect code.",
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
  if (!globalPOSTRateLimit()) {
    return {
      message: "Too many requests",
    };
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "Forbidden",
    };
  }
  if (!sendVerificationPhoneBucket.check(user.id, 1)) {
    return {
      message: "Too many requests",
    };
  }
  let verificationRequest = await getCurrentUserPhoneVerificationRequest();

  if (verificationRequest === null) {
    if (user.phoneVerified) {
      return {
        message: "Forbidden",
      };
    }
    if (!sendVerificationPhoneBucket.consume(user.id, 1)) {
      return {
        message: "Too many requests",
      };
    }
    if (user.phone === null || user.phone === undefined) {
      return {
        message: "User phone is missing",
      };
    }
    verificationRequest = await createPhoneVerificationRequest(
      user.id,
      user.phone
    );
  } else {
    if (!sendVerificationPhoneBucket.consume(user.id, 1)) {
      return {
        message: "Too many requests",
      };
    }
    verificationRequest = await createPhoneVerificationRequest(
      user.id,
      verificationRequest.phone
    );
  }
  await sendVerificationSMS(
    verificationRequest.phone,
    verificationRequest.code
  );
  await setPhoneVerificationRequestCookie(verificationRequest);
  return {
    message: "A new code was sent to your inbox.",
  };
}

interface ActionResult {
  message: string;
}
