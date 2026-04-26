import { useEffect, useState } from "react";
import api from "../../api/api";
import Skeleton from "../../components/Skeleton";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function RoadmapManage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchRoadmaps() {
    setLoading(true);
    api.get("/admin/roadmaps").then((res) => {
      setRoadmaps(res.data.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  return (
    <AdminLayout>
      <header className="sticky top-0 z-10 py-4 px-4 md:px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined font-bold text-2xl">map</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight uppercase tracking-widest text-[10px]">All Roadmaps</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 pb-28 pt-8 px-4 md:px-8">
        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between"><Skeleton variant="text" className="h-5 w-32" /><Skeleton variant="rectangular" className="h-6 w-20 rounded-full" /></div>
                  <Skeleton variant="text" className="h-4 w-full" />
                  <Skeleton variant="rectangular" className="h-1.5 w-full rounded-full" />
                </div>
              ))
            ) : roadmaps.length > 0 ? (
              roadmaps.map((roadmap, idx) => (
                <div key={idx} className="p-6 flex flex-col gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">{roadmap.skill}</span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 group-hover:text-primary transition-colors">{roadmap.title}</h3>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${roadmap.status === "active" ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30"}`}>{roadmap.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs font-black text-slate-500 uppercase">{roadmap.user?.name?.charAt(0) || "?"}</div>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{roadmap.user?.name || "User"}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-slate-400 font-bold text-xs"><span className="material-symbols-outlined text-[18px]">schedule</span>{roadmap.days_left}</div>
                      <div className="flex items-center gap-1 text-primary font-bold text-xs"><span className="material-symbols-outlined text-[18px]">task_alt</span>{roadmap.total_completed_topics}</div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-dark" style={{ width: `${(parseInt(roadmap.total_completed_topics.split("/")[0]) / parseInt(roadmap.total_completed_topics.split("/")[1])) * 100}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center"><p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No roadmaps found</p></div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
