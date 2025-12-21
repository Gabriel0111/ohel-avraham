"use client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { AtSignIcon, ChevronLeftIcon } from "lucide-react";
import { Logo } from "@/components/icons/logo";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchemaDV } from "@/app/schemas/sign-up-schema";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

import { SignInSchema, signInSchema } from "@/app/schemas/sign-in-schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const LoginPage = () => {
  const [isRegistering, startRegistering] = useTransition();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: signUpSchemaDV,
  });

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
      <Link
        href="/"
        className={buttonVariants({
          variant: "ghost",
          className: "absolute top-7 left-5",
        })}
      >
        <ChevronLeftIcon />
        Home
      </Link>
      <div className="mx-auto space-y-5 sm:w-sm mt-10">
        <Logo className="h-5 lg:hidden pb-10" />
        <div className="flex flex-col space-y-1">
          <h1 className="font-bold text-2xl">Login</h1>
          <p className="text-base text-muted-foreground">
            Log in to your Account to start your sharing experience
          </p>
        </div>

        {/*<div className="mx-auto space-y-5 sm:w-sm">*/}
        {/*  <Logo className="h-5 lg:hidden" />*/}
        {/*  <div className="flex flex-col space-y-1">*/}
        {/*    <h1 className="font-bold text-2xl">Login</h1>*/}
        {/*    <p className="text-base text-muted-foreground">*/}
        {/*      Connect to your Account to start your sharing experience*/}
        {/*    </p>*/}
        {/*  </div>*/}

        {/*  <div className="space-y-2">*/}
        {/*    <Button className="w-full" size="lg" type="button">*/}
        {/*      <GoogleIcon />*/}
        {/*      Continue with Google*/}
        {/*    </Button>*/}
        {/*    <Button className="w-full" size="lg" type="button">*/}
        {/*      <AppleIcon />*/}
        {/*      Continue with Apple*/}
        {/*    </Button>*/}
        {/*  </div>*/}

        {/*  <OrDivider />*/}

        <form className="space-y-2" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <div className="flex flex-col gap-3 justify-between">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <InputGroup>
                    <InputGroupInput
                      placeholder="avraham.avinu@gmail.com"
                      type="email"
                      {...field}
                    />
                    <InputGroupAddon>
                      <AtSignIcon />
                    </InputGroupAddon>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </InputGroup>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Input type="password" placeholder="Password" {...field} />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
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
