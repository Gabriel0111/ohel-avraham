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
import { getToken } from "@/lib/auth-server";
import { cookies } from "next/headers";
import type { Language } from "@/lib/i18n/translations";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ohel Avraham",
  description:
    "Get invited or host people to share a wonderful Shabbat together.",
  creator: "Gabriel Elbaz",
  applicationName: "Ohel Avraham",
  authors: [{ name: "Gabriel Elbaz", url: "https://linkedin.com/in/gelbaz" }],
  keywords: "Shabbat, Kosher, Hosts, Guests",
};

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
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANG_COOKIE)?.value;
  const lang: Language = isLanguage(langCookie) ? langCookie : "en";

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
            <main className="mx-auto w-full">
              <ConvexClientProvider initialToken={initialToken}>
                <AuthSync />
                {children}
                <Toaster richColors closeButton />
              </ConvexClientProvider>
            </main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
