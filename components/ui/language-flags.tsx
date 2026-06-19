import flags from "react-phone-number-input/flags";
import { getLanguage } from "@/app/enums/language";
import { cn } from "@/lib/utils";

/** A single language flag (with its native name as the title tooltip). */
export function LanguageFlag({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const lang = getLanguage(code);
  if (!lang) return null;
  const Flag = flags[lang.country];
  return (
    <span
      title={lang.label}
      className={cn("w-5 shrink-0 overflow-hidden rounded-xs", className)}
    >
      {Flag && <Flag title={lang.label} />}
    </span>
  );
}

/** Compact, read-only row of language flags. Renders a dash when empty. */
export function LanguageFlags({
  value,
  className,
}: {
  value?: string[] | null;
  className?: string;
}) {
  const codes = value?.filter((c) => getLanguage(c)) ?? [];
  if (codes.length === 0)
    return <span className="text-xs text-muted-foreground/40">—</span>;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {codes.map((code) => (
        <LanguageFlag key={code} code={code} />
      ))}
    </div>
  );
}
