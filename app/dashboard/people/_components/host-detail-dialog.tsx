import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Phone,
  Mail,
  StickyNote,
  Accessibility,
  Calendar,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import * as RPNInput from "react-phone-number-input";
import { type Id } from "@/convex/_generated/dataModel";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { EnumPill } from "@/components/ui/enum-pill";
import { DetailList, DetailRow } from "@/components/ui/detail-list";
import type { HostData } from "../_lib/types";
import { getInitials, formatDate, mapsUrl, computeAge } from "../_lib/utils";

export function HostDetailDialog({
  host,
  isAdmin,
  verifying,
  onConfirm,
  onClose,
}: {
  host: HostData | null;
  isAdmin: boolean;
  verifying: string | null;
  onConfirm: (userId: Id<"users">) => void;
  onClose: () => void;
}) {
  const { t } = useT();
  const el = useEnumLabel();
  if (!host) return null;
  // Admins are implicitly trusted, so only non-admin hosts can be "pending".
  const needsVerification =
    isAdmin && host.role !== "admin" && !host.isVerified;

  return (
    <Dialog open={!!host} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-violet-500/8 to-transparent px-6 pt-6 pb-5 border-b border-border/50">
          <DialogHeader className="p-0">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 shrink-0 ring-2 ring-violet-500/20 shadow-md">
                <AvatarImage src={host.image} />
                <AvatarFallback className="bg-violet-500/10 text-violet-600 text-lg font-bold">
                  {getInitials(host.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <DialogTitle className="text-base font-bold leading-tight tracking-tight">
                    {host.name || t.people.unknown}
                  </DialogTitle>
                  {host.role && <RoleBadge role={host.role} />}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <EnumPill color="violet">{el.sector(host.sector)}</EnumPill>
                  <EnumPill color="blue">{el.kashrout(host.kashrout)}</EnumPill>
                  <EnumPill color="slate">
                    {el.ethnicity(host.ethnicity)}
                  </EnumPill>
                  {host.hasDisabilityAccess && (
                    <EnumPill color="green" icon={Accessibility}>
                      {t.people.access}
                    </EnumPill>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <DetailList>
            <DetailRow icon={MapPin} tone="violet" label={t.form.address}>
              <a
                href={mapsUrl(host.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-600 transition-colors underline-offset-4 hover:underline"
              >
                {host.address}
              </a>
              {(host.floor || host.entrance) && (
                <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                  {host.floor && `${t.form.floor} ${host.floor}`}
                  {host.floor && host.entrance && " · "}
                  {host.entrance && `${t.form.entrance} ${host.entrance}`}
                </span>
              )}
            </DetailRow>
            <DetailRow icon={Phone} tone="blue" label={t.form.phoneNumber}>
              <a
                href={`tel:${host.phoneNumber}`}
                className="hover:text-blue-600 transition-colors"
              >
                {RPNInput.formatPhoneNumberIntl(host.phoneNumber) ||
                  host.phoneNumber}
              </a>
            </DetailRow>
            {host.email && (
              <DetailRow icon={Mail} tone="rose" label={t.form.email}>
                <a
                  href={`mailto:${host.email}`}
                  className="hover:text-rose-600 transition-colors break-all"
                >
                  {host.email}
                </a>
              </DetailRow>
            )}
            <DetailRow icon={Calendar} tone="indigo" label={t.form.dateOfBirth}>
              {formatDate(host.dob)}
              <span className="text-muted-foreground font-normal">
                {" "}
                · {computeAge(host.dob)} {t.form.yearsOld}
              </span>
            </DetailRow>
            {host.notes && (
              <DetailRow icon={StickyNote} tone="amber" label={t.form.notes}>
                <span className="font-normal text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {host.notes}
                </span>
              </DetailRow>
            )}
          </DetailList>
        </div>

        {/* Admin footer — only shown while the host is still pending */}
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
              onClick={() => onConfirm(host.userId as Id<"users">)}
              disabled={verifying === host.userId}
              size="sm"
              className="gap-2 rounded-xl"
            >
              {verifying === host.userId ? (
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
