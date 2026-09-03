import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/i18n/context";
import { LANG_COOKIE, isLanguage } from "@/lib/i18n/lang";
import { AuthSync } from "@/components/auth-sync";
import { CookieBanner } from "@/components/cookie-consent/cookie-banner";
import { SkipLink } from "@/components/layout/skip-link";
import { getToken } from "@/lib/auth-server";
import { cookies } from "next/headers";
import { translations, type Language } from "@/lib/i18n/translations";
import { env } from "@/lib/env";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Language is cookie-borne, so a visitor and a crawler can land on the same URL
// and need different copy: the crawler carries no cookie and falls back to
// English, which is also the canonical version. There is exactly one URL per
// page, so there are no `hreflang` alternates to declare.
export async function generateMetadata(): Promise<Metadata> {
  const lang = await readLangCookie();
  const { seo } = translations[lang];

  return {
    metadataBase: new URL(env.SITE_URL),
    title: {
      default: seo.title,
      // Inner pages set only their own name; the brand is appended here.
      template: "%s — Ohel Avraham",
    },
    description: seo.description,
    applicationName: "Ohel Avraham",
    creator: "Gabriel Elbaz",
    authors: [{ name: "Gabriel Elbaz", url: "https://linkedin.com/in/gelbaz" }],
    keywords: [
      "Shabbat",
      "Chabbat",
      "שבת",
      "kosher",
      "kashrut",
      "hosts",
      "guests",
      "Israel",
      "hospitality",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: "Ohel Avraham",
      title: seo.title,
      description: seo.description,
      url: "/",
      locale: OG_LOCALES[lang],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

const OG_LOCALES: Record<Language, string> = {
  en: "en_US",
  fr: "fr_FR",
  he: "he_IL",
};

// The language cookie, read the same way in `generateMetadata` and in the tree.
async function readLangCookie(): Promise<Language> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANG_COOKIE)?.value;
  return isLanguage(value) ? value : "he";
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Resolve the auth token on the server so the Convex client knows up-front
  // whether to expect auth (see ConvexClientProvider). Null for logged-out.
  const initialToken = await getToken();

  // Read the language cookie on the server so the very first render is already
  // in the user's language — no flash of English flipping back to French.
  const lang = await readLangCookie();

  return (
    <html
      lang={lang}
      dir={lang === "he" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} antialiased select-none min-h-dvh overflow-y-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLang={lang}>
            <div className="mx-auto w-full">
              <ConvexClientProvider initialToken={initialToken}>
                <SkipLink />
                <AuthSync />
                {children}
                <Toaster richColors closeButton />
                <CookieBanner />
              </ConvexClientProvider>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
