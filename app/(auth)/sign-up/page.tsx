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
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignUpPage = () => {
  const [isRegistering, startRegistering] = useTransition();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: signUpSchemaDV,
  });

  const onSubmit = ({ firstName, lastName, email, password }: SignUpSchema) => {
    startRegistering(async () => {
      // try {
      await authClient.signUp.email({
        email,
        name: `${firstName} ${lastName}`,
        password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            toast.success("Signed up successfully.");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10 px-4">
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
          <h1 className="font-bold text-2xl">Sign up</h1>
          <p className="text-base text-muted-foreground">
            Create your Account to start your sharing experience
          </p>
        </div>

        {/*<div className="space-y-2">*/}
        {/*  <Button className="w-full" size="lg" type="button">*/}
        {/*    <GoogleIcon />*/}
        {/*    Continue with Google*/}
        {/*  </Button>*/}
        {/*  <Button className="w-full" size="lg" type="button">*/}
        {/*    <AppleIcon />*/}
        {/*    Continue with Apple*/}
        {/*  </Button>*/}
        {/*</div>*/}

        {/*<OrDivider />*/}

        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex gap-3 justify-between">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>First Name</FieldLabel>
                    <Input placeholder="Avraham" {...field} />

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
                    <FieldLabel>Last Name</FieldLabel>
                    <Input placeholder="Avinu" {...field} />

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
                  <FieldLabel>Email</FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      placeholder="avraham.avinu@gmail.com"
                      type="email"
                      {...field}
                    />
                    <InputGroupAddon>
                      <AtSignIcon />
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-3 justify-between">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Password</FieldLabel>

                    <Input type="password" {...field} />

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
                    <FieldLabel>Confirm Password</FieldLabel>

                    <Input type="password" {...field} />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Button className="w-full" type="submit" disabled={isRegistering}>
              {isRegistering && <Spinner />}
              Register
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

        <p className="flex justify-center items-center mt-8 text-muted-foreground text-sm">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "link",
              className: "font-normal",
            })}
          >
            Click here to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
