'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area
} from "recharts";
import { TrendingUp, CheckCircle, Clock, Calendar, Zap, Award, Loader2, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const studyData = [
  { day: "Mon", hours: 4, completed: 3 },
  { day: "Tue", hours: 3, completed: 2 },
  { day: "Wed", hours: 5, completed: 4 },
  { day: "Thu", hours: 2, completed: 1 },
  { day: "Fri", hours: 4, completed: 3 },
  { day: "Sat", hours: 6, completed: 5 },
  { day: "Sun", hours: 3, completed: 2 },
];

const subjectStats = [
  { name: "Data Structures", progress: 85, color: "#6366f1" },
  { name: "Algorithms", progress: 60, color: "#10b981" },
  { name: "Database Systems", progress: 45, color: "#f59e0b" },
  { name: "OS Concepts", progress: 30, color: "#ef4444" },
];

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchProgress();
  }, [status]);

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/progress");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isMounted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 rounded-full animate-ping"></div>
          <Loader2 className="absolute top-0 left-0 animate-spin text-indigo-600" size={64} />
        </div>
        <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest">Compiling analytics...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto space-y-12"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
          <TrendingUp size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Learning Intelligence</h1>
          <p className="text-slate-500 font-medium">Deep dive into your study patterns and performance</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={CheckCircle} label="Tasks Completed" value={data?.summary?.completedTasks || "0"} color="text-emerald-500" delay={0.1} />
        <StatCard icon={Clock} label="Study Hours" value={data?.summary?.studyHours || "0h"} color="text-indigo-500" delay={0.2} />
        <StatCard icon={Zap} label="Learning Streak" value={data?.summary?.streak || "0 Days"} color="text-amber-500" delay={0.3} />
        <StatCard icon={Award} label="Productivity Score" value={data?.summary?.productivity || "0%"} color="text-rose-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Study Hours Line Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-widest">Velocity Trend</h3>
            <div className="px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-xs font-black">+12% vs LW</div>
          </div>
          <div className="h-[350px] w-full min-h-[300px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.studyData || studyData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '16px' }}
                    itemStyle={{ fontWeight: 900, color: '#6366f1' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Subject Progress Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-widest">Curriculum Mastery</h3>
            <BrainCircuit className="text-slate-300" size={24} />
          </div>
          <div className="h-[350px] w-full min-h-[300px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.subjectStats || subjectStats} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 12, fontWeight: 800, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '16px' }}
                  />
                  <Bar dataKey="progress" radius={[0, 10, 10, 0]} barSize={24}>
                    {(data?.subjectStats || subjectStats).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Productivity Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-900 text-white p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
            <div className="p-2 bg-indigo-500 rounded-xl">
              <BrainCircuit size={32} />
            </div>
            AI Insights & Strategies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-2xl font-bold leading-relaxed text-indigo-100">
                "Your concentration peaks between <span className="text-white underline decoration-indigo-500 underline-offset-8 font-black text-3xl">7 PM – 10 PM</span>."
              </p>
              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <p className="text-lg text-slate-300">You've completed 20% more tasks this week compared to last week. Exceptional pace!</p>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Tactical Recommendation</p>
              <p className="text-xl text-slate-200 leading-relaxed mb-6">
                Increase focus on <span className="font-black text-rose-400">OS Concepts</span>. It's your lowest progress subject and has a critical deadline in <span className="text-white font-black underline">12 days</span>.
              </p>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-500/20">Optimize Schedule Now</button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <BrainCircuit size={300} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all"
    >
      <div className={`p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 ${color} shadow-inner`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}
