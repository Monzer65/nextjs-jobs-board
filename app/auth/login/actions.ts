"use server";

import { verifyPasswordHash } from "@/lib/server/password";
import { globalPOSTRateLimit } from "@/lib/server/request";
import {
  createSession,
  generateSessionToken,
  SessionFlags,
  setSessionTokenCookie,
} from "@/lib/server/session";
import {
  getUserFromEmail,
  getUserFromPhone,
  getUserPasswordHash,
} from "@/lib/server/user";
import { redirect } from "next/navigation";

// import { verifyEmailInput } from "@/lib/server/email";
// import { verifyPasswordHash } from "@/lib/server/password";
import { Throttler, RefillingTokenBucket } from "@/lib/server/rate-limit";
import { headers } from "next/headers";
import { loginSchema } from "@/zod-schemas/user";
// import {
//   createSession,
//   generateSessionToken,
//   setSessionTokenCookie,
// } from "@/lib/server/session";
// import { getUserFromEmail, getUserPasswordHash } from "@/lib/server/user";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import {
//   ClientDataType,
//   coseAlgorithmES256,
//   coseAlgorithmRS256,
//   createAssertionSignatureMessage,
//   parseAuthenticatorData,
//   parseClientDataJSON,
// } from "@oslojs/webauthn";
// import { ObjectParser } from "@pilcrowjs/object-parser";
// import { decodeBase64 } from "@oslojs/encoding";
// import {
//   getPasskeyCredential,
//   verifyWebAuthnChallenge,
// } from "@/lib/server/webauthn";
// import {
//   decodePKIXECDSASignature,
//   decodeSEC1PublicKey,
//   p256,
//   verifyECDSASignature,
// } from "@oslojs/crypto/ecdsa";
// import { sha256 } from "@oslojs/crypto/sha2";
// import {
//   decodePKCS1RSAPublicKey,
//   sha256ObjectIdentifier,
//   verifyRSASSAPKCS1v15Signature,
// } from "@oslojs/crypto/rsa";
// import { get2FARedirect } from "@/lib/server/2fa";
// import { globalPOSTRateLimit } from "@/lib/server/request";

// import type { SessionFlags } from "@/lib/server/session";
// import type { AuthenticatorData, ClientData } from "@oslojs/webauthn";

const throttler = new Throttler<number>([1, 2, 4, 8, 16, 30, 60, 180, 300]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);
interface ActionResult {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
}

export async function loginAction(
  _prev: ActionResult,
  data: FormData
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "تعداد درخواست های شما بیش از حد مجاز است",
      success: false,
    };
  }
  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      message: "تعداد درخواست های شما بیش از حد مجاز است",
    };
  }

  const formData = Object.fromEntries(data);
  const parsed = loginSchema.safeParse(formData);
  const fields: Record<string, string> = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value.toString()])
  );

  console.log("Form fields:", fields);
  if (!parsed.success) {
    console.error("Validation Error:", parsed.error.issues);
    return {
      message: "داده های ورودی نامعتبر است",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const { email, phone, password } = parsed.data;

  if (email && phone) {
    return {
      message: "لطفا فقط یکی از فیلد های ایمیل یا تلفن را وارد کنید و نه هردو",
    };
  }
  if (!email && !phone) {
    return {
      message: "لطفا یکی از فیلد های ایمیل یا تلفن را وارد کنید",
    };
  }
  let user;
  if (email) user = await getUserFromEmail(email);
  else if (phone) user = await getUserFromPhone(phone);

  if (user === null || !user) {
    return {
      message: "کاربری با این مشخصات یافت نشد",
      success: false,
    };
  }
  if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
    return {
      message: "تعداد درخواست های شما بیش از حد مجاز است",
    };
  }
  if (!throttler.consume(user.id)) {
    return {
      message: "تعداد درخواست های شما بیش از حد مجاز است",
    };
  }
  const passwordHash = await getUserPasswordHash(user.id);
  const validPassword = await verifyPasswordHash(passwordHash, password);
  if (!validPassword) {
    return {
      message: "پسورد اشتباه است",
      success: false,
    };
  }
  throttler.reset(user.id);
  const sessionFlags: SessionFlags = {
    twoFactorVerified: false,
  };
  const sessionToken = await generateSessionToken();
  const session = await createSession(sessionToken, user.id, sessionFlags);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  if (email && !user.emailVerified) {
    return redirect("/auth/verify-email");
  } else if (phone && !user.phoneVerified) {
    return redirect("/auth/verify-phone");
  }
  if (!user.registered2FA) {
    return redirect("/2fa/setup");
  }
  return redirect("/");
}

