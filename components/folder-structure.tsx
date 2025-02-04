"use client";

import * as React from "react";
import { ChevronRight, File, Folder } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useState } from "react";

// This is sample data.
const data = {
  tree: [
    [
      "app",
      [
        "api",
        ["hello", ["route.ts"]],
        "page.tsx",
        "layout.tsx",
        ["blog", ["page.tsx"]],
      ],
    ],
    [
      "components",
      ["ui", "button.tsx", "card.tsx"],
      "header.tsx",
      "footer.tsx",
    ],
    ["lib", ["util.ts"]],
    ["public", "favicon.ico", "vercel.svg"],
    ".eslintrc.json",
    ".gitignore",
    "next.config.js",
    "tailwind.config.js",
    "package.json",
    "README.md",
  ],
};

// Update documentation data to use full paths
const documentationData: Record<string, string> = {
  "/app": "Main application directory containing pages and API routes",
  "/components": "Reusable React components directory",
  "/components/ui/button.tsx": "Custom button component with various styles and variants",
  "/README.md": "Project documentation and setup instructions",
  "/app/api/hello/route.ts": "API route handler for hello endpoint",
  // Add more documentation entries as needed
};

export function FolderSructure({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [active, setActive] = useState<string>();

  return (
    <Sidebar
      {...props}
      variant="floating"
      collapsible="none"
      className="h-auto border rounded flex flex-row w-full gap-6"
    >
      <SidebarContent className="shrink-0">
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.tree.map((item, index) => (
                <Tree 
                  key={index} 
                  item={item} 
                  active={active} 
                  onSelect={setActive}
                  parentPath=""
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <div className="flex-1 border-l p-4">
        {active ? (
          documentationData[active] || `No documentation available for ${active}`
        ) : (
          "Select a file or folder to view its documentation"
        )}
      </div>
    </Sidebar>
  );
}

function Tree({ 
  item, 
  active, 
  onSelect,
  parentPath 
}: { 
  item: string | any[];
  active?: string;
  onSelect: (name: string) => void;
  parentPath: string;
}) {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const fullPath = `${parentPath}/${name}`;

  if (!items.length) {
    return (
      <SidebarMenuButton
        isActive={fullPath === active}
        className="data-[active=true]:bg-transparent"
        onClick={() => onSelect(fullPath)}
      >
        <File />
        {name}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === "components" || name === "ui"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={fullPath === active}
            onClick={() => onSelect(fullPath)}
          >
            <ChevronRight className="transition-transform" />
            <Folder />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree 
                key={index} 
                item={subItem} 
                active={active} 
                onSelect={onSelect}
                parentPath={fullPath}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
