import { mutation, query, type QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
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
    if (!identity) throw new ConvexError({ code: "unauthorized" });
    const guestAuthUserId = identity.subject;

    // Only verified accounts may ask to be hosted.
    const guestUser = await getUserByAuthId(ctx, guestAuthUserId);
    if (!guestUser?.isVerified) {
      throw new ConvexError({ code: "notVerified" });
    }

    const host = await ctx.db.get(args.hostId);
    if (!host) throw new ConvexError({ code: "hostNotFound" });
    const hostAuthUserId = host.authUserId;

    if (guestAuthUserId === hostAuthUserId) {
      throw new ConvexError({ code: "cannotRequestSelf" });
    }
    if (args.adults < 1) {
      throw new ConvexError({ code: "atLeastOneAdult" });
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
      throw new ConvexError({ code: "requestAlreadyPending" });
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
    const hostUser = await getUserByAuthId(ctx, hostAuthUserId);

    if (hostUser?.email) {
      const guestName = guestUser?.name ?? "Un invité";
      await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
        to: hostUser.email,
        subject: `Nouvelle demande de ${guestName} – Ohel Avraham`,
        payload: {
          type: "new_request",
          guestName,
          date: formatDate(args.date),
          partySize: partyLabel(args.adults, args.children),
          message: args.message?.trim(),
        },
      });
    }

    return { id };
  },
});

// Host invites a guest to their table. Mirror of createRequest in the opposite
// direction: the host is the initiator, the guest the one who'll respond. No
// party size — the host is simply offering a seat.
export const createInvitation = mutation({
  args: {
    guestId: v.id("guests"),
    date: v.number(),
    message: v.optional(v.string()),
  },
  returns: v.object({ id: v.id("requests") }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });
    const hostAuthUserId = identity.subject;

    // Only verified hosts may invite.
    const hostUser = await getUserByAuthId(ctx, hostAuthUserId);
    if (!hostUser?.isVerified) {
      throw new ConvexError({ code: "notVerified" });
    }

    const guest = await ctx.db.get(args.guestId);
    if (!guest) throw new ConvexError({ code: "guestNotFound" });
    const guestAuthUserId = guest.authUserId;

    if (guestAuthUserId === hostAuthUserId) {
      throw new ConvexError({ code: "cannotRequestSelf" });
    }

    // One open thread per pair: don't let a host stack pending invitations.
    const existing = await ctx.db
      .query("requests")
      .withIndex("by_guest_host", (q) =>
        q
          .eq("guestAuthUserId", guestAuthUserId)
          .eq("hostAuthUserId", hostAuthUserId),
      )
      .collect();
    if (existing.some((r) => r.status === "pending")) {
      throw new ConvexError({ code: "requestAlreadyPending" });
    }

    const id = await ctx.db.insert("requests", {
      guestAuthUserId,
      hostAuthUserId,
      initiator: "host",
      date: args.date,
      message: args.message?.trim() || undefined,
      status: "pending",
      createdAt: Date.now(),
    });

    // Notify the guest by email (best-effort, out of band).
    const guestUser = await getUserByAuthId(ctx, guestAuthUserId);
    if (guestUser?.email) {
      const hostName = hostUser?.name ?? "Un hôte";
      await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
        to: guestUser.email,
        subject: `${hostName} vous invite à sa table – Ohel Avraham`,
        payload: {
          type: "invitation",
          hostName,
          date: formatDate(args.date),
          message: args.message?.trim(),
        },
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
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new ConvexError({ code: "requestNotFound" });

    // The responder is the party who did NOT open the thread: a guest's
    // hosting request is answered by the host; a host's invitation is answered
    // by the guest.
    const initiator = request.initiator ?? "guest";
    const responderAuthUserId =
      initiator === "guest" ? request.hostAuthUserId : request.guestAuthUserId;
    if (responderAuthUserId !== identity.subject) {
      throw new ConvexError({ code: "forbidden" });
    }
    if (request.status !== "pending") {
      throw new ConvexError({ code: "requestNotPending" });
    }

    const status: "accepted" | "declined" = args.accept
      ? "accepted"
      : "declined";
    await ctx.db.patch(args.requestId, { status, respondedAt: Date.now() });

    // Notify the initiator (the other party) by email.
    const [guestUser, hostUser] = await Promise.all([
      getUserByAuthId(ctx, request.guestAuthUserId),
      getUserByAuthId(ctx, request.hostAuthUserId),
    ]);
    const accepted = args.accept;

    if (initiator === "guest") {
      // Host answered the guest's hosting request → tell the guest.
      if (guestUser?.email) {
        const hostName = hostUser?.name ?? "L'hôte";
        await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
          to: guestUser.email,
          subject: accepted
            ? `${hostName} a accepté votre demande – Ohel Avraham`
            : `Réponse à votre demande – Ohel Avraham`,
          payload: { type: "request_response", hostName, date: formatDate(request.date), accepted },
        });
      }
    } else {
      // Guest answered the host's invitation → tell the host.
      if (hostUser?.email) {
        const guestName = guestUser?.name ?? "L'invité";
        await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
          to: hostUser.email,
          subject: accepted
            ? `${guestName} a accepté votre invitation – Ohel Avraham`
            : `Réponse à votre invitation – Ohel Avraham`,
          payload: { type: "invitation_response", guestName, date: formatDate(request.date), accepted },
        });
      }
    }

    return { status };
  },
});

