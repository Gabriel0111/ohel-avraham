import { z } from "zod";
import { SECTORS } from "@/app/enums/sector";
import { ETHNICITIES } from "@/app/enums/ethnicity";
import { KASHROUT } from "@/app/enums/kashrout";
import type { ValidationMessages } from "@/lib/i18n/translations";

export const buildHostSchema = (m: ValidationMessages) =>
  z.object({
    dob: z.coerce.date({ message: m.dobInvalid }),
    phoneNumber: z
      .string({ message: m.phoneInvalid })
      .min(9, m.phoneInvalid)
      .regex(/^[0-9\-+()\s]+$/, m.phoneInvalid),

    address: z.string({ message: m.addressInvalid }).min(5, m.addressInvalid),
    lat: z.number().optional(),
    lng: z.number().optional(),
    floor: z.coerce.number(m.floorInvalid).int(m.floorInvalid).min(-5, m.floorInvalid).max(100, m.floorInvalid),

    hasDisabilityAccess: z.boolean({ message: m.disabilityRequired }),

    likesSinging: z.boolean().optional(),
    likesDivreiTorah: z.boolean().optional(),

    kashrout: z.enum(KASHROUT, { message: m.kashroutRequired }),

    sector: z.enum(SECTORS, { message: m.sectorRequired }),
    ethnicity: z.enum(ETHNICITIES, { message: m.ethnicityRequired }),

    languages: z.array(z.string()).optional(),

    notes: z.string().max(1000, m.notesTooLong).optional(),
  });

export type HostType = z.infer<ReturnType<typeof buildHostSchema>>;

export const hostSchemaDV: HostType = {
  dob: new Date(2000, 0, 1),

  phoneNumber: "",
  address: "",
  floor: 0,

  hasDisabilityAccess: false,

  likesSinging: false,
  likesDivreiTorah: false,

  kashrout: undefined as unknown as HostType["kashrout"],
  sector: undefined as unknown as HostType["sector"],
  ethnicity: undefined as unknown as HostType["ethnicity"],

  languages: [],

  notes: "",
};
