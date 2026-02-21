import { Link, useLocation } from "react-router-dom";

export default function BottomBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Home", icon: "home", path: "/dashboard" },
    { label: "Search", icon: "search", path: "/search" },
    {
      label: "Generate",
      icon: "add",
      path: "/generate/roadmap",
      isAction: true,
    },
    { label: "Roadmaps", icon: "map", path: "/roadmaps" },
    { label: "Profile", icon: "person", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-md border-t border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl pb-safe">
      <div className="flex items-center justify-around px-2 pb-5 pt-3 relative">
        {navItems.map((item, index) => {
          if (item.isAction) {
            return (
              <div
                key={index}
                className="flex-1 flex justify-center -mt-12 mb-4"
              >
                <Link
                  to={item.path}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform active:scale-90"
                >
                  <span
                    className="material-symbols-outlined fill-current"
                    style={{ fontSize: "32px" }}
                  >
                    {item.icon}
                  </span>
                </Link>
              </div>
            );
          }

          const isActive = currentPath === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className="group flex flex-1 flex-col items-center gap-1"
            >
              <div
                className={`flex h-8 items-center justify-center transition-colors ${isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? "fill-current" : ""}`}
                  style={{ fontSize: "24px" }}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold ${isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}
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
