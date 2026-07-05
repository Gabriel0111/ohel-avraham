import { v } from "convex/values";
import { SECTORS } from "../../app/enums/sector";
import { ETHNICITIES } from "../../app/enums/ethnicity";
import { GENDERS } from "../../app/enums/gender";
import { LANGUAGE_VALUES } from "../../app/enums/language";

const literalUnion = <T extends readonly string[]>(arr: T) =>
  v.union(...arr.map((x) => v.literal(x)));

export const SectorV = literalUnion(SECTORS);
export const EthnicityV = literalUnion(ETHNICITIES);
export const GenderV = literalUnion(GENDERS);
export const LanguageV = literalUnion(LANGUAGE_VALUES);

export const GuestFields = {
  dob: v.number(), // timestamp (ms)
  region: v.string(),
  // Geocoded coordinates of the region (mirrors hosts.lat/lng) — set from the
  // address autocomplete, used to place guests on the search map.
  lat: v.optional(v.number()),
  lng: v.optional(v.number()),
  gender: GenderV,
  sector: SectorV,
  ethnicity: EthnicityV,
  languages: v.optional(v.array(LanguageV)),
  notes: v.optional(v.string()),
};
