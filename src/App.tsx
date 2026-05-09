/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  MessageSquare,
  Settings,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Practice from './components/Practice';
import { UserProgress } from './types';
import { getWordExplanation } from './services/gemini';

type NavTab = 'dashboard' | 'practice' | 'schedule' | 'tutor';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    streak: 3,
    completedExercises: []
  });
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Load progress from local storage
  useEffect(() => {
    const saved = localStorage.getItem('linguo_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const updateProgress = (exerciseId: string, xp: number) => {
    const newProgress = {
      ...progress,
      xp: progress.xp + xp,
      level: Math.floor((progress.xp + xp) / 100) + 1,
      completedExercises: [...progress.completedExercises, exerciseId]
    };
    setProgress(newProgress);
    localStorage.setItem('linguo_progress', JSON.stringify(newProgress));
  };

  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;

    setIsTutorLoading(true);
    setTutorResponse('');
    const resp = await getWordExplanation(tutorQuery);
    setTutorResponse(resp);
    setIsTutorLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar - Desktop */}
      <nav className="hidden lg:flex w-64 bg-white border-r border-neutral-200 flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Linguo</h1>
        </div>

        <div className="flex-1 space-y-2">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard />}
            label="Dashboard"
          />
          <NavItem 
            active={activeTab === 'practice'} 
            onClick={() => setActiveTab('practice')}
            icon={<BookOpen />}
            label="Practice"
          />
          <NavItem 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')}
            icon={<CalendarIcon />}
            label="Schedule"
          />
        </div>

        <div className="border-t border-neutral-100 pt-6">
          <NavItem 
            active={false} 
            onClick={() => setIsTutorOpen(true)}
            icon={<MessageSquare />}
            label="Ask AI Tutor"
          />
          <NavItem 
            active={false} 
            onClick={() => {}}
            icon={<Settings />}
            label="Settings"
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">
        <header className="flex lg:hidden items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary-600 w-6 h-6" />
            <span className="text-xl font-display font-bold">Linguo</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsTutorOpen(true)} className="p-2 text-neutral-500"><MessageSquare /></button>
            <button className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">L{progress.level}</button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Dashboard progress={progress} onStartPractice={() => setActiveTab('practice')} />
            </motion.div>
          )}
          {activeTab === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Practice onComplete={updateProgress} />
            </motion.div>
          )}
          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <h2 className="text-3xl font-display font-bold mb-4">Your Weekly Path</h2>
              <p className="text-neutral-500 max-w-md mx-auto">
                Check your dashboard to see today's focus and the weekly study plan. More detailed path coming soon!
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="btn-secondary mt-8"
              >
                Go back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Tutor Drawer */}
      <AnimatePresence>
        {isTutorOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTutorOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 border-bottom flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold">Linguo AI Tutor</h2>
                    <p className="text-xs text-neutral-500 italic">Expert word explanations</p>
                  </div>
                </div>
                <button onClick={() => setIsTutorOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <form onSubmit={handleTutorSubmit} className="space-y-4">
                  <label className="text-sm font-semibold text-neutral-700">What word would you like to explore?</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tutorQuery}
                      onChange={(e) => setTutorQuery(e.target.value)}
                      placeholder="e.g. Resilience, Ephemeral..."
                      className="input-field"
                    />
                    <button type="submit" className="btn-primary" disabled={isTutorLoading}>
                      Ask
                    </button>
                  </div>
                </form>

                {isTutorLoading && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full"
                    />
                    <p className="text-sm text-neutral-500 italic">Thinking...</p>
                  </div>
                )}

                {tutorResponse && !isTutorLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 whitespace-pre-wrap text-sm leading-relaxed"
                  >
                    {tutorResponse}
                  </motion.div>
                )}
              </div>

              <div className="p-6 bg-neutral-50 text-[10px] text-neutral-400 text-center">
                Powered by Gemini AI • Learn something new today
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 flex items-center justify-around z-40">
        <MobileNavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          icon={<LayoutDashboard />}
        />
        <MobileNavItem 
          active={activeTab === 'practice'} 
          onClick={() => setActiveTab('practice')}
          icon={<BookOpen />}
        />
        <MobileNavItem 
          active={activeTab === 'schedule'} 
          onClick={() => setActiveTab('schedule')}
          icon={<CalendarIcon />}
        />
      </nav>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        active 
          ? 'bg-primary-600 text-white shadow-md shadow-primary-100' 
          : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function MobileNavItem({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl transition-all ${
        active ? 'text-primary-600 bg-primary-50' : 'text-neutral-400'
      }`}
    >
      <span className="w-6 h-6">{icon}</span>
    </button>
  );
}

