import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import authConfig from "./auth.config";

import { nextCookies } from "better-auth/next-js";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        // Rendering (React components, in convex/emails.tsx) needs Node APIs
        // this httpAction's default runtime doesn't have, so it's delegated
        // to the "use node" internal action instead of rendered inline.
        await requireActionCtx(ctx).scheduler.runAfter(0, internal.emails.sendEmail, {
          to: user.email,
          subject: "Reset your password – Ohel Avraham",
          payload: { type: "reset_password", url },
        });
      },
    },
    // No `emailVerification.sendVerificationEmail` here: the emailOTP plugin's
    // `overrideDefaultEmailVerification` below takes over email verification
    // entirely and routes it through `sendVerificationOTP`.
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
        // Always show the Google account chooser so users can pick an account
        // other than the one their browser is already signed into.
        prompt: "select_account",
        // Don't silently create an account on Google sign-in. The login page
        // omits `requestSignUp`, so a Google account with no record gets
        // bounced back with `?error=signup_disabled` ("account doesn't exist").
        // The sign-up page passes `requestSignUp: true` to allow creation.
        disableImplicitSignUp: true,
      },
    },
    plugins: [
      convex({ authConfig }),
      nextCookies(),
      emailOTP({
        // Sends the verification code right after email/password sign-up,
        // and routes every "verify email" flow through a code instead of a link.
        sendVerificationOnSignUp: true,
        overrideDefaultEmailVerification: true,
        otpLength: 6,
        expiresIn: 60 * 10, // 10 minutes
        sendVerificationOTP: async ({ email, otp, type }) => {
          if (type !== "email-verification") return;
          await requireActionCtx(ctx).scheduler.runAfter(0, internal.emails.sendEmail, {
            to: email,
            subject: `${otp} is your verification code – Ohel Avraham`,
            payload: { type: "verify_otp", otp },
          });
        },
      }),
    ],
  });
