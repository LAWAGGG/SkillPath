import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { removeToken } from "../../utils/uttils";
import Skeleton from "../../components/Skeleton";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(document.documentElement.style.fontSize || '16px');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    setLoading(true);
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  const handleLogout = () => {
    api.post("/auth/logout").finally(() => {
      removeToken();
      navigate("/");
    });
  };

  return (
    <AdminLayout>
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md py-4 px-4 border-b border-slate-100 dark:border-slate-800 px-4 md:px-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined font-bold text-2xl">
              admin_panel_settings
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Admin Profile
            </h1>
          </div>
        </div>
      </header>

      <div className="pb-32 px-10 pt-10">
        {/* User Info Section */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="relative mb-6 group">
            <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary to-blue-500 p-1 shadow-2xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <div className="h-full w-full rounded-[20px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                {loading ? (
                  <Skeleton variant="rectangular" className="h-full w-full" />
                ) : user?.name ? (
                  <span className="text-4xl font-black text-primary uppercase">
                    {user.name.charAt(0)}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-slate-300 text-[64px]">
                    person
                  </span>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 flex flex-col items-center">
              <Skeleton variant="text" className="h-8 w-40" />
              <Skeleton variant="text" className="h-4 w-52" />
              <Skeleton variant="rectangular" className="h-7 w-28 rounded-full mt-2" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {user?.name || "Admin Name"}
              </h2>
              <p className="text-base font-medium text-slate-500 dark:text-slate-400">
                {user?.email || "admin@skillpath.com"}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                <span className="material-symbols-outlined text-[16px]">
                  shield
                </span>
                <span className="text-[12px] font-black uppercase tracking-widest">
                  {user?.role || "Administrator"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Settings Group */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 px-2">App Settings</h3>
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Dark Mode</p>
                <p className="text-xs text-slate-500">Toggle dark theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                defaultChecked={document.documentElement.classList.contains('dark')}
                onChange={(e) => {
                  if (e.target.checked) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                  }
                }} 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Font Size */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Font Size</p>
                <p className="text-xs text-slate-500">Adjust app text size</p>
              </div>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {['14px', '16px', '18px'].map((size, i) => (
                <button
                  key={size}
                  onClick={() => {
                    document.documentElement.style.fontSize = size;
                    localStorage.setItem('fontSize', size);
                    setFontSize(size);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${fontSize === size || (!fontSize && size === '16px') ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {i === 0 ? 'A' : i === 1 ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Group */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900/60 rounded-[32px] p-8 border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-primary rounded-full"></div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                System Privileges
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: "schema",
                  title: "Master Access",
                  text: "Skills & Topics Management",
                  color: "text-blue-500",
                  bg: "bg-blue-50 dark:bg-blue-900/20"
                },
                {
                  icon: "group_work",
                  title: "User Moderation",
                  text: "Full User Lifecycle Control",
                  color: "text-purple-500",
                  bg: "bg-purple-50 dark:bg-purple-900/20"
                },
                {
                  icon: "monitoring",
                  title: "Analytics",
                  text: "Real-time Platform Insights",
                  color: "text-emerald-500",
                  bg: "bg-emerald-50 dark:bg-emerald-900/20"
                },
                {
                  icon: "security",
                  title: "Security",
                  text: "System-wide Guard Policies",
                  color: "text-orange-500",
                  bg: "bg-orange-50 dark:bg-orange-900/20"
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <div
                    className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-inner group-hover:scale-110 transition-transform`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</p>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <button
              onClick={handleLogout}
              className="relative flex w-full items-center justify-center gap-3 p-5 rounded-2xl bg-red-500 text-white border-2 border-red-500/20 font-black text-sm shadow-xl shadow-red-500/5 active:scale-95 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
