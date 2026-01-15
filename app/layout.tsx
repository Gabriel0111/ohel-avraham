import type { Metadata } from "next";
import "./globals.css";
import {
  Geist,
  Geist_Mono,
  EB_Garamond,
  Frank_Ruhl_Libre,
  Lato,
} from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-frank-ruhl",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ohel Avraham",
  description:
    "Get invited or host people to share a wonderful Shabbat together.",
  creator: "Gabriel Elbaz",
  applicationName: "Ohel Avraham",
  authors: [{ name: "Gabriel Elbaz", url: "https://linkedin.com/in/gelbaz" }],
  keywords: "Shabbat, Kosher",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        lato.variable,
        ebGaramond.variable,
        frankRuhl.variable,
        geistSans.variable,
        geistMono.variable,
        "antialiased select-none min-h-dvh overflow-y-auto",
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/*<main className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">*/}
          <main>
            <ConvexClientProvider>
              {children}
              <Toaster richColors />
            </ConvexClientProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
