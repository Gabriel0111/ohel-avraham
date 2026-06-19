import { z } from "zod";
import { SECTORS } from "../enums/sector";
import { GENDERS } from "../enums/gender";
import { ETHNICITIES } from "../enums/ethnicity";
import type { ValidationMessages } from "@/lib/i18n/translations";

export const buildGuestSchema = (m: ValidationMessages) =>
  z.object({
    dob: z.coerce.date({ message: m.dobInvalid }),

    region: z.string({ message: m.regionInvalid }).min(3, m.regionInvalid),
    gender: z.literal(GENDERS, { message: m.genderRequired }),
    sector: z.literal(SECTORS, { message: m.sectorRequired }),
    ethnicity: z.literal(ETHNICITIES, { message: m.ethnicityRequired }),
    languages: z.array(z.string()).optional(),
    notes: z.string().max(1000, m.notesTooLong).optional(),
  });

export type GuestType = z.infer<ReturnType<typeof buildGuestSchema>>;

export const guestSchemaDV: GuestType = {
  dob: new Date(2000, 0, 1),

  region: "",
  gender: undefined as unknown as GuestType["gender"],
  sector: undefined as unknown as GuestType["sector"],
  ethnicity: undefined as unknown as GuestType["ethnicity"],
  languages: [],
  notes: "",
};
