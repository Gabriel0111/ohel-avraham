"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n/context";

const BackHomeButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useT();

  const userType = searchParams.get("userType");

  const onBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    const isRegistering = params.has("userType");

    let url = "";

    if (isRegistering) {
      params.delete("userType");
      url = "?";
    } else {
      url = "/";
    }

    router.push(url, { scroll: false });
  };

  if (!userType) {
    return (
      <Link
        href="/"
        className={buttonVariants({
          variant: "ghost",
          className: "absolute top-7 left-5",
        })}
      >
        <ChevronLeftIcon />
        {t.common.home}
      </Link>
    );
  }

  return (
    <Button
      type="button"
      onClick={onBack}
      variant="ghost"
      className="absolute top-7 left-5"
    >
      <ChevronLeftIcon />
      {t.common.back}
    </Button>
  );
};

export default BackHomeButton;
