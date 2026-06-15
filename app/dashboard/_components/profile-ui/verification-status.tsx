"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/context";

interface VerificationStatusProps {
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
}

export const VerificationStatus = ({
  isVerified,
  verifiedBy,
  verifiedAt,
}: VerificationStatusProps) => {
  const { t, lang } = useT();
  const reduce = useReducedMotion();
  const [celebrate, setCelebrate] = useState(false);

  // Fire a one-time shine the first time the user sees their account verified.
  // Keyed by verifiedAt so a re-verification can celebrate again, but a normal
  // revisit stays calm.
  useEffect(() => {
    if (!isVerified || reduce || typeof window === "undefined") return;
    const key = `ohel:verified-seen:${verifiedAt ?? "y"}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    const raf = requestAnimationFrame(() => setCelebrate(true));
    const id = setTimeout(() => setCelebrate(false), 2400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(id);
    };
  }, [isVerified, verifiedAt, reduce]);

  const verifiedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString(
        lang === "he" ? "he-IL" : lang === "fr" ? "fr-FR" : "en-GB",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : null;

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-between p-4 rounded-xl border ${
        isVerified
          ? "border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent"
          : "border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent"
      }`}
    >
      {celebrate && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, transparent 35%, rgba(16,185,129,0.35) 50%, transparent 65%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      <div className="relative flex items-center gap-3">
        <motion.div
          className={`p-2 rounded-full ${
            isVerified
              ? "bg-green-500/15 text-green-600"
              : "bg-amber-500/15 text-amber-600"
          }`}
          animate={
            celebrate && !reduce ? { scale: [1, 1.18, 1] } : { scale: 1 }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {isVerified ? (
            <ShieldCheck className="size-4" />
          ) : (
            <Clock className="size-4" />
          )}
        </motion.div>
        <div>
          <p className="text-sm font-medium">
            {isVerified
              ? celebrate
                ? t.celebrate.verifiedTitle
                : t.profile.verifiedAccount
              : t.profile.identityPending}
          </p>
          {isVerified && verifiedBy && verifiedDate ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="size-3 text-green-500 shrink-0" />
              {t.profile.verifiedByLabel}{" "}
              <span className="font-medium text-foreground">{verifiedBy}</span>
              {" · "}
              {verifiedDate}
            </p>
          ) : !isVerified ? (
            <p className="text-xs text-muted-foreground">
              {t.profile.manualReview}
            </p>
          ) : null}
        </div>
      </div>
      {!isVerified && (
        <Badge
          variant="outline"
          className="relative text-amber-600 border-amber-500/30 shrink-0 text-xs"
        >
          {t.profile.actionRequired}
        </Badge>
      )}
    </div>
  );
};
