"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Home, ShoppingCart, Users, Package, BarChart3, Settings, Droplets, ChevronUp, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", icon: Home, label: "لوحة التحكم" },
  { href: "/orders", icon: ShoppingCart, label: "الطلبات" },
  { href: "/customers", icon: Users, label: "العملاء" },
  { href: "/products", icon: Package, label: "المنتجات" },
  { href: "/reports", icon: BarChart3, label: "التقارير" },
  { href: "/settings", icon: Settings, label: "الإعدادات" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="right" className="bg-white">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Droplets className="w-8 h-8 text-primary" />
          <span className="text-xl font-semibold">أكوا فلو</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>التنقل</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <a href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User className="w-4 h-4" />
              <span>جون دو</span>
              <ChevronUp className="mr-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem>
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