// export async function loginWithPasskeyAction(
//   data: unknown
// ): Promise<ActionResult> {
//   if (!globalPOSTRateLimit()) {
//     return {
//       message: "تعداد درخواست های شما بیش از حد مجاز است",",
//     };
//   }

//   const parser = new ObjectParser(data);
//   let encodedAuthenticatorData: string;
//   let encodedClientDataJSON: string;
//   let encodedCredentialId: string;
//   let encodedSignature: string;
//   try {
//     encodedAuthenticatorData = parser.getString("authenticator_data");
//     encodedClientDataJSON = parser.getString("client_data_json");
//     encodedCredentialId = parser.getString("credential_id");
//     encodedSignature = parser.getString("signature");
//   } catch {
//     return {
//       message: "Invalid or missing fields",
//     };
//   }
//   let authenticatorDataBytes: Uint8Array;
//   let clientDataJSON: Uint8Array;
//   let credentialId: Uint8Array;
//   let signatureBytes: Uint8Array;
//   try {
//     authenticatorDataBytes = decodeBase64(encodedAuthenticatorData);
//     clientDataJSON = decodeBase64(encodedClientDataJSON);
//     credentialId = decodeBase64(encodedCredentialId);
//     signatureBytes = decodeBase64(encodedSignature);
//   } catch {
//     return {
//       message: "Invalid or missing fields",
//     };
//   }

//   let authenticatorData: AuthenticatorData;
//   try {
//     authenticatorData = parseAuthenticatorData(authenticatorDataBytes);
//   } catch {
//     return {
//       message: "Invalid data",
//     };
//   }
//   // TODO: Update host
//   if (!authenticatorData.verifyRelyingPartyIdHash("localhost")) {
//     return {
//       message: "Invalid data",
//     };
//   }
//   if (!authenticatorData.userPresent || !authenticatorData.userVerified) {
//     return {
//       message: "Invalid data",
//     };
//   }

//   let clientData: ClientData;
//   try {
//     clientData = parseClientDataJSON(clientDataJSON);
//   } catch {
//     return {
//       message: "Invalid data",
//     };
//   }
//   if (clientData.type !== ClientDataType.Get) {
//     return {
//       message: "Invalid data",
//     };
//   }

//   if (!verifyWebAuthnChallenge(clientData.challenge)) {
//     return {
//       message: "Invalid data",
//     };
//   }
//   // TODO: Update origin
//   if (clientData.origin !== "http://localhost:3000") {
//     return {
//       message: "Invalid data",
//     };
//   }
//   if (clientData.crossOrigin !== null && clientData.crossOrigin) {
//     return {
//       message: "Invalid data",
//     };
//   }

//   const credential = getPasskeyCredential(credentialId);
//   if (credential === null) {
//     return {
//       message: "Invalid credential",
//     };
//   }

//   let validSignature: boolean;
//   if (credential.algorithmId === coseAlgorithmES256) {
//     const ecdsaSignature = decodePKIXECDSASignature(signatureBytes);
//     const ecdsaPublicKey = decodeSEC1PublicKey(p256, credential.publicKey);
//     const hash = sha256(
//       createAssertionSignatureMessage(authenticatorDataBytes, clientDataJSON)
//     );
//     validSignature = verifyECDSASignature(ecdsaPublicKey, hash, ecdsaSignature);
//   } else if (credential.algorithmId === coseAlgorithmRS256) {
//     const rsaPublicKey = decodePKCS1RSAPublicKey(credential.publicKey);
//     const hash = sha256(
//       createAssertionSignatureMessage(authenticatorDataBytes, clientDataJSON)
//     );
//     validSignature = verifyRSASSAPKCS1v15Signature(
//       rsaPublicKey,
//       sha256ObjectIdentifier,
//       hash,
//       signatureBytes
//     );
//   } else {
//     return {
//       message: "Internal error",
//     };
//   }

//   if (!validSignature) {
//     return {
//       message: "Invalid signature",
//     };
//   }
//   const sessionFlags: SessionFlags = {
//     twoFactorVerified: true,
//   };
//   const sessionToken = generateSessionToken();
//   const session = createSession(sessionToken, credential.userId, sessionFlags);
//   setSessionTokenCookie(sessionToken, sessionTable.expiresAt);
//   return redirect("/");
// }
