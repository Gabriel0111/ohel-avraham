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
import { CalendarIcon, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useErrorMessage, useT } from "@/lib/i18n/context";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestId: string;
  guestName: string;
}

// Host → guest invitation: same shape as RequestDialog without the party-size
// stepper — the host is offering a seat, not declaring how many people come.
export function InviteDialog({
  open,
  onOpenChange,
  guestId,
  guestName,
}: InviteDialogProps) {
  const { t, lang } = useT();
  const getErrorMessage = useErrorMessage();
  const createInvitation = useMutation(api.requests.createInvitation);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setDate(undefined);
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!date) return;
    setSubmitting(true);
    try {
      await createInvitation({
        guestId: guestId as Id<"guests">,
        date: date.getTime(),
        message: message.trim() || undefined,
      });
      toast.success(t.requests.toastInvitationSent);
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
        <DialogHeader className="relative bg-gradient-to-b from-primary/8 to-transparent px-6 pt-6 pb-4 text-start border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/15">
              <Send className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold tracking-tight">
                {t.requests.inviteDialogTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 text-pretty">
                {t.requests.inviteDialogDesc.replace("{name}", guestName)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5">
          <FieldGroup>
            {/* Date */}
            <Field>
              <FieldLabel htmlFor="invite-date">{t.requests.date}</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="invite-date"
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

            {/* Message */}
            <Field>
              <FieldLabel htmlFor="invite-message">
                {t.requests.messageLabel}
              </FieldLabel>
              <Textarea
                id="invite-message"
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
            {t.requests.sendInvitation}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
