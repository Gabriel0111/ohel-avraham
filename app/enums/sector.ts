export const SECTORS = ["Haredi", "Dati", "Traditional", "Secular"] as const;

export type Sector = (typeof SECTORS)[number];
