import { Bell, ChevronRight, ClipboardList } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    if (notification.entity_type === "survey" && notification.entity_id) {
      navigate(`/surveys?focus=${notification.entity_id}`);
    }
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
            <div className="flex items-center justify-between border-b border-[#252A27] px-4 py-3"><div><p className="font-semibold text-white">Notifikasi</p><p className="text-xs text-[#8B9388]">{unreadCount ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}</p></div><ClipboardList className="size-4 text-[#7C9A72]" /></div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && <p className="p-4 text-sm text-[#8B9388]">Belum ada notifikasi.</p>}
              {notifications.map((notification) => <button className={`group flex w-full gap-3 border-b border-[#252A27] px-4 py-3 text-left transition hover:bg-[#202522] ${notification.is_read ? "text-[#8B9388]" : "bg-[#4A5B45]/15 text-white"}`} key={notification.id} onClick={() => openNotification(notification)} type="button"><span className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.is_read ? "bg-[#4A5B45]" : "bg-[#9FBD91]"}`} /><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><span className="font-medium">{notification.title}</span><span className="shrink-0 text-[10px] text-[#8B9388]">{relativeTime(notification.created_at)}</span></span><span className="mt-1 block text-xs leading-5 text-[#8B9388]">{notification.message}</span><span className="mt-2 flex items-center gap-1 text-xs font-medium text-[#9FBD91]">Lihat survey <ChevronRight className="size-3 transition group-hover:translate-x-0.5" /></span></span></button>)}
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

function relativeTime(value) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Baru saja";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}j`;
  return `${Math.floor(seconds / 86400)}h`;
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
