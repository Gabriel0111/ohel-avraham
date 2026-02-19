export const ETHNICITIES = ["Ashkenazi", "Sefardi", "Mizrahi", "Other"] as const;

export type Ethnicity = (typeof ETHNICITIES)[number];
