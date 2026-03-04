import { SidebarProvider } from "@/components/ui/sidebar";
import { StudioHeader } from "./StudioHeader";
import { StudioSidebar } from "./StudioSidebar";

export function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudioSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <StudioHeader />
          <main className="flex-1 overflow-auto p-3 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
