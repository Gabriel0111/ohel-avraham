import { SECTORS } from "../../app/enums/sector";
import { ETHNICITIES } from "../../app/enums/ethnicity";
import { KASHROUT } from "../../app/enums/kashrout";
import { LANGUAGE_VALUES } from "../../app/enums/language";
import { v } from "convex/values";

const literalUnion = <T extends readonly string[]>(arr: T) =>
  v.union(...arr.map((x) => v.literal(x)));

export const SectorV = literalUnion(SECTORS);
export const EthnicityV = literalUnion(ETHNICITIES);
export const KashroutV = literalUnion(KASHROUT);
export const LanguageV = literalUnion(LANGUAGE_VALUES);

export const HostFields = {
  dob: v.number(), // timestamp (ms)

  phoneNumber: v.string(),
  address: v.string(),
  lat: v.optional(v.number()),
  lng: v.optional(v.number()),
  entrance: v.optional(v.string()),
  floor: v.string(),

  hasDisabilityAccess: v.boolean(),

  kashrout: KashroutV,
  sector: SectorV,
  ethnicity: EthnicityV,

  languages: v.optional(v.array(LanguageV)),

  notes: v.optional(v.string()),

  // Availability. Absent / true = the host is open to guests and listed.
  // false = the host has marked themselves unavailable and is hidden from the
  // public lists/map. `unavailableUntil` (ms) optionally auto-restores them on
  // that date; absent means indefinitely until they switch back on.
  isAvailable: v.optional(v.boolean()),
  unavailableUntil: v.optional(v.number()),
};
