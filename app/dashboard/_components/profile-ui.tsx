"use client";

import { useT } from "@/lib/i18n/context";

export const AdminNotice = ({ role }: { role: string }) => {
  const { t } = useT();
  return (
    <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center bg-muted/10">
      <p className="text-sm text-muted-foreground">
        {t.profile.adminNoticePre}
        <span className="text-foreground font-semibold capitalize">{role}</span>
        {t.profile.adminNoticePost}
      </p>
    </div>
  );
};
