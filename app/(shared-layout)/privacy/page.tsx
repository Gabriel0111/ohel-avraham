import type { Metadata } from "next";
import { LegalDocument } from "../_components/legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ohel Avraham collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
