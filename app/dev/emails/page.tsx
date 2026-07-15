import { notFound } from "next/navigation";
import { renderEmail, type EmailPayload } from "@/lib/emails/templates";

// Dev-only gallery: renders every transactional email template with sample
// data — the exact components convex/emails.tsx sends — so design changes
// can be checked at http://localhost:3000/dev/emails without sending mail.

export const dynamic = "force-dynamic";

const SAMPLES: { label: string; payload: EmailPayload }[] = [
  {
    label: "Réinitialisation du mot de passe",
    payload: {
      type: "reset_password",
      url: "https://ohel-avraham.com/reset-password?token=sample",
    },
  },
  {
    label: "Code de vérification email",
    payload: { type: "verify_otp", otp: "482913" },
  },
  {
    label: "Nouvelle demande (→ hôte)",
    payload: {
      type: "new_request",
      guestName: "Sarah Cohen",
      date: "vendredi 10 juillet 2026",
      partySize: "2 adultes · 1 enfant",
      message:
        "Bonjour ! Nous sommes de passage à Jérusalem pour Chabbat et serions ravis de partager votre table.",
    },
  },
  {
    label: "Invitation (→ invité)",
    payload: {
      type: "invitation",
      hostName: "Moshé Lévi",
      date: "vendredi 10 juillet 2026",
      message: "Nous serions heureux de vous recevoir — il reste deux places à notre table.",
    },
  },
  {
    label: "Demande acceptée (→ invité)",
    payload: {
      type: "request_response",
      hostName: "Moshé Lévi",
      date: "vendredi 10 juillet 2026",
      accepted: true,
    },
  },
  {
    label: "Demande refusée (→ invité)",
    payload: {
      type: "request_response",
      hostName: "Moshé Lévi",
      date: "vendredi 10 juillet 2026",
      accepted: false,
    },
  },
  {
    label: "Invitation acceptée (→ hôte)",
    payload: {
      type: "invitation_response",
      guestName: "Sarah Cohen",
      date: "vendredi 10 juillet 2026",
      accepted: true,
    },
  },
  {
    label: "Invitation déclinée (→ hôte)",
    payload: {
      type: "invitation_response",
      guestName: "Sarah Cohen",
      date: "vendredi 10 juillet 2026",
      accepted: false,
    },
  },
  {
    label: "Message de contact (→ opérateur)",
    payload: {
      type: "contact",
      name: "David Azoulay",
      email: "david.azoulay@example.com",
      message:
        "Bonjour,\n\nSerait-il possible d'ajouter une option pour les repas de fête (Yom Tov) en plus de Chabbat ?\n\nMerci pour la plateforme !",
    },
  },
];

export default async function EmailPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const rendered = await Promise.all(
    SAMPLES.map(async (s) => ({ ...s, html: await renderEmail(s.payload) })),
  );

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold tracking-tight">
          Emails <span className="text-primary">— prévisualisation</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les templates exacts envoyés par <code>convex/emails.tsx</code>, rendus avec des
          données d’exemple. Page de dev uniquement (404 en production).
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {rendered.map((s) => (
            <section key={s.label}>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{s.label}</h2>
              <iframe
                title={s.label}
                srcDoc={s.html}
                sandbox=""
                className="h-[720px] w-full rounded-xl border border-border bg-white shadow-sm"
              />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
