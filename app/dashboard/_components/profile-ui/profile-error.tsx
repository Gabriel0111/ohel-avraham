import { ArrowUpRightIcon, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const ProfileError = () => (
  <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
    <div className="size-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
      <User className="size-6" />
    </div>
    <h3 className="text-lg font-bold">Session expired</h3>
    <span className="text-sm text-muted-foreground max-w-xs">
      Please log in again to access your profile settings.
    </span>
    <Link
      href="/login"
      className={cn(
        buttonVariants({ variant: "link", size: "sm" }),
        "text-primary",
      )}
    >
      Return to Login Page <ArrowUpRightIcon size={16} />
    </Link>
  </div>
);
