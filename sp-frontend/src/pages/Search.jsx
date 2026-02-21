import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import BottomBar from "../components/BottomBar";

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

  // Fetch Categories
  useEffect(() => {
    api.get("/skill-categories").then((res) => {
      if (res.data.success) {
        setCategories(res.data.data);
      }
    });

    api.get("/skills/recommendation").then((res) => {
      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    });
  }, []);

  // Initial search if query param exists
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
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      {/* Mobile Container */}
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark bg-dots dot-pattern shadow-2xl">
        {/* Header & Sticky Search Bar */}
        <header className="sticky top-0 z-50 flex flex-col gap-4 light:bg-white/60 dark:bg-background-dark/60 px-4 py-4 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight">Explore Skills</h1>
          </div>

          <div className="group flex items-center gap-2 rounded-full bg-slate-200/50 dark:bg-white/10 px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:bg-white dark:focus-within:bg-white/20">
            <span
              className="material-symbols-outlined text-slate-500 dark:text-slate-400"
              style={{ fontSize: "20px" }}
            >
              search
            </span>
            <input
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none dark:text-white border-0 p-0 focus:ring-0"
              placeholder="Find your next skill..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          {/* Category Scroll */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            <button
              onClick={() => handleCategoryClick("")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${!activeCategory ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-white/5"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${activeCategory === cat.slug ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-white/5"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pb-24 pt-6 overflow-y-auto no-scrollbar">
          {/* Recommendations Section (Only show if not searching or if query is empty) */}
          {!searchQuery && !activeCategory && recommendations.length > 0 && (
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight">
                  Recommended for You
                </h2>
                <span className="material-symbols-outlined text-primary text-[20px]">
                  auto_awesome
                </span>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                {recommendations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSkillSelect(item)}
                    className="flex-shrink-0 w-64 p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/40 dark:to-slate-900/20 border border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-md cursor-pointer group transition-all"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform shadow-inner">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "24px" }}
                      >
                        stars
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-primary uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[14px]">
                        map
                      </span>
                      {item.roadmaps_count} Roadmaps generated
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill List Section */}
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight">
              {searchQuery || activeCategory ? "Search Results" : "All Skills"}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Searching...
              </p>
            </div>
          ) : skills.length > 0 ? (
            <div className="grid gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill)}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 shadow-inner group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "24px" }}
                      >
                        school
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        {skill.category?.name || "Skill"}
                      </p>
                    </div>
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400 text-[32px]">
                  manage_search
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                No skills found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
                We couldn't find any skills matching your search. Try another
                keyword or category.
              </p>
            </div>
          )}
        </main>

        <BottomBar />
      </div>
    </div>
  );
}
