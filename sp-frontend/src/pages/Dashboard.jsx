import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import Skeleton from "../components/Skeleton";
import MainLayout from "../components/layouts/MainLayout";

export default function Dashboard() {
  const [dashboardItem, setDashboardItem] = useState({});
  const [loading, setLoading] = useState(true);
  const currentDate = new Date()
  const currentHour = currentDate.getHours()
  const [timeOfDay, setTimeOfDay] = useState("")
  const navigate = useNavigate();

  function setTime() {
    if (currentHour < 12) setTimeOfDay("Morning")
    else if (currentHour < 18) setTimeOfDay("Afternoon")
    else setTimeOfDay("Night")
  }

  async function fetchDashboard() {
    setLoading(true);
    api.get("user/dashboard").then((res) => {
      setDashboardItem(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(() => {
    fetchDashboard();
    setTime()
  }, []);

  return (
    <MainLayout>
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 py-4 px-4 md:px-8 backdrop-blur-lg bg-background-light/80 dark:bg-background-dark/80 border-b border-slate-200/50 dark:border-white/5">
        <div className="group flex flex-1 items-center gap-2 rounded-full bg-slate-200/50 dark:bg-white/10 px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary/50 max-w-md">
          <span className="material-symbols-outlined text-slate-500 text-[18px]">search</span>
          <input
            className="w-full bg-transparent text-xs font-bold text-slate-900 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none dark:text-white border-0 p-0 focus:ring-0"
            placeholder="Search topics..."
            onKeyDown={(e) => { if (e.key === "Enter") navigate(`/search?q=${e.target.value}`); }}
            type="text"
          />
        </div>
      </header>

      <div className="pb-24 sm:pb-3 pt-6 px-4 md:px-8">
        <div className="mb-8">
          {loading ? (
            <><Skeleton variant="text" className="h-8 w-3/4 mb-2" /><Skeleton variant="text" className="h-4 w-1/2" /></>
          ) : (
            <>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Good {timeOfDay}, {dashboardItem.user_name}!</h1>
              <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">Ready to learn something new today?</p>
            </>
          )}
        </div>

        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm"><Skeleton variant="rectangular" className="h-8 w-8 rounded-lg mb-4" /><Skeleton variant="text" className="h-6 w-1/2" /></div>
            ))
          ) : (
            <>
              <StatItem icon="library_books" color="blue" value={dashboardItem.total_topics} label="Topics Available" />
              <StatItem icon="hourglass_top" color="orange" value={dashboardItem.topics_remaining} label="Topics Remaining" />
              <StatItem icon="rocket_launch" color="primary" value={dashboardItem.active_roadmaps} label="Roadmaps Active" />
              <StatItem icon="check_circle" color="green" value={dashboardItem.topics_completed} label="Topics Completed" />
            </>
          )}
        </div>

        {dashboardItem.last_feedback && !loading && (
          <div className="mb-10 relative overflow-hidden rounded-3xl bg-primary/5 dark:bg-primary/10 p-6 border border-primary/10 shadow-inner">
            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Last AI Insights</span>
              </div>
              <p className="font-bold text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">"{dashboardItem.last_feedback}"</p>
            </div>
          </div>
        )}

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest text-[11px]">Current Roadmaps</h2>
          <Link className="text-[11px] font-black uppercase text-primary tracking-widest" to="/roadmaps">View all</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {loading ? (
            [1, 2].map(i => <div key={i} className="rounded-3xl bg-white dark:bg-slate-900/60 p-6 h-48 border border-slate-100 dark:border-white/5 shadow-sm"><Skeleton variant="rectangular" className="h-full w-full rounded-2xl" /></div>)
          ) : dashboardItem.current_roadmaps?.map((item, i) => (
            <div key={i} className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-950 p-6 shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-inner"><span className="material-symbols-outlined text-[24px]">code_blocks</span></div>
                  <div className="min-w-0"><h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{item.title}</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.skill}</p></div>
                </div>
              </div>
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"><span>Progress</span><span className="text-slate-900 dark:text-white">{Math.round((item.completed_topics_count / item.total_topics) * 100) || 0}%</span></div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden shadow-inner"><div style={{ width: `${Math.round((item.completed_topics_count / item.total_topics) * 100) || 0}%` }} className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-1000 shadow-lg"></div></div>
              </div>
              <button onClick={() => navigate(`/roadmap/${item.id}`)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-[11px] font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-primary/20 active:scale-[0.97] transition-all">Continue Learning <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

function StatItem({ icon, color, value, label }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    primary: "bg-primary/5 text-primary dark:bg-primary/20",
    green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
  };
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-950 p-4 shadow-sm border border-slate-100 dark:border-white/5 transition-all hover:shadow-md">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-inner ${colors[color]}`}><span className="material-symbols-outlined text-[20px]">{icon}</span></div>
      <div><p className="text-xl font-black text-slate-900 dark:text-white">{value}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{label}</p></div>
    </div>
  );
}
