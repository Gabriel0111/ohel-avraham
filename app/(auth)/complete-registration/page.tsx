"use client";

import { Button } from "@/components/ui/button";
import BackHomeButton from "@/app/(auth)/_components/back-home-button";
import RadioSelect, { RadioGroupItem } from "@/components/ui/radio-select";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HostForm from "@/app/(auth)/_components/host-form";
import GuestForm from "@/app/(auth)/_components/guest-form";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import { useAuth } from "@/app/ConvexClientProvider";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const CompleteRegistration = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

  const { data: session } = authClient.useSession();
  const { isAuthenticated, user } = useAuth();

  const createUser = useMutation(api.users.createUser);

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const performSync = async () => {
      // 1. Check if we have a session but no Convex user yet
      // 2. Ensure we aren't already in the middle of a request (isSyncing)
      if (session?.user?.id && !isAuthenticated && !isSyncing) {
        try {
          setIsSyncing(true);
          await createUser();
        } catch (error) {
          console.error("Failed to create user:", error);
        } finally {
          setIsSyncing(false);
        }
      } else if (isAuthenticated && user?.role !== "user") {
        redirect("/");
      }
    };

    performSync();
  }, [session, isAuthenticated, createUser, isSyncing]);

  const items: RadioGroupItem[] = [
    {
      label: "Host",
      description: "Welcome people on Shabbat and share a wonderful holy day",
      value: "host",
    },
    {
      label: "Guest",
      description: "Search for people that can host you on Shabbat",
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
                  title="Complete your registration"
                  description="Finish your registration to pursue your sharing experience."
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
                  Continue
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
