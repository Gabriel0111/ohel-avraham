import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getRoleRingClass, isRegistrationIncomplete } from "@/lib/role-style";

interface DropdownItems {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface AvatarDropdownProps {
  name?: string;
  email?: string;
  imageSrc?: string;
  items: DropdownItems[];
  pendingCount?: number;
  requestsLabel?: string;
  role?: string;
  incompleteLabel?: string;
}

const AvatarDropdown = ({
  name,
  email,
  imageSrc,
  items,
  pendingCount = 0,
  requestsLabel,
  role,
  incompleteLabel,
}: AvatarDropdownProps) => {
  const hasNewRequest = pendingCount > 0;
  const incomplete = isRegistrationIncomplete(role);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar
            className={cn(
              "size-8 shadow-sm ring-2 ring-offset-2 ring-offset-background",
              getRoleRingClass(role),
            )}
          >
            <AvatarImage
              src={imageSrc ?? `https://avatar.vercel.sh/${email}`}
              alt={email}
            />
            <AvatarFallback>{email?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          {incomplete && (
            <span
              role="status"
              className="absolute -bottom-0.5 -end-0.5 flex size-3.5 items-center justify-center rounded-full bg-amber-500 ring-2 ring-background"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500/60 motion-reduce:hidden" />
              <span className="relative text-[8px] font-bold leading-none text-white">
                !
              </span>
              <span className="sr-only">{incompleteLabel}</span>
            </span>
          )}
          {hasNewRequest && (
            <span role="status" className="absolute -top-1 -end-1 flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 motion-reduce:hidden" />
              <span className="relative inline-flex size-3 rounded-full bg-primary ring-2 ring-background" />
              <span className="sr-only">
                {`${pendingCount} ${requestsLabel ?? ""}`.trim()}
              </span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{name}</span>
            <span className="text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {items.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              variant={item?.variant ?? "default"}
            >
              {item.icon}
              <span
                className={cn(
                  "text-popover-foreground",
                  item.variant === "destructive" && "text-destructive",
                )}
              >
                {item.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
