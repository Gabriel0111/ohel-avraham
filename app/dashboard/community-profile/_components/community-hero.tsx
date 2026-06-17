"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Accessibility,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnumPill, genderColor } from "@/components/ui/enum-pill";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { cn } from "@/lib/utils";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import type { Doc } from "@/convex/_generated/dataModel";

type Accent = "violet" | "amber" | "slate";

// Full class strings (Tailwind can't see interpolated color names).
const ACCENT: Record<Accent, { grad: string; ring: string; fallback: string }> =
  {
    violet: {
      grad: "from-violet-500/12",
      ring: "ring-violet-500/25",
      fallback: "bg-violet-500/10 text-violet-600",
    },
    amber: {
      grad: "from-amber-500/12",
      ring: "ring-amber-500/25",
      fallback: "bg-amber-500/10 text-amber-600",
    },
    slate: {
      grad: "from-slate-500/10",
      ring: "ring-border",
      fallback: "bg-slate-500/10 text-slate-600",
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

  const location = host?.address ?? guest?.region;
  const sector = host?.sector ?? guest?.sector;
  const ethnicity = host?.ethnicity ?? guest?.ethnicity;

  const showVerification = user.role !== "admin";

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
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar
            className={cn(
              "size-20 shadow-sm ring-2",
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
            <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-green-500 ring-2 ring-background shadow-sm">
              <CheckCircle2 className="size-3.5 text-white" />
            </span>
          )}
        </div>

        {/* Identity + match dimensions */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground text-balance">
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

          {location && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {sector && (
              <EnumPill color={isHost ? "violet" : "amber"}>
                {el.sector(sector)}
              </EnumPill>
            )}
            {host && (
              <EnumPill color="blue">{el.kashrout(host.kashrout)}</EnumPill>
            )}
            {ethnicity && (
              <EnumPill color="slate">{el.ethnicity(ethnicity)}</EnumPill>
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
