"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Accessibility,
  CheckCircle2,
  Clock,
  Music,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnumPill, ethnicityColor, genderColor } from "@/components/ui/enum-pill";
import { PreferenceBadge } from "@/components/ui/preference-toggle";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { cn } from "@/lib/utils";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import type { Doc } from "@/convex/_generated/dataModel";

type Accent = "violet" | "amber" | "slate";

// Full class strings (Tailwind can't see interpolated color names).
const ACCENT: Record<
  Accent,
  { grad: string; ring: string; fallback: string; orb: string }
> = {
  violet: {
    grad: "from-violet-500/12",
    ring: "ring-violet-500/25",
    fallback: "bg-violet-500/10 text-violet-600",
    orb: "bg-violet-500/20",
  },
  amber: {
    grad: "from-amber-500/12",
    ring: "ring-amber-500/25",
    fallback: "bg-amber-500/10 text-amber-600",
    orb: "bg-amber-500/20",
  },
  slate: {
    grad: "from-slate-500/10",
    ring: "ring-border",
    fallback: "bg-slate-500/10 text-slate-600",
    orb: "bg-slate-500/15",
  },
};

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface CommunityHeroProps {
  user: Doc<"users">;
  host: Doc<"hosts"> | null;
  guest: Doc<"guests"> | null;
}

export function CommunityHero({ user, host, guest }: CommunityHeroProps) {
  const { t } = useT();
  const el = useEnumLabel();
  const reduce = useReducedMotion();

  const isHost = !!host;
  const isGuest = !!guest;
  const accent: Accent = isHost ? "violet" : isGuest ? "amber" : "slate";
  const a = ACCENT[accent];

  const sector = host?.sector ?? guest?.sector;
  const ethnicity = host?.ethnicity ?? guest?.ethnicity;

  const showVerification = user.role !== "admin";

  // A warm one-line description of how this member takes part — the hospitality
  // voice the hero was missing.
  const tagline =
    isHost && isGuest
      ? t.profile.heroTaglineDual
      : isHost
        ? t.profile.heroTaglineHost
        : t.profile.heroTaglineGuest;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60",
        "bg-gradient-to-br to-transparent",
        a.grad,
      )}
    >
      {/* Ambient accent glow — soft depth, never glassy. RTL-safe inset. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-20 -end-16 size-56 rounded-full blur-3xl",
          a.orb,
        )}
      />

      <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:gap-6 sm:p-7">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar
            className={cn(
              "size-20 shadow-sm ring-2 sm:size-24",
              user.isVerified ? "ring-green-500/40" : a.ring,
            )}
          >
            <AvatarImage src={user.image} alt={user.name ?? ""} />
            <AvatarFallback
              className={cn("text-2xl font-semibold", a.fallback)}
            >
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          {user.isVerified && (
            <span className="absolute -bottom-1 -end-1 flex size-6 items-center justify-center rounded-full bg-green-500 ring-2 ring-background shadow-sm">
              <CheckCircle2 className="size-3.5 text-white" />
            </span>
          )}
        </div>

        {/* Identity + match dimensions */}
        <div className="min-w-0 flex-1 space-y-3.5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-2xl">
                {user.name}
              </h2>
              <RoleBadge role={user.role} />
              {showVerification &&
                (user.isVerified ? (
                  <EnumPill color="green" icon={ShieldCheck}>
                    {t.profile.verifiedAccount}
                  </EnumPill>
                ) : (
                  <EnumPill color="amber" icon={Clock}>
                    {t.profile.identityPending}
                  </EnumPill>
                ))}
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              {tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border/50 pt-3.5">
            {sector && (
              <EnumPill color={isHost ? "violet" : "amber"}>
                {el.sector(sector)}
              </EnumPill>
            )}
            {host && (
              <EnumPill color="blue">{el.kashrout(host.kashrout)}</EnumPill>
            )}
            {ethnicity && (
              <EnumPill color={ethnicityColor(ethnicity)}>
                {el.ethnicity(ethnicity)}
              </EnumPill>
            )}
            {guest && (
              <EnumPill color={genderColor(guest.gender)}>
                {el.gender(guest.gender)}
              </EnumPill>
            )}
            {host?.hasDisabilityAccess && (
              <EnumPill color="green" icon={Accessibility}>
                {t.people.access}
              </EnumPill>
            )}
            {host?.likesSinging && (
              <PreferenceBadge
                icon={Music}
                label={t.form.likesSinging}
                color="rose"
              />
            )}
            {host?.likesDivreiTorah && (
              <PreferenceBadge
                icon={BookOpen}
                label={t.form.likesDivreiTorah}
                color="blue"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
