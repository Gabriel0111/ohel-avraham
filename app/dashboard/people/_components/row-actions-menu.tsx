import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Ban, ShieldOff, Trash2 } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { type Id } from "@/convex/_generated/dataModel";

/**
 * Admin row actions (block / unblock / delete) shared by the host and guest
 * tables. Renders inside a table cell that stops row-click propagation.
 */
export function RowActionsMenu({
  userId,
  authUserId,
  name,
  isBlocked,
  blocking,
  onBlock,
  onDelete,
}: {
  userId: Id<"users">;
  authUserId: string;
  name: string;
  isBlocked: boolean;
  blocking: string | null;
  onBlock: (userId: Id<"users">, blocked: boolean) => void;
  onDelete: (info: { authUserId: string; name: string }) => void;
}) {
  const { t } = useT();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-muted"
          disabled={blocking === userId}
        >
          {blocking === userId ? (
            <Spinner className="size-3" />
          ) : (
            <MoreHorizontal className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {isBlocked ? (
          <DropdownMenuItem
            onClick={() => onBlock(userId, false)}
            className="gap-2 cursor-pointer"
          >
            <ShieldOff className="size-3.5 text-green-600" />
            {t.people.unblock}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => onBlock(userId, true)}
            className="gap-2 cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20"
          >
            <Ban className="size-3.5 text-amber-600" />
            {t.people.block}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete({ authUserId, name })}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="size-3.5 text-destructive" />
          {t.people.deleteUser}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
