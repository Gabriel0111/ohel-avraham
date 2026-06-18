import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationBar({
  pageIndex,
  pageCount,
  total,
  label,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  pageIndex: number;
  pageCount: number;
  total: number;
  label: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border/40 bg-muted/20">
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{total}</span> {label} ·
        page{" "}
        <span className="font-medium text-foreground">{pageIndex + 1}</span> /{" "}
        {pageCount}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={!canPrev}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canNext}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
