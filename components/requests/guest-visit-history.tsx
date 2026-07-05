"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useT } from "@/lib/i18n/context";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History, Mail, Phone } from "lucide-react";
import { formatPhone } from "@/lib/format-phone";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(ms: number, lang: string) {
  return new Date(ms).toLocaleDateString(
    lang === "fr" ? "fr-FR" : lang === "he" ? "he-IL" : "en-US",
    { weekday: "short", day: "2-digit", month: "long", year: "numeric" },
  );
}

// Button + dialog wrapper for the guest search: shows the count of past
// visits up front, and opens the full history (with former hosts' contacts)
// on click — so a host can take references BEFORE sending an invitation.
export function GuestVisitHistoryButton({
  guestId,
  guestName,
}: {
  guestId: Id<"guests">;
  guestName?: string;
}) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const visits = useQuery(api.requests.getGuestVisitHistoryByGuestId, {
    guestId,
  });

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 shrink-0"
        onClick={() => setOpen(true)}
      >
        <History className="size-4" />
        {/* On narrow phones the icon + counter alone keep the action bar
            from overflowing next to the invite button. */}
        <span className="hidden sm:inline">{t.requests.visitHistoryShort}</span>
        {visits === undefined ? (
          <Skeleton className="size-5 rounded-full" />
        ) : (
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-muted text-foreground/70 text-[11px] font-bold tabular-nums">
            {visits.length}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <History className="size-4 text-muted-foreground" />
              {t.requests.visitHistory}
              {guestName && (
                <span className="text-muted-foreground font-normal">
                  · {guestName}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t.requests.visitHistoryHint}
            </DialogDescription>
          </DialogHeader>
          <GuestVisitHistory guestId={guestId} withHeading={false} />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Reference check for a host: the guest's past accepted stays, with each
// former host's contact details, shown BEFORE the host accepts a request or
// sends an invitation. Reachable through either gate — an existing thread
// (requestId) or the guest search (guestId, verified hosts only).
export function GuestVisitHistory({
  requestId,
  guestId,
  withHeading = true,
}: {
  requestId?: Id<"requests">;
  guestId?: Id<"guests">;
  // The dialog wrapper already provides a title; skip the inline one there.
  withHeading?: boolean;
}) {
  const { t, lang } = useT();
  const byRequest = useQuery(
    api.requests.getGuestVisitHistory,
    requestId ? { requestId } : "skip",
  );
  const byGuest = useQuery(
    api.requests.getGuestVisitHistoryByGuestId,
    !requestId && guestId ? { guestId } : "skip",
  );
  const visits = requestId ? byRequest : byGuest;

  if (visits === undefined) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="size-4" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {withHeading && (
        <div className="flex items-center gap-2">
          <History className="size-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.requests.visitHistory}
          </p>
        </div>
      )}
      {visits.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
          {t.requests.visitHistoryEmpty}
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {t.requests.visitHistoryHint}
          </p>
          <ul className="flex flex-col gap-2">
            {visits.map((v, i) => (
              <li
                key={v.requestId}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5"
              >
                {/* Rank — most recent stay first */}
                <span className="w-4 shrink-0 text-center text-xs font-semibold tabular-nums text-muted-foreground/70">
                  {i + 1}
                </span>
                <Avatar className="size-8 shrink-0 border border-border/50">
                  <AvatarImage src={v.hostImage} />
                  <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                    {getInitials(v.hostName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {v.hostName ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.requests.hostedOn} {formatDate(v.date, lang)}
                  </p>
                </div>
                {/* Contact buttons — PreferenceToggle sizing (the edit-mode
                    preference buttons), tinted with the admin detail-dialog
                    tones (phone=blue, mail=rose). */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {v.hostPhoneNumber && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`tel:${v.hostPhoneNumber}`}
                          className="flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 bg-blue-500/10 text-blue-600 ring-blue-500/15 transition-colors hover:bg-blue-500/20 dark:text-blue-300"
                        >
                          <Phone className="size-4.5" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatPhone(v.hostPhoneNumber)}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {v.hostEmail && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`mailto:${v.hostEmail}`}
                          className="flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 bg-rose-500/10 text-rose-600 ring-rose-500/15 transition-colors hover:bg-rose-500/20 dark:text-rose-300"
                        >
                          <Mail className="size-4.5" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>{v.hostEmail}</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
