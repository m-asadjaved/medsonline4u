import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1"],
  navMain: [
    {
      title: "Admin",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        }
      ],
    },
    {
      title: "Products",
      url: "#",
      items: [
        {
          title: "View Products",
          url: "/admin/products",
        },
        {
          title: "Add New Product",
          url: "/admin/products/new",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      items: [
        {
          title: "View Orders",
          url: "/admin/orders",
        },
      ],
    },
    {
      title: "Files",
      url: "#",
      items: [
        {
          title: "Manage Images",
          url: "/admin/images",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
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
      <SidebarRail />
    </Sidebar>
  );
}
