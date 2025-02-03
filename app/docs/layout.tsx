import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AnimatedTitle } from "../animated-title";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="top-[--header-height] !h-[calc(100svh-var(--header-height))]">
        <div className="flex gap-2 p-4 items-center">
          <SidebarTrigger />
          <AnimatedTitle />
        </div>
        <div className="relative grid grid-cols-4 gap-6 p-6 pt-0 overflow-auto h-[calc(100svh-var(--header-height)-60px)]">
          <section className="col-span-3">{children}</section>
          {/* <aside className="sticky top-[300px] col-span-1">
            <h4>On this page</h4>

            <ul>
              <li></li>
            </ul>
          </aside> */}
        </div>
      </main>
    </SidebarProvider>
  );
}
