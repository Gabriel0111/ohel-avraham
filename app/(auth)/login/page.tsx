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
import { signUpSchemaDV } from "@/app/schemas/sign-up-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordField } from "@/app/(auth)/_components/password-field";
import { Controller, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { SignInSchema, signInSchema } from "@/app/schemas/sign-in-schema";
import { Suspense, useTransition } from "react";
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

const LoginPage = () => {
  const [isRegistering, startRegistering] = useTransition();
  const { t } = useT();
  const getErrorMessage = useErrorMessage();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    redirect("/");
  }

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: signUpSchemaDV,
  });

  async function signInWithGoogle() {
    startRegistering(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: async () => {
            toast.success(t.auth.signedInWithGoogle);
          },
          onError: (ctx) => {
            toast.error(getErrorMessage(ctx.error));
          },
        },
      });
    });
  }

  const handleSubmit = ({ email, password }: SignInSchema) => {
    startRegistering(async () => {
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
        </Suspense>

        <AuthHeader title={t.auth.loginTitle} description={t.auth.loginDesc} />

        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isRegistering}
          onClick={signInWithGoogle}
        >
          {isRegistering ? <Spinner /> : <GoogleIcon />}
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

            <Button className="w-full" type="submit" disabled={isRegistering}>
              {isRegistering && <Spinner />}
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
