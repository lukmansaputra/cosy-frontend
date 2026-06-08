import {
  LayoutDashboard,
  FolderKanban,
  Wallet,
  Users,
  ClipboardList,
  User,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Finance",
    path: "/finance",
    icon: Wallet,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    label: "Surveys",
    path: "/surveys",
    icon: ClipboardList,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
];
