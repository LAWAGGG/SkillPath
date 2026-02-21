import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import BottomBar from "../components/BottomBar";
import { removeToken } from "../utils/uttils";

export default function Profile() {
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
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark bg-dots dot-pattern shadow-2xl">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between gap-4 light:bg-white/60 dark:bg-background-dark/60 px-4 py-4 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight">Profile</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-32 pt-10 overflow-y-auto no-scrollbar">
          {/* User Info Section */}
          <div className="flex flex-col items-center mb-5 text-center">
            <div className="relative mb-4 group">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-1 shadow-xl shadow-primary/20">
                <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900">
                  {user?.name ? (
                    <span className="text-3xl font-black text-primary uppercase">
                      {user.name.charAt(0)}
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-300 text-[48px]">
                      person
                    </span>
                  )}
                </div>
              </div>
            </div>
            {loading ? (
              <div className="space-y-2 flex flex-col items-center">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
                <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-full"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {user?.email || "user@example.com"}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {user?.role || "Member"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Settings Group */}
          <div className="space-y-6">
            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 font-black text-sm active:scale-95 transition-all shadow-sm shadow-red-500/5"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                Logout
              </button>
            </div>
          </div>
        </main>

        <BottomBar />
      </div>
    </div>
  );
}
