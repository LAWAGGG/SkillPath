import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function QuizResult() {
  const navigate = useNavigate();
  const { phase_id } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/quizzes/${phase_id}/result`)
      .then((res) => {
        if (res.data.success) {
          setResultData(res.data);
        } else {
          alert("Gagal memuat hasil kuis.");
          navigate(-1);
        }
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Gagal memuat hasil kuis.");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [phase_id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
      </div>
    );
  }

  if (!resultData || !resultData.result) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 text-center">
        <p className="text-slate-500 mb-4">Hasil kuis tidak ditemukan.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-all"
        >
          Kembali
        </button>
      </div>
    );
  }

  const { score, result } = resultData;
  const numericScore = parseInt(score.split("/")[0]) || 0;

  // Decide color based on score
  let scoreColor = "text-red-500";
  let scoreBg = "bg-red-500/10";
  if (numericScore >= 80) {
    scoreColor = "text-green-500";
    scoreBg = "bg-green-500/10";
  } else if (numericScore >= 60) {
    scoreColor = "text-yellow-500";
    scoreBg = "bg-yellow-500/10";
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden flex justify-center">
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark shadow-2xl border-x border-slate-200/50 dark:border-white/5 pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 pt-4 pb-4 px-4 shadow-sm flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Quiz Results</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 flex flex-col no-scrollbar">
          {/* Score Card */}
          <div
            className={`mt-4 mb-8 p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col items-center justify-center text-center ${scoreBg}`}
          >
            <span
              className="material-symbols-outlined text-4xl mb-2"
              style={{ color: "inherit" }}
            >
              {numericScore >= 80
                ? "emoji_events"
                : numericScore >= 60
                  ? "thumb_up"
                  : "sentiment_dissatisfied"}
            </span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
              Your Score
            </h2>
            <div
              className={`text-5xl font-black tracking-tighter ${scoreColor}`}
            >
              {score}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg mb-4 px-2">Detailed Feedback</h3>

            {result.answers.map((item, idx) => {
              const { answer, question } = item;
              const isCorrect = answer.is_correct === 1;

              const options = [
                { key: "a", text: question.option_a },
                { key: "b", text: question.option_b },
                { key: "c", text: question.option_c },
                { key: "d", text: question.option_d },
              ];

              return (
                <div
                  key={question.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-sm"
                >
                  <div className="flex gap-3 mb-4">
                    <div
                      className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 border-2 ${
                        isCorrect
                          ? "border-green-500 bg-green-500/10 text-green-500"
                          : "border-red-500 bg-red-500/10 text-red-500"
                      }`}
                    >
                      <span className="text-sm font-bold">{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] leading-snug">
                        {question.question}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    {options.map((opt) => {
                      const isUserAnswer = answer.user_answer === opt.key;
                      const isTrueAnswer = question.true_answer === opt.key;

                      let optionClass =
                        "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400";
                      let icon = null;

                      if (isTrueAnswer) {
                        optionClass =
                          "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-bold";
                        icon = (
                          <span className="material-symbols-outlined text-[18px] text-green-500">
                            check_circle
                          </span>
                        );
                      } else if (isUserAnswer && !isTrueAnswer) {
                        optionClass =
                          "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 font-bold";
                        icon = (
                          <span className="material-symbols-outlined text-[18px] text-red-500">
                            cancel
                          </span>
                        );
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border-2 flex items-start gap-3 w-full transition-all ${optionClass}`}
                        >
                          <div
                            className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-bold uppercase shrink-0 ${
                              isTrueAnswer
                                ? "border-green-500 bg-green-500 text-white"
                                : isUserAnswer && !isTrueAnswer
                                  ? "border-red-500 bg-red-500 text-white"
                                  : "border-slate-300 dark:border-slate-600 text-slate-500"
                            }`}
                          >
                            {opt.key}
                          </div>
                          <span className="text-sm flex-1 leading-relaxed">
                            {opt.text}
                          </span>
                          {icon && (
                            <div className="shrink-0 pt-0.5">{icon}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {answer.overview && (
                    <div className="mt-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-[18px]">
                          lightbulb
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider">
                          Explanation
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {answer.overview}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
