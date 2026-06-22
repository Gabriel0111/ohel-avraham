import { z } from "zod";
import type { ValidationMessages } from "@/lib/i18n/translations";

// Built from the active language's messages (mirrors buildHostSchema /
// buildGuestSchema) so validation errors are localized.
export const buildSignUpSchema = (m: ValidationMessages) =>
  z
    .object({
      firstName: z.string().trim().min(2, m.firstNameMin),
      lastName: z.string().trim().min(2, m.lastNameMin),
      email: z.email(m.emailInvalid),
      password: z.string().min(8, m.passwordMin),
      confirmPassword: z.string().min(8, m.passwordMin),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: m.passwordsNoMatch,
      path: ["confirmPassword"],
    });

export type SignUpSchema = z.infer<ReturnType<typeof buildSignUpSchema>>;

export const signUpSchemaDV: SignUpSchema = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
