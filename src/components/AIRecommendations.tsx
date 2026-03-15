import { useState, useEffect } from "react";
import { BookOpen, Video, FileText, Code, ExternalLink, Loader2, Sparkles } from "lucide-react";

export function AIRecommendations({ query }: { query: string }) {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchRecommendations();
    }
  }, [query]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/recommendations?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResources(data.recommendations || []);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!query) return null;

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={24} />
        <span className="text-indigo-600 dark:text-indigo-400 font-medium">AI is hunting for the best resources...</span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
        <Sparkles size={20} />
        AI Recommended Resources for "{query}"
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((res: any) => (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                res.type === 'video' ? 'bg-rose-100 text-rose-600' :
                res.type === 'article' ? 'bg-blue-100 text-blue-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                {res.type === 'video' ? <Video size={20} /> :
                 res.type === 'article' ? <FileText size={20} /> :
                 <Code size={20} />}
              </div>
              <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 line-clamp-2">{res.title}</h4>
            <div className="mt-auto pt-4 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
              <span>{res.source}</span>
              <span>{res.duration}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
