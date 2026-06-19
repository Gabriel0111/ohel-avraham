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
  gender: GenderV,
  sector: SectorV,
  ethnicity: EthnicityV,
  languages: v.optional(v.array(LanguageV)),
  notes: v.optional(v.string()),
};
