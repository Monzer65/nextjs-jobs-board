import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomOTP(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const code = encodeBase32UpperCaseNoPadding(bytes);
  return code;
}

export function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
  return recoveryCode;
}

export function generateOTP(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const num = new DataView(bytes.buffer).getUint32(0) % 1000000;
  return num.toString().padStart(6, "0");
}

export function generateSecureOTP(): string {
  const max = 10 ** 6; // 1000000
  const bytes = new Uint8Array(2); // 2 bytes = 16 bits, enough for numbers up to 65535
  let otp: number;

  do {
    crypto.getRandomValues(bytes);
    otp = (bytes[0] << 8) | bytes[1]; // Combine the two bytes into a single number
  } while (otp >= max); // Retry if the number exceeds the range

  return otp.toString().padStart(6, "0"); // Ensure it's 6 digits with leading zeros
}
