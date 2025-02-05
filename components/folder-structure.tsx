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
    ["src", [
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
      ],
      ["lib", ["util.ts"]],
      ["locales", "client.ts", "it.ts", "en.ts", "server.ts"],
      ["server"]
    ],
    ["public", "favicon.ico", "vercel.svg"],
    ".env",
    ".env.example",
    ".eslintrc.cjs",
    "drizzle.config.ts",
    "next.config.mjs",
    "next-env.d.ts",
    "package.json",
    "postcss.config.js",
    "prettier.config.mjs",
    "start-localstack.sh",
    "tailwind.config.js",
    "tsconfig.json"
  ],
};

// Update documentation data to use full paths
const documentationData: Record<string, React.ReactNode> = {
  "/app": "Main application directory containing pages and API routes",
  "/components": "Reusable React components directory",
  "/components/ui/button.tsx": "Custom button component with various styles and variants",
  "/app/api/hello/route.ts": "API route handler for hello endpoint",
  "/public": "The public folder contains static assets that are served by the web server. The favicon.ico file is an example of a static asset.",
  "/src/app": `The app folder contains all the routes of the Next.js application. The page.tsx file at the root directory of /app is the homepage of the application. The layout.tsx file is used to wrap the application with providers. See Next.js documentation↗ for more information.

src/app/_components/post.tsx
The post.tsx file is an example of a client component that calls a tRPC mutation.

src/app/api/auth/[...nextauth]/route.ts
The [...nextauth]/route.ts file is the NextAuth.js authentication slug route. It is used to handle authentication requests. See NextAuth.js usage for more information on NextAuth.js, and Next.js Dynamic Routes Docs↗ for info on catch-all/slug routes.

src/app/api/trpc/[trpc]/route.ts
The [trpc].ts file is the tRPC API entrypoint. It is used to handle tRPC requests. See tRPC usage for more information on this file, and Next.js Dynamic Routes Docs↗ for info on catch-all/slug routes.`,
  "/.env": "The .env file is used to store environment variables. See Environment Variables for more information. This file should not be committed to git history.",
  "/.env.example": "The .env.example file shows example environment variables based on the chosen libraries. This file should be committed to git history.",
  "/.eslintrc.cjs": "The .eslintrc.cjs file is used to configure ESLint. See ESLint Docs↗ for more information.",
  "/drizzle.config.ts": "The drizzle.config.ts file is used to configure drizzle kit. See the documentation↗ for more information.",
  "/next-env.d.ts": "The next-env.d.ts file ensures Next.js types are picked up by the TypeScript compiler. You should not remove it or edit it as it can change at any time. See Next.js Docs↗ for more information.",
  "/next.config.mjs": "The next.config.mjs file is used to configure Next.js. See Next.js Docs↗ for more information. Note: The .mjs extension is used to allow for ESM imports.",
  "/postcss.config.js": "The postcss.config.js file is used for Tailwind PostCSS usage. See Tailwind PostCSS Docs↗ for more information.",
  "/prettier.config.mjs": "The prettier.config.mjs file is used to configure Prettier to include the prettier-plugin-tailwindcss for formatting Tailwind CSS classes. See the Tailwind CSS blog post↗ for more information.",
  "/start-localstack.sh": "The start-localstack.sh file is used to start the database. Please see the comments inside the file for information on how to start the database with your operating system.",
  "/tsconfig.json": "The tsconfig.json file is used to configure TypeScript. Some non-defaults, such as strict mode, have been enabled to ensure the best usage of TypeScript for Create T3 App and its libraries. See TypeScript Docs↗ or TypeScript Usage for more information."
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
