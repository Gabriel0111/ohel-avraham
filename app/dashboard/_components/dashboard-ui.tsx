import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ActionCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: ReactNode;
}

export const ActionCard = ({ title, subtitle, href, icon }: ActionCardProps) => (
  <Link
    href={href}
    className="group block p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="grow text-left">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-tight">
          {subtitle}
        </p>
      </div>
      <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);
