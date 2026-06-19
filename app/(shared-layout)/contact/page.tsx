"use client";

import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Send, MessageSquareHeart } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Footer } from "../_components/footer";
import { useT } from "@/lib/i18n/context";

export default function ContactPage() {
  const { t } = useT();
  const [isSending, startSending] = useTransition();
  const submitContact = useMutation(api.contact.submitContact);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t.contact.validationName),
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t.contact.validationEmail),
        message: z.string().min(10, t.contact.validationMessage),
      }),
    [t.contact],
  );

  type ContactForm = z.infer<typeof schema>;

  const form = useForm<ContactForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = (values: ContactForm) => {
    startSending(async () => {
      try {
        await submitContact(values);
        toast.success(t.contact.success);
        form.reset();
      } catch {
        toast.error(t.contact.error);
      }
    });
  };

  return (
    <main>
      <div className="py-10 sm:py-16">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
            <MessageSquareHeart className="size-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.contact.title}
          </h1>
          <p className="max-w-xl text-balance text-muted-foreground">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="mx-auto mt-12 w-full max-w-xl">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8"
          >
            <FieldGroup>
              <div className="grid gap-5">
                <Field>
                  <FieldLabel htmlFor="contact-name">
                    {t.contact.formName}
                  </FieldLabel>
                  <Input
                    id="contact-name"
                    placeholder={t.contact.formNamePlaceholder}
                    aria-invalid={!!form.formState.errors.name}
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <FieldError errors={[form.formState.errors.name]} />
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact-email">
                    {t.contact.formEmail}
                  </FieldLabel>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder={t.contact.formEmailPlaceholder}
                    aria-invalid={!!form.formState.errors.email}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <FieldError errors={[form.formState.errors.email]} />
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact-message">
                    {t.contact.formMessage}
                  </FieldLabel>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    className="resize-none"
                    placeholder={t.contact.formMessagePlaceholder}
                    aria-invalid={!!form.formState.errors.message}
                    {...form.register("message")}
                  />
                  {form.formState.errors.message && (
                    <FieldError errors={[form.formState.errors.message]} />
                  )}
                </Field>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSending}
                >
                  {isSending ? <Spinner /> : <Send className="size-4" />}
                  {isSending ? t.contact.sending : t.contact.submit}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
