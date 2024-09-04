"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Compress Image",
    href: "reading/comming-soon",
    description: "Compress the image file in the browser.",
  },
  {
    title: "Compress PDF",
    href: "/reading/comming-soon",
    description: "Compress the PDF file in the browser.",
  },
  {
    title: "Analyse Document",
    href: "/reading/comming-soon",
    description: "Get analytical charts for documents with analytical data.",
  },
  {
    title: "Chat with your file",
    href: "/reading/comming-soon",
    description: "You can chat with your file having a knowledge base tag.",
  },
  {
    title: "Upload-File",
    href: "/services/file-upload",
    description: "Get free 100MB of storage. Upload a file in the document management system and extract non-machine-readable text.",
  },
  {
    title: "View File",
    href: "/services/manage-files",
    description: "View all your files.",
  },
];

export function NavigationMenuAll() {
  return (
    <div className="flex justify-center mt-16"> {/* Centers the menu horizontally and moves it down */}
      <NavigationMenu className="w-full max-w-4xl">
        <NavigationMenuList>
        <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="reading/blogs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Blogs</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* Login and Sign Up */}
          <NavigationMenuItem className="space-x-4">
            <Link href="/auth/login" legacyBehavior passHref>
              <Button variant="outline">Login</Button>
            </Link>

            <Link href="/auth/register" legacyBehavior passHref>
              <Button>Sign Up</Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
