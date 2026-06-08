import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

const PAGE_META = {
  "/": {
    title: "Dashboard",
    subtitle: "Ringkasan aktivitas bisnis",
  },
  "/projects": {
    title: "Projects",
    subtitle: "Kelola daftar proyek",
  },
  "/customers": {
    title: "Customers",
    subtitle: "Kelola data customer",
  },
  "/finance": {
    title: "Finance",
    subtitle: "Ringkasan keuangan proyek",
  },
  "/profile": {
    title: "Profile",
    subtitle: "Akun dan perusahaan",
  },
  "/surveys": {
    title: "Surveys",
    subtitle: "Daftar survey",
  },
};

export default function AppHeader() {
  const location = useLocation();
  const { user } = useAuth();
  const meta = getPageMeta(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between gap-3 border-b border-[#252A27] bg-[#0F1110]/90 px-4 backdrop-blur md:px-6">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold text-[#F5F5F2] md:text-xl">
          {meta.title}
        </h2>

        <p className="truncate text-xs text-[#8B9388]">
          {meta.subtitle}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#252A27] bg-[#161917]">
          <Bell size={18} className="text-[#8B9388]" />
        </button>

        <Link
          to="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#252A27] bg-[#4A5B45] text-sm font-semibold text-white"
          title="Profile"
        >
          {getInitials(user?.full_name)}
        </Link>
      </div>
    </header>
  );
}

function getPageMeta(pathname) {
  if (pathname.startsWith("/projects/")) {
    return {
      title: "Project Detail",
      subtitle: "RAB, dokumen, dan keuangan",
    };
  }

  return PAGE_META[pathname] || PAGE_META["/"];
}

function getInitials(name = "C") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
}
