import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
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

export function generateRandomUsername(length: number = 8): string {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let username = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    username += characters[randomIndex];
  }
  return username;
}

export const generateRandomPassword = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return Array.from(randomBytes(length))
    .map((byte) => chars[byte % chars.length])
    .join("");
};

export function verifyEmailInput(email: string): boolean {
  return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export function normalizePhone(phone: string): string | null {
  const phoneRegex = /^(?:\+98|0098|98|0)?(9[0-9]{9})$/;
  const match = phone.match(phoneRegex);

  if (match) {
    // Normalize to international format: +989XXXXXXXXX
    return `+98${match[1]}`;
  }

  return null; // Return null if the phone number is invalid
}

export function verifyPhoneInput(phone: string): boolean {
  return normalizePhone(phone) !== null && phone.length < 256;
}
