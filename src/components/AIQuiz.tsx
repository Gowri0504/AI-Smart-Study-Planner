'use client'

import { useState, useEffect } from "react";
import { Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AIQuiz({ topic, onComplete }: { topic: string; onComplete?: (score: number, total: number) => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/quiz?query=${encodeURIComponent(topic)}`);
      const data = await res.json();
      setQuestions(data.questions || []);
      setStarted(true);
      setCurrentIndex(0);
      setScore(0);
      setQuizFinished(false);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } catch (error) {
      console.error("Failed to load quiz", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (onComplete) onComplete(score + (selectedAnswer === questions[currentIndex].correctAnswer ? 1 : 0), questions.length);
    }
  };

  if (!started && !loading) {
    return (
      <div className="mt-8 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-lg text-indigo-600">
          <Brain size={32} />
        </div>
        <h3 className="text-2xl font-black mb-2 text-slate-800 dark:text-white">AI Knowledge Check</h3>
        <p className="text-slate-500 mb-6 max-w-sm">Test your mastery of <span className="font-bold text-indigo-600">"{topic}"</span> with an auto-generated micro-quiz.</p>
        <button 
          onClick={startQuiz}
          className="px-8 py-4 px bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          Initialize Quiz
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8 py-12 flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="font-black text-slate-500 tracking-widest uppercase text-sm animate-pulse">Generating neural pathways...</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center"
      >
        <div className="text-6xl mb-6">{score === questions.length ? '🏆' : score > 0 ? '👍' : '📚'}</div>
        <h3 className="text-3xl font-black mb-2">Quiz Complete!</h3>
        <p className="text-slate-500 text-lg mb-8">You scored <span className="font-black text-indigo-600 text-2xl">{score}</span> out of {questions.length}</p>
        <div className="flex gap-4 justify-center">
          <button onClick={startQuiz} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
            <RotateCcw size={18} /> Retry
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="mt-8 p-6 md:p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center font-black">
            {currentIndex + 1}
          </div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">Score: {score}</div>
      </div>

      <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white leading-relaxed">{currentQ.question}</h3>

      <div className="space-y-4 mb-8">
        <AnimatePresence>
          {currentQ.options.map((option: string, idx: number) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQ.correctAnswer;
            
            let btnClass = "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200";
            
            if (isAnswered) {
              if (isCorrect) btnClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400";
              else if (isSelected) btnClass = "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-700 dark:text-rose-400";
              else btnClass = "bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 opacity-50";
            } else if (isSelected) {
              btnClass = "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700";
            }

            return (
              <motion.button
                key={option}
                onClick={() => handleAnswerSubmit(option)}
                disabled={isAnswered}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-semibold flex items-center justify-between group ${btnClass}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-500" size={24} />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="text-rose-500" size={24} />}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl mb-8 text-indigo-800 dark:text-indigo-300 font-medium"
        >
          <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">Explanation:</span>
          {currentQ.explanation}
        </motion.div>
      )}

      {isAnswered && (
        <div className="flex justify-end">
          <button 
            onClick={nextQuestion}
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"} <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
