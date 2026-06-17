"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  // Captured once at mount — enough to decide how to render the banner.
  const [now] = useState(() => Date.now());
  // Mirror the server rule: off only counts while a return date (if any) is
  // still in the future.
  const until =
    host.isAvailable === false &&
    host.unavailableUntil != null &&
    host.unavailableUntil > now
      ? host.unavailableUntil
      : null;
  const isAvailable = host.isAvailable !== false || until === null;

  const dateFmt = lang === "fr" ? "dd MMMM yyyy" : "PPP";

  const goAvailable = () =>
    startTransition(async () => {
      try {
        await setAvailability({ available: true });
        toast.success(t.hostProfile.toastAvailable);
      } catch {
        toast.error(t.hostProfile.availabilityError);
      }
    });

  const goUnavailable = () =>
    startTransition(async () => {
      try {
        await setAvailability({
          available: false,
          unavailableUntil: returnDate ? returnDate.getTime() : undefined,
        });
        toast.success(t.hostProfile.toastUnavailable);
        setDialogOpen(false);
        setReturnDate(undefined);
      } catch {
        toast.error(t.hostProfile.availabilityError);
      }
    });

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border p-3",
        isAvailable
          ? "border-green-500/20 bg-green-500/5"
          : "border-amber-500/25 bg-amber-500/5",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-full shrink-0",
            isAvailable
              ? "bg-green-500/15 text-green-600"
              : "bg-amber-500/15 text-amber-600",
          )}
        >
          {isAvailable ? (
            <CircleCheck className="size-4" />
          ) : (
            <CircleSlash className="size-4" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {isAvailable ? t.hostProfile.available : t.hostProfile.unavailable}
          </p>
          <p className="text-xs text-muted-foreground text-pretty">
            {isAvailable
              ? t.hostProfile.availableDesc
              : until
                ? t.hostProfile.unavailableUntilDesc.replace(
                    "{date}",
                    format(new Date(until), dateFmt),
                  )
                : t.hostProfile.unavailableDesc}
          </p>
        </div>
      </div>

      {isAvailable ? (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => setDialogOpen(true)}
        >
          <PowerOff className="size-3.5" />
          {t.hostProfile.makeUnavailable}
        </Button>
      ) : (
        <Button
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={pending}
          onClick={goAvailable}
        >
          {pending ? <Spinner className="size-3.5" /> : <Power className="size-3.5" />}
          {t.hostProfile.makeAvailable}
        </Button>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.hostProfile.unavailableDialogTitle}</DialogTitle>
            <DialogDescription className="text-pretty">
              {t.hostProfile.unavailableDialogDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-1">
            <Label>
              {t.hostProfile.returnDateLabel}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                ({t.hostProfile.returnDateOptional})
              </span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "w-full justify-start text-start font-normal",
                    !returnDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="size-4 shrink-0" />
                  {returnDate
                    ? format(returnDate, dateFmt)
                    : t.hostProfile.indefinitely}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  defaultMonth={returnDate}
                  startMonth={new Date()}
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {returnDate && (
              <button
                type="button"
                onClick={() => setReturnDate(undefined)}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                {t.hostProfile.clearReturnDate}
              </button>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={pending}
            >
              {t.common.cancel}
            </Button>
            <Button onClick={goUnavailable} disabled={pending} className="gap-1.5">
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
