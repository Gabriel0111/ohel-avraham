import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signInSchemaDV: SignInSchema = {
  email: "",
  password: "",
};
