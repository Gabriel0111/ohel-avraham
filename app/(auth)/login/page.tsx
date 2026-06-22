"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { AtSignIcon, KeyRoundIcon, MailCheckIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordField } from "@/app/(auth)/_components/password-field";
import { Controller, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  buildSignInSchema,
  signInSchemaDV,
  type SignInSchema,
} from "@/app/schemas/sign-in-schema";
import { Suspense, useEffect, useMemo, useRef, useTransition } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import BackHomeButton from "@/app/(auth)/_components/back-home-button";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import OrDivider from "@/app/(auth)/_components/or-divider";
import GoogleIcon from "@/components/icons/google";
import { cn } from "@/lib/utils";
import { useErrorMessage, useT } from "@/lib/i18n/context";
import { useAuth } from "@/app/ConvexClientProvider";

function VerifyEmailNotice() {
  const { t } = useT();
  const params = useSearchParams();
  if (params.get("verify") !== "1") return null;
  return (
    <Alert className="border-primary/20 bg-primary/5">
      <MailCheckIcon className="size-4 text-primary" />
      <AlertTitle>{t.auth.verifyEmailTitle}</AlertTitle>
      <AlertDescription>{t.auth.verifyEmailDesc}</AlertDescription>
    </Alert>
  );
}

// Better Auth bounces a Google sign-in for a non-existent account back here
// with `?error=signup_disabled` (a full-page redirect, so the client onError
// callback can't catch it). Surface it once on landing.
function GoogleSignInError() {
  const { t } = useT();
  const params = useSearchParams();
  const router = useRouter();
  const shown = useRef(false);
  useEffect(() => {
    if (shown.current) return;
    if (params.get("error") === "signup_disabled") {
      shown.current = true;
      toast.error(t.auth.noGoogleAccount);
      router.replace("/login");
    }
  }, [params, router, t]);
  return null;
}

const LoginPage = () => {
  const [isGoogleLoading, startGoogle] = useTransition();
  const [isEmailLoading, startEmail] = useTransition();
  const { t } = useT();
  const getErrorMessage = useErrorMessage();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    redirect("/");
  }

  const router = useRouter();

  const schema = useMemo(() => buildSignInSchema(t.validation), [t.validation]);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: signInSchemaDV,
  });

  async function signInWithGoogle() {
    startGoogle(async () => {
      // `errorCallbackURL` brings a non-existent account back to
      // /login?error=signup_disabled.
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/login",
        fetchOptions: {
          onError: (ctx) => {
            toast.error(getErrorMessage(ctx.error));
          },
        },
      });
    });
  }

  const handleSubmit = ({ email, password }: SignInSchema) => {
    startEmail(async () => {
      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            toast.success(t.auth.loginSuccess);
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
      <BackHomeButton />

      <div className="mx-auto w-full max-w-sm space-y-8">
        <Suspense>
          <VerifyEmailNotice />
          <GoogleSignInError />
        </Suspense>

        <AuthHeader title={t.auth.loginTitle} description={t.auth.loginDesc} />

        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isGoogleLoading || isEmailLoading}
          onClick={signInWithGoogle}
        >
          {isGoogleLoading ? <Spinner /> : <GoogleIcon />}
          {t.auth.continueWithGoogle}
        </Button>

        <OrDivider />

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
                        className={cn(fieldState.invalid && "text-destructive")}
                      />
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <PasswordField
              control={form.control}
              name="password"
              label={t.form.password}
              placeholder="••••••••"
              autoComplete="current-password"
              icon={KeyRoundIcon}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={isGoogleLoading || isEmailLoading}
            >
              {isEmailLoading && <Spinner />}
              {t.auth.continueWithEmail}
            </Button>
          </FieldGroup>
        </form>

        <p className="flex justify-center items-center text-muted-foreground text-sm">
          <span>{t.auth.noAccount}</span>
          <Link
            href="/sign-up"
            className={buttonVariants({
              variant: "link",
              className: "font-normal",
            })}
          >
            {t.auth.clickToRegister}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
