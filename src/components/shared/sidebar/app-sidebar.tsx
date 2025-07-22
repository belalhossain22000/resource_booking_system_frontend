"use client";

import Logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  HandCoins,
  Home,
  InfoIcon,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";

const data = {
  admin: {
    navMain: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard, 
      },
      {
        title: "Calendar View",
        url: "/calender-view",
        icon: User,
      },
      {
        title: "All Bookings",
        url: "/all-bookings", 
        icon: User,
      },
      {
        title: "Resources",
        url: "/resources",
        icon: User,
      },
    ],
    actions:[
      {
        title: "New Booking",
        url: "/new-booking",
        icon: LayoutDashboard, 
      },
      {
        title: "Setting",
        url: "/setting",
        icon: LayoutDashboard, 
      },
    ]
  },
};

// add roles based on your requirements
interface AppSidebarProps {
  role: string;
}

export default function AppSidebar({ role, ...props }: AppSidebarProps) {
  const sidebarData = data[role?.toLowerCase() as keyof typeof data];

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 bg-white border-r border-blue-200"
      {...props}
    >
      <SidebarHeader>
        <Link
          href={"/"}
          className="flex items-center w-full max-h-40 justify-center"
        >
          <Image
            src={Logo.src}
            alt="Logo"
            width={300}
            height={300}
            className="size-auto "
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData?.navMain } section="Navigation" />
        <NavMain items={sidebarData?.actions} section="Actions" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
