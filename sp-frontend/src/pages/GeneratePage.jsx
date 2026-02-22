import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import BottomBar from "../components/BottomBar";

export default function GeneratePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillId = searchParams.get("skill_id");
  const skillName = searchParams.get("name");

  const [formData, setFormData] = useState({
    skill_id: skillId || "",
    level: "Beginner",
    hours_per_day: 1,
    target_deadline: "",
    tujuan_akhir: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  const loadingMessages = [
    "Analyzing your goals...",
    "Consulting the AI experts...",
    "Breaking down complex modules...",
    "Mapping out phases...",
    "Finding the best learning resources...",
    "Optimizing your study schedule...",
    "Finalizing your personalized roadmap...",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Increase timeout to 60s for AI generation
    api
      .post("/roadmaps/generate", formData, { timeout: 60000 })
      .then((res) => {
        if (res.data.success) {
          navigate(`/roadmap/${res.data.data.id}`);
        }
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "Gagal generate roadmap. Silakan coba lagi.",
        );
        console.log(error.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      {/* Mobile Container */}
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark bg-dots dot-pattern shadow-2xl">
        {/* Header */}
        <header className="sticky top-0 z-40 light:bg-white/60 dark:bg-background-dark/60 px-4 py-4 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight">AI Roadmap</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-32 pt-8 overflow-y-auto no-scrollbar">
          {!skillId ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6 animate-in fade-in zoom-in duration-500">
              <div className="relative mb-8">
                <div className="h-24 w-24 bg-primary/10 rounded-3xl flex items-center justify-center rotate-12 shadow-inner">
                  <span className="material-symbols-outlined text-primary text-[48px] -rotate-12">
                    search_insights
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg border-2 border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    add
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                No Skill Selected
              </h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-[280px] mb-10 leading-relaxed">
                To generate a personalized AI roadmap, you need to choose a
                skill you want to master first.
              </p>
              <Link
                to="/search"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all"
              >
                Find a Skill to Learn
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Generator
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs font-bold text-slate-500">
                    {skillName}
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight leading-tight">
                  Tell AI how you want to learn{" "}
                  <span className="text-primary">{skillName}</span>
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-start gap-3 animate-shake">
                    <span className="material-symbols-outlined text-[20px]">
                      error
                    </span>
                    {error}
                  </div>
                )}

                {/* Level Select */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                    Your Current Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Beginner (pemula)",
                      "Intermediate (menengah)",
                      "Hampir Pro",
                      "Advanced (ahli)",
                    ].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData({ ...formData, level: lvl })}
                        className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${formData.level === lvl ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-white/5"}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hours per Day */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                    Commitment (Hours / Day)
                  </label>
                  <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-white/5">
                    <span className="material-symbols-outlined text-primary">
                      schedule
                    </span>
                    <input
                      type="range"
                      min="0.5"
                      max="12"
                      step="0.5"
                      value={formData.hours_per_day}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hours_per_day: e.target.value,
                        })
                      }
                      className="flex-1 accent-primary"
                    />
                    <span className="text-sm font-black text-slate-900 dark:text-white w-10 text-center">
                      {formData.hours_per_day}h
                    </span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                    Target Deadline
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                      event
                    </span>
                    <input
                      type="date"
                      required
                      value={formData.target_deadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          target_deadline: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                    Your Goal
                  </label>
                  <textarea
                    required
                    rows="4"
                    placeholder="E.g. I want to be able to build a fullstack SaaS application..."
                    value={formData.tujuan_akhir}
                    onChange={(e) =>
                      setFormData({ ...formData, tujuan_akhir: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50"
                >
                  Generate Intelligence Roadmap
                  <span className="material-symbols-outlined">
                    auto_awesome
                  </span>
                </button>
              </form>
            </>
          )}
        </main>

        <BottomBar />

        {/* AI Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="max-w-xs w-full text-center px-6">
              <div className="relative mb-8 mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[48px] animate-bounce">
                    smart_toy
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                Generating Brilliance
              </h3>
              <p className="text-sm font-bold text-primary animate-pulse transition-all duration-500">
                {loadingMessages[loadingStep]}
              </p>
              <div className="mt-8 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full bg-primary animate-bounce`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
