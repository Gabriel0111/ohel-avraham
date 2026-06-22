import { z } from "zod";
import type { ValidationMessages } from "@/lib/i18n/translations";

// Built from the active language's messages (mirrors buildSignInSchema) so
// validation errors are localized.
export const buildForgotPasswordSchema = (m: ValidationMessages) =>
  z.object({
    email: z.email(m.emailInvalid),
  });

export type ForgotPasswordSchema = z.infer<
  ReturnType<typeof buildForgotPasswordSchema>
>;

export const forgotPasswordSchemaDV: ForgotPasswordSchema = {
  email: "",
};
