import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOTP() {
  // Generate a random OTP of 6 digits
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}
