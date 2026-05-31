import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/i18n/context";
import { AuthSync } from "@/components/auth-sync";
import { getToken } from "@/lib/auth-server";

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

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} antialiased select-none min-h-dvh overflow-y-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <main className="mx-auto w-full">
              <ConvexClientProvider initialToken={initialToken}>
                <AuthSync />
                {children}
                <Toaster richColors />
              </ConvexClientProvider>
            </main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
