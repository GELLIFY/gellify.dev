"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import LaunchUI from "./logos/launch-ui";
import { Button } from "./ui/button";
import Link from "next/link";
import { Search } from "@/components/search";

export function Navbar() {
  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b  p-4 justify-between gap-4">
      <div className="flex gap-4 items-center flex-1">
        <div className="flex gap-2 items-center">
          <LaunchUI />
          <h1 className="font-bold text-primary">GELLIFY.dev</h1>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Documentation</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-hidden focus:shadow-md"
                        href="/"
                      >
                        <LaunchUI className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          acme-app
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          A web development stack focused on simplicity,
                          modularity, and full-stack typesafety. The core pieces
                          are Next.js, NeonDB with Drizzle, and Clerk.js.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs/introduction" title="Introduction">
                    Stack focused on simplicity and modularity
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem href="/docs/usage/first-steps" title="First Steps">
                    Here is the bare minimum to get your app working.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <Search />
      <Button asChild>
        <Link href={"https://github.com/GELLIFY/acme-app"}>Get started</Link>
      </Button>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
