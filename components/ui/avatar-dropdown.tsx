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

interface DropdownItems {
  icon: ReactNode;
  label: string;
  onClick: () => void;
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
      <DropdownMenuTrigger asChild className="cursor-pointer">
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
            <DropdownMenuItem key={index} onClick={item.onClick}>
              {item.icon}
              <span className="text-popover-foreground">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
