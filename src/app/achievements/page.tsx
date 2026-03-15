'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Award, Zap, Trophy, Star, Target, CheckCircle2 } from "lucide-react";

const mockAchievements = [
  { id: 1, title: "Early Bird", description: "Completed 5 study sessions before 9 AM.", icon: Zap, unlocked: true, date: "2024-03-10" },
  { id: 2, title: "Focus Master", description: "Maintained 90% focus score for a full hour.", icon: Target, unlocked: true, date: "2024-03-12" },
  { id: 3, title: "7-Day Streak", description: "Studied for 7 consecutive days.", icon: Trophy, unlocked: false, progress: 71 },
  { id: 4, title: "Subject Guru", description: "Completed all topics in a single subject.", icon: Star, unlocked: false, progress: 45 },
];

export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchAchievements();
  }, [status]);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Syncing achievement neural pathways...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-4">
        <Award className="text-amber-500" size={32} />
        <div>
          <h1 className="text-3xl font-bold">Achievements & Gamification</h1>
          <p className="text-slate-500">Level up your learning and earn badges as you progress.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-indigo-100 font-medium">Your Level</p>
          <p className="text-4xl font-black">Level {data?.stats?.level || 1}</p>
          <div className="mt-4 h-2 bg-indigo-400/30 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${data?.stats?.xpProgress || 0}%` }}></div>
          </div>
          <p className="text-xs mt-2 text-indigo-100">{data?.stats?.xpToNextLevel || 0} XP to Level {(data?.stats?.level || 1) + 1}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total XP</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{data?.stats?.totalXP || 0}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Badges Won</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{data?.stats?.badgesCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(data?.achievements || []).map((ach: any) => (
          <div key={ach.id} className={`p-6 rounded-2xl border transition-all ${ach.unlocked ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800 opacity-60'}`}>
            <div className={`p-4 rounded-xl w-fit mb-4 ${ach.unlocked ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <Award size={32} />
            </div>
            <h3 className="font-bold text-lg mb-1">{ach.title}</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">{ach.description}</p>
            
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
              <CheckCircle2 size={16} />
              Unlocked on {ach.date}
            </div>
          </div>
        ))}
        {(!data?.achievements || data?.achievements.length === 0) && (
          <div className="col-span-full py-12 text-center text-slate-500 font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            No achievements unlocked yet. Keep studying to earn badges!
          </div>
        )}
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-xl font-bold">Global Leaderboard</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {(data?.leaderboard || []).map((user: any) => (
            <div key={user.rank} className={`p-4 flex items-center gap-6 ${user.isUser ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}`}>
              <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${user.rank === 1 ? 'bg-amber-400 text-white' : user.rank === 2 ? 'bg-slate-300 text-white' : user.rank === 3 ? 'bg-amber-600 text-white' : 'text-slate-400'}`}>
                {user.rank}
              </div>
              <div className="flex-1 font-bold text-slate-800 dark:text-white">{user.name}</div>
              <div className="text-indigo-600 font-bold">{user.xp} XP</div>
              <div className="flex items-center gap-1 text-rose-500 font-bold">
                <Zap size={14} fill="currentColor" />
                {user.streak}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
