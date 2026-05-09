import { useEffect, useState } from "react";
import api from "../../api/api";
import Skeleton from "../../components/Skeleton";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function RoadmapManage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category_id: "",
    skill_id: "",
  });

  async function fetchInitialData() {
    try {
      const [catRes, skillRes] = await Promise.all([
        api.get("/admin/skill-categories"),
        api.get("/admin/skills"),
      ]);
      setCategories(catRes.data.data);
      setSkills(skillRes.data.data);
    } catch (err) {
      console.error("Failed to fetch filters", err);
    }
  }

  async function fetchRoadmaps() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category_id) params.append("category_id", filters.category_id);
    if (filters.skill_id) params.append("skill_id", filters.skill_id);

    api.get(`/admin/roadmaps?${params.toString()}`).then((res) => {
      setRoadmaps(res.data.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchRoadmaps();
  }, [filters]);

  // Get Top 3 skills
  const skillUsage = roadmaps.reduce((acc, roadmap) => {
    acc[roadmap.skill] = (acc[roadmap.skill] || 0) + 1;
    return acc;
  }, {});

  const topSkills = Object.entries(skillUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <AdminLayout>
      <header className="sticky top-0 z-10 py-4 px-4 md:px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-bold text-2xl">map</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight uppercase tracking-widest text-[10px]">All Roadmaps</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Manage user progress</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
              <span className="material-symbols-outlined text-xs text-slate-400">category</span>
              <select
                value={filters.category_id}
                onChange={(e) => setFilters({ ...filters, category_id: e.target.value, skill_id: "" })}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
              <span className="material-symbols-outlined text-xs text-slate-400">psychology</span>
              <select
                value={filters.skill_id}
                onChange={(e) => setFilters({ ...filters, skill_id: e.target.value })}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
              >
                <option value="">All Skills</option>
                {skills
                  .filter(s => !filters.category_id || s.skill_category_id == filters.category_id)
                  .map((skill) => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 pb-28 pt-8 px-4 md:px-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Roadmaps</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{roadmaps.length}</h4>
          </div>
          
          <div className="md:col-span-3 bg-gradient-to-br from-primary/5 to-purple-500/5 p-6 rounded-[2rem] border border-primary/10 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">military_tech</span>
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Top 3 Used Skills</p>
            <div className="flex flex-wrap gap-4">
              {topSkills.length > 0 ? (
                topSkills.map(([name, count], i) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{count} roadmaps</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No data available</p>
              )}
            </div>
          </div>
        </div>

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
              <div className="p-20 text-center">
                <div className="h-16 w-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <span className="material-symbols-outlined text-4xl">search_off</span>
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No roadmaps found for these filters</p>
                <button 
                  onClick={() => setFilters({ category_id: "", skill_id: "" })}
                  className="mt-4 text-xs font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
