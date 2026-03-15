'use client'

import Link from "next/link";
import { BookOpen, Calendar, Clock, MessageSquare, TrendingUp, Award, Zap, BrainCircuit, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-50 dark:bg-purple-900/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-12 py-8 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/50 dark:border-slate-800/50"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
            <BrainCircuit size={28} />
          </div>
          <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">StudyFlow</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">
            Neural Sync
          </Link>
          <Link href="/login" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-2xl hover:scale-105 active:scale-95">
            Initialize
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-8 py-32 text-center space-y-12 max-w-5xl mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-800 shadow-sm"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>AI-Driven Learning Intelligence System</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]"
          >
            Optimize Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Neural Assets.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight"
          >
            The elite management system that architects your study routine, quantifies your progress, and uses deep AI to predict cognitive mastery.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            <Link href="/login" className="group bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-3xl text-xl font-black transition-all shadow-[0_20px_50px_-15px_rgba(79,70,229,0.4)] flex items-center gap-3 hover:scale-105 active:scale-95">
              Launch Protocol
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-800 px-10 py-5 rounded-3xl text-xl font-black transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-xl">
              System Demo
            </Link>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="px-12 py-32 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard 
              icon={Calendar} 
              title="Smart Scheduler" 
              description="AI-generated routines optimized for cognitive load and deadlines."
              color="text-indigo-600"
              bg="bg-indigo-50 dark:bg-indigo-900/20"
              delay={0.4}
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Predictive Insights" 
              description="Quantify your exam readiness with real-time neural performance data."
              color="text-emerald-600"
              bg="bg-emerald-50 dark:bg-emerald-900/20"
              delay={0.5}
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Neural Assistant" 
              description="24/7 AI-tutor providing deep insights and motivational protocols."
              color="text-amber-600"
              bg="bg-amber-50 dark:bg-amber-900/20"
              delay={0.6}
            />
            <FeatureCard 
              icon={Clock} 
              title="Deep Focus" 
              description="Integrated Pomodoro cycles with streak-tracking and productivity scoring."
              color="text-rose-600"
              bg="bg-rose-50 dark:bg-rose-900/20"
              delay={0.7}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-12 py-16 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
          <BrainCircuit size={24} />
          <span className="text-xl font-black tracking-tighter">StudyFlow</span>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          © 2026 AI Smart Study Planner. Engineered for Academic Excellence.
        </p>
        <div className="flex gap-6 text-slate-400 font-black text-[10px] uppercase tracking-widest">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Protocol</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, bg, delay }: any) {
  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all group"
    >
      <div className={`p-5 rounded-[2rem] w-fit mb-8 transition-transform group-hover:scale-110 shadow-inner ${bg} ${color}`}>
        <Icon size={36} />
      </div>
      <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
