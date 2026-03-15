'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Users, Plus, Search, MessageCircle, MoreVertical, ShieldCheck, UserPlus } from "lucide-react";

const mockGroups = [
  { id: 1, name: "Algorithms & DS Group", description: "Studying for final exams and placements.", members: 24, lastActive: "2 mins ago" },
  { id: 2, name: "Database Systems Study", description: "Learning SQL and database design.", members: 15, lastActive: "15 mins ago" },
  { id: 3, name: "Operating Systems Prep", description: "Focusing on CPU scheduling and memory management.", members: 8, lastActive: "1 hour ago" },
];

export default function GroupsPage() {
  const { data: session, status } = useSession();
  const [isCreating, setIsCreating] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchGroups();
  }, [status]);

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/groups");
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGroup),
    });
    setNewGroup({ name: "", description: "" });
    setIsCreating(false);
    fetchGroups();
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      setLoading(true);
      await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
      });
      fetchGroups();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading && groups.length === 0) return <div className="flex items-center justify-center min-h-screen">Connecting to study networks...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Users className="text-indigo-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold">Collaborative Study Groups</h1>
            <p className="text-slate-500">Learn together, share resources, and track progress as a team.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-bold"
        >
          <Plus size={20} />
          {isCreating ? "Cancel" : "Create Group"}
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          placeholder="Search groups by name or topic..."
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      {isCreating && (
        <form onSubmit={handleCreateGroup} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold mb-6">Start a New Study Group</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Group Name</label>
              <input 
                value={newGroup.name}
                onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl" 
                placeholder="e.g. Finals Prep 2024" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Main Subject</label>
              <input className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl" placeholder="e.g. Computer Science" />
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <label className="text-sm font-bold text-slate-500 uppercase">Description</label>
            <textarea 
              value={newGroup.description}
              onChange={e => setNewGroup({...newGroup, description: e.target.value})}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl" 
              rows={3} 
              placeholder="What is this group about?"
            ></textarea>
          </div>
          <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform hover:scale-[1.01]">
            Launch Group
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map((group) => (
          <div key={group.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="text-slate-400 cursor-pointer" size={20} />
            </div>
            
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{group.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{group.description}</p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase">
                <div className="flex items-center gap-1">
                  <UserPlus size={14} />
                  {group.members} Members
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {group.lastActive}
                </div>
              </div>
              <button 
                onClick={() => !group.isMember && handleJoinGroup(group.id)}
                disabled={group.isMember}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${group.isMember ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed' : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-indigo-600 cursor-pointer'}`}
              >
                {group.isMember ? 'Joined' : 'Join'}
              </button>
            </div>
          </div>
        ))}
        {groups.length === 0 && !isCreating && (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
            No study groups active yet. Start the first one!
          </div>
        )}
      </div>

      <div className="bg-indigo-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black leading-tight">Match with Study Partners</h2>
            <p className="text-indigo-100 max-w-lg opacity-80 leading-relaxed">
              Our AI matches you with students having similar learning styles, goals, and schedules to boost your accountability.
            </p>
            <button className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-50 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto md:mx-0">
              <ShieldCheck size={20} />
              Start Matching
            </button>
          </div>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-16 h-16 rounded-full border-4 border-indigo-900 bg-indigo-700 flex items-center justify-center text-xl font-black shadow-2xl">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Users size={240} />
        </div>
      </div>
    </div>
  );
}
