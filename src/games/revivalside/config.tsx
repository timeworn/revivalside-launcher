import { BookTextIcon, FileTextIcon, HomeIcon, SaveIcon } from "lucide-react";
import { lazy, Suspense } from "react";
import type { GameConfig } from "@/games/types";
import { getGameAssets } from "@/lib/utils";
import { SiDiscord } from "@icons-pack/react-simple-icons";

const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const Save = lazy(() => import("./pages/Save").then((m) => ({ default: m.Save })));
const Logs = lazy(() => import("./pages/Logs").then((m) => ({ default: m.Logs })));

export const revivalsideConfig: GameConfig = {
  id: "revivalside",
  name: "RevivalSide",
  description:
    "A world where conflict never ends between Counters and Corrupted Objects after the Administration Failure. We invite you to a journey to save the Reality.",
  assets: getGameAssets("revivalside"),
  sidebarItems: [
    {
      name: "Home",
      icon: HomeIcon,
      href: "",
    },
    {
      name: "Cross Save",
      icon: SaveIcon,
      href: "/save",
    },
    {
      name: "Logs",
      icon: FileTextIcon,
      href: "/logs",
    },
    {
      name: "Docs",
      icon: BookTextIcon,
      href: "https://url.timeworn.net/GbYsun",
      type: "external",
      side: "bottom",
    },
    {
      name: "Discord",
      icon: SiDiscord,
      href: "https://url.timeworn.net/xXWss7",
      type: "external",
      side: "bottom",
    },
  ],
  routes: [
    {
      index: true,
      element: (
        <Suspense>
          <Home />
        </Suspense>
      ),
    },
    {
      path: "save",
      element: (
        <Suspense>
          <Save />
        </Suspense>
      ),
    },
    {
      path: "logs",
      element: (
        <Suspense>
          <Logs />
        </Suspense>
      ),
    },
  ],
};
