import * as React from "react";
import {
  render,
  Html,
  Head,
  Font,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

// ─── Brand — the site's candlelight tokens, converted to email-safe hex ──────
// (source of truth: DESIGN.md / app/globals.css, OKLCH → sRGB)

const AMBER = "#bc4100"; // candlelight-amber (primary)
const AMBER_TINT = "#f8ece6"; // primary/10 over white
const ON_AMBER = "#fdf9f4"; // on-amber (button text)
const BG = "#fbfaf8"; // threshold-white (site body)
const CARD = "#ffffff";
const INK = "#0d0907";
const MUTED = "#6d6157"; // muted-ink
const SURFACE = "#f5f1ec"; // surface-muted
const HAIRLINE = "#e6e2dd";
const GREEN = "#16a34a"; // accepted / verified
const GREEN_TINT = "#e7f6ec";

const FONT_STACK =
  "'Plus Jakarta Sans', 'Segoe UI', Helvetica, Arial, sans-serif";

const siteUrl = process.env.SITE_URL ?? "https://ohel-avraham.com";

function initialsOf(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

// ─── Shared layout ───────────────────────────────────────────────────────────

function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="fr" dir="ltr">
      <Head>
        <Font
          fontFamily="Plus Jakarta Sans"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHRjcWuA_.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: BG,
          margin: 0,
          padding: 0,
          fontFamily: FONT_STACK,
        }}
      >
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "40px 16px" }}>
          {/* Wordmark — mirrors components/icons/logo.tsx */}
          <Section style={{ textAlign: "center", paddingBottom: 20 }}>
            <Text
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.4px",
                color: INK,
              }}
            >
              Ohel<span style={{ color: AMBER }}>Avraham</span>
            </Text>
            <Text style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>
              La tente d’Abraham
            </Text>
          </Section>

          {/* Card — white, hairline border, site rounded-xl */}
          <Section
            style={{
              backgroundColor: CARD,
              borderRadius: 14,
              border: `1px solid ${HAIRLINE}`,
              overflow: "hidden",
            }}
          >
            {/* Candlelight thread */}
            <div style={{ height: 3, backgroundColor: AMBER }} />

            <div style={{ padding: "28px 32px" }}>{children}</div>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", paddingTop: 20 }}>
            <Text style={{ margin: 0, fontSize: 12, color: MUTED, lineHeight: "1.6" }}>
              Vous recevez cet email car vous êtes inscrit sur{" "}
              <a href={siteUrl} style={{ color: AMBER, textDecoration: "none", fontWeight: 600 }}>
                Ohel Avraham
              </a>
              .
            </Text>
            <Text style={{ margin: "4px 0 0", fontSize: 12, color: MUTED }}>
              © {new Date().getFullYear()} Ohel Avraham — Chabbat autour d’une même table.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function TitleBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <Text
        style={{
          margin: "0 0 4px",
          fontSize: 21,
          fontWeight: 700,
          letterSpacing: "-0.2px",
          color: INK,
          lineHeight: "1.25",
        }}
      >
        {title}
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        {subtitle}
      </Text>
      <Hr style={{ border: "none", borderTop: `1px solid ${HAIRLINE}`, margin: "0 0 20px" }} />
    </>
  );
}

/** Person row — initials avatar in the site's primary-tint style. */
function PersonRow({
  name,
  sub,
  subColor = MUTED,
  tint = AMBER_TINT,
  tintText = AMBER,
}: {
  name: string;
  sub: string;
  subColor?: string;
  tint?: string;
  tintText?: string;
}) {
  return (
    <table role="presentation" cellPadding={0} cellSpacing={0} style={{ marginBottom: 4 }}>
      <tbody>
        <tr>
          <td style={{ verticalAlign: "middle" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: tint,
                textAlign: "center",
                lineHeight: "44px",
                fontSize: 15,
                fontWeight: 700,
                color: tintText,
              }}
            >
              {initialsOf(name)}
            </div>
          </td>
          <td style={{ verticalAlign: "middle", paddingLeft: 12 }}>
            <Text style={{ margin: 0, fontWeight: 700, fontSize: 16, color: INK }}>{name}</Text>
            <Text style={{ margin: "2px 0 0", fontSize: 13, color: subColor }}>{sub}</Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function DateBadge({
  date,
  color = AMBER,
  bg = AMBER_TINT,
}: {
  date: string;
  color?: string;
  bg?: string;
}) {
  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: bg,
        borderRadius: 999,
        padding: "7px 16px",
        marginTop: 16,
        marginBottom: 4,
      }}
    >
      <Text style={{ margin: 0, fontSize: 14, fontWeight: 600, color }}>
        Chabbat · {date}
      </Text>
    </div>
  );
}

