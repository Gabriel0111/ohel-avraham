"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/app/ConvexClientProvider";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EnumPill, genderColor, type PillColor } from "@/components/ui/enum-pill";
import { toast } from "sonner";
import * as RPNInput from "react-phone-number-input";
import {
  CalendarDays,
  Users,
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  StickyNote,
  Check,
  X,
  Inbox,
  SendHorizonal,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  CalendarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { DetailList, DetailRow } from "@/components/ui/detail-list";

type Status = "pending" | "accepted" | "declined" | "cancelled";

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function computeAge(dobMs: number): number {
  const dob = new Date(dobMs);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function formatDate(ms: number, lang: string) {
  return new Date(ms).toLocaleDateString(
    lang === "fr" ? "fr-FR" : lang === "he" ? "he-IL" : "en-US",
    { weekday: "short", day: "2-digit", month: "long", year: "numeric" },
  );
}

function StatusBadge({ status }: { status: Status }) {
  const { t } = useT();
  const map: Record<
    Status,
    { label: string; icon: typeof Clock; color: PillColor }
  > = {
    pending: { label: t.requests.statusPending, icon: Clock, color: "amber" },
    accepted: {
      label: t.requests.statusAccepted,
      icon: CheckCircle2,
      color: "green",
    },
    declined: { label: t.requests.statusDeclined, icon: XCircle, color: "red" },
    cancelled: { label: t.requests.statusCancelled, icon: Ban, color: "slate" },
  };
  const { label, icon, color } = map[status];
  return (
    <EnumPill color={color} icon={icon}>
      {label}
    </EnumPill>
  );
}

function PartyDateRow({
  date,
  adults,
  kids,
  expired,
}: {
  date: number;
  adults: number;
  kids: number;
  expired?: boolean;
}) {
  const { t, lang } = useT();
  const total = adults + kids;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-3.5" />
        <span className={cn(expired && "line-through decoration-1")}>
          {formatDate(date, lang)}
        </span>
        {expired && <EnumPill color="slate">{t.requests.expired}</EnumPill>}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Users className="size-3.5" />
        {total} {t.requests.people}
        <span className="text-muted-foreground/60">
          ({adults} + {kids})
        </span>
      </span>
    </div>
  );
}

function MessageBlock({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
      <MessageSquare className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
        {message}
      </p>
    </div>
  );
}

// ─── Expired notice ───────────────────────────────────────────────────────────
// Once the invitation date has passed, contact details are withheld again.

function ExpiredNotice() {
  const { t } = useT();
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-sm text-muted-foreground">
      <CalendarOff className="size-4 shrink-0" />
      <span className="text-pretty">{t.requests.expiredInfo}</span>
    </div>
  );
}

// ─── Received (host view) ─────────────────────────────────────────────────────

