"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { AtSignIcon, KeyRoundIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchemaDV } from "@/app/schemas/sign-up-schema";
import { FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";

import { SignInSchema, signInSchema } from "@/app/schemas/sign-in-schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import BackHomeButton from "@/app/(auth)/_components/back-home-button";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import OrDivider from "@/app/(auth)/_components/or-divider";
import GoogleIcon from "@/components/icons/google";
import { cn } from "@/lib/utils";

const LoginPage = () => {
  const [isRegistering, startRegistering] = useTransition();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: signUpSchemaDV,
  });

  async function signInWithGoogle() {
    startRegistering(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/complete-registration",
        fetchOptions: {
          onSuccess: async () => {
            toast.success("Signed in with Google, you will be redirected...");
          },
          onError: () => {
            toast.error("Internal Server Error");
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
            toast.success("Login successfully.");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  };

  return (
    <div className="relative flex flex-col py-10 px-4 min-h-screen justify-center overflow-y-auto">
      <BackHomeButton />

      <div className="mx-auto space-y-8 sm:w-sm mt-10">
        <AuthHeader
          title="Login"
          description="Log in to your Account to start your sharing experience"
        />

        <Button
          className="w-full"
          type="submit"
          disabled={isRegistering}
          onClick={signInWithGoogle}
        >
          {isRegistering ? <Spinner /> : <GoogleIcon />}
          Continue with Google
        </Button>

        <OrDivider />

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <div className="flex flex-col space-y-5 justify-between">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <FieldLabel>Email</FieldLabel>

                    <InputGroup aria-invalid={fieldState.invalid}>
                      <InputGroupInput
                        placeholder="avraham.avinu@gmail.com"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        className={cn(fieldState.invalid && "text-destructive")}
                        {...field}
                      />
                      <InputGroupAddon>
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
                  </>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <FieldLabel>Password</FieldLabel>

                    <InputGroup aria-invalid={fieldState.invalid}>
                      <InputGroupAddon>
                        <KeyRoundIcon
                          className={cn(
                            fieldState.invalid && "text-destructive",
                          )}
                        />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="password"
                        aria-invalid={fieldState.invalid}
                        className={cn(fieldState.invalid && "text-destructive")}
                        {...field}
                      />
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </>
                )}
              />

              <Button className="w-full" type="submit" disabled={isRegistering}>
                {isRegistering && <Spinner />}
                Continue With Email
              </Button>
            </div>
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

        <p className="flex justify-center items-center mt-8 text-muted-foreground text-sm">
          <span>Don&#39;t have an account?</span>
          <Link
            href="/sign-up"
            className={buttonVariants({
              variant: "link",
              className: "font-normal",
            })}
          >
            Click here to register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
