export const GENDERS = ["Male", "Female"] as const;

export type Gender = (typeof GENDERS)[number];
