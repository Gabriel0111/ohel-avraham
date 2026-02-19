import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { ArrowUpRightIcon, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const EmptyProfile = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon" className="rounded-full bg-orange-400/10 p-6">
        <User size={12} className="text-orange-500" />
      </EmptyMedia>
      <EmptyTitle>Profile not Completed</EmptyTitle>
      <EmptyDescription>
        Please complete your registration to display your profile details.
      </EmptyDescription>
    </EmptyHeader>
    <Link
      href="/complete-registration"
      className={cn(
        buttonVariants({ variant: "link", size: "sm" }),
        "text-primary",
      )}
    >
      Complete your Registration <ArrowUpRightIcon size={16} />
    </Link>
  </Empty>
);
