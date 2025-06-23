"use client";
// src/components/admin/NavigationBar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function NavigationBar() {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <div className="text-xl font-semibold">後台管理系統</div>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              <Link href="/admin/dashboard">儀表板</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              <Link href="/admin/products"> 商品管理</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              <Link href="/admin/users"> 使用者管理 </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Button variant="outline" size="sm" onClick={handleLogout}>
        登出
      </Button>
    </header>
  );
}
