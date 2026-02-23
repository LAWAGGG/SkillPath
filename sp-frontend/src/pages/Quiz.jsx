import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function Quiz() {
  const navigate = useNavigate();
  const { phase_id } = useParams();
  const [quizDetails, setQuizDetails] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/quizzes/${phase_id}`)
      .then((res) => {
        if (res.data.success) {
          setQuizDetails(res.data.data);
        } else {
          alert("Gagal memuat kuis.");
          navigate(-1);
        }
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Gagal memuat kuis.");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [phase_id, navigate]);

  const handleSelectOption = (questionId, optionLetter) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < quizDetails.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleSubmit = () => {
    if (!quizDetails) return;

    // Check if all questions are answered
    const unanswered = quizDetails.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `Ada ${unanswered.length} soal yang belum dijawab. Yakin ingin mengumpulkan?`,
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    const formattedAnswers = Object.keys(answers).map((qId) => ({
      question_id: parseInt(qId),
      answer: answers[qId],
    }));

    api
      .post(`/quizzes/${quizDetails.quiz_id}/submit`, {
        answers: formattedAnswers,
      })
      .then((res) => {
        if (res.data) {
          navigate(`/quiz/${phase_id}/result`);
        }
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Gagal mengumpulkan kuis.");
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
      </div>
    );
  }

  if (
    !quizDetails ||
    !quizDetails.questions ||
    quizDetails.questions.length === 0
  ) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4 text-center">
        <p className="text-slate-500">Kuis tidak tersedia untuk phase ini.</p>
      </div>
    );
  }

  const currentQuestion = quizDetails.questions[currentQuestionIdx];
  const progress =
    ((currentQuestionIdx + 1) / quizDetails.questions.length) * 100;

  const options = [
    { key: "a", text: currentQuestion.option_a },
    { key: "b", text: currentQuestion.option_b },
    { key: "c", text: currentQuestion.option_c },
    { key: "d", text: currentQuestion.option_d },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden flex justify-center">
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark shadow-2xl border-x border-slate-200/50 dark:border-white/5">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 pt-4 pb-2 px-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold tracking-tight">Phase Quiz</h1>
            <div className="w-10"></div>
          </div>

          <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-xs font-bold text-slate-500">
              Question {currentQuestionIdx + 1} of{" "}
              {quizDetails.questions.length}
            </span>
            <span className="text-xs font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col no-scrollbar">
          <div className="mb-8">
            <h2 className="text-xl font-bold leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4 flex-1">
            {options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() =>
                    handleSelectOption(currentQuestion.id, opt.key)
                  }
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-slate-200 dark:border-slate-800 hover:border-primary/50 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-bold uppercase transition-colors shrink-0 ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 dark:border-slate-700 text-slate-500"
                    }`}
                  >
                    {opt.key}
                  </div>
                  <span
                    className={`text-sm font-medium leading-relaxed ${isSelected ? "text-primary dark:text-primary" : "text-slate-700 dark:text-slate-300"}`}
                  >
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-4 flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIdx === 0}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Previous
            </button>

            {currentQuestionIdx < quizDetails.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      sync
                    </span>
                    Submitting...
                  </>
                ) : (
                  <>Submit Answers</>
                )}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
