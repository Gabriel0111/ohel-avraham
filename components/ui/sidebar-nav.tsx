import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Icon } from "@tabler/icons-react";

type SidebarNavProps = HTMLAttributes<HTMLElement> & {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
};

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const [val, setVal] = useState(pathname ?? "/settings");

  const handleSelect = (e: string) => {
    setVal(e);
  };

  return (
    <>
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.url} value={item.url}>
                <div className="flex items-center gap-x-4 px-2 py-1">
                  <span className="scale-125">
                    {item.icon && <item.icon />}
                  </span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        aria-orientation="horizontal"
        type="always"
        className="hidden w-full bg-background px-1 py-2 md:block"
      >
        <nav
          className={cn("flex space-2 py-1 flex-col space-y-2", className)}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                pathname === item.url
                  ? "bg-primary hover:bg-accent"
                  : "hover:bg-accent hover:underline hover:underline-offset-2",
                "justify-start items-center",
              )}
            >
              <span className="me-2 scale-110">
                {item.icon && <item.icon />}
              </span>
              <span> {item.title}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
