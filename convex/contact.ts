import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";

// Where contact-form submissions are delivered (the platform operator).
const CONTACT_RECIPIENT = "gelbaz.dev@gmail.com";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const emailShell = (title: string, body: string) => `
  <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#111;">
    <h1 style="font-size:22px;font-weight:600;margin-bottom:8px;">${title}</h1>
    ${body}
    <p style="color:#999;margin-top:28px;font-size:13px;">Ohel Avraham — la tente d'Abraham.</p>
  </div>
`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, { name, email, message }) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2 || !EMAIL_RE.test(cleanEmail) || cleanMessage.length < 10) {
      throw new ConvexError({ code: "invalidInput" });
    }

    await ctx.scheduler.runAfter(0, internal.requests.sendEmail, {
      to: CONTACT_RECIPIENT,
      subject: `Contact – ${cleanName}`,
      html: emailShell(
        "Nouveau message de contact",
        `<p style="color:#555;line-height:1.6;">
           <strong>${escapeHtml(cleanName)}</strong>
           (<a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a>)
           vous a écrit&nbsp;:
         </p>
         <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #7c3aed;background:#f5f3ff;color:#444;border-radius:6px;white-space:pre-wrap;">${escapeHtml(
           cleanMessage,
         )}</blockquote>`,
      ),
    });

    return { success: true };
  },
});
