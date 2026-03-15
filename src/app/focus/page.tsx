'use client'

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Clock, Play, Pause, RotateCcw, Coffee, Zap, BrainCircuit, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FocusPage() {
  const { data: session, status } = useSession();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    if (mode === 'study') {
      setSessions(prev => prev + 1);
      // Save session to DB
      try {
        await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ duration: 25, focusScore: 90 }),
        });
      } catch (err) {
        console.error("Failed to save neural session:", err);
      }
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('study');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'study' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-40px)] p-4 relative overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 -z-10 ${mode === 'study' ? 'bg-indigo-50/50 dark:bg-indigo-950/10' : 'bg-emerald-50/50 dark:bg-emerald-950/10'}`}></div>
      
      <div className="text-center mb-16 space-y-4">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-indigo-600"
        >
          <BrainCircuit size={14} />
          Cognitive Load Optimization
        </motion.div>
        <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Deep Focus</h1>
        <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          Using the Pomodoro technique to maximize neural plasticity and retention.
        </p>
      </div>

      <motion.div 
        layout
        className="bg-white dark:bg-slate-900 w-full max-w-2xl p-16 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden group"
      >
        {/* Progress Ring Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className={mode === 'study' ? 'text-indigo-600' : 'text-emerald-600'}
              strokeDasharray="301.59"
              strokeDashoffset={301.59 - (301.59 * (100 - progress) / 100)}
            />
          </svg>
        </div>

        <div className="flex gap-4 justify-center mb-12">
          <button 
            onClick={() => { setMode('study'); setTimeLeft(25 * 60); setIsActive(false); }}
            className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${mode === 'study' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'}`}
          >
            Study Phase
          </button>
          <button 
            onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
            className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${mode === 'break' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'}`}
          >
            Neural Reset
          </button>
        </div>

        <motion.div 
          key={timeLeft}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[10rem] md:text-[12rem] font-black text-slate-900 dark:text-white font-mono tracking-tighter mb-12 tabular-nums leading-none text-center select-none"
        >
          {formatTime(timeLeft)}
        </motion.div>

        <div className="flex gap-8 justify-center">
          <button 
            onClick={toggleTimer}
            className={`p-8 rounded-[2.5rem] text-white transition-all transform hover:scale-110 active:scale-90 shadow-2xl ${isActive ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/40' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/40'}`}
          >
            {isActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
          </button>
          <button 
            onClick={resetTimer}
            className="p-8 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all transform hover:rotate-180 duration-700"
          >
            <RotateCcw size={40} />
          </button>
        </div>
      </motion.div>

      <div className="mt-16 grid grid-cols-2 gap-10 w-full max-w-2xl">
        <StatItem icon={Zap} label="Cycles Completed" value={sessions} color="text-amber-500" bg="bg-amber-50 dark:bg-amber-900/20" />
        <StatItem icon={Coffee} label="Rest Accumulated" value={`${sessions * 5}m`} color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-900/20" />
      </div>
    </motion.div>
  );
}

function StatItem({ icon: Icon, label, value, color, bg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all"
    >
      <div className={`p-5 rounded-2xl ${bg} ${color} shadow-inner`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}
