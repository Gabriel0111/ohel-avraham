"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { CalendarIcon, Minus, Plus, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

interface RequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostId: string;
  hostName: string;
}

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7 rounded-lg"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus className="size-3.5" />
        </Button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums">
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7 rounded-lg"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function RequestDialog({
  open,
  onOpenChange,
  hostId,
  hostName,
}: RequestDialogProps) {
  const { t, lang } = useT();
  const createRequest = useMutation(api.requests.createRequest);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setDate(undefined);
    setAdults(1);
    setChildren(0);
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!date) return;
    setSubmitting(true);
    try {
      await createRequest({
        hostId: hostId as Id<"hosts">,
        date: date.getTime(),
        adults,
        children,
        message: message.trim() || undefined,
      });
      toast.success(t.requests.toastSent);
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t.requests.toastSentError,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const dateLocale = lang === "fr" ? "dd MMMM yyyy" : "PPP";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t.requests.dialogTitle}</DialogTitle>
          <DialogDescription>
            {t.requests.dialogDesc.replace("{name}", hostName)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Date */}
          <div className="space-y-1.5">
            <Label>{t.requests.date}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "w-full justify-start text-start font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="size-4 shrink-0" />
                  {date ? format(date, dateLocale) : t.requests.selectDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  defaultMonth={date}
                  startMonth={new Date()}
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Party size */}
          <div className="grid grid-cols-2 gap-3">
            <Stepper
              label={t.requests.adults}
              value={adults}
              min={1}
              onChange={setAdults}
            />
            <Stepper
              label={t.requests.children}
              value={children}
              min={0}
              onChange={setChildren}
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="request-message">
              {t.requests.messageLabel}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                ({t.requests.messageOptional})
              </span>
            </Label>
            <Textarea
              id="request-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.requests.messagePlaceholder}
              rows={3}
              maxLength={600}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            {t.common.cancel}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!date || submitting}
            className="gap-2"
          >
            {submitting ? (
              <Spinner className="size-4" />
            ) : (
              <Send className="size-4" />
            )}
            {t.requests.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
