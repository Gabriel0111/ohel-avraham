import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapLinkProps {
  /** The place to search for on Google Maps (address or region). */
  query: string;
  /** Primary line shown to the user. */
  label: string;
  /** Optional secondary line (e.g. floor). */
  subLabel?: string;
  className?: string;
}

/**
 * A minimalist, location link that opens Google Maps in a new tab.
 * Shared by the host address and the guest preferred-region rows so both
 * read identically. RTL-safe (logical spacing, no hard-coded sides).
 */
export function MapLink({ query, label, subLabel, className }: MapLinkProps) {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group -mx-2.5 inline-flex max-w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-primary/8",
        className,
      )}
    >
      <MapPin className="size-4 shrink-0 text-primary" />
      <span className="min-w-0">
        <span className="block truncate font-medium text-foreground transition-colors group-hover:text-primary dark:group-hover:text-primary">
          {label}
        </span>
        {subLabel && (
          <span className="block truncate text-xs text-muted-foreground">
            {subLabel}
          </span>
        )}
      </span>
      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/40 transition-all group-hover:text-primary dark:group-hover:text-primary rtl:-scale-x-100" />
    </a>
  );
}
