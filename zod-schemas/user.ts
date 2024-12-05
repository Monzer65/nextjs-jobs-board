import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import userTable from "@/db/schema/user";
import {
  emailVerificationRequestTable,
  phoneVerificationRequestTable,
} from "@/db/schema";

const messages = {
  required: "این فیلد اجباری است",
  invalid: "مقدار وارد شده نامعتبر است",
  unique: "این مقدار قبلاً استفاده شده است",
  username: "نام کاربری باید بیش‌ از ۳ کاراکتر باشد",
  invalid_username: "نام کاربری باید فقط شامل حروف، اعداد و _ باشد",
  email: "ایمیل وارد شده صحیح نیست",
  phone: "تلفن وارد شده صحیح نیست",
  boolean: "مقدار باید درست یا نادرست باشد",
  password: "رمز عبور باید حداقل ۸ کاراکتر باشد",
  confirm: "تکرار رمز عبور با رمز عبور مطابقت ندارد",
};

const emailRegex = /^.+@.+\..+$/;
const phoneRegex = /^(?:\+98|0098|98|0)?(9[0-9]{9})$/;
const usernameRegex =
  /^[^\s]+[a-zA-Z0-9_.-\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u06F0-\u06F9\u0660-\u0669]*$/;

export const isValiEmail = (email: string) => {
  return emailRegex.test(email);
};
export const isvalidPhone = (phone: string) => {
  return phoneRegex.test(phone);
};

export const signupInsertSchema = createInsertSchema(userTable, {
  username: (schema) =>
    schema.username
      .min(3, messages.username)
      .max(30, "نام کاربری نمی‌تواند بیش از ۳۰ کاراکتر باشد.")
      .regex(usernameRegex, messages.invalid_username),
  phone: (schema) => schema.phone.optional(),
  email: (schema) => schema.email.optional(),
  password: (schema) => schema.password.min(8, messages.password),
});

export const signupSchema = signupInsertSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.confirm,
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.email) {
        const isValid = isValiEmail(data.email);
        if (!isValid) {
          return false;
        }
        return !!data.email;
      }
      return true;
    },
    {
      message: messages.email,
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      if (data.phone) {
        const isValid = isvalidPhone(data.phone);
        if (!isValid) {
          return false;
        }
        return !!data.phone;
      }
      return true;
    },
    {
      message: messages.phone,
      path: ["phone"],
    }
  );

export const loginInsertSchema = createInsertSchema(userTable, {
  phone: (schema) => schema.phone.optional(),
  email: (schema) => schema.email.optional(),
  password: (schema) => schema.password.min(8, "رمز عبور صحیح نیست"),
});

export const loginSchema = loginInsertSchema
  .refine(
    (data) => {
      if (data.email) {
        const isValid = isValiEmail(data.email);
        if (!isValid) {
          return false;
        }
        return !!data.email;
      }
      return true;
    },
    {
      message: messages.email,
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      if (data.phone) {
        const isValid = isvalidPhone(data.phone);
        if (!isValid) {
          return false;
        }
        return !!data.phone;
      }
      return true;
    },
    {
      message: messages.phone,
      path: ["phone"],
    }
  );

export const emailVerificationSchema = createInsertSchema(
  emailVerificationRequestTable,
  {
    code: (schema) => schema.code.min(6, "کد وارد شده صحیح نیست"),
  }
);

export const phoneVerificationSchema = z.object({
  code: z.string(),
});
export const updateUserSchema = signupInsertSchema.partial();
export const selectUserSchema = createSelectSchema(userTable);
export type SignupInsertSchemaType = z.infer<typeof signupInsertSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type SelectUserSchemaType = z.infer<typeof selectUserSchema>;
export type LoginInsertSchemaType = z.infer<typeof loginInsertSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type EmailVerificationSchemaType = z.infer<
  typeof emailVerificationSchema
>;
export type PhoneVerificationSchemaType = z.infer<
  typeof phoneVerificationSchema
>;
