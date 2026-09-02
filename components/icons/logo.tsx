import { cn } from "@/lib/utils";

// Wordmark. Rendered inside links (navbar, footer, auth) — deliberately a
// <span>, not a heading, so pages keep a single meaningful <h1>.
export const Logo = ({ className }: { className?: string }) => {
  return (
    <span className={cn("block text-2xl font-bold tracking-tight", className)}>
      Ohel<span className="text-primary">Avraham</span>
    </span>
  );
};
