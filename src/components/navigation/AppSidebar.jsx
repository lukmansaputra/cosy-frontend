import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Wallet,
  Users,
  ClipboardList,
  User,
} from "lucide-react";

const primaryMenu = [
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
];

const secondaryMenu = [
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
];

const profileMenu = [
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
];

function MenuSection({ items }) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all
              ${
                isActive
                  ? "bg-[#4A5B45]/20 text-[#7C9A72]"
                  : "text-[#8B9388] hover:bg-[#161917] hover:text-white"
              }
            `
            }
          >
            <Icon size={18} />

            {item.label}
          </NavLink>
        );
      })}
    </div>
  );
}

export default function AppSidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-[#252A27] bg-[#0F1110]">
      <div className="border-b border-[#252A27] p-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#7C9A72]">
          Cosy
        </h1>

        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#8B9388]">
          Management System
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <MenuSection items={primaryMenu} />

        <div className="my-5 border-t border-[#252A27]" />

        <MenuSection items={secondaryMenu} />
      </div>

      <div className="border-t border-[#252A27] p-3">
        <MenuSection items={profileMenu} />
      </div>
    </aside>
  );
}
