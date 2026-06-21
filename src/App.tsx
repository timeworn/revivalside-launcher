import { Layout } from "@/Layout";
import "./App.css";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { FileTextIcon, HomeIcon, InfoIcon, SaveIcon, SettingsIcon } from "lucide-react";
import type { SidebarNavItem } from "@/components/Sidebar";
import { Home } from "@/pages/Home";
import { Save } from "@/pages/Save";
import { Settings } from "@/pages/Settings";

const items: SidebarNavItem[] = [
  {
    name: "Home",
    icon: HomeIcon,
    href: "/",
  },
  {
    name: "Cross Save",
    icon: SaveIcon,
    href: "/save",
  },
  {
    name: "Logs",
    icon: FileTextIcon,
    href: "#",
    type: "folder",
  },
  {
    name: "Help",
    icon: InfoIcon,
    href: "https://discord.gg/9FryPYZSjH",
    type: "external",
    side: "bottom",
  },
  {
    name: "Settings",
    icon: SettingsIcon,
    href: "/settings",
    side: "bottom",
  },
];

const router = createMemoryRouter([
  {
    path: "/",
    element: <Layout items={items} />,
    children: [
      { index: true, element: <Home /> },
      { path: "save", element: <Save /> },
      { path: "settings", element: <Settings /> },
      // {
      //   path: "settings",
      //   element: <SettingsLayout />,
      //   children: [{ index: true, element: <Settings /> }],
      // },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
