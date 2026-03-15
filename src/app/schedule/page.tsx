'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Calendar, RefreshCw, Loader2, Clock, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SchedulePage() {
  const { data: session, status } = useSession();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchSchedules();
  }, [status]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/schedule/generate");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch schedule");
      }
      
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    try {
      setGenerating(true);
      setError(null);
      const res = await fetch("/api/schedule/generate", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate schedule");
      }
      
      await fetchSchedules();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 text-slate-900 dark:text-white">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
              <Calendar size={32} />
            </div>
            Smart Schedule
          </h1>
          <p className="mt-2 text-slate-500 font-medium">AI-optimized learning routine based on your goals</p>
        </div>
        
        <button 
          onClick={generateSchedule}
          disabled={generating}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:hover:scale-100"
        >
          {generating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
          {generating ? "Calculating Path..." : "AI Generate Schedule"}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400"
          >
            <AlertCircle size={20} />
            <p className="font-semibold">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && schedules.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 rounded-full animate-ping"></div>
            <Loader2 className="absolute top-0 left-0 animate-spin text-indigo-600" size={64} />
          </div>
          <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest">Architecting your routine...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {days.map((dayName, dayIdx) => {
            const daySchedules = Array.isArray(schedules) ? schedules.filter(s => s.dayOfWeek === dayIdx) : [];
            if (daySchedules.length === 0) return null;
            
            return (
              <motion.div 
                key={dayName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIdx * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-2xl transition-all"
              >
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest">{dayName}</h3>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500/20"></div>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {daySchedules.map((slot: any, slotIdx: number) => (
                    <motion.div 
                      key={slot.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (dayIdx * 0.1) + (slotIdx * 0.05) }}
                      className="p-6 px-8 flex items-center gap-10 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group/slot"
                    >
                      <div className="flex items-center gap-3 text-slate-400 group-hover/slot:text-indigo-600 transition-colors font-black min-w-[160px] text-lg">
                        <Clock size={20} className="group-hover/slot:scale-110 transition-transform" />
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </div>
                      <div className="flex-1 font-bold text-xl text-slate-700 dark:text-slate-200 group-hover/slot:translate-x-2 transition-transform">
                        {slot.taskName}
                      </div>
                      <div className="opacity-0 group-hover/slot:opacity-100 transition-opacity">
                        <button className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl">Focus Mode</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
          
          {(!schedules || schedules.length === 0) && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800"
            >
              <div className="bg-white dark:bg-slate-800 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Calendar className="text-slate-300" size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-widest">No routine found</h2>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">Generate an AI-powered study schedule to start optimizing your learning time.</p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
