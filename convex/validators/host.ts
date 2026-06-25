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

  // Hospitality preferences shown on the host's profile.
  likesSinging: v.optional(v.boolean()),
  likesDivreiTorah: v.optional(v.boolean()),

  kashrout: KashroutV,
  sector: SectorV,
  ethnicity: EthnicityV,

  languages: v.optional(v.array(LanguageV)),

  notes: v.optional(v.string()),

  // Availability. Absent / true = the host is open to guests and listed.
  // false = the host has marked themselves unavailable for a window and is
  // hidden from the public lists/map while inside it. The window is
  // [`unavailableFrom`, `unavailableUntil`] (ms): `from` absent = already
  // started, `until` absent = indefinite. Read-time logic auto-restores the
  // host once the window has passed (or before it starts).
  isAvailable: v.optional(v.boolean()),
  unavailableFrom: v.optional(v.number()),
  unavailableUntil: v.optional(v.number()),
};
