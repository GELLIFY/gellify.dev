import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { NameTransition } from '../name';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='top-[--header-height] !h-[calc(100svh-var(--header-height))]'>
        <div className='flex gap-2 p-4 items-center'>
          <SidebarTrigger />
          <NameTransition />
        </div>
        <div className='p-6 overflow-auto h-[calc(100svh-var(--header-height)-60px)]'>{children}</div>
      </main>
    </SidebarProvider>
  )
}
