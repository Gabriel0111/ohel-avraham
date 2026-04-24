"use client";

import { useT } from "@/lib/i18n/context";

const OrDivider = () => {
  const { t } = useT();

  return (
    <div className="flex w-full items-center justify-center">
      <div className="h-px w-full bg-border" />
      <span className="px-2 text-muted-foreground text-xs">{t.common.or}</span>
      <div className="h-px w-full bg-border" />
    </div>
  );
};

export default OrDivider;
