import { motion } from 'motion/react';
import { Bell, Calendar, Clock, BookMarked, ToggleRight, ToggleLeft } from 'lucide-react';
import { useState } from 'react';

export default function Reminders() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const plan = [
    { day: 'Monday', time: '08:00 AM', topic: 'Professional & Business', description: 'Terms related to networking, meetings, and office communication.' },
    { day: 'Tuesday', time: '12:30 PM', topic: 'Academic & Formal', description: 'Advanced verbs and connectors for essay writing.' },
    { day: 'Wednesday', time: '07:00 PM', topic: 'Technology & Digital', description: 'Software development, AI, and digital marketing vocabulary.' },
    { day: 'Thursday', time: '08:00 AM', topic: 'Travel & Culture', description: 'Phrases for booking, navigating, and cultural etiquette.' },
    { day: 'Friday', time: '05:00 PM', topic: 'Emotions & Nuance', description: 'Subtle adjectives for describing feelings and character traits.' },
    { day: 'Saturday', time: '10:00 AM', topic: 'Idioms & Slang', description: 'Common conversational expressions and phrasal verbs.' },
    { day: 'Sunday', time: '04:00 PM', topic: 'Weekly Review', description: 'Reinforce the words learned throughout the week.' }
  ];

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Study Schedule</h1>
          <p className="text-slate-500">Your personalized daily roadmap to fluency.</p>
        </div>
        <button 
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-medium text-slate-700"
        >
          {notificationsEnabled ? <ToggleRight className="text-indigo-600" /> : <ToggleLeft className="text-slate-300" />}
          <span>Notifications</span>
        </button>
      </div>

      <div className="space-y-6">
        {plan.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={item.day}
            className="glass-card p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-indigo-200 transition-all hover:bg-white"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex flex-col items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <span className="text-xs font-black text-slate-400 group-hover:text-indigo-400 uppercase tracking-tighter">{item.day.slice(0, 3)}</span>
              <Calendar size={20} className="text-slate-400 group-hover:text-indigo-500" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-slate-800">{item.topic}</h3>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-wider">Plan</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 pr-4 border-l md:border-l-0 md:border-r border-slate-100 md:pr-6">
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                <Clock size={16} />
                <span>{item.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Bell size={14} />
                <span>Smart Alert</span>
              </div>
            </div>

            <button className="md:ml-2 p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
              <BookMarked size={20} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-indigo-900 rounded-[32px] text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Pro Tip</h3>
          <p className="text-indigo-200 leading-relaxed max-w-xl">
            "Spaced Repetition is the most effective way to learn vocabulary. Research suggests reviewing new words 
            at increasing intervals (1 day, 3 days, 1 week) to permanently embed them in your long-term memory."
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
