import { mutation, query, internalAction, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { RequestStatusV } from "./validators/request";
import type { Doc } from "./_generated/dataModel";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getUserByAuthId(ctx: QueryCtx, authUserId: string) {
  return ctx.db
    .query("users")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
    .unique();
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function partyLabel(adults: number, children: number) {
  const parts = [`${adults} adulte${adults > 1 ? "s" : ""}`];
  if (children > 0) parts.push(`${children} enfant${children > 1 ? "s" : ""}`);
  return parts.join(" · ");
}

// Contact details stay visible through the invitation day, then a day of grace,
// after which they're withheld — the meal is past and the connection private again.
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
function isRequestExpired(dateMs: number) {
  return Date.now() > dateMs + ONE_DAY_MS;
}

const emailShell = (title: string, body: string) => `
  <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#111;">
    <h1 style="font-size:22px;font-weight:600;margin-bottom:8px;">${title}</h1>
    ${body}
    <p style="color:#999;margin-top:28px;font-size:13px;">Ohel Avraham — la tente d'Abraham.</p>
  </div>
`;

// ─── Mutations ──────────────────────────────────────────────────────────────

export const createRequest = mutation({
  args: {
    hostId: v.id("hosts"),
    date: v.number(),
    adults: v.number(),
    children: v.number(),
    message: v.optional(v.string()),
  },
  returns: v.object({ id: v.id("requests") }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const guestAuthUserId = identity.subject;

    const host = await ctx.db.get(args.hostId);
    if (!host) throw new Error("Hôte introuvable.");
    const hostAuthUserId = host.authUserId;

    if (guestAuthUserId === hostAuthUserId) {
      throw new Error("Vous ne pouvez pas vous envoyer une demande à vous-même.");
    }
    if (args.adults < 1) {
      throw new Error("Au moins un adulte est requis.");
    }

    // Prevent stacking multiple pending requests to the same host.
    const existing = await ctx.db
      .query("requests")
      .withIndex("by_guest_host", (q) =>
        q
          .eq("guestAuthUserId", guestAuthUserId)
          .eq("hostAuthUserId", hostAuthUserId),
      )
      .collect();
    if (existing.some((r) => r.status === "pending")) {
      throw new Error("Vous avez déjà une demande en attente auprès de cet hôte.");
    }

    const id = await ctx.db.insert("requests", {
      guestAuthUserId,
      hostAuthUserId,
      date: args.date,
      adults: args.adults,
      children: args.children,
      message: args.message?.trim() || undefined,
      status: "pending",
      createdAt: Date.now(),
    });

    // Notify the host by email (best-effort, out of band).
    const [guestUser, hostUser] = await Promise.all([
      getUserByAuthId(ctx, guestAuthUserId),
      getUserByAuthId(ctx, hostAuthUserId),
    ]);

    if (hostUser?.email) {
      const guestName = guestUser?.name ?? "Un invité";
      await ctx.scheduler.runAfter(0, internal.requests.sendEmail, {
        to: hostUser.email,
        subject: `Nouvelle demande de ${guestName} – Ohel Avraham`,
        html: emailShell(
          "Vous avez reçu une nouvelle demande",
          `<p style="color:#555;line-height:1.6;">
             <strong>${guestName}</strong> souhaite être reçu(e) pour le
             <strong>${formatDate(args.date)}</strong> (${partyLabel(
               args.adults,
               args.children,
             )}).
           </p>
           ${
             args.message?.trim()
               ? `<blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #7c3aed;background:#f5f3ff;color:#444;border-radius:6px;">${args.message.trim()}</blockquote>`
               : ""
           }
           <p style="color:#555;line-height:1.6;">Connectez-vous à votre tableau de bord pour accepter ou refuser.</p>`,
        ),
      });
    }

    return { id };
  },
});

export const respondToRequest = mutation({
  args: {
    requestId: v.id("requests"),
    accept: v.boolean(),
  },
  returns: v.object({ status: RequestStatusV }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Demande introuvable.");

    // Only the targeted host may respond.
    if (request.hostAuthUserId !== identity.subject) {
      throw new Error("Vous n'êtes pas autorisé à répondre à cette demande.");
    }
    if (request.status !== "pending") {
      throw new Error("Cette demande a déjà été traitée.");
    }

    const status: "accepted" | "declined" = args.accept
      ? "accepted"
      : "declined";
    await ctx.db.patch(args.requestId, { status, respondedAt: Date.now() });

    // Notify the guest by email.
    const [guestUser, hostUser] = await Promise.all([
      getUserByAuthId(ctx, request.guestAuthUserId),
      getUserByAuthId(ctx, request.hostAuthUserId),
    ]);

    if (guestUser?.email) {
      const hostName = hostUser?.name ?? "L'hôte";
      const accepted = args.accept;
      await ctx.scheduler.runAfter(0, internal.requests.sendEmail, {
        to: guestUser.email,
        subject: accepted
          ? `${hostName} a accepté votre demande – Ohel Avraham`
          : `Réponse à votre demande – Ohel Avraham`,
        html: emailShell(
          accepted ? "Votre demande a été acceptée 🎉" : "Réponse à votre demande",
          accepted
            ? `<p style="color:#555;line-height:1.6;">
                 <strong>${hostName}</strong> vous accueille pour le
                 <strong>${formatDate(request.date)}</strong>.
                 Retrouvez ses coordonnées (téléphone et adresse) dans votre tableau de bord.
               </p>`
            : `<p style="color:#555;line-height:1.6;">
                 <strong>${hostName}</strong> n'est malheureusement pas disponible pour le
                 <strong>${formatDate(request.date)}</strong>. N'hésitez pas à contacter d'autres hôtes.
               </p>`,
        ),
      });
    }

    return { status };
  },
});

export const cancelRequest = mutation({
  args: { requestId: v.id("requests") },
  returns: v.object({ cancelled: v.boolean() }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Demande introuvable.");
    if (request.guestAuthUserId !== identity.subject) {
      throw new Error("Vous n'êtes pas autorisé à annuler cette demande.");
    }
    if (request.status !== "pending") {
      throw new Error("Seule une demande en attente peut être annulée.");
    }

    await ctx.db.patch(args.requestId, {
      status: "cancelled",
      respondedAt: Date.now(),
    });
    return { cancelled: true };
  },
});

// ─── Queries ────────────────────────────────────────────────────────────────

type RequestDoc = Doc<"requests">;

function baseRequest(r: RequestDoc) {
  return {
    _id: r._id,
    _creationTime: r._creationTime,
    status: r.status,
    date: r.date,
    adults: r.adults,
    children: r.children,
    message: r.message,
    createdAt: r.createdAt,
    respondedAt: r.respondedAt,
  };
}

// Host's inbox — requests received, joined with the requesting guest's profile.
export const getMyIncomingRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const requests = await ctx.db
      .query("requests")
      .withIndex("by_host", (q) => q.eq("hostAuthUserId", identity.subject))
      .collect();

    return Promise.all(
      requests
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async (r) => {
          const [user, guest] = await Promise.all([
            getUserByAuthId(ctx, r.guestAuthUserId),
            ctx.db
              .query("guests")
              .withIndex("by_authUserId", (q) =>
                q.eq("authUserId", r.guestAuthUserId),
              )
              .unique(),
          ]);
          const expired = isRequestExpired(r.date);
          const reveal = r.status === "accepted" && !expired;
          return {
            ...baseRequest(r),
            isExpired: expired,
            guest: {
              name: user?.name,
              image: user?.image,
              sector: guest?.sector,
              ethnicity: guest?.ethnicity,
              gender: guest?.gender,
              region: guest?.region,
              dob: guest?.dob,
              // Contact details are private until the host accepts, and are
              // withheld again once the invitation date has passed.
              email: reveal ? user?.email : undefined,
              notes: reveal ? guest?.notes : undefined,
            },
          };
        }),
    );
  },
});

// Guest's sent requests — host contact details are revealed only once accepted.
export const getMyOutgoingRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const requests = await ctx.db
      .query("requests")
      .withIndex("by_guest", (q) => q.eq("guestAuthUserId", identity.subject))
      .collect();

    return Promise.all(
      requests
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async (r) => {
          const [user, host] = await Promise.all([
            getUserByAuthId(ctx, r.hostAuthUserId),
            ctx.db
              .query("hosts")
              .withIndex("by_authUserId", (q) =>
                q.eq("authUserId", r.hostAuthUserId),
              )
              .unique(),
          ]);
          const expired = isRequestExpired(r.date);
          const reveal = r.status === "accepted" && !expired;
          return {
            ...baseRequest(r),
            isExpired: expired,
            host: {
              name: user?.name,
              image: user?.image,
              sector: host?.sector,
              ethnicity: host?.ethnicity,
              kashrout: host?.kashrout,
              hasDisabilityAccess: host?.hasDisabilityAccess,
              // Contact details are private until the host accepts, and are
              // withheld again once the invitation date has passed.
              phoneNumber: reveal ? host?.phoneNumber : undefined,
              address: reveal ? host?.address : undefined,
              floor: reveal ? host?.floor : undefined,
              entrance: reveal ? host?.entrance : undefined,
            },
          };
        }),
    );
  },
});

// Pending count for the host, used for the navbar/menu badge.
export const getIncomingPendingCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const pending = await ctx.db
      .query("requests")
      .withIndex("by_host_status", (q) =>
        q.eq("hostAuthUserId", identity.subject).eq("status", "pending"),
      )
      .collect();
    return pending.length;
  },
});

// ─── Email (internal action) ──────────────────────────────────────────────────

export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ohel Avraham <gelbaz.dev@gmail.com>",
        to: args.to,
        subject: args.subject,
        html: args.html,
      }),
    });
    return null;
  },
});
