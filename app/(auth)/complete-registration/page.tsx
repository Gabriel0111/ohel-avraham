"use client";

import { Button } from "@/components/ui/button";
import BackHomeButton from "@/app/(auth)/_components/back-home-button";
import RadioSelect, { RadioGroupItem } from "@/components/ui/radio-select";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HostForm from "@/app/(auth)/_components/host-form";
import GuestForm from "@/app/(auth)/_components/guest-form";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useT } from "@/lib/i18n/context";

const CompleteRegistration = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

  const { t } = useT();

  const items: RadioGroupItem[] = [
    {
      label: t.auth.hostLabel,
      description: t.auth.hostDesc,
      value: "host",
    },
    {
      label: t.auth.guestLabel,
      description: t.auth.guestDesc,
      value: "guest",
    },
  ];

  const setUserType = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("userType", type);

    router.push(params.toString() ? `?${params.toString()}` : "/", {
      scroll: false,
    });
  };

  const onContinue = () => {
    if (!selectedUserType) return;

    setUserType(selectedUserType);
  };

  return (
    <div className="relative flex flex-col py-10 px-4 min-h-screen overflow-y-auto">
      <BackHomeButton />
      <AnimatedThemeToggler />

      <div className="mx-auto space-y-5 sm:w-sm mt-10">
        <AnimatePresence mode="wait">
          {!userType && (
            <motion.div
              key="host"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col space-y-5 justify-center">
                <AuthHeader
                  title={t.auth.completeRegTitle}
                  description={t.auth.completeRegDesc}
                />

                <RadioSelect
                  items={items}
                  onSelected={(value) => setSelectedUserType(value)}
                />

                <Button
                  className="w-full"
                  disabled={!selectedUserType}
                  onClick={onContinue}
                >
                  {t.common.continue}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {userType === "host" && (
            <motion.div
              key="host"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <HostForm />
            </motion.div>
          )}

          {userType === "guest" && (
            <motion.div
              key="guest"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <GuestForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompleteRegistration;
