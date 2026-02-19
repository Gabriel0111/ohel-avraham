import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--inter-sans",
  subsets: ["latin"],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable}  ${geistSans.variable} ${geistMono.variable} antialiased select-none min-h-dvh overflow-y-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="mx-auto w-full">
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
