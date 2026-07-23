import { NavLink, Outlet, Navigate, Link } from "react-router-dom";
import { Inbox, FileText, SlidersHorizontal, LogOut, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/admin", label: "Messages", icon: Inbox, end: true },
  { to: "/admin/blog", label: "Blog Posts", icon: FileText },
  { to: "/admin/content", label: "Site Content", icon: SlidersHorizontal },
];

export default function AdminShell() {
  const { user, logout } = useAuth();

  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (user === false) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-100" data-testid="admin-shell">
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-slate-950 text-slate-300">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Crescent Wellness
          </p>
          <p className="mt-1 font-semibold text-white">CMS Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={`admin-nav-${l.label.toLowerCase().split(" ")[0]}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </Link>
          <button
            onClick={logout}
            data-testid="admin-logout"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
          <p className="px-3 pt-2 text-xs text-slate-600">{user.email}</p>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
