import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import type { ComponentProps, FC } from "react";
import { NavLink } from "react-router-dom";

export interface SidebarNavItem {
  name: string;
  icon: LucideIcon;
  href?: string;
  side?: "top" | "bottom";
}

interface SidebarItemProps extends ComponentProps<typeof NavLink> {
  name: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ name, className, children, ...props }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <NavLink
            className={({ isActive }) =>
              cn(
                "size-9 rounded-lg brightness-75 hover:brightness-100 transition-all duration-300 hover:bg-muted inline-flex items-center justify-center box-content p-1",
                isActive && "brightness-100 bg-muted",
                className,
              )
            }
            {...props}
          >
            {children}
          </NavLink>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">{name}</TooltipContent>
    </Tooltip>
  );
};

interface SidebarProps {
  items?: SidebarNavItem[];
}

export const Sidebar: FC<SidebarProps> = ({ items = [] }) => {
  return (
    <nav className="sticky top-0 flex w-fit h-screen flex-col items-center gap-4 p-2 backdrop-blur-3xl">
      <img src="/favicon.webp" alt="Logo" className="size-8" />
      <Separator />
      <div className="flex flex-col gap-2">
        {items
          .filter((item) => item.side === "top" || !item.side)
          .map((item, index) => (
            <SidebarItem key={index} name={item.name} to={item.href || "#"}>
              <item.icon />
            </SidebarItem>
          ))}
      </div>
      <div className="flex mt-auto flex-col gap-2">
        {items
          .filter((item) => item.side === "bottom")
          .map((item, index) => (
            <SidebarItem key={index} name={item.name} to={item.href || "#"}>
              <item.icon />
            </SidebarItem>
          ))}
      </div>
    </nav>
  );
};
