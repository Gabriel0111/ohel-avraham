// Drop house numbers from a raw address fragment so search UIs never surface
// the exact door — the street name alone is enough to place someone.
export function stripHouseNumber(value?: string): string | undefined {
  if (!value) return undefined;
  return (
    value
      .replace(/\b\d+[a-zA-Z]?\b/g, " ")
      .replace(/\s+,/g, ",")
      .replace(/,\s*,/g, ",")
      .replace(/\s{2,}/g, " ")
      .replace(/^[\s,]+|[\s,]+$/g, "")
      .trim() || undefined
  );
}