export const cancelRequest = mutation({
  args: { requestId: v.id("requests") },
  returns: v.object({ cancelled: v.boolean() }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new ConvexError({ code: "requestNotFound" });
    // The initiator cancels their own thread: a guest cancels their request, a
    // host cancels their invitation.
    const initiator = request.initiator ?? "guest";
    const initiatorAuthUserId =
      initiator === "guest" ? request.guestAuthUserId : request.hostAuthUserId;
    if (initiatorAuthUserId !== identity.subject) {
      throw new ConvexError({ code: "forbidden" });
    }
    if (request.status !== "pending") {
      throw new ConvexError({ code: "requestNotPending" });
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

// Who started the thread, defaulting to the legacy guest-initiated direction.
function initiatorOf(r: RequestDoc): "guest" | "host" {
  return r.initiator ?? "guest";
}

// Enrich a request from the viewer's perspective. The counterparty is whoever
// the viewer is NOT in the row: a viewer on the host side sees the guest, a
// viewer on the guest side sees the host. Contact details are revealed only
// once accepted and before the date lapses.
async function enrichRequest(
  ctx: QueryCtx,
  r: RequestDoc,
  viewerAuthUserId: string,
) {
  const expired = isRequestExpired(r.date);
  const reveal = r.status === "accepted" && !expired;
  const viewerIsHostSide = r.hostAuthUserId === viewerAuthUserId;
  const counterpartyKind: "host" | "guest" = viewerIsHostSide
    ? "guest"
    : "host";
  const counterpartyAuthId = viewerIsHostSide
    ? r.guestAuthUserId
    : r.hostAuthUserId;

  const user = await getUserByAuthId(ctx, counterpartyAuthId);
  const guest =
    counterpartyKind === "guest"
      ? await ctx.db
          .query("guests")
          .withIndex("by_authUserId", (q) =>
            q.eq("authUserId", counterpartyAuthId),
          )
          .unique()
      : null;
  const host =
    counterpartyKind === "host"
      ? await ctx.db
          .query("hosts")
          .withIndex("by_authUserId", (q) =>
            q.eq("authUserId", counterpartyAuthId),
          )
          .unique()
      : null;

  // One flat shape for both kinds (irrelevant fields stay undefined), so the
  // client gets a single object type and narrows on `counterpartyKind`.
  const party = {
    name: user?.name,
    image: user?.image,
    sector: guest?.sector ?? host?.sector,
    ethnicity: guest?.ethnicity ?? host?.ethnicity,
    // Guest-only traits
    gender: guest?.gender,
    region: guest?.region,
    dob: guest?.dob,
    // Host-only traits
    kashrout: host?.kashrout,
    hasDisabilityAccess: host?.hasDisabilityAccess,
    // Contact — revealed once accepted and before the date lapses
    email: reveal ? user?.email : undefined,
    notes: reveal ? guest?.notes : undefined,
    phoneNumber: reveal ? host?.phoneNumber : undefined,
    address: reveal ? host?.address : undefined,
    floor: reveal ? host?.floor : undefined,
    entrance: reveal ? host?.entrance : undefined,
  };

  return {
    ...baseRequest(r),
    initiator: initiatorOf(r),
    isExpired: expired,
    counterpartyKind,
    party,
  };
}

// Load every row the viewer is part of, on either side, once.
async function myRequests(ctx: QueryCtx, me: string) {
  const [asHost, asGuest] = await Promise.all([
    ctx.db
      .query("requests")
      .withIndex("by_host", (q) => q.eq("hostAuthUserId", me))
      .collect(),
    ctx.db
      .query("requests")
      .withIndex("by_guest", (q) => q.eq("guestAuthUserId", me))
      .collect(),
  ]);
  return { asHost, asGuest };
}

// The viewer's inbox — threads where they are the responder: guest requests
// addressed to them as host, and host invitations addressed to them as guest.
export const getMyIncomingRequests = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const me = identity.subject;

    const { asHost, asGuest } = await myRequests(ctx, me);
    const incoming = [
      ...asHost.filter((r) => initiatorOf(r) === "guest"),
      ...asGuest.filter((r) => initiatorOf(r) === "host"),
    ].sort((a, b) => b.createdAt - a.createdAt);

    return Promise.all(incoming.map((r) => enrichRequest(ctx, r, me)));
  },
});

// The viewer's sent threads — those they initiated: hosting requests they sent
// as guest, and invitations they sent as host.
export const getMyOutgoingRequests = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const me = identity.subject;

    const { asHost, asGuest } = await myRequests(ctx, me);
    const outgoing = [
      ...asGuest.filter((r) => initiatorOf(r) === "guest"),
      ...asHost.filter((r) => initiatorOf(r) === "host"),
    ].sort((a, b) => b.createdAt - a.createdAt);

    return Promise.all(outgoing.map((r) => enrichRequest(ctx, r, me)));
  },
});

// Pending count of threads awaiting the viewer's response, for the navbar/menu
// badge: guest requests to answer as host + host invitations to answer as guest.
export const getIncomingPendingCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;
    const me = identity.subject;

    const [asHostPending, asGuestPending] = await Promise.all([
      ctx.db
        .query("requests")
        .withIndex("by_host_status", (q) =>
          q.eq("hostAuthUserId", me).eq("status", "pending"),
        )
        .collect(),
      ctx.db
        .query("requests")
        .withIndex("by_guest_status", (q) =>
          q.eq("guestAuthUserId", me).eq("status", "pending"),
        )
        .collect(),
    ]);

    const toAnswerAsHost = asHostPending.filter(
      (r) => initiatorOf(r) === "guest",
    ).length;
    const toAnswerAsGuest = asGuestPending.filter(
      (r) => initiatorOf(r) === "host",
    ).length;
    return toAnswerAsHost + toAnswerAsGuest;
  },
});

