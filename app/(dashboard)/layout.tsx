import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/dashboard/command-menu";
import { UserNav } from "@/components/dashboard/user-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultOpen = true
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <CommandMenu />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* Header content can go here if needed */}
            </div>
            <UserNav />
          </header>
          <main className="flex-1 bg-muted/40 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
