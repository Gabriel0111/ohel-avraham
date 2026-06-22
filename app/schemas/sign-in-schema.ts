import { z } from "zod";
import type { ValidationMessages } from "@/lib/i18n/translations";

// Built from the active language's messages (mirrors buildHostSchema /
// buildGuestSchema) so validation errors are localized.
export const buildSignInSchema = (m: ValidationMessages) =>
  z.object({
    email: z.email(m.emailInvalid),
    password: z.string().min(8, m.passwordMin),
  });

export type SignInSchema = z.infer<ReturnType<typeof buildSignInSchema>>;

export const signInSchemaDV: SignInSchema = {
  email: "",
  password: "",
};
