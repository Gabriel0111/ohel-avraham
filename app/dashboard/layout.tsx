import { CSSProperties, PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { BlockedGuard } from "@/app/dashboard/_components/blocked-guard";
import { ProfileProvider } from "@/app/dashboard/_components/profile-provider";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 14)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="border-0 md:border border-border shadow-none md:shadow-md m-0 md:m-6 bg-card rounded-none md:rounded-2xl">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 mx-auto w-full max-w-6xl px-4 md:px-6 py-6 md:py-8 pb-8 md:pb-6">
            <BlockedGuard>
              <ProfileProvider>{children}</ProfileProvider>
            </BlockedGuard>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
