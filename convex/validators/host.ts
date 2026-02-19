import { SECTORS } from "../../app/enums/sector";
import { ETHNICITIES } from "../../app/enums/ethnicity";
import { KASHROUT } from "../../app/enums/kashrout";
import { v } from "convex/values";

const literalUnion = <T extends readonly string[]>(arr: T) =>
  v.union(...arr.map((x) => v.literal(x)));

export const SectorV = literalUnion(SECTORS);
export const EthnicityV = literalUnion(ETHNICITIES);
export const KashroutV = literalUnion(KASHROUT);

export const HostFields = {
  dob: v.number(), // timestamp (ms)

  phoneNumber: v.string(),
  address: v.string(),
  entrance: v.string(),
  floor: v.string(),

  hasDisabilityAccess: v.boolean(),

  kashrout: KashroutV,
  sector: SectorV,
  ethnicity: EthnicityV,

  notes: v.optional(v.string()),
};
