"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { endOfDay, format, startOfDay } from "date-fns";
import { enUS, fr, he } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { CalendarIcon, CircleCheck, CircleSlash, Power, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

export function HostAvailability({ host }: { host: Doc<"hosts"> }) {
  const { t, lang } = useT();
  const setAvailability = useMutation(api.hosts.setHostAvailability);
  const [pending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  // The dialog offers two mutually exclusive choices: an open-ended window
  // ("until further notice") or a specific date range. Picking one clears the
  // other; confirming applies whichever is selected.
  const [indefinite, setIndefinite] = useState(false);

  // Captured once at mount — enough to decide how to render the banner.
  const [now] = useState(() => Date.now());

  const from = host.unavailableFrom ?? null;
  const until = host.unavailableUntil ?? null;

  // Mirror the server window rule (convex/hosts.ts:isHostAvailable). "off" =
  // we're currently inside the unavailable window: started (from absent or
  // past) and not yet ended (until absent or future). Both absent = the legacy
  // "unavailable indefinitely from now" state.
  const off =
    host.isAvailable === false &&
    (from == null || from <= now) &&
    (until == null || until >= now);
  const isAvailable = !off;

  // A window is "live" when one is set and its end hasn't passed — either
  // current or scheduled for the future. Drives which action button to show:
  // the auto-restore is read-time, so a passed window leaves isAvailable=false
  // lingering, and that host should be offered "become unavailable", not "clear".
  const hasLiveWindow =
    host.isAvailable === false && (until == null || until >= now);

  // Localize month/weekday names and formatted dates with the active language.
  const dateLocale = lang === "fr" ? fr : lang === "he" ? he : enUS;
  const dateFmt = lang === "fr" ? "dd MMM yyyy" : "PP";
  const fmt = (ms: number) =>
    format(new Date(ms), dateFmt, { locale: dateLocale });

  // Discard any in-progress selection when the dialog closes, so reopening it
  // never shows a stale range that was never confirmed.
  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setRange(undefined);
      setIndefinite(false);
    }
  };

  const goAvailable = () =>
    startTransition(async () => {
      try {
        await setAvailability({ available: true });
        toast.success(t.hostProfile.toastAvailable);
      } catch {
        toast.error(t.hostProfile.availabilityError);
      }
    });

  const submitUnavailable = (from?: number, until?: number) =>
    startTransition(async () => {
      try {
        await setAvailability({
          available: false,
          unavailableFrom: from,
          unavailableUntil: until,
        });
        toast.success(t.hostProfile.toastUnavailable);
        handleDialogChange(false);
      } catch {
        toast.error(t.hostProfile.availabilityError);
      }
    });

  // A picked range hides the host for that span (whole first day → whole last
  // day); "until further notice" sends an open-ended window (no dates).
  const goUnavailable = () => {
    if (!range?.from || !range?.to) return;
    submitUnavailable(
      startOfDay(range.from).getTime(),
      endOfDay(range.to).getTime(),
    );
  };
  const goUnavailableIndefinitely = () => submitUnavailable();

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border p-3",
        isAvailable
          ? "border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent"
          : "border-red-500/25 bg-gradient-to-br from-red-500/10 to-transparent",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-full shrink-0",
            isAvailable
              ? "bg-green-500/15 text-green-600"
              : "bg-red-500/15 text-red-600",
          )}
        >
          {isAvailable ? (
            <CircleCheck className="size-4" />
          ) : (
            <CircleSlash className="size-4" />
          )}
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-semibold",
              isAvailable
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400",
            )}
          >
            {isAvailable ? t.hostProfile.available : t.hostProfile.unavailable}
          </p>
          <p className="text-xs text-muted-foreground text-pretty">
            {off
              ? until != null
                ? t.hostProfile.unavailableUntilDesc.replace("{date}", fmt(until))
                : t.hostProfile.unavailableDesc
              : hasLiveWindow && from != null && until != null
                ? t.hostProfile.unavailableScheduledDesc
                    .replace("{from}", fmt(from))
                    .replace("{until}", fmt(until))
                : t.hostProfile.availableDesc}
          </p>
        </div>
      </div>

      {hasLiveWindow ? (
        <Button
          variant="success"
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={pending}
          onClick={goAvailable}
        >
          {pending ? <Spinner className="size-3.5" /> : <Power className="size-3.5" />}
          {t.hostProfile.makeAvailable}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
          onClick={() => setDialogOpen(true)}
        >
          <PowerOff className="size-3.5" />
          {t.hostProfile.makeUnavailable}
        </Button>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.hostProfile.unavailableDialogTitle}</DialogTitle>
            <DialogDescription className="text-pretty">
              {t.hostProfile.unavailableDialogDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            {/* Open-ended option first: selecting it clears any date range;
                confirming applies it. */}
            <Button
              variant={indefinite ? "destructive" : "outline"}
              disabled={pending}
              onClick={() => {
                setIndefinite((v) => !v);
                setRange(undefined);
              }}
              className={cn(
                "w-full gap-1.5",
                !indefinite &&
                  "border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400",
              )}
            >
              <PowerOff className="size-3.5" />
              {t.hostProfile.makeUnavailableIndefinitely}
            </Button>

            {/* — or — pick a specific period below */}
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground lowercase">
                {t.common.or}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex items-center justify-between">
              <Label>{t.hostProfile.unavailablePeriodLabel}</Label>
              {range?.from && (
                <button
                  type="button"
                  onClick={() => setRange(undefined)}
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  {t.hostProfile.clearReturnDate}
                </button>
              )}
            </div>
            <div
              className={cn(
                "flex justify-center rounded-xl border bg-muted/20 p-2 transition-opacity",
                indefinite && "opacity-50",
              )}
            >
              <Calendar
                mode="range"
                locale={dateLocale}
                selected={range}
                onSelect={(r) => {
                  setRange(r);
                  setIndefinite(false);
                }}
                numberOfMonths={1}
                defaultMonth={range?.from ?? new Date()}
                startMonth={new Date()}
                disabled={(d) => d < startOfDay(new Date())}
              />
            </div>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <CalendarIcon className="size-3.5 shrink-0" />
              {range?.from
                ? range.to
                  ? `${format(range.from, dateFmt, { locale: dateLocale })} → ${format(range.to, dateFmt, { locale: dateLocale })}`
                  : format(range.from, dateFmt, { locale: dateLocale })
                : t.hostProfile.selectPeriod}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={pending}
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={indefinite ? goUnavailableIndefinitely : goUnavailable}
              disabled={
                pending || (!indefinite && (!range?.from || !range?.to))
              }
              className="gap-1.5"
            >
              {pending ? (
                <Spinner className="size-4" />
              ) : (
                <PowerOff className="size-4" />
              )}
              {t.hostProfile.confirmUnavailable}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
