import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarNavigation } from "./sidebar-navigation";

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
          title: "Project Structure",
          url: "/docs/project-structure",
        },
        {
          title: "Reccomendations",
          url: "/docs/reccomendations",
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
          title: "Neon",
          url: "/docs/usage/neon",
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
          url: "/docs/deployment/vercel",
        },
        {
          title: "Azure",
          url: "/docs/deployment/azure",
        },
        // {
        //   title: "AWS",
        //   url: "/docs/deployment/aws",
        // },
        {
          title: "Docker",
          url: "/docs/deployment/docker",
        },
      ],
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarContent>
        <SidebarNavigation items={items.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
