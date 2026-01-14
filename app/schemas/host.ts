import { z } from "zod";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { KASHROUT } from "@/app/enums/kashrout";

export const hostSchema = z.object({
  dob: z.coerce.date({ message: "Date of birth must be a valid date" }),
  phoneNumber: z
    .string({ message: "Phone number must be a valid phone number" })
    .min(9)
    .regex(/^[0-9\-+()\s]+$/, "Invalid phone number"),

  address: z.string({ message: "Address must be defined" }).min(5),
  floor: z.coerce.number(),

  hasDisabilityAccess: z.boolean({
    message: "Disability access must be defined",
  }),

  kashrout: z.enum(KASHROUT, { message: "Kashrout must be defined" }),

  sector: z.enum(SECTORS, { message: "Sector must be a defined" }),
  ethnicity: z.enum(ETHNICITIES, { message: "Ethnicity must be a defined" }),

  notes: z.string().max(1000, "Notes can contains up to 1000 chars").optional(),
});

export type HostType = z.infer<typeof hostSchema>;

export const hostSchemaDV: HostType = {
  dob: new Date(2000, 0, 1),

  phoneNumber: "",
  address: "",
  floor: 0,

  hasDisabilityAccess: false,

  kashrout: undefined as unknown as HostType["kashrout"],
  sector: undefined as unknown as HostType["sector"],
  ethnicity: undefined as unknown as HostType["ethnicity"],

  notes: "",
};
