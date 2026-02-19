import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function SiteHeader() {
  return (
    <header className="flex sticky top-0 z-10 border-b border-border bg-card rounded-t-md h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 lg:gap-2 px-4">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex justify-end w-full">
          <AnimatedThemeToggler />
        </div>

        {/*<h1 className="text-base font-medium">Documents</h1>*/}
        {/*<div className="ml-auto flex items-center gap-2">*/}
        {/*  <Button variant="ghost" asChild size="sm" className="hidden sm:flex">*/}
        {/*    <a*/}
        {/*      href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"*/}
        {/*      rel="noopener noreferrer"*/}
        {/*      target="_blank"*/}
        {/*      className="dark:text-foreground"*/}
        {/*    >*/}
        {/*      GitHub*/}
        {/*    </a>*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>
    </header>
  );
}