/** Quoted personal message — soft surface tint, site rounded-lg. */
function MessageQuote({ message }: { message: string }) {
  return (
    <div
      style={{
        backgroundColor: SURFACE,
        borderRadius: 10,
        padding: "12px 16px",
        marginTop: 16,
      }}
    >
      <Text
        style={{
          margin: 0,
          fontSize: 14,
          color: INK,
          lineHeight: "1.7",
          fontStyle: "italic",
          whiteSpace: "pre-wrap",
        }}
      >
        « {message} »
      </Text>
    </div>
  );
}

function DashboardButton({
  label = "Voir sur mon tableau de bord",
  color = AMBER,
}: {
  label?: string;
  color?: string;
}) {
  return (
    <Button
      href={`${siteUrl}/dashboard/requests`}
      style={{
        display: "inline-block",
        backgroundColor: color,
        color: ON_AMBER,
        borderRadius: 10,
        padding: "11px 24px",
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

/** Big lettered code block — shared by every OTP-style email. */
function CodeBlock({ code }: { code: string }) {
  return (
    <div style={{ textAlign: "center", margin: "4px 0 24px" }}>
      <div
        style={{
          display: "inline-block",
          backgroundColor: SURFACE,
          borderRadius: 12,
          padding: "16px 28px",
        }}
      >
        <Text
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 10,
            color: INK,
          }}
        >
          {code}
        </Text>
      </div>
    </div>
  );
}

// ─── Templates ────────────────────────────────────────────────────────────────

/** Password reset link */
export function ResetPasswordEmail({ url }: { url: string }) {
  return (
    <EmailLayout preview="Réinitialisez votre mot de passe">
      <TitleBlock
        title="Réinitialisez votre mot de passe"
        subtitle="Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien expire dans 1 heure."
      />

      <Button
        href={url}
        style={{
          display: "inline-block",
          backgroundColor: AMBER,
          color: ON_AMBER,
          borderRadius: 10,
          padding: "11px 24px",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Réinitialiser mon mot de passe
      </Button>

      <Text style={{ marginTop: 24, fontSize: 13, color: MUTED, lineHeight: "1.6" }}>
        Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email — votre
        mot de passe restera inchangé.
      </Text>
    </EmailLayout>
  );
}

/** Email verification code — sign-up, and every "resend code" */
export function VerifyOtpEmail({ otp }: { otp: string }) {
  return (
    <EmailLayout preview={`${otp} est votre code de vérification`}>
      <TitleBlock
        title="Confirmez votre email"
        subtitle="Saisissez ce code pour vérifier votre adresse et poursuivre votre inscription. Il expire dans 10 minutes."
      />

      <CodeBlock code={otp} />

      <Text style={{ fontSize: 13, color: MUTED, lineHeight: "1.6" }}>
        Si vous n’êtes pas à l’origine de cette inscription, vous pouvez ignorer cet email.
      </Text>
    </EmailLayout>
  );
}

/** Guest requests a host — sent to the host */
export function NewRequestEmail({
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
      <TitleBlock
        title="Nouvelle demande d’accueil"
        subtitle="Un invité souhaite rejoindre votre table."
      />

      <PersonRow name={guestName} sub="souhaite être reçu(e)" />

      <DateBadge date={date} />

      <Text style={{ margin: "8px 0 0", fontSize: 14, color: MUTED }}>{partySize}</Text>

      {message && <MessageQuote message={message} />}

      <Text style={{ marginTop: 20, fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        Connectez-vous à votre tableau de bord pour{" "}
        <strong style={{ color: INK }}>accepter</strong> ou{" "}
        <strong style={{ color: INK }}>refuser</strong> cette demande.
      </Text>

      <DashboardButton label="Répondre à la demande" />
    </EmailLayout>
  );
}

/** Host invites a guest — sent to the guest */
export function InvitationEmail({
  hostName,
  date,
  message,
}: {
  hostName: string;
  date: string;
  message?: string;
}) {
  return (
    <EmailLayout preview={`${hostName} vous invite à sa table de Chabbat`}>
      <TitleBlock
        title="Vous avez une invitation"
        subtitle="Un hôte vous propose une place à sa table."
      />

      <PersonRow name={hostName} sub="vous invite à sa table" />

      <DateBadge date={date} />

      {message && <MessageQuote message={message} />}

      <Text style={{ marginTop: 20, fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        Connectez-vous à votre tableau de bord pour{" "}
        <strong style={{ color: INK }}>accepter</strong> ou{" "}
        <strong style={{ color: INK }}>refuser</strong> cette invitation.
      </Text>

      <DashboardButton label="Répondre à l’invitation" />
    </EmailLayout>
  );
}

/** Host answered the guest's request — sent to the guest */
export function RequestResponseEmail({
  hostName,
  date,
  accepted,
}: {
  hostName: string;
  date: string;
  accepted: boolean;
}) {
  const title = accepted ? "Votre demande a été acceptée" : "Réponse à votre demande";
  const preview = accepted
    ? `${hostName} vous accueille pour Chabbat le ${date}`
    : `${hostName} n’est pas disponible le ${date}`;

  return (
    <EmailLayout preview={preview}>
      <TitleBlock
        title={title}
        subtitle={accepted ? "Bonne nouvelle — vous êtes attendu(e)." : "Votre demande a reçu une réponse."}
      />

      <PersonRow
        name={hostName}
        sub={accepted ? "vous accueille" : "n’est pas disponible"}
        subColor={accepted ? GREEN : MUTED}
        tint={accepted ? GREEN_TINT : SURFACE}
        tintText={accepted ? GREEN : MUTED}
      />

      <DateBadge
        date={date}
        color={accepted ? GREEN : MUTED}
        bg={accepted ? GREEN_TINT : SURFACE}
      />

      <Text style={{ marginTop: 16, fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        {accepted
          ? "L’adresse et le numéro de téléphone de votre hôte sont désormais disponibles dans votre tableau de bord."
          : `N’hésitez pas à contacter d’autres hôtes disponibles pour le ${date}.`}
      </Text>

      <DashboardButton
        label={accepted ? "Voir les coordonnées" : "Trouver un autre hôte"}
        color={accepted ? GREEN : AMBER}
      />
    </EmailLayout>
  );
}

/** Guest answered the host's invitation — sent to the host */
export function InvitationResponseEmail({
  guestName,
  date,
  accepted,
}: {
  guestName: string;
  date: string;
  accepted: boolean;
}) {
  const title = accepted ? "Votre invitation a été acceptée" : "Réponse à votre invitation";
  const preview = accepted
    ? `${guestName} a accepté votre invitation pour le ${date}`
    : `${guestName} ne pourra pas se joindre à vous le ${date}`;

  return (
    <EmailLayout preview={preview}>
      <TitleBlock
        title={title}
        subtitle={accepted ? "Votre invité sera là." : "Votre invitation a reçu une réponse."}
      />

      <PersonRow
        name={guestName}
        sub={accepted ? "a accepté l’invitation" : "ne pourra pas venir"}
        subColor={accepted ? GREEN : MUTED}
        tint={accepted ? GREEN_TINT : SURFACE}
        tintText={accepted ? GREEN : MUTED}
      />

      <DateBadge
        date={date}
        color={accepted ? GREEN : MUTED}
        bg={accepted ? GREEN_TINT : SURFACE}
      />

      <Text style={{ marginTop: 16, fontSize: 14, color: MUTED, lineHeight: "1.6" }}>
        {accepted
          ? "Les coordonnées de votre invité sont disponibles dans votre tableau de bord."
          : `Vous pouvez inviter d’autres personnes pour le ${date}.`}
      </Text>

      <DashboardButton
        label={accepted ? "Voir les coordonnées" : "Chercher d’autres invités"}
        color={accepted ? GREEN : AMBER}
      />
    </EmailLayout>
  );
}

/** Contact form submission — sent to the platform operator */
export function ContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return (
    <EmailLayout preview={`Nouveau message de ${name}`}>
      <TitleBlock
        title="Nouveau message de contact"
        subtitle="Via le formulaire de contact d’Ohel Avraham."
      />

      <PersonRow name={name} sub={email} subColor={AMBER} />

      <MessageQuote message={message} />

      <Text style={{ marginTop: 20, fontSize: 13, color: MUTED }}>
        Répondez directement à cet email pour contacter l’expéditeur.
      </Text>
    </EmailLayout>
  );
}

// ─── Rendering ────────────────────────────────────────────────────────────────

export type EmailPayload =
  | { type: "new_request"; guestName: string; date: string; partySize: string; message?: string }
  | { type: "invitation"; hostName: string; date: string; message?: string }
  | { type: "request_response"; hostName: string; date: string; accepted: boolean }
  | { type: "invitation_response"; guestName: string; date: string; accepted: boolean }
  | { type: "contact"; name: string; email: string; message: string }
  | { type: "reset_password"; url: string }
  | { type: "verify_otp"; otp: string };

export async function renderEmail(payload: EmailPayload): Promise<string> {
  switch (payload.type) {
    case "reset_password":
      return await render(<ResetPasswordEmail url={payload.url} />);
    case "verify_otp":
      return await render(<VerifyOtpEmail otp={payload.otp} />);
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
        <InvitationEmail hostName={payload.hostName} date={payload.date} message={payload.message} />,
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
