"use client";

import Link from "next/link";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRoundIcon, ShieldXIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import { PasswordField } from "@/app/(auth)/_components/password-field";
import {
  buildResetPasswordSchema,
  resetPasswordSchemaDV,
  type ResetPasswordSchema,
} from "@/app/schemas/reset-password-schema";
import { authClient } from "@/lib/auth-client";
import { useErrorMessage, useT } from "@/lib/i18n/context";

const ResetPasswordPage = () => {
  const { t } = useT();
  const getErrorMessage = useErrorMessage();
  const router = useRouter();
  const params = useSearchParams();
  const [isLoading, startSubmit] = useTransition();

  // Better Auth's callback redirects here with `?token=...`, or
  // `?error=INVALID_TOKEN` when the link is expired/invalid.
  const token = params.get("token");
  const linkError = params.get("error");
  const isLinkValid = !!token && !linkError;

  const schema = useMemo(
    () => buildResetPasswordSchema(t.validation),
    [t.validation],
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: resetPasswordSchemaDV,
  });

  const handleSubmit = ({ password }: ResetPasswordSchema) => {
    if (!token) return;
    startSubmit(async () => {
      await authClient.resetPassword({
        newPassword: password,
        token,
        fetchOptions: {
          onSuccess: () => {
            toast.success(t.auth.resetPasswordSuccess);
            router.push("/login");
          },
          onError: (ctx) => {
            toast.error(getErrorMessage(ctx.error));
          },
        },
      });
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-y-auto px-4 py-16">
      <div className="mx-auto w-full max-w-sm space-y-8">
        {isLinkValid ? (
          <>
            <AuthHeader
              title={t.auth.resetPasswordTitle}
              description={t.auth.resetPasswordDesc}
            />

            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FieldGroup>
                <PasswordField
                  control={form.control}
                  name="password"
                  label={t.form.newPassword}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  icon={KeyRoundIcon}
                />

                <PasswordField
                  control={form.control}
                  name="confirmPassword"
                  label={t.form.confirmPassword}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  icon={KeyRoundIcon}
                />

                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading && <Spinner />}
                  {t.auth.updatePassword}
                </Button>
              </FieldGroup>
            </form>
          </>
        ) : (
          <>
            <AuthHeader title={t.auth.forgotPasswordTitle} />

            <Alert variant="destructive">
              <ShieldXIcon className="size-4" />
              <AlertTitle>{t.auth.invalidResetLink}</AlertTitle>
              <AlertDescription>{t.auth.forgotPasswordDesc}</AlertDescription>
            </Alert>

            <Link
              href="/forgot-password"
              className={buttonVariants({ className: "w-full" })}
            >
              {t.auth.requestNewResetLink}
            </Link>
          </>
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

export default ResetPasswordPage;
