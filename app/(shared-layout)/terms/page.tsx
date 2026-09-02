import type { Metadata } from "next";
import { LegalDocument } from "../_components/legal-document";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of the Ohel Avraham platform.",
};

export default function TermsPage() {
  return <LegalDocument kind="terms" />;
}
