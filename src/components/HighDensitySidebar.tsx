import React from 'react';
import { UserStats } from '../types.ts';

interface HighDensitySidebarProps {
  stats: UserStats;
  onNavigateToBadges?: () => void;
}

export const HighDensitySidebar: React.FC<HighDensitySidebarProps> = () => {
  return (
    <aside className="w-full lg:w-[300px] flex-shrink-0 bg-[#0F172A] p-5 border-t lg:border-t-0 lg:border-l border-[#334155] flex flex-col gap-5">
      <div className="flex-1 min-h-4"></div>

      {/* Developer Tip Dashed Card */}
      <div className="bg-[#0F172A] border border-dashed border-[#334155] rounded-lg p-3">
        <div className="stats-label text-[#38BDF8] mb-1">Developer Tip</div>
        <p className="text-[11px] leading-relaxed text-[#94A3B8]">
          Did you know? Using the &apos;Why did I get this wrong?&apos; deep breakdown unlocks the &apos;Concept Master&apos; badge.
        </p>
      </div>
    </aside>
  );
};
