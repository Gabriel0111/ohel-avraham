import type { Metadata } from "next";
import { LegalDocument } from "../_components/legal-document";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Ohel Avraham uses cookies and how you can control them.",
};

export default function CookiesPage() {
  return <LegalDocument kind="cookies" />;
}
