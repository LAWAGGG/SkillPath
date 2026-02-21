import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import BottomBar from "../components/BottomBar";

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  async function fetchRoadmaps() {
    setLoading(true);
    api
      .get("/roadmaps")
      .then((res) => {
        if (res.data.success) {
          setRoadmaps(res.data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

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
            <h1 className="text-xl font-bold tracking-tight">My Roadmaps</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-32 pt-6 overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Loading Roadmaps...
              </p>
            </div>
          ) : roadmaps.length > 0 ? (
            <div className="grid gap-6">
              {roadmaps.map((item) => {
                const progress =
                  Math.round(
                    (item.completed_topics_count / item.total_topics) * 100,
                  ) || 0;

                return (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/60 p-5 shadow-sm border border-slate-200/60 dark:border-white/5 transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "30px" }}
                          >
                            map
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {item.skill} • {item.total_topics} Modules
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-green-100 dark:bg-green-900/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-400/20">
                        {item.status}
                      </div>
                    </div>

                    <div className="mb-5 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          Progress
                        </span>
                        <span className="text-slate-900 dark:text-white">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 shadow-inner">
                        <div
                          style={{ width: `${progress}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-700 ease-out shadow-lg"
                        ></div>
                      </div>
                    </div>

                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        <span className="text-xs font-bold">
                          {item.hours_per_day}h / day
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[16px]">
                          event
                        </span>
                        <span className="text-xs font-bold">
                          {item.days_left}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/roadmap/${item.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/30 active:scale-[0.97]"
                    >
                      Continue Learning
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400 text-[32px]">
                  map
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                No roadmaps yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
                You haven't generated any learning paths yet. Start by exploring
                skills!
              </p>
              <Link
                to="/search"
                className="mt-6 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Explore Skills
              </Link>
            </div>
          )}
        </main>

        <BottomBar />
      </div>
    </div>
  );
}
