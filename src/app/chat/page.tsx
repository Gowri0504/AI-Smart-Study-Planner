'use client'

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hi! I'm your AI Smart Study Assistant. How can I help you optimize your learning today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered a neural sync error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-40px)] max-w-5xl mx-auto p-4 md:p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
            <BrainCircuit size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Neural Assistant</h1>
            <p className="text-sm text-slate-500 font-medium">Real-time learning optimization & insights</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full text-xs font-black border border-emerald-100 dark:border-emerald-900/30">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          AI ONLINE
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-inner mb-6 p-8 space-y-8 no-scrollbar"
      >
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-3 rounded-2xl shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-indigo-600 border border-slate-100 dark:border-slate-700'}`}>
                {msg.role === 'user' ? <User size={24} /> : <Sparkles size={24} />}
              </div>
              <div className={`max-w-[75%] p-6 rounded-[2rem] shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none font-medium' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700 leading-relaxed text-lg'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-indigo-600 border border-slate-100 dark:border-slate-700 animate-pulse">
              <Sparkles size={24} />
            </div>
            <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-800 rounded-tl-none border border-slate-100 dark:border-slate-700">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
        <div className="relative">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your study patterns, mastery, or motivation..."
            className="w-full pl-8 pr-20 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all text-lg font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/40 disabled:opacity-50 active:scale-90"
          >
            <Send size={24} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
