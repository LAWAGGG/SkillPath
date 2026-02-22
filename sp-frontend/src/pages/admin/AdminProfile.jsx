import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AdminBottomBar from "../../components/AdminBottomBar";
import { removeToken } from "../../utils/uttils";

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
                  {user?.name ? (
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
                <div className="h-7 w-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                <div className="h-4 w-52 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-xl"></div>
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
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">
                Account Permissions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">
                    check_circle
                  </span>
                  <span className="text-sm font-medium">
                    Manage all skills & categories
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">
                    check_circle
                  </span>
                  <span className="text-sm font-medium">
                    Moderate platform users
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">
                    check_circle
                  </span>
                  <span className="text-sm font-medium">
                    View platform analytics
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 font-black text-sm active:scale-95 transition-all shadow-sm shadow-red-500/5"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
              Logout from Admin Panel
            </button>
          </div>
        </main>

        <AdminBottomBar />
      </div>
    </div>
  );
}
