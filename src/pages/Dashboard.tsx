import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, Plus, ArrowRight, Flame, Trophy, Target } from 'lucide-react';
import { getWordOfTheDay } from '../lib/gemini';
import { Word, UserStats } from '../types';

export default function Dashboard() {
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  
  const stats: UserStats = {
    streak: 12,
    wordsMastered: 420,
    totalXp: 1200,
    dailyProgress: 75
  };

  useEffect(() => {
    async function fetchWord() {
      try {
        const w = await getWordOfTheDay();
        setWord(w);
      } catch (error) {
        console.error("Failed to fetch word:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWord();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Left Column: Word focus */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <section className="glass-card p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
          <div className="absolute top-6 right-6 z-10">
            <span className="px-4 py-2 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Word of the Day
            </span>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col justify-center gap-4 animate-pulse">
              <div className="h-16 w-3/4 bg-slate-100 rounded-2xl"></div>
              <div className="h-6 w-1/4 bg-slate-100 rounded-lg"></div>
              <div className="h-24 w-full bg-slate-100 rounded-3xl mt-6"></div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="z-10"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 font-display">{word?.term}</h1>
              <p className="text-xl text-slate-500 font-medium italic mb-6">{word?.phonetic}</p>
              
              <div className="flex gap-3 mb-8">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-md">{word?.partOfSpeech}</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-md">{word?.difficulty}</span>
              </div>
              
              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed max-w-2xl mb-4">
                "{word?.definition}"
              </p>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                <p className="text-sm text-slate-400 uppercase font-black tracking-wider mb-2">Example</p>
                <p className="text-slate-600 italic">"{word?.example}"</p>
              </div>

              <div className="flex flex-wrap gap-4 mt-auto">
                <button className="btn-primary flex items-center gap-2">
                  <Plus size={20} /> Add to Library
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <Volume2 size={20} /> Pronunciation
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Decorative background elements */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-20 -left-10 w-40 h-40 bg-amber-50 rounded-full blur-2xl opacity-30"></div>
        </section>

        {/* Recent Learning */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentWordCard term="Serendipity" definition="Kebetulan yang menyenangkan" initial="S" color="bg-emerald-100 text-emerald-600" />
          <RecentWordCard term="Ambiguity" definition="Ketidakjelasan makna" initial="A" color="bg-blue-100 text-blue-600" />
          <RecentWordCard term="Pragmatic" definition="Berpikir praktis" initial="P" color="bg-purple-100 text-purple-600" />
          <RecentWordCard term="Resilient" definition="Tangguh / Cepat pulih" initial="R" color="bg-rose-100 text-rose-600" />
        </section>
      </div>

      {/* Right Column: Progress & Quizzes */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        {/* Stats Card */}
        <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-10 z-10 relative">
            <div>
              <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wider mb-1">Learning Streak</p>
              <h2 className="text-4xl font-bold flex items-center gap-2">
                {stats.streak} Days <Flame className="text-amber-400 fill-amber-400" size={32} />
              </h2>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Trophy className="text-indigo-200" size={24} />
            </div>
          </div>
          
          <div className="space-y-6 z-10 relative">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-indigo-200">Daily Goal (15/20)</span>
                <span>{stats.dailyProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-indigo-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.dailyProgress}%` }}
                  className="h-full bg-indigo-400 rounded-full shadow-lg shadow-indigo-500/20"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-2xl font-bold">{stats.wordsMastered}</p>
                <p className="text-xs text-indigo-300 uppercase font-bold tracking-tight">Words Mastered</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-2xl font-bold">{(stats.totalXp / 1000).toFixed(1)}k</p>
                <p className="text-xs text-indigo-300 uppercase font-bold tracking-tight">Total XP</p>
              </div>
            </div>
          </div>
          
          {/* Abstract circles */}
          <div className="absolute top-1/2 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl"></div>
        </div>

        {/* Weekly Challenge */}
        <div className="flex-1 glass-card p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-indigo-600" size={20} />
            <h3 className="text-xl font-bold text-slate-800">Weekly Challenge</h3>
          </div>
          <p className="text-slate-500 text-sm mb-6">Master the last 50 words you've added to your library.</p>
          
          <div className="flex-1 flex flex-col gap-4">
            <ChallengeItem id="1" label="Synonyms Match" active />
            <ChallengeItem id="2" label="Context Clues" />
            <ChallengeItem id="3" label="Spelling Master" />
          </div>

          <button className="w-full py-4 mt-8 bg-slate-100 text-slate-800 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
            Start Challenge <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RecentWordCard({ term, definition, initial, color }: { term: string; definition: string; initial: string; color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-110", color)}>
          {initial}
        </div>
        <div>
          <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{term}</p>
          <p className="text-sm text-slate-400">{definition}</p>
        </div>
      </div>
      <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-all scale-100 group-hover:scale-125"></div>
    </motion.div>
  );
}

function ChallengeItem({ id, label, active }: { id: string; label: string; active?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border flex items-center gap-4 transition-all",
      active ? "bg-indigo-50 border-indigo-100 shadow-sm" : "bg-white border-slate-100 opacity-60"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
        active ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
      )}>
        {id}
      </div>
      <span className={cn("font-medium", active ? "text-slate-800" : "text-slate-400")}>
        {label}
      </span>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
