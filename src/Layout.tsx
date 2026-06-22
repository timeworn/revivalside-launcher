import { Sidebar, SidebarGroup, SidebarItem, type SidebarNavItem } from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation, useOutlet } from "react-router-dom";
import { useEffect, useState, type FC } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";
import * as motion from "motion/react-m";
import { WindowControls } from "@/components/WindowControls";
import { Separator } from "@/components/ui/separator";
import { SettingsProvider } from "@/components/SettingsProvider";
import favicon from "@/assets/favicon.webp";
import { LauncherStateProvider } from "@/components/LauncherStateProvider";

const bgImages = import.meta.glob("@/assets/bg/**/*.{webp,png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

const getRandomBg = () => {
  const imagePaths = Object.keys(bgImages);
  if (imagePaths.length === 0) return null;

  const randomPath = imagePaths[Math.floor(Math.random() * imagePaths.length)];
  return bgImages[randomPath] as string;
};

export const Layout: FC<{ items: SidebarNavItem[] }> = ({ items }) => {
  const outlet = useOutlet();
  const location = useLocation();
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  const isHome = location.pathname === "/";

  useEffect(() => {
    setBgUrl(getRandomBg());
    console.log("Background image set to:", bgUrl);
  }, []);

  return (
    <SettingsProvider>
      <LauncherStateProvider>
        <TooltipProvider>
          <WindowControls />
          <div className="select-none">
            <div className="relative w-screen h-full flex">
              <div className="fixed -z-50 h-screen w-full bg-muted">
                {bgUrl && <img src={bgUrl} className="w-full h-full object-cover" />}
              </div>
              <div className="fixed -z-40 h-full w-full bg-background/60" />
              <Sidebar className="backdrop-blur-3xl">
                <img src={favicon} className="size-8" />
                <Separator />
                <SidebarGroup>
                  {items
                    .filter((item) => item.side === "top" || !item.side)
                    .map((item, index) => (
                      <SidebarItem key={index} item={item} />
                    ))}
                </SidebarGroup>
                <SidebarGroup className="mt-auto">
                  {items
                    .filter((item) => item.side === "bottom")
                    .map((item, index) => (
                      <SidebarItem key={index} item={item} />
                    ))}
                </SidebarGroup>
              </Sidebar>
              <div
                className={cn(
                  "flex-1 transition-[backdrop-filter] p-14 duration-300 min-h-screen overflow-hidden",
                  !isHome && "backdrop-blur-3xl overflow-y-scroll",
                )}
              >
                <LazyMotion features={domAnimation}>
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
                      className={cn("w-full h-full opacity-0", !isHome && "max-w-xl")}
                    >
                      {outlet}
                    </motion.div>
                  </AnimatePresence>
                </LazyMotion>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </LauncherStateProvider>
    </SettingsProvider>
  );
};
