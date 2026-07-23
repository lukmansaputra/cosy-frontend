import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import { getNotifications, markNotificationRead } from "@/services/notification.service";

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
  const [notificationOpen, setNotificationOpen] = useState(false);
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 30000,
  });
  const notifications = notificationsQuery.data || [];
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  async function openNotification(notification) {
    if (!notification.is_read) {
      await markNotificationRead(notification.id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
    setNotificationOpen(false);
  }

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
        <div className="relative">
        <button
          aria-label="Notifikasi"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#252A27] bg-[#161917]"
          onClick={() => setNotificationOpen((open) => !open)}
        >
          <Bell size={18} className="text-[#8B9388]" />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[#7C9A72] px-1 text-[10px] font-bold text-[#101311]">{unreadCount > 9 ? "9+" : unreadCount}</span>}
        </button>
        {notificationOpen && (
          <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-[#303632] bg-[#161917] shadow-2xl shadow-black/30">
            <div className="border-b border-[#252A27] px-4 py-3"><p className="font-semibold text-white">Notifikasi</p></div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && <p className="p-4 text-sm text-[#8B9388]">Belum ada notifikasi.</p>}
              {notifications.map((notification) => <button className={`w-full border-b border-[#252A27] px-4 py-3 text-left text-sm transition hover:bg-[#202522] ${notification.is_read ? "text-[#8B9388]" : "bg-[#4A5B45]/15 text-white"}`} key={notification.id} onClick={() => openNotification(notification)} type="button"><p className="font-medium">{notification.title}</p><p className="mt-1 text-xs leading-5 text-[#8B9388]">{notification.message}</p></button>)}
            </div>
          </div>
        )}
        </div>

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
