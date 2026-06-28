import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";

// Where contact-form submissions are delivered (the platform operator).
const CONTACT_RECIPIENT = "gelbaz.dev@gmail.com";

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

    await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
      to: CONTACT_RECIPIENT,
      subject: `Contact – ${cleanName}`,
      payload: { type: "contact", name: cleanName, email: cleanEmail, message: cleanMessage },
    });

    return { success: true };
  },
});
