"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import * as React from "react";
import {
  render,
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

// ─── Brand ────────────────────────────────────────────────────────────────────

const BRAND = "#b45309"; // amber-700
const BRAND_LIGHT = "#fef3c7"; // amber-100
const AMBER = "#d97706"; // amber-600 (guest-side invitations)
const AMBER_LIGHT = "#fef3c7"; // amber-100
const TEXT = "#111827";
const MUTED = "#6b7280";
const BG = "#f9fafb";
const CARD = "#ffffff";
const BORDER = "#e5e7eb";

const siteUrl = process.env.SITE_URL ?? "https://ohel-avraham.com";

// ─── Shared layout ───────────────────────────────────────────────────────────

function EmailLayout({
  preview,
  accentColor = BRAND,
  accentLight = BRAND_LIGHT,
  children,
}: {
  preview: string;
  accentColor?: string;
  accentLight?: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: BG, margin: 0, padding: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "40px auto", padding: "0 16px" }}>
          {/* Header */}
          <Section style={{ textAlign: "center", paddingBottom: 24 }}>
            <Text style={{ margin: 0, fontSize: 22, fontWeight: 700, color: accentColor, letterSpacing: "-0.5px" }}>
              🕌 Ohel Avraham
            </Text>
            <Text style={{ margin: "4px 0 0", fontSize: 13, color: MUTED }}>
              La tente d'Abraham
            </Text>
          </Section>

          {/* Card */}
          <Section style={{ backgroundColor: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
            {/* Accent bar */}
            <div style={{ height: 4, backgroundColor: accentColor }} />

            <div style={{ padding: "28px 32px" }}>
              {children}
            </div>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", paddingTop: 24 }}>
            <Text style={{ margin: 0, fontSize: 12, color: MUTED }}>
              Vous recevez cet email car vous êtes inscrit sur Ohel Avraham.
            </Text>
            <Text style={{ margin: "4px 0 0", fontSize: 12, color: MUTED }}>
              © {new Date().getFullYear()} Ohel Avraham
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function DashboardButton({ label = "Voir sur mon tableau de bord", color = BRAND }: { label?: string; color?: string }) {
  return (
    <Button
      href={`${siteUrl}/dashboard/requests`}
      style={{
        display: "inline-block",
        backgroundColor: color,
        color: "#fff",
        borderRadius: 8,
        padding: "12px 24px",
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none",
        marginTop: 20,
      }}
    >
      {label}
    </Button>
  );
}

function DateBadge({ date, color = BRAND, bg = BRAND_LIGHT }: { date: string; color?: string; bg?: string }) {
  return (
    <div style={{ display: "inline-block", backgroundColor: bg, borderRadius: 8, padding: "8px 14px", marginTop: 16, marginBottom: 4 }}>
      <Text style={{ margin: 0, fontSize: 15, fontWeight: 600, color }}>
        📅 {date}
      </Text>
    </div>
  );
}

function MessageQuote({ message, color = BRAND, bg = BRAND_LIGHT }: { message: string; color?: string; bg?: string }) {
  return (
    <div style={{ backgroundColor: bg, borderLeft: `3px solid ${color}`, borderRadius: "0 8px 8px 0", padding: "12px 16px", marginTop: 16 }}>
      <Text style={{ margin: 0, fontSize: 14, color: TEXT, lineHeight: "1.6", fontStyle: "italic" }}>
        « {message} »
      </Text>
    </div>
  );
}

// ─── Templates ────────────────────────────────────────────────────────────────

/** Guest requests a host — sent to the host */
function NewRequestEmail({
  guestName,
  date,
  partySize,
  message,
}: {
  guestName: string;
  date: string;
  partySize: string;
  message?: string;
}) {
  return (
    <EmailLayout preview={`${guestName} souhaite être reçu(e) pour Chabbat`}>
      <Text style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: TEXT }}>
        Nouvelle demande d'accueil
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: MUTED }}>
        Un invité souhaite rejoindre votre table.
      </Text>

      <Hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "0 0 20px" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: BRAND_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>👤</span>
        </div>
        <div>
          <Text style={{ margin: 0, fontWeight: 700, fontSize: 16, color: TEXT }}>{guestName}</Text>
          <Text style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>souhaite être reçu(e)</Text>
        </div>
      </div>

      <DateBadge date={date} />

      <Text style={{ margin: "8px 0 0", fontSize: 14, color: MUTED }}>
        {partySize}
      </Text>

      {message && <MessageQuote message={message} />}

      <Text style={{ marginTop: 20, fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        Connectez-vous à votre tableau de bord pour <strong style={{ color: TEXT }}>accepter</strong> ou <strong style={{ color: TEXT }}>refuser</strong> cette demande.
      </Text>

      <DashboardButton label="Répondre à la demande" />
    </EmailLayout>
  );
}

/** Host invites a guest — sent to the guest */
function InvitationEmail({
  hostName,
  date,
  message,
}: {
  hostName: string;
  date: string;
  message?: string;
}) {
  return (
    <EmailLayout preview={`${hostName} vous invite à sa table de Chabbat`} accentColor={AMBER} accentLight={AMBER_LIGHT}>
      <Text style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: TEXT }}>
        Vous avez une invitation !
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: MUTED }}>
        Un hôte vous propose une place à sa table.
      </Text>

      <Hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "0 0 20px" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: AMBER_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>🏠</span>
        </div>
        <div>
          <Text style={{ margin: 0, fontWeight: 700, fontSize: 16, color: TEXT }}>{hostName}</Text>
          <Text style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>vous invite à sa table</Text>
        </div>
      </div>

      <DateBadge date={date} color={AMBER} bg={AMBER_LIGHT} />

      {message && <MessageQuote message={message} color={AMBER} bg={AMBER_LIGHT} />}

      <Text style={{ marginTop: 20, fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        Connectez-vous à votre tableau de bord pour <strong style={{ color: TEXT }}>accepter</strong> ou <strong style={{ color: TEXT }}>refuser</strong> cette invitation.
      </Text>

      <DashboardButton label="Répondre à l'invitation" color={AMBER} />
    </EmailLayout>
  );
}

