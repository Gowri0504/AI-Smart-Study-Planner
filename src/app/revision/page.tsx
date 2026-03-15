'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BookMarked, Calendar, CheckCircle, Clock, ArrowRight, Sparkles, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function RevisionPage() {
  const { data: session, status } = useSession();
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchRevisions();
  }, [status]);

  const fetchRevisions = async () => {
    try {
      const res = await fetch("/api/revisions");
      const data = await res.json();
      setRevisions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading neural memory...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-5xl mx-auto space-y-12"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
          <BookMarked size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Smart Revision</h1>
          <p className="text-slate-500 font-medium tracking-tight">AI-scheduled sessions based on the Spaced Repetition (1-3-7-15) algorithm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {Array.isArray(revisions) && revisions.map((rev, index) => (
          <RevisionCard key={rev.id} rev={rev} index={index} onReviewComplete={fetchRevisions} />
        ))}
        {Array.isArray(revisions) && revisions.length === 0 && !loading && (
          <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">You're all caught up!</h3>
            <p className="text-slate-500 mt-2">No pending reviews. Great job maintaining your neural pathways.</p>
          </div>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900 text-white p-12 rounded-[3.5rem] overflow-hidden relative border border-slate-800 shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-indigo-400" size={24} />
            <h3 className="text-3xl font-black tracking-tight">The Retention Engine</h3>
          </div>
          <p className="text-slate-400 text-xl max-w-2xl mb-10 font-medium leading-relaxed">
            Our AI schedules revisions at geometrically increasing intervals to move information from your <span className="text-white font-black">working memory</span> to <span className="text-indigo-400 font-black">long-term neural storage</span>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RevisionStep day="1" label="Initial Study" />
            <RevisionStep day="3" label="First Review" />
            <RevisionStep day="7" label="Deep Review" />
            <RevisionStep day="15" label="Mastery Sync" />
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Brain size={280} className="text-indigo-500" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function RevisionStep({ day, label }: { day: string, label: string }) {
  return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors group/step">
      <div className="text-indigo-400 font-black text-2xl mb-1 group-hover/step:scale-110 transition-transform">Day {day}</div>
      <div className="text-slate-400 font-bold text-sm uppercase tracking-widest">{label}</div>
    </div>
  );
}

function RevisionCard({ rev, index, onReviewComplete }: { rev: any, index: number, onReviewComplete: () => void }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async (quality: number) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId: rev.id, quality })
      });
      if (res.ok) {
        onReviewComplete();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      setIsReviewing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6 hover:shadow-2xl transition-all group overflow-hidden relative"
    >
      <div className={`absolute top-0 left-0 w-2 h-full ${rev.color.replace('text', 'bg')} opacity-40`}></div>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex gap-6 items-center">
          <div className={`p-5 rounded-2xl ${rev.bg} ${rev.color} shadow-inner group-hover:scale-110 transition-transform flex-shrink-0`}>
            <Brain size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{rev.topic}</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{rev.subject}</p>
          </div>
        </div>

        {!isReviewing ? (
          <div className="flex flex-wrap items-center gap-6 lg:gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Repetition</span>
              <span className="text-lg font-black text-slate-700 dark:text-slate-200 flex items-center gap-2">
                #{rev.repetition || 0}
              </span>
            </div>
            
            <div className={`px-6 py-2 rounded-full text-sm font-black border-2 ${rev.color} border-current/20 bg-current/5`}>
              {rev.status}
            </div>

            <button 
              onClick={() => setIsReviewing(true)}
              disabled={rev.status === "Completed"}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all ${
                rev.status === "Completed" 
                  ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 group-hover:shadow-indigo-500/40"
              }`}
            >
              {rev.status === "Completed" ? "Done for now" : "Start Session"}
              {rev.status !== "Completed" && <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        ) : (
          <div className="w-full lg:w-3/4 flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-700 dark:text-slate-200">How well did you recall this topic?</h4>
              <button onClick={() => setIsReviewing(false)} className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Cancel</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                  <span className="font-bold text-indigo-600 animate-pulse">Syncing to neural net...</span>
                </div>
              )}
              <button onClick={() => submitReview(1)} className="p-3 rounded-xl font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors">1 - Blackout</button>
              <button onClick={() => submitReview(2)} className="p-3 rounded-xl font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors">2 - Hard</button>
              <button onClick={() => submitReview(3)} className="p-3 rounded-xl font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">3 - Effort</button>
              <button onClick={() => submitReview(4)} className="p-3 rounded-xl font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">4 - Good</button>
              <button onClick={() => submitReview(5)} className="p-3 rounded-xl font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors">5 - Perfect</button>
            </div>
            <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold mt-2">SM-2 Algorithm Evaluation</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
