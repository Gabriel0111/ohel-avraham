import { CSSProperties, PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

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
      <SidebarInset className="border border-border shadow-md m-6 bg-card rounded-md">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 mx-auto w-full max-w-6xl px-6 py-8 pb-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
