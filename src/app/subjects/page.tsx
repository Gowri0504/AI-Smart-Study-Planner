'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BookOpen, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AIRecommendations } from "@/components/AIRecommendations";
import { AIQuiz } from "@/components/AIQuiz";

export default function SubjectsPage() {
  const { data: session, status } = useSession();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", difficulty: "1", topics: "" });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchSubjects();
  }, [status]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/subjects");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch subjects");
      }
      
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const topicsArray = newSubject.topics.split(",").map(t => t.trim()).filter(t => t !== "");
    
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSubject, topics: topicsArray }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add subject");
      }
      
      setNewSubject({ name: "", difficulty: "1", topics: "" });
      setIsAdding(false);
      await fetchSubjects();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

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
              <BookOpen size={32} />
            </div>
            My Subjects
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Manage your learning curriculum and topics</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
            isAdding 
              ? "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400" 
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
          }`}
        >
          {isAdding ? "Cancel" : <><Plus size={20} /> Add Subject</>}
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

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            onSubmit={handleAddSubject} 
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl mb-12 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Subject Name</label>
                <input 
                  value={newSubject.name}
                  onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all outline-none text-lg font-bold"
                  placeholder="e.g. Advanced Data Structures"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Difficulty Level</label>
                <select 
                  value={newSubject.difficulty}
                  onChange={e => setNewSubject({...newSubject, difficulty: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all outline-none text-lg font-bold appearance-none cursor-pointer"
                >
                  <option value="1">🟢 1 - Very Easy</option>
                  <option value="2">🟡 2 - Easy</option>
                  <option value="3">🟠 3 - Moderate</option>
                  <option value="4">🔴 4 - Hard</option>
                  <option value="5">🔥 5 - Very Hard</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Topics (comma separated)</label>
              <textarea 
                value={newSubject.topics}
                onChange={e => setNewSubject({...newSubject, topics: e.target.value})}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all outline-none text-lg font-medium"
                placeholder="e.g. B-Trees, AVL Trees, Red-Black Trees, Graphs"
                rows={3}
              />
            </div>
            <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99]">
              Launch Subject
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {loading && subjects.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 rounded-full animate-ping"></div>
            <Loader2 className="absolute top-0 left-0 animate-spin text-indigo-600" size={64} />
          </div>
          <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest">Syncing knowledge base...</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {Array.isArray(subjects) && subjects.map((subject, index) => (
            <motion.div 
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{subject.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-black uppercase tracking-tighter text-slate-400">Difficulty</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <div key={lvl} className={`w-3 h-1.5 rounded-full ${lvl <= subject.difficulty ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Mastery Topics</p>
                <div className="flex flex-wrap gap-2">
                  {subject.topics && subject.topics.map((topic: any) => (
                    <span key={topic.id} className="text-xs px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-100 dark:border-slate-800 font-bold group-hover:border-indigo-200 dark:group-hover:border-indigo-900 transition-colors">
                      {topic.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {(!subjects || subjects.length === 0) && !isAdding && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-32 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800"
            >
              <div className="bg-white dark:bg-slate-800 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <BookOpen className="text-slate-300" size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-widest">Your curriculum is empty</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">Start your journey by adding your first subject to the knowledge base.</p>
            </motion.div>
          )}

          {/* Render Recommendations for the first subject as a demo, or allow selection. For now, let's just show it below the subjects list if we have subjects, based on the first subject's name to demonstrate the feature. */}
          {subjects.length > 0 && (
            <div className="col-span-full mt-8">
              <AIRecommendations query={subjects[0].name} />
              
              <div className="mt-12">
                <AIQuiz topic={subjects[0].name} onComplete={(score: number) => console.log(`Quiz finished with score: ${score}`)} />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
