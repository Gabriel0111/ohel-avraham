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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { useErrorMessage, useT } from "@/lib/i18n/context";

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
  const getErrorMessage = useErrorMessage();
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
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const dateLocale = lang === "fr" ? "dd MMMM yyyy" : "PPP";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="relative bg-gradient-to-b from-violet-500/8 to-transparent px-6 pt-6 pb-4 text-start border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 ring-1 ring-violet-500/15">
              <Send className="size-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold tracking-tight">
                {t.requests.dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 text-pretty">
                {t.requests.dialogDesc.replace("{name}", hostName)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5">
          <FieldGroup>
            {/* Date */}
            <Field>
              <FieldLabel htmlFor="request-date">{t.requests.date}</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="request-date"
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
            </Field>

            {/* Party size */}
            <Field>
              <FieldLabel>{t.requests.partySize}</FieldLabel>
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
            </Field>

            {/* Message */}
            <Field>
              <FieldLabel htmlFor="request-message">
                {t.requests.messageLabel}
              </FieldLabel>
              <Textarea
                id="request-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.requests.messagePlaceholder}
                rows={3}
                maxLength={600}
                className="resize-none"
              />
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/20 gap-2">
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
