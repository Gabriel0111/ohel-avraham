"use client";

import { Logo } from "@/components/icons/logo";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useT();

  return (
    <footer className="border-t border-border py-12">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {t.footer.tagline}
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">{t.footer.platform}</h4>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.aboutUs}
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.dashboard}
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">{t.footer.account}</h4>
            <Link
              href="/sign-up"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.footer.signUp}
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          {"© " + new Date().getFullYear() + " " + t.footer.rights}
        </p>
        <p className="text-xs text-muted-foreground">
          {t.footer.builtWith + " "}
          <span className="text-primary">{t.footer.love}</span>
          {" " + t.footer.forCommunity}
        </p>
      </div>
    </footer>
  );
}
