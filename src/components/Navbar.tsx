import React from 'react';
import { Terminal, Award, Globe, PlayCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'quiz' | 'languages' | 'dashboard' | 'admin';
  setCurrentTab: (tab: 'home' | 'quiz' | 'languages' | 'dashboard' | 'admin') => void;
  streak?: number;
  userName?: string;
  onEditName?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, userName = 'Developer', onEditName }) => {
  const getInitials = (name: string) => {
    if (!name) return 'D';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  return (
    <header className="sticky top-0 z-50 h-16 bg-[#0F172A]/90 backdrop-blur-md border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Brand identity */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-[#1E293B] border border-[#334155] flex items-center justify-center group-hover:border-[#38BDF8] transition-colors">
            <Terminal className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[20px] tracking-tight text-[#38BDF8]">
              zero_trace
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
              v2.0
            </span>
          </div>
        </div>

        {/* Navigation links with High Density active border */}
        <nav className="hidden md:flex items-center gap-6 h-full">
          <button
            onClick={() => setCurrentTab('home')}
            className={`h-full flex items-center gap-1.5 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              currentTab === 'home' || currentTab === 'quiz'
                ? 'text-[#F8FAFC] border-[#38BDF8]'
                : 'text-[#94A3B8] border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('languages')}
            className={`h-full flex items-center gap-1.5 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              currentTab === 'languages'
                ? 'text-[#F8FAFC] border-[#38BDF8]'
                : 'text-[#94A3B8] border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Languages</span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`h-full flex items-center gap-1.5 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'text-[#F8FAFC] border-[#38BDF8]'
                : 'text-[#94A3B8] border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
        </nav>

        {/* Right side: High Density Profile Chip */}
        <div className="flex items-center gap-3">
          {/* High Density User Profile */}
          <div
            onClick={() => {
              if (onEditName) {
                onEditName();
              } else {
                setCurrentTab('dashboard');
              }
            }}
            title="Click to edit profile name"
            className="flex items-center gap-3 cursor-pointer pl-1 group"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                {userName}
              </div>
              <div className="text-[10px] text-[#10B981] flex items-center justify-end gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>Online</span>
              </div>
            </div>
            <div className="w-9 h-9 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-[#334155] group-hover:ring-[#38BDF8] transition-all">
              {getInitials(userName)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
