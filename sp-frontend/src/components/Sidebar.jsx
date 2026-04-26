import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: "Generate",
      icon: "add",
      path: "/generate/roadmap",
      isAction: true,
    },
    { label: "Home", icon: "home", path: "/dashboard" },
    { label: "Search", icon: "search", path: "/search" },
    { label: "Roadmaps", icon: "map", path: "/roadmaps" },
    { label: "Profile", icon: "person", path: "/profile" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl p-4">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "24px" }}
          >
            rocket_launch
          </span>
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          SkillPath
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;

          if (item.isAction) {
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          }

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
              <span
                className={`material-symbols-outlined ${isActive ? "fill-current" : ""}`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-200/50 dark:border-white/5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
          SkillPath AI © 2026
        </p>
      </div>
    </aside>
  );
}
