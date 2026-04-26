import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { removeToken } from "../utils/uttils";
import Skeleton from "../components/Skeleton";
import MainLayout from "../components/layouts/MainLayout";

export default function Profile() {
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
    <MainLayout>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Profile</h1>
        </div>
      </header>

      {/* Content */}
      <div className="pb-32 px-7 pt-10">
        {/* User Info Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative mb-4 group">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-1 shadow-xl shadow-primary/20">
              <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900">
                {loading ? (
                  <Skeleton variant="circular" className="h-full w-full" />
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
              <Skeleton variant="text" className="h-4 w-56" />
              <Skeleton variant="rectangular" className="h-6 w-20 rounded-full mt-2" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {user?.name || "User Name"}
              </h2>
              <p className="text-base font-semibold text-slate-500 dark:text-slate-400">
                {user?.email || "user@example.com"}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <span className="text-xs font-black uppercase tracking-widest">
                  {user?.role || "Member"}
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

        <div className="space-y-6">
          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 p-4 rounded-2xl bg-red-200 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-400 dark:border-red-500/20 font-black text-sm active:scale-95 transition-all shadow-sm shadow-red-500/5"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
