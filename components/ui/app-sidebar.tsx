"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  UserPlus,
  FileText,
  FolderPlus,
  LogOut,
  User as UserIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import UserCard from "@/components/dynamicUI/userCard"; // Add import

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Register User",
    url: "/dashboard/register",
    icon: UserPlus,
  },
  {
    title: "Create Blog",
    url: "/dashboard/create-blog",
    icon: FileText,
  },
  {
    title: "Create Category",
    url: "/dashboard/create-category",
    icon: FolderPlus,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

interface User {
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/v1/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user in sidebar", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/v1/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">
          Blogzenx Admin
        </h2>
        <h2 className="text-xl font-bold tracking-tight hidden group-data-[collapsible=icon]:block text-center">
          BA
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mb-2">
          <div className="group-data-[collapsible=icon]:hidden w-full">
            <UserCard user={user} variant="sidebar" />
          </div>
          <div className="hidden group-data-[collapsible=icon]:flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            {/* Fallback icon for collapsed state if avatar shouldn't be shown or just simplified */}
            <UserIcon className="h-5 w-5" />
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="destructive"
              className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
