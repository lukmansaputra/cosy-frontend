import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import AppSidebar from "@/components/navigation/AppSidebar";
import AppHeader from "@/components/navigation/AppHeader";
import MobileNav from "@/components/navigation/MobileNav";

export default function DashboardLayout() {
  const location = useLocation();

  useEffect(() => {
    document.title = `${getTitle(location.pathname)} - COSY MUSEUM`;
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-w-0">
        <AppSidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AppHeader />

          <main className="min-w-0 max-w-full flex-1 overflow-x-hidden p-4 pb-24 md:p-6 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

function getTitle(pathname) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/projects/")) return "Project Detail";
  if (pathname === "/projects") return "Projects";
  if (pathname === "/customers") return "Customers";
  if (pathname === "/finance") return "Finance";
  if (pathname === "/profile") return "Profile";
  if (pathname === "/surveys") return "Surveys";

  return "COSY";
}
