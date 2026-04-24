import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AdminBottomBar from "../../components/AdminBottomBar";
import { removeToken } from "../../utils/uttils";
import Skeleton from "../../components/Skeleton";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      {/* Mobile Container */}
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-white dark:bg-slate-900 bg-dots dot-pattern shadow-2xl z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 px-4 py-6 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined font-bold text-2xl">
              admin_panel_settings
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Admin Profile
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage administrator account
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-32 pt-10 overflow-y-auto no-scrollbar">
          {/* User Info Section */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative mb-6 group">
              <div className="h-28 w-28 rounded-3xl bg-gradient-to-tr from-primary to-blue-500 p-1 shadow-2xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <div className="h-full w-full rounded-[20px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  {loading ? (
                    <Skeleton variant="rectangular" className="h-full w-full" />
                  ) : user?.name ? (
                    <span className="text-4xl font-black text-primary uppercase">
                      {user.name.charAt(0)}
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-300 text-[56px]">
                      person
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-slate-900 shadow-lg">
                <span className="material-symbols-outlined text-[20px]">
                  verified
                </span>
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
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {user?.name || "Admin Name"}
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {user?.email || "admin@skillpath.com"}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                  <span className="material-symbols-outlined text-[14px]">
                    shield
                  </span>
                  <span className="text-[12px] font-black uppercase tracking-wider">
                    {user?.role || "Administrator"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Actions Group */}
          <div className="space-y-6">
            <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-inner">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-1 bg-primary rounded-full"></div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Privileges
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: "schema",
                    text: "Master Access: Skills & Topics",
                    color: "text-blue-500",
                  },
                  {
                    icon: "group_work",
                    text: "User Lifecycle Moderation",
                    color: "text-purple-500",
                  },
                  {
                    icon: "monitoring",
                    text: "Full Platform Analytics",
                    color: "text-emerald-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div
                      className={`h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <button
                onClick={handleLogout}
                className="relative flex w-full items-center justify-center gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-red-500/20 text-red-600 dark:text-red-400 font-black text-sm shadow-xl shadow-red-500/5 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined font-bold">
                  power_settings_new
                </span>
                Terminate Session
              </button>
            </div>
          </div>
        </main>

        <AdminBottomBar />
      </div>
    </div>
  );
}
