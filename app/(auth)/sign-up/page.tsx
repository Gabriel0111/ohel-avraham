"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { AtSignIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buildSignUpSchema,
  signUpSchemaDV,
  type SignUpSchema,
} from "@/app/schemas/sign-up-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useMemo, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import BackHomeButton from "@/app/(auth)/_components/back-home-button";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import { PasswordField } from "@/app/(auth)/_components/password-field";
import { useAuth } from "@/app/ConvexClientProvider";
import OrDivider from "@/app/(auth)/_components/or-divider";
import GoogleIcon from "@/components/icons/google";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useErrorMessage, useT } from "@/lib/i18n/context";

const SignUpPage = () => {
  const [isGoogleLoading, startGoogle] = useTransition();
  const [isEmailLoading, startEmail] = useTransition();
  const { t } = useT();
  const getErrorMessage = useErrorMessage();

  const router = useRouter();

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    redirect("/");
  }

  async function signInWithGoogle() {
    startGoogle(async () => {
      // `requestSignUp: true` lets Google create the account here (the provider
      // has `disableImplicitSignUp`, which the login page relies on to reject
      // unknown accounts).
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/complete-registration",
        errorCallbackURL: "/sign-up",
        requestSignUp: true,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(getErrorMessage(ctx.error));
          },
        },
      });
    });
  }

  const schema = useMemo(() => buildSignUpSchema(t.validation), [t.validation]);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: signUpSchemaDV,
  });

  const onSubmit = ({ firstName, lastName, email, password }: SignUpSchema) => {
    startEmail(async () => {
      const signup = await authClient.signUp.email({
        email,
        name: `${firstName} ${lastName}`,
        password,
        image: `https://avatar.vercel.sh/${email}`,
        callbackURL: "/login",
      });

      if (signup.error) {
        toast.error(getErrorMessage(signup.error));
        return;
      }

      toast.success(t.auth.signedUpSuccess);
      router.push("/complete-registration");
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <BackHomeButton />

      <div className="mx-auto w-full max-w-sm space-y-8">
        <AuthHeader title={t.auth.signUpTitle} description={t.auth.signUpDesc} />

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

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex flex-col sm:flex-row gap-5">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="firstName">
                      {t.form.firstName}
                    </FieldLabel>
                    <Input
                      id="firstName"
                      placeholder="Avraham"
                      autoComplete="given-name"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="lastName">
                      {t.form.lastName}
                    </FieldLabel>
                    <Input
                      id="lastName"
                      placeholder="Avinu"
                      autoComplete="family-name"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

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

            <div className="flex flex-col sm:flex-row gap-5">
              <PasswordField
                control={form.control}
                name="password"
                label={t.form.password}
                placeholder="••••••••"
                autoComplete="new-password"
              />

              <PasswordField
                control={form.control}
                name="confirmPassword"
                label={t.form.confirmPassword}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={isGoogleLoading || isEmailLoading}
            >
              {isEmailLoading && <Spinner />}
              {t.auth.register}
            </Button>
          </FieldGroup>
        </form>

        <p className="flex justify-center items-center text-muted-foreground text-sm">
          <span>{t.auth.alreadyHaveAccount}</span>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "link",
              className: "font-normal",
            })}
          >
            {t.auth.clickToLogin}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
