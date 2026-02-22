import { Link, useNavigate } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [dashboardItem, setDashboardItem] = useState({});
  const navigate = useNavigate();

  async function fetchDashboard() {
    api.get("user/dashboard").then((res) => {
      setDashboardItem(res.data);
    });
  }

  useEffect(() => {
    fetchDashboard();
  }, []);
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      {/* Mobile Container */}
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark bg-dots dot-pattern shadow-2xl">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between gap-4 light:bg-white/60 dark:bg-background-dark/60 px-4 py-4 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/5">
          {/* Search Bar */}
          <div className="group flex flex-1 items-center gap-2 rounded-full bg-slate-200/50 dark:bg-white/10 px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:bg-white dark:focus-within:bg-white/20">
            <span
              className="material-symbols-outlined text-slate-500 dark:text-slate-400"
              style={{ fontSize: "20px" }}
            >
              search
            </span>
            <input
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none dark:text-white border-0 p-0 focus:ring-0"
              placeholder="Search topics..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/search?q=${e.target.value}`);
                }
              }}
              type="text"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pb-24 pt-6 overflow-y-auto no-scrollbar">
          {/* Greeting Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Selamat pagi, {dashboardItem.user_name}!
            </h1>
            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
              Ready to learn something new today?
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            {/* Stat Card 1 */}
            <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900/60 p-4 shadow-sm border border-slate-200/60 dark:border-white/5 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-inner">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "22px" }}
                >
                  library_books
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {dashboardItem.total_topics}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Topics
                </p>
              </div>
            </div>
            {/* Stat Card 2 */}
            <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900/60 p-4 shadow-sm border border-slate-200/60 dark:border-white/5 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 shadow-inner">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "22px" }}
                >
                  hourglass_top
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {dashboardItem.topics_remaining}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Remaining
                </p>
              </div>
            </div>
            {/* Stat Card 3 */}
            <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900/60 p-4 shadow-sm border border-slate-200/60 dark:border-white/5 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 text-primary shadow-inner">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "22px" }}
                >
                  rocket_launch
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {dashboardItem.active_roadmaps}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active Roadmaps
                </p>
              </div>
            </div>
            {/* Stat Card 4 */}
            <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900/60 p-4 shadow-sm border border-slate-200/60 dark:border-white/5 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 shadow-inner">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "22px" }}
                >
                  check_circle
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {dashboardItem.topics_completed}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Completed
                </p>
              </div>
            </div>
          </div>

          {/* AI Insight Card */}
          {dashboardItem.last_feedback == null ? (
            ""
          ) : (
            <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 p-6 border border-primary/20 shadow-lg shadow-primary/5">
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/20 dark:bg-primary/30">
                    <span className="material-symbols-outlined text-primary text-[20px] block">
                      auto_awesome
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Last Feedback
                  </span>
                </div>
                <p className="font-medium text-lg leading-relaxed text-slate-800 dark:text-slate-200 italic">
                  "{dashboardItem.last_feedback}"
                </p>
                <div className="mt-4 flex justify-end">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight">
                    – SkillPath AI
                  </span>
                </div>
              </div>
              {/* Decorative background flare */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
          )}

          {/* Roadmaps Section */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Current Roadmaps
            </h2>
            <Link
              className="text-sm font-bold text-primary hover:text-primary-dark transition-colors px-2 py-1"
              to="/roadmaps"
            >
              View all
            </Link>
          </div>

          <div className="space-y-5 mb-10">
            {/* Roadmap Card 1: React */}
            {dashboardItem.current_roadmaps?.map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/60 p-5 shadow-sm border border-slate-200/60 dark:border-white/5 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#61DAFB]/10 text-[#61DAFB] shadow-inner">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "30px" }}
                      >
                        code_blocks
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {item.skill} • {item.completed_topics_count}/
                        {item.total_topics} Modules
                      </p>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest border ${
                      item.status === "active"
                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-400/20"
                        : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-400/20"
                    }`}
                  >
                    {item.status}
                  </div>
                </div>
                <div className="mb-5 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Progress
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {Math.round(
                        (item.completed_topics_count / item.total_topics) * 100,
                      ) || 0}
                      %
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 shadow-inner">
                    <div
                      style={{
                        width: `${
                          Math.round(
                            (item.completed_topics_count / item.total_topics) *
                              100,
                          ) || 0
                        }%`,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-700 ease-out shadow-lg"
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/roadmap/${item.id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/30 active:scale-[0.97]"
                >
                  Continue Learning
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            ))}
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomBar />
      </div>
    </div>
  );
}
