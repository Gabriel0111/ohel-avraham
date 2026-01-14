import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const BackHomeButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userType = searchParams.get("userType");

  // If userType exists → remove it
  const onBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    const isRegistering = params.has("userType");

    let url = "";

    if (isRegistering) {
      params.delete("userType");
      // url = params.toString();
      url = "?";

      // router.push(params.toString());
    } else {
      url = "/";
    }

    router.push(url, { scroll: false });
  };

  // No userType → go home
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
        Home
      </Link>
    );
  }

  // userType exists → go back one step
  return (
    <Button
      type="button"
      onClick={onBack}
      variant="ghost"
      className="absolute top-7 left-5"
    >
      <ChevronLeftIcon />
      Back
    </Button>
  );
};

export default BackHomeButton;
