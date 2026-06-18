import { Layout } from "@/Layout";
import "./App.css";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { HomeIcon, SaveIcon, SettingsIcon } from "lucide-react";
import type { SidebarNavItem } from "@/components/Sidebar";
import { Home } from "@/pages/Home";

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
      // { path: "library", element: <Library /> },
      // { path: "settings", element: <Settings /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
