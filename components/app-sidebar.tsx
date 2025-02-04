import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Introduction",
          url: "/docs/introduction",
        },
        {
          title: "Why this template?",
          url: "/docs/why",
        },
        {
          title: "Installation",
          url: "/docs/installation",
        },
        {
          title: "Project Structure",
          url: "/docs/project-structure",
        },
        {
          title: "FAQ",
          url: "/docs/faq",
        },
        {
          title: "Other Reccomendations",
          url: "/docs/other-reccomendations",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "First Steps",
          url: "/docs/usage/first-steps",
        },
        {
          title: "Next.js",
          url: "/docs/usage/next-js",
          isActive: true,
        },
        {
          title: "Typescript",
          url: "/docs/usage/typescript",
        },
        {
          title: "Shadcn/ui",
          url: "/docs/usage/shadcn-ui",
        },
        {
          title: "Drizzle",
          url: "/docs/usage/drizzle",
        },
        {
          title: "NeonDB",
          url: "/docs/usage/neon-db",
        },
        {
          title: "Clerk",
          url: "/docs/usage/clerk",
        },
        {
          title: "Environment variables",
          url: "/docs/usage/env-variables",
        },
      ],
    },
    {
      title: "Deployment",
      url: "#",
      items: [
        {
          title: "Vercel",
          url: "/deployment/vercel",
        },
        {
          title: "Azure",
          url: "/deployment/azure",
        },
        {
          title: "AWS",
          url: "/deployment/aws",
        },
        {
          title: "Docker",
          url: "/deployment/docker",
        },
      ],
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {items.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
