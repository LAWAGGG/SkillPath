import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import api from "../api/api";
import Skeleton from "../components/Skeleton";

export default function TopicDetail() {
  const { roadmapId, topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopic();
  }, [roadmapId, topicId]);

  async function fetchTopic() {
    try {
      setLoading(true);
      const res = await api.get(`/roadmaps/${roadmapId}/topic/${topicId}`);
      if (res.data.success) {
        setTopic(res.data.data);
      }
    } catch (err) {
      alert("Failed to load topic details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle() {
    try {
      await api.patch(`topics/${topicId}/toggle`);
      setTopic((prev) => ({ ...prev, is_completed: !prev.is_completed }));
    } catch (err) {
      alert("Failed to toggle completion.");
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-white dark:bg-slate-950 shadow-2xl border-x border-slate-200/50 dark:border-white/5">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5">
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex-1 text-center py-4">
              <h1 className="text-sm font-black uppercase tracking-widest text-slate-500">
                Topic Detail
              </h1>
            </div>
            <div className="w-10 flex justify-center">
                {topic?.is_completed && !loading && (
                    <span className="material-symbols-outlined text-green-500 bg-green-500/10 p-1.5 rounded-full">
                        check
                    </span>
                )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32 no-scrollbar">
          {loading ? (
            <div className="space-y-6">
              <Skeleton variant="text" className="h-10 w-3/4 mb-10" />
              <div className="space-y-4">
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-5/6" />
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-4/6" />
              </div>
              <div className="pt-10 space-y-4">
                <Skeleton variant="rectangular" className="h-20 w-full rounded-2xl" />
                <Skeleton variant="rectangular" className="h-20 w-full rounded-2xl" />
              </div>
            </div>
          ) : topic ? (
            <>
              <h1 className="text-2xl font-black tracking-tight mb-8 leading-snug">
                  {topic.topic_title}
              </h1>

              <div className="prose prose-sm dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none prose-pre:bg-transparent prose-pre:p-0">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const { children, className, node, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          {...rest}
                          PreTag="div"
                          children={String(children).replace(/\n$/, "")}
                          language={match[1]}
                          style={atomDark}
                          customStyle={{ margin: '1rem 0', borderRadius: '1rem', padding: '1rem', fontSize: '13px' }}
                        />
                      ) : (
                        <code
                          {...rest}
                          className="bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-primary text-[0.85em] font-mono before:hidden after:hidden"
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => <h1 className="text-2xl font-black mt-8 mb-4 tracking-tight">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-white/5 pb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200">{children}</h3>,
                    p: ({ children }) => <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-5">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-5 space-y-2 text-slate-700 dark:text-slate-300">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-5 space-y-2 text-slate-700 dark:text-slate-300">{children}</ol>,
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/50 pl-4 py-2 mb-5 text-slate-600 dark:text-slate-400 italic bg-primary/5 rounded-r-xl">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark font-medium underline decoration-primary/30 underline-offset-2">{children}</a>
                  }}
                >
                  {topic.description || "No description provided."}
                </Markdown>
              </div>

              {topic.resources?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
                    external reference
                  </h3>
                  <div className="grid gap-3">
                    {topic.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-100 gap-4 p-4 rounded-2xl bg-background-light dark:bg-background-dark border border-slate-200/50 dark:border-white/5 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                            res.type === "video"
                              ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
                              : "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[24px]">
                            {res.type === "video"
                              ? "play_circle"
                              : res.type === "article"
                                ? "description"
                                : "integration_instructions"}
                          </span>
                        </div>
                        <div className="flex-1 truncate">
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                            {res.title}
                          </p>
                          <p className="text-[10px] font-black tracking-wider uppercase text-slate-400 mt-1">
                            {res.type}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-[16px]">
                            arrow_forward_ios
                            </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex w-16 h-16 rounded-full bg-slate-100 text-slate-400 items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px]">sentiment_dissatisfied</span>
              </div>
              <p className="text-slate-500 font-medium">Topic not found.</p>
            </div>
          )}
        </main>

        <div className="absolute bottom-0 left-0 right-0 z-50">
          <div className="bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 w-full pt-16 pb-6 px-6">
            <button
              onClick={handleToggle}
              disabled={loading || !topic}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${
                topic?.is_completed
                  ? "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                  : "bg-primary text-white shadow-primary/30 hover:bg-primary-dark"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {topic?.is_completed ? "restart_alt" : "done_all"}
              </span>
              {topic?.is_completed ? "Undo Complete Topic" : "Complete Topic"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
