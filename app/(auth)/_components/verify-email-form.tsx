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

/**
 * Sign-up just sent a code (sendVerificationOnSignUp) — this flag lets the
 * form skip the automatic re-send when the user lands here right after.
 */
export const OTP_JUST_SENT_KEY = "ohel:otp-just-sent";

type VerifyEmailFormProps = {
  email: string;
  onVerified: () => void;
};

const VerifyEmailForm = ({ email, onVerified }: VerifyEmailFormProps) => {
  const { t } = useT();
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const [isVerifying, startVerify] = useTransition();
  const [isResending, startResend] = useTransition();
  const sentOnce = useRef(false);

  // A code was either just sent by sign-up, or the user came back later and
  // the old one is likely expired — send a fresh one on arrival.
  useEffect(() => {
    if (sentOnce.current) return;
    sentOnce.current = true;

    if (sessionStorage.getItem(OTP_JUST_SENT_KEY)) {
      sessionStorage.removeItem(OTP_JUST_SENT_KEY);
      return;
    }

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
