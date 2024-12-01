"use server";

import { headers } from "next/headers";
import { RefillingTokenBucket } from "./rate-limit";

const globalBucket = new RefillingTokenBucket<string>(100, 1);

export async function globalGETRateLimit(): Promise<boolean> {
  // Note: Assumes X-Forwarded-For will always be defined.
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP === null) {
    return true;
  }
  return globalBucket.consume(clientIP, 1);
}

export async function globalPOSTRateLimit(): Promise<boolean> {
  // Note: Assumes X-Forwarded-For will always be defined.
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP === null) {
    return true;
  }
  return globalBucket.consume(clientIP, 3);
}

// "use server";
// import { headers } from "next/headers";
// import { TokenBucket } from "./rate-limit";

// export async function globalGETRateLimit(): Promise<boolean> {
//   // // Note: Assumes X-Forwarded-For will always be defined.
//   const clientIP = (await headers()).get("X-Forwarded-For");
//   if (clientIP === null) {
//     return true;
//   }
//   const bucket = new TokenBucket("global_ip", 10, 2);
//   const valid = await bucket.consume(clientIP, 1);
//   if (!valid) {
//     throw new Error("Too many requests");
//   }
//   return valid;
// }

// export async function globalPOSTRateLimit(): Promise<boolean> {
//   // Note: Assumes X-Forwarded-For will always be defined.
//   const clientIP = (await headers()).get("X-Forwarded-For");
//   if (clientIP === null) {
//     return true;
//   }
//   const bucket = new TokenBucket("global_ip", 10, 2);
//   const valid = await bucket.consume(clientIP, 3);
//   if (!valid) {
//     throw new Error("Too many requests");
//   }
//   return valid;
// }
