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
  SignUpSchema,
  signUpSchema,
  signUpSchemaDV,
} from "@/app/schemas/sign-up-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import BackHomeButton from "@/app/(auth)/_components/back-home-button";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import { useAuth } from "@/app/ConvexClientProvider";
import OrDivider from "@/app/(auth)/_components/or-divider";
import GoogleIcon from "@/components/icons/google";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

const SignUpPage = () => {
  const [isRegistering, startRegistering] = useTransition();
  const { t } = useT();

  const router = useRouter();

  const createNewUser = useMutation(api.users.createUser);

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    redirect("/");
  }

  async function signInWithGoogle() {
    startRegistering(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/complete-registration",
        fetchOptions: {
          onSuccess: async () => {
            toast.success(t.auth.signedInWithGoogle);
          },
          onError: () => {
            toast.error("Internal Server Error");
          },
        },
      });
    });
  }

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: signUpSchemaDV,
  });

  const onSubmit = ({ firstName, lastName, email, password }: SignUpSchema) => {
    startRegistering(async () => {
      const signup = await authClient.signUp.email({
        email,
        name: `${firstName} ${lastName}`,
        password,
        image: `https://avatar.vercel.sh/${email}`,
      });

      if (signup.error) {
        toast.error(signup.error.message);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const signIn = await authClient.signIn.email({
        email,
        password,
      });

      if (signIn.error) {
        toast.error(signIn.error.message);
        return;
      }

      const result = await createNewUser();

      if (result) {
        router.push("/complete-registration");
        toast.success(t.auth.signedUpSuccess);
      } else {
        toast.error(t.auth.errorCreating);
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10 px-4">
      <BackHomeButton />

      <div className="mx-auto space-y-8 md:w-sm w-sm mt-10">
        <AuthHeader
          title={t.auth.signUpTitle}
          description={t.auth.signUpDesc}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={isRegistering}
          onClick={signInWithGoogle}
        >
          {isRegistering ? <Spinner /> : <GoogleIcon />}
          {t.auth.continueWithGoogle}
        </Button>

        <OrDivider />

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex flex-col md:flex-row gap-5 justify-between">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t.form.firstName}</FieldLabel>
                    <Input
                      placeholder="Avraham"
                      aria-invalid={fieldState.invalid}
                      className={cn(fieldState.invalid && "text-destructive")}
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
                    <FieldLabel>{t.form.lastName}</FieldLabel>
                    <Input
                      placeholder="Avinu"
                      aria-invalid={fieldState.invalid}
                      className={cn(fieldState.invalid && "text-destructive")}
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
                  <FieldLabel>{t.form.email}</FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      placeholder="avraham.avinu@gmail.com"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      className={cn(fieldState.invalid && "text-destructive")}
                      {...field}
                    />
                    <InputGroupAddon>
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

            <div className="flex flex-col md:flex-row gap-5 justify-between">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t.form.password}</FieldLabel>

                    <Input
                      type="password"
                      aria-invalid={fieldState.invalid}
                      className={cn(fieldState.invalid && "text-destructive")}
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t.form.confirmPassword}</FieldLabel>

                    <Input
                      type="password"
                      aria-invalid={fieldState.invalid}
                      className={cn(fieldState.invalid && "text-destructive")}
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Button className="w-full" type="submit" disabled={isRegistering}>
              {isRegistering && <Spinner />}
              {t.auth.register}
            </Button>
          </FieldGroup>
        </form>
        {/*<p className="mt-8 text-muted-foreground text-sm">*/}
        {/*  By clicking continue, you agree to our{" "}*/}
        {/*  <a*/}
        {/*    className="underline underline-offset-4 hover:text-primary"*/}
        {/*    href="#"*/}
        {/*  >*/}
        {/*    Terms of Service*/}
        {/*  </a>{" "}*/}
        {/*  and{" "}*/}
        {/*  <a*/}
        {/*    className="underline underline-offset-4 hover:text-primary"*/}
        {/*    href="#"*/}
        {/*  >*/}
        {/*    Privacy Policy*/}
        {/*  </a>*/}
        {/*  .*/}
        {/*</p>*/}

        <p className="flex justify-center items-center mt-2 text-muted-foreground text-sm">
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
