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
}

const AvatarDropdown = ({
  name,
  email,
  imageSrc,
  items,
}: AvatarDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer shadow-sm">
        <Avatar className="size-8 shrink-0">
          <AvatarImage
            src={imageSrc ?? `https://avatar.vercel.sh/${email}`}
            alt={email}
          />
          <AvatarFallback>{email?.slice(0, 1)}</AvatarFallback>
        </Avatar>
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
