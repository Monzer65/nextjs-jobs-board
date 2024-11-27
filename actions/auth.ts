"use server";

import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { confirmatioSchema, signupSchema } from "@/zod-schemas/user";
import bcrypt from "bcryptjs";
import { user } from "@/db/schema";
import { redirect } from "next/navigation";
import { generateOTP } from "@/lib/utils";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
};

export async function signupAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const fields: Record<string, string> = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value.toString()])
  );

  const parsed = signupSchema.safeParse(formData);
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
    const existingUser = await checkExistingUser(
      contactMethod,
      email ?? undefined,
      phone ?? undefined,
      fields
    );
    if (existingUser) {
      return existingUser;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      phone: phone || null,
      email: email || null,
      confirmationCode: generateOTP().toString(),
      password: hashedPassword,
    };

    await db.insert(user).values(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      message: "خطا در ثبت کاربر",
      success: false,
    };
  }
  redirect(
    `/auth/verify?${email ? "email" : "phone"}=${
      email?.toString() || phone?.toString()
    }`
  );
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
    existingUser = await db.select().from(user).where(eq(user.email, email));
    verifiedUser =
      existingUser.length > 0 && existingUser[0].emailVerified === true;
  } else if (contactMethod === "phone" && phone) {
    existingUser = await db.select().from(user).where(eq(user.phone, phone));
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

export async function verifyOtpAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const fields: Record<string, string> = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value.toString()])
  );
  const parsed = confirmatioSchema.safeParse(formData);

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
    conditions.push(eq(user.email, email));
  }

  if (phone) {
    conditions.push(eq(user.phone, phone));
  }

  if (conditions.length === 0) {
    throw new Error("Either email or phone must be provided");
  }

  // Use `or` to combine conditions if both are provided
  const queryCondition =
    conditions.length > 1 ? or(...conditions) : conditions[0];
  try {
    const existingUser = await db.select().from(user).where(queryCondition);

    if (existingUser.length === 0) {
      return {
        message: "کاربری با این شماره موبایل یا ایمیل وجود ندارد",
        fields,
        success: false,
      };
    }

    if (existingUser[0].confirmationCode === otp) {
      if (phone && existingUser[0].phone === phone) {
        await db
          .update(user)
          .set({ phoneVerified: true })
          .where(eq(user.id, existingUser[0].id));
      } else if (email && existingUser[0].email === email) {
        await db
          .update(user)
          .set({ emailVerified: true })
          .where(eq(user.id, existingUser[0].id));
      }

      await db
        .update(user)
        .set({ confirmationCode: null })
        .where(eq(user.id, existingUser[0].id));

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
