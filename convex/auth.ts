import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { betterAuth } from "better-auth";
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
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Ohel Avraham <gelbaz.dev@gmail.com>",
            to: user.email,
            subject: "Verify your email – Ohel Avraham",
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#111;">
                <h1 style="font-size:22px;font-weight:600;margin-bottom:8px;">Verify your email</h1>
                <p style="color:#555;line-height:1.6;margin-bottom:28px;">
                  Thank you for joining <strong>Ohel Avraham</strong>. Click the button below to verify your email address and complete your registration.
                </p>
                <a href="${url}" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px;">Verify my email</a>
                <p style="color:#999;margin-top:28px;font-size:13px;">If you did not create an account, you can safely ignore this email.</p>
              </div>
            `,
          }),
        });
      },
    },
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
    ],
  });
