import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import Skeleton from "../components/Skeleton";
import MainLayout from "../components/layouts/MainLayout";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";

  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    setLoadingCats(true);
    const catPromise = api.get("/skill-categories").then((res) => {
      if (res.data.success) {
        setCategories(res.data.data);
      }
    });

    const recPromise = api.get("/skills/recommendation").then((res) => {
      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    });

    Promise.all([catPromise, recPromise]).finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    performSearch(initialQuery, activeCategory);
  }, []);

  async function performSearch(query = searchQuery, category = activeCategory) {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (category) params.append("category", category);

    api
      .get(`/skills?${params.toString()}`)
      .then((res) => {
        if (res.data.success) {
          setSkills(res.data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  const handleCategoryClick = (slug) => {
    const newCategory = activeCategory === slug ? "" : slug;
    setActiveCategory(newCategory);
    performSearch(searchQuery, newCategory);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  const handleSkillSelect = (skill) => {
    navigate(
      `/generate/roadmap?skill_id=${skill.id}&name=${encodeURIComponent(skill.name)}`,
    );
  };

  return (
    <MainLayout>
      <header className="sticky top-0 z-10 flex flex-col gap-4 py-4 backdrop-blur-lg bg-background-light/80 dark:bg-background-dark/80 px-4 md:px-8 border-b border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Explore Skills</h1>
        </div>

        <div className="group flex items-center gap-2 rounded-full bg-slate-200/50 dark:bg-white/10 px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:bg-white dark:focus-within:bg-white/20 max-w-2xl">
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400" style={{ fontSize: "20px" }}>search</span>
          <input
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none dark:text-white border-0 p-0 focus:ring-0"
            placeholder="Find your next skill..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {loadingCats ? (
            [1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} variant="rectangular" className="h-8 w-24 rounded-full shrink-0" />)
          ) : (
            <>
              <button
                onClick={() => handleCategoryClick("")}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border ${!activeCategory ? "bg-primary text-white border-primary shadow-lg" : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-white/5"}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border ${activeCategory === cat.slug ? "bg-primary text-white border-primary shadow-lg" : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-white/5"}`}
                >
                  {cat.name}
                </button>
              ))}
            </>
          )}
        </div>
      </header>

      <div className="pb-24 pt-6 px-4 md:px-8">
        {(!searchQuery && !activeCategory) && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Recommended for You</h2>
              <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loadingCats ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 shadow-sm">
                    <Skeleton variant="rectangular" className="h-12 w-12 rounded-xl mb-4" />
                    <Skeleton variant="text" className="h-5 w-3/4 mb-2" />
                    <Skeleton variant="text" className="h-3 w-full" />
                  </div>
                ))
              ) : (
                recommendations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSkillSelect(item)}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md cursor-pointer group transition-all"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>stars</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors text-base truncate">{item.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed h-12 overflow-hidden">{item.description}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[14px]">map</span>
                      {item.roadmaps_count} Generated
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {searchQuery || activeCategory ? "Search Results" : "All Skills"}
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5">
                <Skeleton variant="rectangular" className="h-12 w-12 rounded-xl" />
                <div className="flex-1 ml-4"><Skeleton variant="text" className="h-4 w-3/4" /></div>
              </div>
            ))}
          </div>
        ) : skills.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => handleSkillSelect(skill)}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-lg cursor-pointer transition-all w-full overflow-hidden"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>school</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{skill.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{skill.category?.name || "Skill"}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 ml-2">chevron_right</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <span className="material-symbols-outlined text-4xl">manage_search</span>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No skills found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
