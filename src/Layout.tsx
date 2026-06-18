import { Sidebar, type SidebarNavItem } from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";
import type { FC } from "react";

export const Layout: FC<{ items: SidebarNavItem[] }> = ({ items }) => {
  return (
    <TooltipProvider>
      <div className="w-screen h-screen flex bg-[url(/bg.png)] bg-cover overflow-hidden">
        <Sidebar items={items} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
};
