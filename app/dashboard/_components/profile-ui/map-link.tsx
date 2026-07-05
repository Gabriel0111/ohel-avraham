import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Tones mirror the admin detail-dialog field colors (address=primary/sky,
// phone=blue). Full class strings — Tailwind can't see interpolated names.
type ContactTone = "primary" | "blue";

const TONES: Record<
  ContactTone,
  { icon: string; hoverBg: string; hoverText: string }
> = {
  primary: {
    icon: "text-primary",
    hoverBg: "hover:bg-primary/8",
    hoverText: "group-hover:text-primary dark:group-hover:text-primary",
  },
  blue: {
    icon: "text-blue-500",
    hoverBg: "hover:bg-blue-500/8",
    hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-300",
  },
};

interface ContactLinkProps {
  href: string;
  icon: LucideIcon;
  /** Primary line shown to the user. */
  label: string;
  /** Optional secondary line (e.g. floor). */
  subLabel?: string;
  tone?: ContactTone;
  /** Open in a new tab (external destinations like Google Maps). */
  external?: boolean;
  className?: string;
}

/**
 * A minimalist contact/location link row: icon, value, trailing arrow.
 * Shared by the address (Google Maps) and phone rows so both read as the
 * same object. RTL-safe (logical spacing, no hard-coded sides).
 */
export function ContactLink({
  href,
  icon: Icon,
  label,
  subLabel,
  tone = "primary",
  external = false,
  className,
}: ContactLinkProps) {
  const c = TONES[tone];

  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group -mx-2.5 inline-flex max-w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
        c.hoverBg,
        className,
      )}
    >
      <Icon className={cn("size-4 shrink-0", c.icon)} />
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate font-medium text-foreground transition-colors",
            c.hoverText,
          )}
        >
          {label}
        </span>
        {subLabel && (
          <span className="block truncate text-xs text-muted-foreground">
            {subLabel}
          </span>
        )}
      </span>
      <ArrowUpRight
        className={cn(
          "size-3.5 shrink-0 text-muted-foreground/40 transition-all rtl:-scale-x-100",
          c.hoverText,
        )}
      />
    </Link>
  );
}

interface MapLinkProps {
  /** The place to search for on Google Maps (address or region). */
  query: string;
  label: string;
  subLabel?: string;
  className?: string;
}

/** Location variant: opens a Google Maps search in a new tab. */
export function MapLink({ query, label, subLabel, className }: MapLinkProps) {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;

  return (
    <ContactLink
      href={href}
      icon={MapPin}
      label={label}
      subLabel={subLabel}
      external
      className={className}
    />
  );
}
