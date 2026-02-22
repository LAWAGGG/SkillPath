import { useEffect, useState } from "react";
import AdminBottomBar from "../../components/AdminBottomBar";
import api from "../../api/api";

export default function RoadmapManage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchRoadmaps() {
    setLoading(true);
    api.get("/admin/roadmaps").then((res) => {
      setRoadmaps(res.data.data);
      console.log(res.data.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none z-0"></div>

      <div className="relative flex flex-col h-full min-h-screen w-full max-w-md mx-auto bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto no-scrollbar z-10">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-bold text-2xl">
                map
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                All Roadmaps
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage System Roadmaps
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 pb-28">
          <div className="bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {loading ? (
                <div className="p-10 text-center text-slate-500">
                  Loading...
                </div>
              ) : roadmaps.length > 0 ? (
                roadmaps.map((roadmap, idx) => (
                  <div
                    key={idx}
                    className="p-5 flex flex-col gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                            {roadmap.skill}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {roadmap.title}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          roadmap.status === "active"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            : roadmap.status === "completed"
                              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {roadmap.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                          {roadmap.user?.name?.charAt(0) || "?"}
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {roadmap.user?.name || "Unknown User"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-400">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          <span className="text-[10px] font-bold">
                            {roadmap.days_left}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-[14px]">
                            task_alt
                          </span>
                          <span className="text-[10px] font-bold">
                            {roadmap.total_completed_topics}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Simple Progress Bar */}
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            (parseInt(
                              roadmap.total_completed_topics.split("/")[0],
                            ) /
                              parseInt(
                                roadmap.total_completed_topics.split("/")[1],
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-500">
                  No roadmaps found.
                </div>
              )}
            </div>
          </div>
        </main>

        <AdminBottomBar />
      </div>
    </div>
  );
}
