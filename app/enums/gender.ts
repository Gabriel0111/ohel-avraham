export const GENDERS = ["Male", "Female", "Couple"] as const;

export type Gender = (typeof GENDERS)[number];
