import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import api from "../api/api";
import Skeleton from "../components/Skeleton";
import MainLayout from "../components/layouts/MainLayout";

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
    <MainLayout>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 px-4 md:px-8">
        <div className="py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 truncate">
              Learning Module
            </h1>
          </div>
          <div className="w-10 flex justify-center shrink-0">
              {topic?.is_completed && !loading && (
                  <span className="material-symbols-outlined text-green-500 bg-green-500/10 p-1.5 rounded-full text-[20px]">
                      check
                  </span>
              )}
          </div>
        </div>
      </header>

      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8">
        <main className="pb-3">
          {loading ? (
            <div className="space-y-6">
              <Skeleton variant="text" className="h-10 w-3/4 mb-10" />
              <div className="space-y-4">
                <Skeleton variant="text" className="h-4 w-full" /><Skeleton variant="text" className="h-4 w-full" /><Skeleton variant="text" className="h-4 w-5/6" />
              </div>
            </div>
          ) : topic ? (
            <>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-8 leading-tight text-slate-900 dark:text-white">
                  {topic.topic_title}
              </h1>

              <div className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none prose-pre:bg-transparent prose-pre:p-0 overflow-hidden">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const { children, className, node, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 dark:border-white/10">
                          <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, "")}
                            language={match[1]}
                            style={atomDark}
                            customStyle={{ margin: 0, padding: '1.5rem', fontSize: '13px', backgroundColor: 'transparent' }}
                          />
                        </div>
                      ) : (
                        <code {...rest} className="bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-primary text-[0.9em] font-mono before:hidden after:hidden">{children}</code>
                      );
                    },
                    h2: ({ children }) => <h2 className="text-xl font-bold mt-10 mb-4 border-b border-slate-100 dark:border-white/5 pb-2">{children}</h2>,
                    p: ({ children }) => <p className="leading-relaxed text-slate-600 dark:text-slate-400 mb-6">{children}</p>,
                  }}
                >
                  {topic.description || "No description provided."}
                </Markdown>
              </div>

              {topic.resources?.length > 0 && (
                <div className="mt-5 pt-8 border-t border-slate-200 dark:border-white/10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                    external reference
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {topic.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all group overflow-hidden"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${res.type === "video" ? "bg-red-50 text-red-500 dark:bg-red-500/10" : "bg-blue-50 text-blue-500 dark:bg-blue-500/10"}`}>
                          <span className="material-symbols-outlined">{res.type === "video" ? "play_circle" : "description"}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{res.title}</p>
                          <p className="text-[10px] font-black uppercase text-slate-400 mt-1">{res.type}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </main>
      </div>

      {/* Persistent Footer Action */}
      <div className="bottom-0 z-30 w-full mt-auto">
        <div className="bg-white dark:bg-slate-900 pt-6 pb-30 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleToggle}
              disabled={loading || !topic}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                topic?.is_completed
                  ? "bg-slate-100 dark:bg-white/5 text-slate-500"
                  : "bg-primary text-white shadow-primary/30"
              }`}
            >
              <span className="material-symbols-outlined">{topic?.is_completed ? "restart_alt" : "done_all"}</span>
              {topic?.is_completed ? "Undo Completion" : "Complete Topic"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