/** Host answered the guest's request — sent to the guest */
function RequestResponseEmail({
  hostName,
  date,
  accepted,
}: {
  hostName: string;
  date: string;
  accepted: boolean;
}) {
  const emoji = accepted ? "🎉" : "💬";
  const title = accepted ? "Votre demande a été acceptée !" : "Réponse à votre demande";
  const preview = accepted
    ? `${hostName} vous accueille pour Chabbat le ${date}`
    : `${hostName} n'est pas disponible le ${date}`;

  return (
    <EmailLayout preview={preview} accentColor={accepted ? "#16a34a" : MUTED} accentLight={accepted ? "#dcfce7" : "#f3f4f6"}>
      <Text style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: TEXT }}>
        {emoji} {title}
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: MUTED }}>
        {accepted ? "Bonne nouvelle !" : "Votre demande a reçu une réponse."}
      </Text>

      <Hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "0 0 20px" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: accepted ? "#dcfce7" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>🏠</span>
        </div>
        <div>
          <Text style={{ margin: 0, fontWeight: 700, fontSize: 16, color: TEXT }}>{hostName}</Text>
          <Text style={{ margin: "2px 0 0", fontSize: 13, color: accepted ? "#16a34a" : MUTED }}>
            {accepted ? "vous accueille" : "n'est pas disponible"}
          </Text>
        </div>
      </div>

      <DateBadge date={date} color={accepted ? "#16a34a" : MUTED} bg={accepted ? "#dcfce7" : "#f3f4f6"} />

      <Text style={{ marginTop: 16, fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        {accepted
          ? "L'adresse et le numéro de téléphone de votre hôte sont désormais disponibles dans votre tableau de bord."
          : `N'hésitez pas à contacter d'autres hôtes disponibles pour le ${date}.`}
      </Text>

      <DashboardButton
        label={accepted ? "Voir les coordonnées" : "Trouver un autre hôte"}
        color={accepted ? "#16a34a" : BRAND}
      />
    </EmailLayout>
  );
}

