import { z } from "zod";
import { SECTORS } from "../enums/sector";
import { GENDERS } from "../enums/gender";
import { ETHNICITIES } from "../enums/ethnicity";

export const guestSchema = z.object({
  dob: z.coerce.date({ message: "Date of birth must be a valid date" }),

  region: z.string({ message: "Region must be defined" }).min(3),
  gender: z.enum(GENDERS, { message: "Gender must be defined" }),
  sector: z.enum(SECTORS, { message: "Sector must be a defined" }),
  ethnicity: z.enum(ETHNICITIES, {
    message: "Ethnicity must be a defined",
  }),
  notes: z.string().max(1000, "Notes can contains up to 1000 chars").optional(),
});

export type GuestType = z.infer<typeof guestSchema>;

export const guestSchemaDV: GuestType = {
  dob: new Date(2000, 0, 1),

  region: "",
  gender: undefined as unknown as GuestType["gender"],
  sector: undefined as unknown as GuestType["sector"],
  ethnicity: undefined as unknown as GuestType["ethnicity"],
  notes: "",
};
