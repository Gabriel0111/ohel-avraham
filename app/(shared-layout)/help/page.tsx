import type { Metadata } from "next";
import { LegalDocument } from "../_components/legal-document";

export const metadata: Metadata = {
  title: "Help",
  description:
    "Answers to common questions about hosting and finding a Shabbat table on Ohel Avraham.",
};

export default function HelpPage() {
  return <LegalDocument kind="help" />;
}
