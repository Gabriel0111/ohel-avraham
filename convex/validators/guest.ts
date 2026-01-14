import { v } from "convex/values";
import { SECTORS } from "../../app/enums/sector";
import { ETHNICITIES } from "../../app/enums/ethnicity";
import { GENDERS } from "../../app/enums/gender";

const literalUnion = <T extends readonly string[]>(arr: T) =>
  v.union(...arr.map((x) => v.literal(x)));

export const SectorV = literalUnion(SECTORS);
export const EthnicityV = literalUnion(ETHNICITIES);
export const GenderV = literalUnion(GENDERS);

export const GuestFields = {
  dob: v.number(), // timestamp (ms)
  region: v.string(),
  gender: GenderV,
  sector: SectorV,
  ethnicity: EthnicityV,
  notes: v.optional(v.string()),
};