/** Guest answered the host's invitation — sent to the host */
function InvitationResponseEmail({
  guestName,
  date,
  accepted,
}: {
  guestName: string;
  date: string;
  accepted: boolean;
}) {
  const emoji = accepted ? "🎉" : "💬";
  const title = accepted ? "Votre invitation a été acceptée !" : "Réponse à votre invitation";
  const preview = accepted
    ? `${guestName} a accepté votre invitation pour le ${date}`
    : `${guestName} ne pourra pas se joindre à vous le ${date}`;

  return (
    <EmailLayout preview={preview} accentColor={accepted ? "#16a34a" : MUTED} accentLight={accepted ? "#dcfce7" : "#f3f4f6"}>
      <Text style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: TEXT }}>
        {emoji} {title}
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: MUTED }}>
        {accepted ? "Votre invité sera là !" : "Votre invitation a reçu une réponse."}
      </Text>

      <Hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "0 0 20px" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: accepted ? "#dcfce7" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>👤</span>
        </div>
        <div>
          <Text style={{ margin: 0, fontWeight: 700, fontSize: 16, color: TEXT }}>{guestName}</Text>
          <Text style={{ margin: "2px 0 0", fontSize: 13, color: accepted ? "#16a34a" : MUTED }}>
            {accepted ? "a accepté l'invitation" : "ne pourra pas venir"}
          </Text>
        </div>
      </div>

      <DateBadge date={date} color={accepted ? "#16a34a" : MUTED} bg={accepted ? "#dcfce7" : "#f3f4f6"} />

      <Text style={{ marginTop: 16, fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        {accepted
          ? "Les coordonnées de votre invité sont disponibles dans votre tableau de bord."
          : `Vous pouvez inviter d'autres personnes pour le ${date}.`}
      </Text>

      <DashboardButton
        label={accepted ? "Voir les coordonnées" : "Chercher d'autres invités"}
        color={accepted ? "#16a34a" : BRAND}
      />
    </EmailLayout>
  );
}

/** Contact form submission — sent to the platform operator */
function ContactEmail({ name, email, message }: { name: string; email: string; message: string }) {
  return (
    <EmailLayout preview={`Nouveau message de ${name}`}>
      <Text style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: TEXT }}>
        Nouveau message de contact
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: MUTED }}>
        Via le formulaire de contact d'Ohel Avraham.
      </Text>

      <Hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, margin: "0 0 20px" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: BRAND_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>✉️</span>
        </div>
        <div>
          <Text style={{ margin: 0, fontWeight: 700, fontSize: 16, color: TEXT }}>{name}</Text>
          <Text style={{ margin: "2px 0 0", fontSize: 13, color: BRAND }}>{email}</Text>
        </div>
      </div>

      <div style={{ backgroundColor: BRAND_LIGHT, borderLeft: `3px solid ${BRAND}`, borderRadius: "0 8px 8px 0", padding: "14px 16px" }}>
        <Text style={{ margin: 0, fontSize: 14, color: TEXT, lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
          {message}
        </Text>
      </div>

      <Text style={{ marginTop: 20, fontSize: 13, color: MUTED }}>
        Répondez directement à cet email pour contacter l'expéditeur.
      </Text>
    </EmailLayout>
  );
}

// ─── Email type union ─────────────────────────────────────────────────────────

type EmailPayload =
  | { type: "new_request"; guestName: string; date: string; partySize: string; message?: string }
  | { type: "invitation"; hostName: string; date: string; message?: string }
  | { type: "request_response"; hostName: string; date: string; accepted: boolean }
  | { type: "invitation_response"; guestName: string; date: string; accepted: boolean }
  | { type: "contact"; name: string; email: string; message: string };

async function renderEmail(payload: EmailPayload): Promise<string> {
  switch (payload.type) {
    case "new_request":
      return await render(
        <NewRequestEmail
          guestName={payload.guestName}
          date={payload.date}
          partySize={payload.partySize}
          message={payload.message}
        />,
      );
    case "invitation":
      return await render(
        <InvitationEmail
          hostName={payload.hostName}
          date={payload.date}
          message={payload.message}
        />,
      );
    case "request_response":
      return await render(
        <RequestResponseEmail
          hostName={payload.hostName}
          date={payload.date}
          accepted={payload.accepted}
        />,
      );
    case "invitation_response":
      return await render(
        <InvitationResponseEmail
          guestName={payload.guestName}
          date={payload.date}
          accepted={payload.accepted}
        />,
      );
    case "contact":
      return await render(
        <ContactEmail name={payload.name} email={payload.email} message={payload.message} />,
      );
  }
}

// ─── Action ───────────────────────────────────────────────────────────────────

export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    payload: v.any(),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return null;

    const html = renderEmail(args.payload as EmailPayload);

    await fetch("https://api.resend.com/emails", {
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
      }),
    });

    return null;
  },
});
