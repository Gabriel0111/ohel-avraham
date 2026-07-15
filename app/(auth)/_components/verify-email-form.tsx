"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import { authClient } from "@/lib/auth-client";
import { useT } from "@/lib/i18n/context";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_S = 60;
// Must mirror convex/auth.ts's emailOTP `expiresIn` — past this, the last
// code sent is dead regardless of the resend cooldown, so it's worth
// silently sending a fresh one rather than showing an input for a code that
// can only ever fail.
const OTP_EXPIRES_S = 60 * 10;

/**
 * When the last code for this email was sent, so a page refresh doesn't
 * reset the cooldown and fire off a brand new email every time — only the
 * remaining wait is recomputed from this stamp.
 */
function lastSentKey(email: string) {
  return `ohel:otp-sent-at:${email}`;
}

/** Marks "a code was just sent for this email" — called at every send site
 * (sign-up's implicit send, the auto-send on arrival, and manual resend). */
export function markOtpSent(email: string) {
  sessionStorage.setItem(lastSentKey(email), String(Date.now()));
}

type VerifyEmailFormProps = {
  email: string;
  onVerified: () => void;
};

/** How long ago (seconds) the last code for this email was sent, or
 * `Infinity` if none is on record — read once at mount, so a page refresh
 * picks up the correct remaining cooldown from the very first render. */
function elapsedSinceLastSent(email: string): number {
  const lastSentAt = Number(sessionStorage.getItem(lastSentKey(email)) ?? 0);
  return lastSentAt ? (Date.now() - lastSentAt) / 1000 : Infinity;
}

const VerifyEmailForm = ({ email, onVerified }: VerifyEmailFormProps) => {
  const { t } = useT();
  const [otp, setOtp] = useState("");
  // Lazy initializer (not an effect): a page refresh must show the correct
  // remaining cooldown on the very first render, not a flash of 60s that
  // then corrects itself. Mirrors the mount effect below: past OTP_EXPIRES_S
  // (or no code on record) a fresh one is about to be sent, so the cooldown
  // starts full rather than at 0.
  const [cooldown, setCooldown] = useState(() => {
    const elapsed = elapsedSinceLastSent(email);
    return elapsed >= OTP_EXPIRES_S
      ? RESEND_COOLDOWN_S
      : Math.max(0, Math.ceil(RESEND_COOLDOWN_S - elapsed));
  });
  const [isVerifying, startVerify] = useTransition();
  const [isResending, startResend] = useTransition();
  const checkedOnMount = useRef(false);

  // A code was either just sent (by sign-up or a previous mount of this same
  // form) or it's genuinely time for a fresh one. `lastSentAt` survives a
  // page refresh (sessionStorage), so reloading the page while a code is
  // still fresh must NOT fire another send.
  useEffect(() => {
    if (checkedOnMount.current) return;
    checkedOnMount.current = true;

    if (elapsedSinceLastSent(email) < OTP_EXPIRES_S) return;

    markOtpSent(email);
    authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const verify = (code: string) => {
    startVerify(async () => {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (error) {
        toast.error(t.auth.verifyCodeInvalid);
        setOtp("");
        return;
      }

      toast.success(t.auth.verifyCodeSuccess);
      onVerified();
    });
  };

  const resend = () => {
    startResend(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (!error) {
        markOtpSent(email);
        toast.success(t.auth.codeSent);
        setCooldown(RESEND_COOLDOWN_S);
      }
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <AuthHeader
        title={t.auth.verifyCodeTitle}
        description={t.auth.verifyCodeDesc.replace("{email}", email)}
      />

      {/* Le code se lit toujours de gauche à droite, même en hébreu */}
      <div dir="ltr" className="flex justify-center">
        <InputOTP
          maxLength={OTP_LENGTH}
          value={otp}
          onChange={setOtp}
          onComplete={verify}
          disabled={isVerifying}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        className="w-full"
        disabled={otp.length < OTP_LENGTH || isVerifying}
        onClick={() => verify(otp)}
      >
        {isVerifying && <Spinner />}
        {t.auth.verifyCodeButton}
      </Button>

      <Button
        variant="ghost"
        type="button"
        className="w-full"
        disabled={cooldown > 0 || isResending}
        onClick={resend}
      >
        {isResending && <Spinner />}
        {cooldown > 0
          ? t.auth.resendCodeIn.replace("{seconds}", String(cooldown))
          : t.auth.resendCode}
      </Button>
    </div>
  );
};

export default VerifyEmailForm;
