import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import BottomBar from "../components/BottomBar";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Reviewing your recent activity...",
    "Comparing progress with target...",
    "Calculating performance score...",
    "AI is drafting your feedback...",
    "Finding motivational insights...",
    "Preparing recommendations...",
    "Finalizing your report...",
  ];

  async function fetchFeedbacks() {
    setLoading(true);
    api
      .get(`/ai/feedbacks/${params.id}`)
      .then((res) => {
        setFeedbacks(res.data.data);
        setLoading(false);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  async function handleGenerateFeedback() {
    setIsGenerating(true);
    api
      .post(`/ai/feedback/${params.id}`, {}, { timeout: 60000 })
      .then((res) => {
        if (res.data.success) {
          fetchFeedbacks();
        }
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Gagal generate feedback.");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }

  useEffect(() => {
    fetchFeedbacks();

  }, []);

  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }


  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark shadow-2xl border-x border-slate-200/50 dark:border-white/5">
        {/* Header */}
        <header className="sticky top-0 z-50 light:bg-white/60 dark:bg-background-dark/60 px-4 py-4 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              Progress Insights
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-32 px-4 py-6 space-y-8 no-scrollbar">
          {feedbacks.length === 0 ? (
            <div className="py-20 text-center">
              <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-[40px]">
                  tips_and_updates
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">No Feedback Yet</h3>
              <p className="text-sm text-slate-500 mb-8 px-10">
                Generate your first AI feedback to see how you're doing and get
                personalized advice.
              </p>
              <button
                onClick={handleGenerateFeedback}
                className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/30 active:scale-95 transition-all"
              >
                Get AI Review Now
              </button>
            </div>
          ) : (
            <>
              {/* Latest Feedback Highlight */}
              <div className="bg-primary rounded-[32px] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <span className="material-symbols-outlined text-[100px]">
                    auto_awesome
                  </span>
                </div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80 bg-white/10 px-3 py-1 rounded-full">
                      Latest Analysis
                    </span>
                    <h2 className="text-2xl font-black mt-2">
                      Personal Progress
                    </h2>
                  </div>
                  <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30">
                    <div className="text-center">
                      <span className="block text-2xl font-black leading-none">
                        {feedbacks[0].score_progress}
                      </span>
                      <span className="text-[10px] font-bold opacity-70">
                        SCORE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <p className="text-sm font-bold leading-relaxed italic">
                      "{feedbacks[0].apresiasi}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateFeedback}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-primary text-primary font-black text-sm transition-all active:scale-95 shadow-lg shadow-primary/5"
              >
                <span className="material-symbols-outlined">refresh</span>
                Update Feedback
              </button>

              {/* Detailed Breakdown */}
              <div className="space-y-6">
                {/* Analysis */}
                <div className="bg-white dark:bg-slate-950/40 rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        analytics
                      </span>
                    </div>
                    <h3 className="font-bold">Deep Analysis</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {feedbacks[0].analisis}
                  </p>
                </div>

                {/* Concrete Steps */}
                <div className="bg-white dark:bg-slate-950/40 rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-500/10 text-green-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        lightbulb
                      </span>
                    </div>
                    <h3 className="font-bold">Saran Konkret</h3>
                  </div>
                  <ul className="space-y-3">
                    {
                      Array.isArray(feedbacks[0].saran_konkret) ? feedbacks[0].saran_konkret?.map((saran, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium"
                        >
                          <span className="h-5 w-5 rounded-full bg-slate-100 dark:bg-white/5 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-400">
                            {i + 1}
                          </span>
                          {saran}
                        </li>
                      ))
                        : <p>{feedbacks[0].saran_konkret}</p>
                    }
                  </ul>
                </div>

                {/* Motivation */}
                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        favorite
                      </span>
                    </div>
                    <h3 className="font-bold text-primary">
                      Motivation Booster
                    </h3>
                  </div>
                  <p className="text-sm font-bold text-primary italic leading-relaxed">
                    "{feedbacks[0].pesan_motivasi}"
                  </p>
                </div>

                {/* Schedule Alert */}
                {feedbacks[0].perlu_penyesuaian_jadwal && (
                  <div className="bg-red-50 dark:bg-red-500/10 rounded-3xl p-6 border border-red-100 dark:border-red-500/10 flex gap-4">
                    <span className="material-symbols-outlined text-red-600">
                      notification_important
                    </span>
                    <div>
                      <h4 className="font-bold text-red-600 text-sm">
                        Jadwal Perlu Penyesuaian
                      </h4>
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        Progressmu saat ini agak tertinggal dari target awal. AI
                        menyarankan untuk menyesuaikan durasi belajar atau
                        deadline.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* History Section */}
              {feedbacks.length > 1 && (
                <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-4">
                    Previous Reports
                  </h3>
                  <div className="space-y-3">
                    {feedbacks.slice(1).map((fb) => (
                      <div
                        key={fb.id}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-500">
                            {new Date(fb.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-bold mt-1">
                            Score: {fb.score_progress}/10
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300">
                          chevron_right
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <BottomBar />

        {/* AI Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="max-w-xs w-full text-center px-6">
              <div className="relative mb-8 mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[48px] animate-bounce">
                    reviews
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                AI Reviewing Path
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
