import { z } from "zod";
import type { ValidationMessages } from "@/lib/i18n/translations";

// Built from the active language's messages (mirrors buildSignUpSchema) so
// validation errors are localized.
export const buildResetPasswordSchema = (m: ValidationMessages) =>
  z
    .object({
      password: z.string().min(8, m.passwordMin),
      confirmPassword: z.string().min(8, m.passwordMin),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: m.passwordsNoMatch,
      path: ["confirmPassword"],
    });

export type ResetPasswordSchema = z.infer<
  ReturnType<typeof buildResetPasswordSchema>
>;

export const resetPasswordSchemaDV: ResetPasswordSchema = {
  password: "",
  confirmPassword: "",
};
