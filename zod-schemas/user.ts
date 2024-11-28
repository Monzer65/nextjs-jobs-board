import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import user from "@/db/schema/user";

const messages = {
  required: "این فیلد اجباری است",
  invalid: "مقدار وارد شده نامعتبر است",
  unique: "این مقدار قبلاً استفاده شده است",
  username: "نام کاربری باید بیش‌ از ۳ کاراکتر باشد",
  invalid_username: "نام کاربری باید فقط شامل حروف، اعداد و _ باشد",
  email: "ایمیل وارد شده صحیح نیست",
  phone: "تلفن وارد شده صحیح نیست",
  boolean: "مقدار باید درست یا نادرست باشد",
  password: "رمز عبور باید حداقل ۶ کاراکتر باشد",
  confirm: "تکرار رمز عبور با رمز عبور مطابقت ندارد",
};

export const userInsertSchema = createInsertSchema(user, {
  username: (schema) =>
    schema.username
      .min(3, messages.username)
      .max(30, "نام کاربری نمی‌تواند بیش از ۳۰ کاراکتر باشد.")
      .regex(
        /^[a-zA-Z0-9_\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u06F0-\u06F9\u0660-\u0669]+$/,
        messages.invalid_username
      ),
  phone: (schema) => schema.phone.optional(),
  email: (schema) => schema.email.optional(),
  password: (schema) => schema.password.min(6, messages.password),
});

export const signupSchema = userInsertSchema
  .extend({
    confirmPassword: z.string(),
    contactMethod: z.enum(["email", "phone"]),
    userType: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.confirm,
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.contactMethod === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(data.email || "");
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
      if (data.contactMethod === "phone") {
        const phoneRegex = /^(?:\+98|0098|98|0)?(9[0-9]{9})$/;
        const isValid = phoneRegex.test(data.phone || "");
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
  )
  .refine(
    (data) => {
      if (
        data.userType === "freelancer" ||
        data.userType === "job_seeker" ||
        data.userType === "employer"
      ) {
        return true;
      }
    },
    {
      message: "نوع کاربر را انتخاب کنید",
      path: ["userType"],
    }
  );

export const confirmationSchema = z
  .object({
    email: z.string().optional(),
    phone: z.string().optional(),
    otp: z.string().length(6, "کد تایید باید حداقل ۶ کاراکتر باشد"),
  })
  .refine(
    (data) => {
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(data.email);
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
        const phoneRegex = /^(?:\+98|0098|98|0)?(9[0-9]{9})$/;
        const isValid = phoneRegex.test(data.phone || "");
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

export const selectUserSchema = createSelectSchema(user);

export type UserInsertSchemaType = z.infer<typeof userInsertSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type ConfirmationSchemaType = z.infer<typeof confirmationSchema>;
export type SelectUserSchemaType = z.infer<typeof selectUserSchema>;
