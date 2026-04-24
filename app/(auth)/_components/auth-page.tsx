"use client";

import { Logo } from "@/components/icons/logo";
import { PropsWithChildren, Suspense } from "react";
import { FloatingPaths } from "@/app/(auth)/_components/floating-paths";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export function AuthPage({ children }: PropsWithChildren) {
  const { t } = useT();

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 sm:-mx-8mx-auto!">
      <div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
        <div className="absolute inset-0 bg-black" />

        <Link href="/" className="z-20">
          <Logo className="text-white" />
        </Link>

        <div className="z-10 mt-auto">
          <blockquote className="space-y-2 text-white">
            <p className="text-xl">
              &ldquo;{t.auth.quote}&rdquo;
            </p>
            <footer className="text-sm text-muted-foreground">
              {t.auth.quoteSource}
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
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
