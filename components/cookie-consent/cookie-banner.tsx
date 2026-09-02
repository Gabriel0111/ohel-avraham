"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/context";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { OPEN_COOKIE_SETTINGS_EVENT, type ConsentValue } from "@/lib/cookie-consent";

export function CookieBanner() {
  const { t } = useT();
  const { consent, ready, set } = useCookieConsent();
  const [forcedOpen, setForcedOpen] = useState(false);

  useEffect(() => {
    const open = () => setForcedOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
  }, []);

  const visible = ready && (consent === null || forcedOpen);
  if (!visible) return null;

  const choose = (value: ConsentValue) => {
    set(value);
    setForcedOpen(false);
  };

  return (
    <section
      aria-label={t.cookieBanner.title}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background p-4"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t.cookieBanner.message}{" "}
          <Link href="/cookies" className="text-primary underline">
            {t.cookieBanner.learnMore}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => choose("necessary")}
          >
            {t.cookieBanner.necessaryOnly}
          </Button>
          <Button size="sm" onClick={() => choose("all")}>
            {t.cookieBanner.acceptAll}
          </Button>
        </div>
      </div>
    </section>
  );
}
