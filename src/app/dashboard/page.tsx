'use client'

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Users,
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Clock, 
  Settings, 
  MessageSquare, 
  TrendingUp,
  Award,
  BookMarked,
  Plus,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchDashboardData();
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
      <p className="text-slate-500 font-black uppercase tracking-widest">Initializing Neural Dashboard...</p>
    </div>
  );

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Subjects", href: "/subjects" },
    { icon: Calendar, label: "Schedule", href: "/schedule" },
    { icon: Clock, label: "Focus Mode", href: "/focus" },
    { icon: TrendingUp, label: "Progress", href: "/progress" },
    { icon: BookMarked, label: "Revision", href: "/revision" },
    { icon: Users, label: "Study Groups", href: "/groups" },
    { icon: MessageSquare, label: "AI Assistant", href: "/chat" },
    { icon: Award, label: "Achievements", href: "/achievements" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">StudyFlow</h1>
        </div>
        <nav className="mt-4 px-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome back, {session?.user?.name}!</h2>
            <p className="text-slate-500 dark:text-slate-400">Here's your study plan for today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
              + New Subject
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Schedule Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="text-indigo-500" size={20} />
              Today's Schedule
            </h3>
            <div className="space-y-4">
              {(data?.schedule || []).map((slot: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm font-medium text-slate-500">{slot.time}</span>
                  <span className="font-medium">{slot.task}</span>
                </div>
              ))}
              {(!data?.schedule || data.schedule.length === 0) && (
                <p className="text-slate-400 text-sm italic">No study sessions planned for today.</p>
              )}
            </div>
          </motion.div>

          {/* Progress Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} />
              Weekly Progress
            </h3>
            <div className="flex items-center justify-center h-40">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-700 stroke-current"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 stroke-current"
                    strokeWidth="3"
                    strokeDasharray={`${data?.progress || 0}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{data?.progress || 0}%</span>
                  <span className="text-xs text-slate-500">Goal met</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Burnout Risk Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className={`size-5 ${
                data?.burnout?.riskLevel === 'High' ? 'text-rose-500' : 
                data?.burnout?.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
              }`} />
              Burnout Risk: {data?.burnout?.riskLevel || "Low"}
            </h3>
            
            <div className="space-y-4">
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    data?.burnout?.riskLevel === 'High' ? 'bg-rose-500' : 
                    data?.burnout?.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${data?.burnout?.riskPercentage || 0}%` }}
                />
              </div>
              
              <div className={`p-4 rounded-lg text-sm border ${
                data?.burnout?.riskLevel === 'High' ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900/30' : 
                data?.burnout?.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30' : 
                'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/30'
              }`}>
                {data?.burnout?.message || "Analyzing study patterns..."}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Heatmap */}
        <div className="mt-8">
          <ActivityHeatmap />
        </div>
      </main>
    </div>
  );
}
