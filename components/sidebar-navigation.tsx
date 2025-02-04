'use client'

import { usePathname } from 'next/navigation'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  url: string;
  items?: Array<{
    title: string;
    url: string;
  }>;
}

export function SidebarNavigation({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname()

  return (
    <>
      {items.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items?.map((subItem) => (
                <SidebarMenuItem key={subItem.title}>
                  <SidebarMenuButton asChild isActive={pathname === subItem.url} className={cn({ "bg-[hsl(240_4.8%_95.9%)]": pathname === subItem.url})}>
                    <a href={subItem.url}>{subItem.title}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
} 