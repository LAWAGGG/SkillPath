import { Link, useLocation } from "react-router-dom";

export default function AdminBottomBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Dash", icon: "dashboard", path: "/admin/dashboard" },
    { label: "Skills", icon: "psychology", path: "/admin/skill" },
    { label: "Roadmaps", icon: "map", path: "/admin/roadmaps" },
    { label: "Users", icon: "people", path: "/admin/users" },
    { label: "Profile", icon: "person", path: "/admin/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-md border-t border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl pb-safe">
      <div className="flex items-center justify-around px-2 pb-5 pt-3 relative">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className="group flex flex-1 flex-col items-center gap-1"
            >
              <div
                className={`flex h-8 items-center justify-center transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    isActive ? "fill-current" : ""
                  }`}
                  style={{ fontSize: "24px" }}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold ${
                  isActive
                    ? "text-primary"
                    : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
