"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useErrorMessage, useT } from "@/lib/i18n/context";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EnumPill, type PillColor } from "@/components/ui/enum-pill";
import {
  EthnicityBadge,
  GenderBadge,
  KashroutBadge,
  SectorBadge,
} from "@/components/ui/enum-badges";
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
  ChevronRight,
} from "lucide-react";
import type { FunctionReturnType } from "convex/server";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { DetailList, DetailRow } from "@/components/ui/detail-list";

type Status = "pending" | "accepted" | "declined" | "cancelled";

// Incoming and outgoing now share one unified shape (party + counterpartyKind).
type RequestItem = FunctionReturnType<
  typeof api.requests.getMyIncomingRequests
>[number];

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
  // Absent for host invitations (no party size).
  adults?: number;
  kids?: number;
  expired?: boolean;
}) {
  const { t, lang } = useT();
  const hasParty = adults != null;
  const total = (adults ?? 0) + (kids ?? 0);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-3.5" />
        <span className={cn(expired && "line-through decoration-1")}>
          {formatDate(date, lang)}
        </span>
        {expired && <EnumPill color="slate">{t.requests.expired}</EnumPill>}
      </span>
      {hasParty && (
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" />
          {total} {t.requests.people}
          <span className="text-muted-foreground/60">
            ({adults} + {kids ?? 0})
          </span>
        </span>
      )}
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

// ─── Request rows & detail dialogs ────────────────────────────────────────────

// Compact, clickable summary row — mirrors the members table: minimal info up
// front, full details revealed in a dialog.
function RequestRow({
  name,
  image,
  fallbackColor,
  pills,
  status,
  date,
  adults,
  kids,
  expired,
  onClick,
}: {
  name?: string;
  image?: string;
  fallbackColor: "amber" | "sky";
  pills: React.ReactNode;
  status: Status;
  date: number;
  adults?: number;
  kids?: number;
  expired?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full cursor-pointer rounded-2xl border border-border/60 bg-card p-4 text-start transition-colors hover:bg-accent/60 active:bg-accent"
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0 border border-border/50">
          <AvatarImage src={image} />
          <AvatarFallback
            className={cn(
              "text-xs font-semibold",
              fallbackColor === "amber"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-primary/10 text-primary",
            )}
          >
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{name ?? "—"}</p>
            <span className="ms-auto shrink-0">
              <StatusBadge status={status} />
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">{pills}</div>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
      </div>
      <div className="mt-3">
        <PartyDateRow date={date} adults={adults} kids={kids} expired={expired} />
      </div>
    </button>
  );
}

// ─── Detail dialogs ───────────────────────────────────────────────────────────

type Direction = "incoming" | "outgoing";

// A short line describing the thread, by who's looking and at whom.
function useThreadLabel() {
  const { t } = useT();
  return (direction: Direction, kind: "guest" | "host") => {
    if (direction === "incoming") {
      return kind === "guest"
        ? t.requests.wantsToBeHostedLabel
        : t.requests.invitedYouLabel;
    }
    return kind === "host"
      ? t.requests.youRequestedLabel
      : t.requests.youInvitedLabel;
  };
}

// One detail dialog for every thread. The counterparty (guest or host) drives
// the accent and which traits/contacts show; the direction drives the action
// (respond when it's addressed to me, cancel when I opened it).
function RequestDetailDialog({
  request,
  direction,
  busy,
  onRespond,
  onCancel,
  onClose,
}: {
  request: RequestItem | null;
  direction: Direction;
  busy: string | null;
  onRespond: (id: Id<"requests">, accept: boolean) => void;
  onCancel: (id: Id<"requests">) => void;
  onClose: () => void;
}) {
  const { t } = useT();
  const threadLabel = useThreadLabel();
  if (!request) return null;
  const r = request;
  const p = r.party;
  const isGuest = r.counterpartyKind === "guest";

  return (
    <Dialog open={!!request} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div
          className={cn(
            "relative bg-gradient-to-b to-transparent px-6 pt-6 pb-5 border-b border-border/50",
            isGuest ? "from-amber-500/8" : "from-primary/8",
          )}
        >
          <DialogHeader className="p-0">
            <div className="flex items-start gap-4">
              <Avatar
                className={cn(
                  "size-14 shrink-0 ring-2 shadow-md",
                  isGuest ? "ring-amber-500/20" : "ring-primary/20",
                )}
              >
                <AvatarImage src={p.image} />
                <AvatarFallback
                  className={cn(
                    "text-base font-bold",
                    isGuest
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {getInitials(p.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <DialogTitle className="text-base font-bold leading-tight tracking-tight">
                    {p.name ?? "—"}
                  </DialogTitle>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {threadLabel(direction, r.counterpartyKind)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.sector && <SectorBadge value={p.sector} />}
                  {isGuest ? (
                    <>
                      {p.ethnicity && <EthnicityBadge value={p.ethnicity} />}
                      {p.gender && <GenderBadge value={p.gender} />}
                    </>
                  ) : (
                    p.kashrout && <KashroutBadge value={p.kashrout} />
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3">
          <PartyDateRow
            date={r.date}
            adults={r.adults}
            kids={r.children}
            expired={r.isExpired}
          />
          <MessageBlock message={r.message} />

          {/* Contact / details — revealed once accepted, withheld once past */}
          {r.status === "accepted" &&
            (r.isExpired ? (
              <ExpiredNotice />
            ) : isGuest ? (
              <DetailList>
                {p.region && (
                  <DetailRow icon={MapPin} tone="amber" label={t.form.address}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.region)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-600 transition-colors underline-offset-4 hover:underline"
                    >
                      {p.region}
                    </a>
                  </DetailRow>
                )}
                {p.email && (
                  <DetailRow icon={Mail} tone="rose" label={t.form.email}>
                    <a
                      href={`mailto:${p.email}`}
                      className="hover:text-rose-600 transition-colors"
                    >
                      {p.email}
                    </a>
                  </DetailRow>
                )}
                {p.dob != null && (
                  <DetailRow icon={CalendarDays} tone="indigo" label={t.form.age}>
                    {computeAge(p.dob)} {t.form.yearsOld}
                  </DetailRow>
                )}
                {p.notes && (
                  <DetailRow icon={StickyNote} tone="amber" label={t.form.notes}>
                    <span className="font-normal text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {p.notes}
                    </span>
                  </DetailRow>
                )}
              </DetailList>
            ) : p.phoneNumber || p.address ? (
              <DetailList>
                {p.phoneNumber && (
                  <DetailRow icon={Phone} tone="blue" label={t.form.phoneNumber}>
                    <a
                      href={`tel:${p.phoneNumber}`}
                      className="hover:text-primary transition-colors"
                    >
                      {RPNInput.formatPhoneNumberIntl(p.phoneNumber) ||
                        p.phoneNumber}
                    </a>
                  </DetailRow>
                )}
                {p.address && (
                  <DetailRow icon={MapPin} tone="sky" label={t.form.address}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                      {p.address}
                    </a>
                    {(p.floor || p.entrance) && (
                      <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                        {p.floor && `${t.form.floor} ${p.floor}`}
                        {p.floor && p.entrance && " · "}
                        {p.entrance && `${t.form.entrance} ${p.entrance}`}
                      </span>
                    )}
                  </DetailRow>
                )}
              </DetailList>
            ) : null)}
        </div>

        {/* Footer — respond if it's addressed to me, cancel if I opened it */}
        {r.status === "pending" &&
          (direction === "incoming" ? (
            <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center gap-2">
              <Button
                size="sm"
                className="gap-1.5 flex-1"
                disabled={busy === r._id}
                onClick={() => onRespond(r._id, true)}
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
                onClick={() => onRespond(r._id, false)}
              >
                <X className="size-4" />
                {t.requests.decline}
              </Button>
            </div>
          ) : (
            <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-end">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled={busy === r._id}
                onClick={() => onCancel(r._id)}
              >
                {busy === r._id ? (
                  <Spinner className="size-4" />
                ) : (
                  <X className="size-4" />
                )}
                {t.requests.cancelRequest}
              </Button>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
}

// ─── Thread list (received or sent) ───────────────────────────────────────────

function RequestsList({ direction }: { direction: Direction }) {
  const { t } = useT();
  const getErrorMessage = useErrorMessage();
  const items = useQuery(
    direction === "incoming"
      ? api.requests.getMyIncomingRequests
      : api.requests.getMyOutgoingRequests,
  );
  const respond = useMutation(api.requests.respondToRequest);
  const cancel = useMutation(api.requests.cancelRequest);
  const [busy, setBusy] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleRespond = async (requestId: Id<"requests">, accept: boolean) => {
    setBusy(requestId);
    try {
      await respond({ requestId, accept });
      toast.success(
        accept ? t.requests.toastAccepted : t.requests.toastDeclined,
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const handleCancel = async (requestId: Id<"requests">) => {
    setBusy(requestId);
    try {
      await cancel({ requestId });
      toast.success(t.requests.toastCancelled);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  if (items === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <EmptyState
        icon={direction === "incoming" ? Inbox : SendHorizonal}
        label={
          direction === "incoming" ? t.requests.noReceived : t.requests.noSent
        }
      />
    );
  }

  const selected = items.find((r) => r._id === selectedId) ?? null;

  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((r) => {
          const isGuest = r.counterpartyKind === "guest";
          return (
            <RequestRow
              key={r._id}
              name={r.party.name}
              image={r.party.image}
              fallbackColor={isGuest ? "amber" : "sky"}
              status={r.status}
              date={r.date}
              adults={r.adults}
              kids={r.children}
              expired={r.isExpired}
              onClick={() => setSelectedId(r._id)}
              pills={
                <>
                  {r.party.sector && <SectorBadge value={r.party.sector} />}
                  {isGuest
                    ? r.party.region && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {r.party.region}
                        </span>
                      )
                    : r.party.kashrout && (
                        <KashroutBadge value={r.party.kashrout} />
                      )}
                </>
              }
            />
          );
        })}
      </div>

      <RequestDetailDialog
        request={selected}
        direction={direction}
        busy={busy}
        onRespond={handleRespond}
        onCancel={handleCancel}
        onClose={() => setSelectedId(null)}
      />
    </>
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
  const pendingCount = useQuery(api.requests.getIncomingPendingCount);

  // Everyone can both receive and send now: a guest sends hosting requests and
  // receives host invitations; a host receives requests and sends invitations.
  // So both tabs are always shown.
  return (
    <div>
      <PageHeader title={t.requests.title} subtitle={t.requests.desc} />

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
          <RequestsList direction="incoming" />
        </TabsContent>
        <TabsContent value="sent" className="mt-4">
          <RequestsList direction="outgoing" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
