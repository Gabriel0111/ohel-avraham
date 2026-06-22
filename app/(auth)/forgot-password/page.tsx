"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSignIcon, ChevronLeftIcon, MailCheckIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import {
  buildForgotPasswordSchema,
  forgotPasswordSchemaDV,
  type ForgotPasswordSchema,
} from "@/app/schemas/forgot-password-schema";
import { authClient } from "@/lib/auth-client";
import { useErrorMessage, useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const ForgotPasswordPage = () => {
  const { t } = useT();
  const getErrorMessage = useErrorMessage();
  const [isLoading, startSubmit] = useTransition();
  const [sent, setSent] = useState(false);

  const schema = useMemo(
    () => buildForgotPasswordSchema(t.validation),
    [t.validation],
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: forgotPasswordSchemaDV,
  });

  const handleSubmit = ({ email }: ForgotPasswordSchema) => {
    startSubmit(async () => {
      await authClient.requestPasswordReset({
        email,
        // Relative path: Better Auth's callback redirects here with `?token=`.
        redirectTo: "/reset-password",
        fetchOptions: {
          onSuccess: () => setSent(true),
          onError: (ctx) => {
            toast.error(getErrorMessage(ctx.error));
          },
        },
      });
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-y-auto px-4 py-16">
      <Link
        href="/login"
        className={buttonVariants({
          variant: "ghost",
          className: "absolute top-7 start-5",
        })}
      >
        <ChevronLeftIcon />
        {t.auth.backToLogin}
      </Link>

      <div className="mx-auto w-full max-w-sm space-y-8">
        <AuthHeader
          title={t.auth.forgotPasswordTitle}
          description={t.auth.forgotPasswordDesc}
        />

        {sent ? (
          <Alert className="border-primary/20 bg-primary/5">
            <MailCheckIcon className="size-4 text-primary" />
            <AlertTitle>{t.auth.resetLinkSentTitle}</AlertTitle>
            <AlertDescription>{t.auth.resetLinkSentDesc}</AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">{t.form.email}</FieldLabel>

                    <InputGroup aria-invalid={fieldState.invalid}>
                      <InputGroupInput
                        id="email"
                        placeholder="avraham.avinu@gmail.com"
                        type="email"
                        dir="ltr"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <InputGroupAddon align="inline-start">
                        <AtSignIcon
                          className={cn(
                            fieldState.invalid && "text-destructive",
                          )}
                        />
                      </InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Spinner />}
                {t.auth.sendResetLink}
              </Button>
            </FieldGroup>
          </form>
        )}

        <p className="flex justify-center items-center text-muted-foreground text-sm">
          <Link
            href="/login"
            className={buttonVariants({
              variant: "link",
              className: "font-normal",
            })}
          >
            {t.auth.backToLogin}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
