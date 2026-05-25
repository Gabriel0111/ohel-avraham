import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Logo } from "@/components/icons/logo";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex sticky top-0 z-10 border-b border-border bg-card md:rounded-t-md h-(--header-height) shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center px-3 md:px-4">
        {/* Hamburger — toujours visible */}
        <SidebarTrigger className="transition-transform duration-150 active:scale-90" />

        {/* Séparateur desktop uniquement */}
        <Separator
          orientation="vertical"
          className="hidden md:block mx-3 data-[orientation=vertical]:h-4"
        />

        {/* Logo centré sur mobile uniquement */}
        <div className="flex flex-1 justify-center md:hidden">
          <Link href="/" className="transition-opacity duration-150 hover:opacity-70">
            <Logo className="text-base" />
          </Link>
        </div>

        {/* Spacer desktop */}
        <div className="hidden md:flex flex-1" />

        <AnimatedThemeToggler className="transition-transform duration-150 active:scale-90" />
      </div>
    </header>
  );
}
