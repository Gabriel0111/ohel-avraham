import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Mail,
  StickyNote,
  Calendar,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { type Id } from "@/convex/_generated/dataModel";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import {
  EthnicityBadge,
  GenderBadge,
  SectorBadge,
} from "@/components/ui/enum-badges";
import { DetailList, DetailRow } from "@/components/ui/detail-list";
import type { GuestData } from "../_lib/types";
import { getInitials, formatDate, mapsUrl, computeAge } from "../_lib/utils";

export function GuestDetailDialog({
  guest,
  isAdmin,
  verifying,
  onConfirm,
  onClose,
}: {
  guest: GuestData | null;
  isAdmin: boolean;
  verifying: string | null;
  onConfirm: (userId: Id<"users">) => void;
  onClose: () => void;
}) {
  const { t } = useT();
  if (!guest) return null;
  // Admins are implicitly trusted, so only non-admin guests can be "pending".
  const needsVerification =
    isAdmin && guest.role !== "admin" && !guest.isVerified;

  return (
    <Dialog open={!!guest} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-amber-500/8 to-transparent px-6 pt-6 pb-5 border-b border-border/50">
          <DialogHeader className="p-0">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 ring-2 ring-amber-500/20 shadow-md shrink-0">
                <AvatarImage src={guest.image} />
                <AvatarFallback className="bg-amber-500/10 text-amber-600 text-lg font-bold">
                  {getInitials(guest.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <DialogTitle className="text-base font-bold leading-tight tracking-tight">
                    {guest.name || t.people.unknown}
                  </DialogTitle>
                  {guest.role && <RoleBadge role={guest.role} />}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <SectorBadge value={guest.sector} />
                  <EthnicityBadge value={guest.ethnicity} />
                  <GenderBadge value={guest.gender} />
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <DetailList>
            <DetailRow icon={MapPin} tone="amber" label={t.form.address}>
              <a
                href={mapsUrl(guest.region)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-600 transition-colors underline-offset-4 hover:underline"
              >
                {guest.region}
              </a>
            </DetailRow>
            {guest.email && (
              <DetailRow icon={Mail} tone="rose" label={t.form.email}>
                <a
                  href={`mailto:${guest.email}`}
                  className="hover:text-rose-600 transition-colors break-all"
                >
                  {guest.email}
                </a>
              </DetailRow>
            )}
            <DetailRow icon={Calendar} tone="indigo" label={t.form.dateOfBirth}>
              {formatDate(guest.dob)}
              <span className="text-muted-foreground font-normal">
                {" "}
                · {computeAge(guest.dob)} {t.form.yearsOld}
              </span>
            </DetailRow>
            {guest.notes && (
              <DetailRow icon={StickyNote} tone="amber" label={t.form.notes}>
                <span className="font-normal text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {guest.notes}
                </span>
              </DetailRow>
            )}
          </DetailList>
        </div>

        {/* Admin footer — only shown while the guest is still pending */}
        {needsVerification && (
          <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-500/10">
              <span className="relative flex size-2">
                <span className="absolute inset-0 inline-flex rounded-full bg-amber-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full size-2 bg-amber-500" />
              </span>
              <Clock className="size-3.5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                {t.people.unverified}
              </span>
            </div>
            <Button
              variant="success"
              onClick={() => onConfirm(guest.userId as Id<"users">)}
              disabled={verifying === guest.userId}
              size="sm"
              className="gap-2 rounded-xl"
            >
              {verifying === guest.userId ? (
                <Spinner className="size-3.5" />
              ) : (
                <ShieldCheck className="size-3.5" />
              )}
              {t.people.confirm}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
