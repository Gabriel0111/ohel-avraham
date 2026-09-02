"use client";

import { useT } from "@/lib/i18n/context";

/**
 * Keyboard-only "skip to main content" link (WCAG 2.4.1). Visually hidden
 * until focused, then anchored top-start. Targets `#main-content`, which the
 * route-group layouts put on their `<main>` element.
 */
export function SkipLink() {
  const { t } = useT();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-ring"
    >
      {t.common.skipToContent}
    </a>
  );
}
