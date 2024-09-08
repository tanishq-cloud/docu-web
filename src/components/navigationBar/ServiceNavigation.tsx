'use client';

import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";
import { IconAssetFilled } from '@tabler/icons-react';
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"; 
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

interface ServiceNavigationProps {
  username: string;
  uid: string;
}

export default function ServiceNavigation({ username, uid }: ServiceNavigationProps) {
  
  const router = useRouter();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string>("");

  

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/services/login");
  };

  useEffect(() => {
    setActiveLink(pathname); // Set the active link based on the current URL path
  }, [pathname]);

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/">
        <IconAssetFilled />
        <p className="font-bold text-inherit">DocuSpace</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-10" justify="center">
        <NavbarItem isActive={activeLink === "/services/file-upload"}>
        <TooltipProvider>
        <Tooltip> <TooltipContent>
        <p>Upload Files</p>
            </TooltipContent>
            <Link href="/services/file-upload" className={activeLink === "/services/file-upload" ? "text-blue-500" : ""}>
              Upload Files
            </Link>
          </Tooltip>
        </TooltipProvider>
          
        </NavbarItem>
        <NavbarItem isActive={activeLink === "/services/manage-files"}>
        <TooltipProvider>
          <Tooltip> 
            <TooltipContent>
            <p>View and manage files</p>
            </TooltipContent>
            <Link href="/services/manage-files" className={activeLink === "/services/manage-files" ? "text-blue-500" : ""}>
              View Files
            </Link>
          </Tooltip>
          </TooltipProvider>
        </NavbarItem>
        <NavbarItem isActive={activeLink === "/services/chat"}>
        <TooltipProvider>
        <Tooltip> 
            <TooltipContent>
            <p>Chat with your files present the knowledgehub</p>
            </TooltipContent>
            <Link href="/services/chat" className={activeLink === "/services/chat" ? "text-blue-500" : ""}>
              Chat With File
            </Link>
          </Tooltip>
          </TooltipProvider>
        </NavbarItem> 
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={username} 
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{username}</p>
            </DropdownItem>
            <DropdownItem key="settings" onClick={() => window.location.href = "/services/settings"}>My Settings</DropdownItem>
            <DropdownItem key="help_and_feedback" onClick={() => window.location.href = "/help-feedback"}>Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
