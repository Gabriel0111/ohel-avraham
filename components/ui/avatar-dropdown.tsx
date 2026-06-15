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
}

const AvatarDropdown = ({
  name,
  email,
  imageSrc,
  items,
  pendingCount = 0,
  requestsLabel,
}: AvatarDropdownProps) => {
  const hasNewRequest = pendingCount > 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="size-8 shadow-sm">
            <AvatarImage
              src={imageSrc ?? `https://avatar.vercel.sh/${email}`}
              alt={email}
            />
            <AvatarFallback>{email?.slice(0, 1)}</AvatarFallback>
          </Avatar>
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
