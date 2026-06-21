import { Sidebar, type SidebarNavItem } from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation, useOutlet } from "react-router-dom";
import { type FC } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

export const Layout: FC<{ items: SidebarNavItem[] }> = ({ items }) => {
  const outlet = useOutlet();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <TooltipProvider>
      <div className="w-screen h-screen flex overflow-hidden">
        <div className="absolute -z-50 h-full w-full">
          <img src="/bg.png" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -z-40 h-full w-full bg-background/50" />
        <Sidebar items={items} />
        <div
          className={cn(
            "flex-1 transition-[backdrop-filter] duration-300",
            !isHome && "w-full h-full backdrop-blur-3xl",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.25, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
              }}
              className={cn("w-full h-full", !isHome && "p-14 overflow-y-scroll")}
            >
              <div className="w-full h-full max-w-xl">{outlet}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
};
