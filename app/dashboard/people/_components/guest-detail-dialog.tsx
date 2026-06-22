import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Mail, StickyNote, Calendar } from "lucide-react";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { EnumPill, ethnicityColor, genderColor } from "@/components/ui/enum-pill";
import { DetailList, DetailRow } from "@/components/ui/detail-list";
import type { GuestData } from "../_lib/types";
import { getInitials, formatDate, mapsUrl, computeAge } from "../_lib/utils";

export function GuestDetailDialog({
  guest,
  onClose,
}: {
  guest: GuestData | null;
  onClose: () => void;
}) {
  const { t } = useT();
  const el = useEnumLabel();
  if (!guest) return null;

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
                  <EnumPill color="amber">{el.sector(guest.sector)}</EnumPill>
                  <EnumPill color={ethnicityColor(guest.ethnicity)}>
                    {el.ethnicity(guest.ethnicity)}
                  </EnumPill>
                  <EnumPill color={genderColor(guest.gender)}>
                    {el.gender(guest.gender)}
                  </EnumPill>
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
      </DialogContent>
    </Dialog>
  );
}
