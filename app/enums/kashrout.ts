export const KASHROUT = ["Mehadrin", "Regular", "Badatz", "Rabbanut", "None"] as const;

export type Kashrout = (typeof KASHROUT)[number];
