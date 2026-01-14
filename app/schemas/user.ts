import { z } from "zod";
import { RoleType } from "@/convex/enums";

export const userSchema = z.object({
  _id: z.string(),
  _creationTime: z.number(),
  email: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional(),
  role: z.custom<RoleType>(),
  authUserId: z.string(),
  isVerified: z.boolean(),
});

export type UserType = z.infer<typeof userSchema>;
