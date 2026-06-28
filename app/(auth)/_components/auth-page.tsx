"use client";

import { Logo } from "@/components/icons/logo";
import { PropsWithChildren, Suspense } from "react";
import { AuthIllustration } from "@/app/(auth)/_components/auth-illustration";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export function AuthPage({ children }: PropsWithChildren) {
  const { t } = useT();

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col border-r p-10 lg:flex overflow-hidden bg-[oklch(0.141_0.008_50)]">
        <AuthIllustration />

        <Link href="/" className="z-20 relative">
          <Logo className="text-primary-foreground" />
        </Link>

        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl text-balance leading-relaxed text-primary-foreground/95">
              &ldquo;{t.auth.quote}&rdquo;
            </p>
            <footer className="text-sm text-primary-foreground/60">
              {t.auth.quoteSource}
            </footer>
          </blockquote>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-sm text-muted-foreground">
              {t.auth.loadingRegistration}
            </p>
          </div>
        }
      >
        {children}
      </Suspense>
    </main>
  );
}
