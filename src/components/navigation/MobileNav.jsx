import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Users,
  Wallet,
} from "lucide-react";

const MOBILE_NAV = [
  {
    label: "Home",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Survey",
    path: "/surveys",
    icon: ClipboardList,
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
];

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#252A27] bg-[#161917] md:hidden">
      <div className="grid grid-cols-5">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex flex-col items-center gap-1 py-3 text-xs transition-colors
                ${isActive ? "text-[#7C9A72]" : "text-[#8B9388]"}
              `
              }
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
