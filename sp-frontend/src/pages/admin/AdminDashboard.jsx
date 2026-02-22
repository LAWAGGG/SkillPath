import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminBottomBar from "../../components/AdminBottomBar";
import api from "../../api/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [dashboardItem, setDashboardItem] = useState({})
  const navigate = useNavigate();

  async function fetchDashboard() {
    api.get("/admin/dashboard").then((res)=>{
        setDashboardItem(res.data)
        console.log(res.data)
    })
  }

  useEffect(()=>{
    fetchDashboard()
  },[])

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      {/* Subtle Dot Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none z-0"></div>

      <div className="relative flex flex-col h-full min-h-screen w-full max-w-md mx-auto bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto no-scrollbar z-10">
        {/* Mobile Header / TopAppBar */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-bold text-2xl">
                admin_panel_settings
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                SkillPath
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin Dashboard</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-5 pb-28 space-y-8">
          {/* Stats Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Statistics
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">
                      group
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {dashboardItem.total_users}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Total Registered Users
                  </p>
                </div>
              </div>
              {/* Stat Card 2 */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">
                      bolt
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {dashboardItem.active_learner}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Active Learners Today
                  </p>
                </div>
              </div>
              {/* Stat Card 3 */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">
                      map
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {dashboardItem.total_roadmaps}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Total Roadmaps Created
                  </p>
                </div>
              </div>
              {/* Stat Card 4 */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">
                      verified
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {Math.round(dashboardItem.completed_roadmaps / dashboardItem.total_roadmaps * 100)}%
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Completed Roadmaps
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === "users"
                      ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                      : "text-slate-500"
                  }`}
                >
                  Top Users
                </button>
                <button
                  onClick={() => setActiveTab("roadmaps")}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === "roadmaps"
                      ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                      : "text-slate-500"
                  }`}
                >
                  Roadmaps
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
              {activeTab === "users" ? (
                <div className="divide-y divide-slate-50 dark:divide-white/5">
                 {dashboardItem.top_user?.map((user, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 relative">
                          {user.img ? (
                            <img
                              alt=""
                              className="h-full w-full rounded-full object-cover border-2 border-white dark:border-slate-800"
                              src={user.img}
                            />
                          ) : (
                            <div className="h-full w-full rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs text-orange-600 dark:text-orange-400 font-black">
                              {user.initial_user}
                            </div>
                          )}
                          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">
                          {user.roadmaps_count}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                          Roadmaps
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-white/5">
               {dashboardItem.recent_roadmaps?.map((roadmap, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {roadmap.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-slate-500 font-medium">
                            {roadmap.user}
                          </p>
                          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {roadmap.created_at}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider light:bg-${roadmap.color}-100 text-${roadmap.color}-600 dark:bg-${roadmap.color}-900/30 dark:text-${roadmap.color}-400`}
                      >
                        {roadmap.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                <button onClick={()=>activeTab == 'users' ? navigate('/admin/users') : navigate('/admin/roadmaps')} className="w-full py-2.5 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-all">
                  Load More Activity
                </button>
              </div>
            </div>
          </section>
        </main>

        <AdminBottomBar />
      </div>
    </div>
  );
}
