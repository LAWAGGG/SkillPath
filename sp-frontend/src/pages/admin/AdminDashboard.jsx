import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Skeleton from "../../components/Skeleton";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [dashboardItem, setDashboardItem] = useState({})
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchDashboard() {
    setLoading(true);
    api.get("/admin/dashboard").then((res)=>{
        setDashboardItem(res.data)
        setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(()=>{
    fetchDashboard()
  },[])

  return (
    <AdminLayout>
      {/* Header - Full width to sidebar */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 py-4 px-4 md:px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined font-bold text-2xl">
              admin_panel_settings
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Admin Dashboard
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="sm:pb-8 pb-20 space-y-8 pt-6 px-4 md:px-8">
        {/* Stats Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Platform Statistics</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col gap-3 shadow-sm">
                  <Skeleton variant="rectangular" className="h-8 w-8 rounded-lg" />
                  <div><Skeleton variant="text" className="h-8 w-12 mb-1" /><Skeleton variant="text" className="h-3 w-20" /></div>
                </div>
              ))
            ) : (
              <>
                <StatCard icon="group" color="blue" value={dashboardItem.total_users} label="Total Users" />
                <StatCard icon="bolt" color="purple" value={dashboardItem.active_learner} label="Active Learners" />
                <StatCard icon="map" color="amber" value={dashboardItem.total_roadmaps} label="Total Roadmaps" />
                <StatCard icon="verified" color="rose" value={`${Math.round(dashboardItem.completed_roadmaps / dashboardItem.total_roadmaps * 100) || 0}%`} label="Completion Rate" />
              </>
            )}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Recent Activity</h2>
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              {['users', 'roadmaps'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500"}`}
                >
                  {tab === 'users' ? 'Top Users' : 'Roadmaps'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3"><Skeleton variant="circular" className="h-10 w-10" /><div><Skeleton variant="text" className="h-4 w-24 mb-1" /><Skeleton variant="text" className="h-3 w-16" /></div></div>
                    <Skeleton variant="text" className="h-4 w-8" />
                  </div>
                ))
              ) : activeTab === "users" ? (
                dashboardItem.top_user?.map((user, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs text-orange-600 dark:text-orange-400 font-black uppercase">{user.initial_user}</div>
                      <div className="min-w-0"><p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p><p className="text-[10px] text-slate-500 truncate font-medium">{user.email}</p></div>
                    </div>
                    <div className="text-right"><p className="text-sm font-black text-primary">{user.roadmaps_count}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Roadmaps</p></div>
                  </div>
                ))
              ) : (
                dashboardItem.recent_roadmaps?.map((roadmap, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-900 dark:text-white truncate">{roadmap.title}</p><div className="flex items-center gap-2 mt-1"><p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{roadmap.user}</p><span className="h-1 w-1 rounded-full bg-slate-300"></span><p className="text-[10px] text-slate-400 font-medium">{roadmap.created_at}</p></div></div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border bg-primary/10 text-primary border-primary/20`}>{roadmap.status}</span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
              <button onClick={() => activeTab === 'users' ? navigate('/admin/users') : navigate('/admin/roadmaps')} className="w-full py-3 bg-white dark:bg-slate-900 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm active:scale-[0.98] transition-all">
                View All {activeTab === 'users' ? 'Users' : 'Roadmaps'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, color, value, label }) {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
  };

  return (
    <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div>
        <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}
