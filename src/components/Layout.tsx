import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap, Users, Bell, Flame } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Linguo</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/library" icon={<BookOpen size={18} />} label="Library" />
          <NavItem to="/quizzes" icon={<GraduationCap size={18} />} label="Quizzes" />
          <NavItem to="/reminders" icon={<Bell size={18} />} label="Schedule" />
          <NavItem to="/community" icon={<Users size={18} />} label="Community" />
          
          <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold ml-4">
            RJ
          </div>
        </div>
        
        {/* Mobile Nav Trigger (Simple version) */}
        <div className="md:hidden">
          <button className="p-2 text-slate-500 hover:text-slate-800 transition-colors">
            <NavItem to="/reminders" icon={<Bell size={20} />} label="" />
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 text-sm font-medium transition-all px-3 py-2 rounded-lg",
          isActive 
            ? "text-indigo-600 bg-indigo-50" 
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        )
      }
    >
      {icon}
      {label && <span>{label}</span>}
    </NavLink>
  );
}
