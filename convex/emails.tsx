"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { renderEmail, type EmailPayload } from "../lib/emails/templates";

// Templates live in lib/emails/templates.tsx so the Next.js preview page
// (app/dev/emails) renders the exact same components this action sends.

export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    payload: v.any(),
    // Reply-To header — set for contact emails so replying from the inbox
    // reaches the visitor, not noreply@.
    replyTo: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return null;

    const html = await renderEmail(args.payload as EmailPayload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ohel Avraham <noreply@mail.ohel-avraham.com>",
        to: args.to,
        subject: args.subject,
        html,
        ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      throw new Error(`Resend ${res.status}: ${await res.text()}`);
    }

    return null;
  },
});