function ReceivedList() {
  const { t } = useT();
  const el = useEnumLabel();
  const incoming = useQuery(api.requests.getMyIncomingRequests);
  const respond = useMutation(api.requests.respondToRequest);
  const [busy, setBusy] = useState<string | null>(null);

  const handleRespond = async (requestId: Id<"requests">, accept: boolean) => {
    setBusy(requestId);
    try {
      await respond({ requestId, accept });
      toast.success(accept ? t.requests.toastAccepted : t.requests.toastDeclined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.requests.toastRespondError);
    } finally {
      setBusy(null);
    }
  };

  if (incoming === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (incoming.length === 0) {
    return (
      <EmptyState icon={Inbox} label={t.requests.noReceived} />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {incoming.map((r) => (
        <div
          key={r._id}
          className="rounded-2xl border border-border/60 bg-card p-4 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 border border-border/50">
                <AvatarImage src={r.guest.image} />
                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                  {getInitials(r.guest.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {r.guest.name ?? "—"}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {r.guest.sector && (
                    <EnumPill color="emerald">{el.sector(r.guest.sector)}</EnumPill>
                  )}
                  {r.guest.ethnicity && (
                    <EnumPill color="slate">
                      {el.ethnicity(r.guest.ethnicity)}
                    </EnumPill>
                  )}
                  {r.guest.gender && (
                    <EnumPill color={genderColor(r.guest.gender)}>
                      {el.gender(r.guest.gender)}
                    </EnumPill>
                  )}
                  {r.guest.region && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {r.guest.region}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <StatusBadge status={r.status} />
          </div>

          <PartyDateRow
            date={r.date}
            adults={r.adults}
            kids={r.children}
            expired={r.isExpired}
          />
          <MessageBlock message={r.message} />

          {/* Full guest details — revealed once accepted, withheld once past */}
          {r.status === "accepted" &&
            (r.isExpired ? (
              <ExpiredNotice />
            ) : (
              <DetailList>
                {r.guest.email && (
                  <DetailRow icon={Mail} tone="rose" label={t.form.email}>
                    <a
                      href={`mailto:${r.guest.email}`}
                      className="hover:text-rose-600 transition-colors"
                    >
                      {r.guest.email}
                    </a>
                  </DetailRow>
                )}
                {r.guest.dob != null && (
                  <DetailRow icon={CalendarDays} tone="indigo" label={t.form.age}>
                    {computeAge(r.guest.dob)} {t.form.yearsOld}
                  </DetailRow>
                )}
                {r.guest.notes && (
                  <DetailRow icon={StickyNote} tone="amber" label={t.form.notes}>
                    <span className="font-normal text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {r.guest.notes}
                    </span>
                  </DetailRow>
                )}
              </DetailList>
            ))}

          {r.status === "pending" && (
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                className="gap-1.5 flex-1"
                disabled={busy === r._id}
                onClick={() => handleRespond(r._id, true)}
              >
                {busy === r._id ? (
                  <Spinner className="size-4" />
                ) : (
                  <Check className="size-4" />
                )}
                {t.requests.accept}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 flex-1"
                disabled={busy === r._id}
                onClick={() => handleRespond(r._id, false)}
              >
                <X className="size-4" />
                {t.requests.decline}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Sent (guest view) ────────────────────────────────────────────────────────

function SentList() {
  const { t } = useT();
  const el = useEnumLabel();
  const outgoing = useQuery(api.requests.getMyOutgoingRequests);
  const cancel = useMutation(api.requests.cancelRequest);
  const [busy, setBusy] = useState<string | null>(null);

  const handleCancel = async (requestId: Id<"requests">) => {
    setBusy(requestId);
    try {
      await cancel({ requestId });
      toast.success(t.requests.toastCancelled);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.requests.toastCancelError);
    } finally {
      setBusy(null);
    }
  };

  if (outgoing === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (outgoing.length === 0) {
    return <EmptyState icon={SendHorizonal} label={t.requests.noSent} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {outgoing.map((r) => (
        <div
          key={r._id}
          className="rounded-2xl border border-border/60 bg-card p-4 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 border border-border/50">
                <AvatarImage src={r.host.image} />
                <AvatarFallback className="bg-violet-500/10 text-violet-600 text-xs font-semibold">
                  {getInitials(r.host.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {r.host.name ?? "—"}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {r.host.sector && (
                    <EnumPill color="violet">{el.sector(r.host.sector)}</EnumPill>
                  )}
                  {r.host.kashrout && (
                    <EnumPill color="blue">{el.kashrout(r.host.kashrout)}</EnumPill>
                  )}
                </div>
              </div>
            </div>
            <StatusBadge status={r.status} />
          </div>

          <PartyDateRow
            date={r.date}
            adults={r.adults}
            kids={r.children}
            expired={r.isExpired}
          />
          <MessageBlock message={r.message} />

          {/* Contact — revealed once accepted, withheld once past */}
          {r.status === "accepted" &&
            (r.isExpired ? (
              <ExpiredNotice />
            ) : r.host.phoneNumber || r.host.address ? (
              <DetailList>
                {r.host.phoneNumber && (
                  <DetailRow icon={Phone} tone="blue" label={t.form.phoneNumber}>
                    <a
                      href={`tel:${r.host.phoneNumber}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {RPNInput.formatPhoneNumberIntl(r.host.phoneNumber) ||
                        r.host.phoneNumber}
                    </a>
                  </DetailRow>
                )}
                {r.host.address && (
                  <DetailRow icon={MapPin} tone="violet" label={t.form.address}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.host.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-violet-600 transition-colors underline-offset-4 hover:underline"
                    >
                      {r.host.address}
                    </a>
                    {(r.host.floor || r.host.entrance) && (
                      <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                        {r.host.floor && `${t.form.floor} ${r.host.floor}`}
                        {r.host.floor && r.host.entrance && " · "}
                        {r.host.entrance &&
                          `${t.form.entrance} ${r.host.entrance}`}
                      </span>
                    )}
                  </DetailRow>
                )}
              </DetailList>
            ) : null)}

          {r.status === "pending" && (
            <div className="flex items-center justify-end pt-1">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled={busy === r._id}
                onClick={() => handleCancel(r._id)}
              >
                {busy === r._id ? (
                  <Spinner className="size-4" />
                ) : (
                  <X className="size-4" />
                )}
                {t.requests.cancelRequest}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  label,
}: {
  icon: typeof Inbox;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
      <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
        <Icon className="size-6" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RequestsPage() {
  const { t } = useT();
  const { user } = useAuth();
  const pendingCount = useQuery(api.requests.getIncomingPendingCount);

  const role = user?.role;
  // Admins are treated as hosts (they receive requests like one).
  const isHost = role === "host" || role === "guest:host" || role === "admin";
  const isGuest = role === "guest" || role === "guest:host";
  // A host only receives requests; a guest only sends them. Only guest:host
  // sees both. (A plain user with no role yet falls back to the sent view.)
  const mode: "both" | "received" | "sent" =
    isHost && isGuest ? "both" : isHost ? "received" : "sent";

  const subtitle =
    mode === "received"
      ? t.requests.descReceived
      : mode === "sent"
        ? t.requests.descSent
        : t.requests.desc;

  return (
    <div>
      <PageHeader title={t.requests.title} subtitle={subtitle} />

      {mode === "both" ? (
        <Tabs defaultValue="received" className="w-full">
          <TabsList>
            <TabsTrigger value="received" className="gap-2">
              <Inbox className="size-4" />
              {t.requests.received}
              {pendingCount != null && pendingCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold tabular-nums">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <SendHorizonal className="size-4" />
              {t.requests.sent}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-4">
            <ReceivedList />
          </TabsContent>
          <TabsContent value="sent" className="mt-4">
            <SentList />
          </TabsContent>
        </Tabs>
      ) : mode === "received" ? (
        <ReceivedList />
      ) : (
        <SentList />
      )}
    </div>
  );
}
