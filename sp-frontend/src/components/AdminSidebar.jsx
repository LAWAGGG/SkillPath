import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/admin/dashboard" },
    { label: "Skills", icon: "psychology", path: "/admin/skill" },
    { label: "Roadmaps", icon: "map", path: "/admin/roadmaps" },
    { label: "Users", icon: "people", path: "/admin/users" },
    { label: "Profile", icon: "person", path: "/admin/profile" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl p-4">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>admin_panel_settings</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">SkillPath</span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive
                  ? "bg-slate-100 dark:bg-white/10 text-primary"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 dark:text-slate-400"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "fill-current" : ""}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-200/50 dark:border-white/5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
          Admin Dashboard © 2026
        </p>
      </div>
    </aside>
  );
}
