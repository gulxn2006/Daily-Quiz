import React from 'react';
import { Trophy, Award, CheckCircle, BarChart3, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { UserStats } from '../types.ts';
import { ALL_BADGES } from '../data/badges.ts';
import { LANGUAGES } from '../data/languages.ts';

interface DashboardViewProps {
  stats: UserStats;
  onStartQuiz: () => void;
  userName?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, onStartQuiz, userName = 'Coder' }) => {
  const getCodingTier = (percent: number, quizzes: number) => {
    if (quizzes === 0 || percent === 0) return 'Novice Tier';
    if (percent < 30) return 'Junior Developer Tier';
    if (percent < 60) return 'Intermediate Developer Tier';
    if (percent < 85) return 'Senior Developer Tier';
    return 'Staff Developer Tier';
  };

  const isBadgeUnlocked = (badgeId: string) => {
    switch (badgeId) {
      case 'first-quiz':
        return stats.totalQuizzes >= 1;
      case 'ten-quizzes':
        return stats.totalQuizzes >= 10;
      case 'fifty-quizzes':
        return stats.totalQuizzes >= 50;
      case 'speed-coder':
        return stats.totalQuizzes >= 1 && (stats.recentSessions || []).some(s => s.timeSpentSeconds <= 240 && s.accuracy >= 80);
      case 'concept-master':
        return stats.totalQuizzes >= 1 && stats.bestScore === 100;
      case 'hard-mode-survivor':
        return stats.totalQuizzes >= 1 && (stats.recentSessions || []).some(s => (s.difficulty === 'advanced' || s.difficulty === 'adaptive') && s.accuracy >= 80);
      case 'perfect-score':
        return stats.bestScore === 100 && stats.totalQuizzes >= 1;
      case 'python-master':
        return (stats.languageMastery?.python || 0) >= 90 && (stats.languageStats?.python?.solved || 0) >= 10;
      case 'java-master':
        return (stats.languageMastery?.java || 0) >= 70 && (stats.languageStats?.java?.solved || 0) >= 10;
      case 'javascript-master':
        return (stats.languageMastery?.javascript || 0) >= 80 && (stats.languageStats?.javascript?.solved || 0) >= 10;
      default:
        return false;
    }
  };

  const unlockedBadgesCount = ALL_BADGES.filter(b => isBadgeUnlocked(b.id)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 md:p-7 rounded-xl bg-[#1E293B] border border-[#334155] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F172A] border border-[#334155] text-[#38BDF8] text-xs font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>zero_trace Verified Coder</span>
            </div>
            <h1 className="text-2xl font-bold text-[#F8FAFC] mb-1">
              Welcome back, {userName || 'Coder'}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] font-sans">
              Keep sharpening your mental models. Your questions are customized to eliminate concept gaps.
            </p>
          </div>
        </div>

        {/* Coding Level Bar */}
        <div className="mt-6 pt-5 border-t border-[#334155]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#94A3B8] font-medium">Coding Level</span>
            <span className="text-[#38BDF8] font-bold">
              {stats.codingLevelPercent}% ({getCodingTier(stats.codingLevelPercent, stats.totalQuizzes)})
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-[#0F172A] border border-[#334155] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#38BDF8] transition-all duration-1000"
              style={{ width: `${stats.codingLevelPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Quizzes */}
        <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center">
          <div className="stats-label text-[#94A3B8] mb-1">Total Quizzes</div>
          <div className="text-3xl font-extrabold text-[#F8FAFC] font-mono">{stats.totalQuizzes}</div>
          <div className="text-[11px] text-[#94A3B8] mt-1">{stats.totalQuizzes === 0 ? '0 completed' : `${stats.totalQuizzes} completed`}</div>
        </div>

        {/* Questions Solved */}
        <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center">
          <div className="stats-label text-[#94A3B8] mb-1">Questions Solved</div>
          <div className="text-3xl font-extrabold text-[#38BDF8] font-mono">{stats.questionsSolved}</div>
          <div className="text-[11px] text-[#94A3B8] mt-1">{stats.questionsSolved === 0 ? '0 attempted' : '0 duplicate questions'}</div>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center">
          <div className="stats-label text-[#94A3B8] mb-1">Overall Accuracy</div>
          <div className="text-3xl font-extrabold text-[#10B981] font-mono">{stats.accuracy}%</div>
          <div className="text-[11px] text-[#94A3B8] mt-1">{stats.totalQuizzes === 0 ? '0% initial score' : 'Across all languages'}</div>
        </div>

        {/* Best Score */}
        <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center">
          <div className="stats-label text-[#94A3B8] mb-1">Best Score</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{stats.bestScore}%</div>
          <div className="text-[11px] text-[#94A3B8] mt-1">{stats.bestScore === 0 ? '0% initial record' : stats.bestScore === 100 ? 'Flawless 10/10 attempt' : `${stats.bestScore}% top score`}</div>
        </div>
      </div>

      {/* Languages Mastery Progress */}
      <div className="p-6 rounded-xl bg-[#1E293B] border border-[#334155] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F8FAFC] font-mono flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#38BDF8]" />
            <span>Language Mastery Ratings</span>
          </h2>
          <span className="text-xs text-[#94A3B8] font-mono">Weighted by real-time test scores</span>
        </div>

        <div className="space-y-3">
          {[
            { id: 'python', name: 'Python', icon: '🐍', barColor: 'bg-[#38BDF8]' },
            { id: 'javascript', name: 'JavaScript', icon: '⚡', barColor: 'bg-amber-400' },
            { id: 'java', name: 'Java', icon: '☕', barColor: 'bg-[#8B5CF6]' },
            { id: 'cpp', name: 'C++', icon: '⚡', barColor: 'bg-sky-400' },
            { id: 'typescript', name: 'TypeScript', icon: '🟦', barColor: 'bg-indigo-400' },
            { id: 'rust', name: 'Rust', icon: '🦀', barColor: 'bg-rose-500' },
          ].map(lang => {
            const percent = stats.languageMastery?.[lang.id] ?? 0;
            const langStat = stats.languageStats?.[lang.id];
            return (
              <div key={lang.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#F8FAFC]">
                    <span>{lang.icon}</span>
                    <span className="font-semibold">{lang.name}</span>
                    {langStat && langStat.solved > 0 && (
                      <span className="text-[10px] text-[#94A3B8] font-normal">
                        ({langStat.correct}/{langStat.solved} correct)
                      </span>
                    )}
                  </div>
                  <span className="text-[#94A3B8] font-bold">{percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0F172A] overflow-hidden border border-[#334155]">
                  <div
                    className={`h-full rounded-full ${lang.barColor} transition-all duration-700`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification: Badges Collection */}
      <div className="p-6 rounded-xl bg-[#1E293B] border border-[#334155] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] font-mono flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Earned Achievements & Badges</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">Unlock badges by conquering diverse quizzes and high accuracy.</p>
          </div>
          <div className="text-xs font-mono text-[#38BDF8] bg-[#0F172A] px-3 py-1 rounded-md border border-[#334155]">
            {unlockedBadgesCount} / {ALL_BADGES.length} Unlocked
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ALL_BADGES.map(badge => {
            const unlocked = isBadgeUnlocked(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-lg border flex flex-col justify-between transition-all ${
                  unlocked
                    ? 'bg-[#0F172A] border-[#334155] hover:border-[#38BDF8]'
                    : 'bg-[#0F172A]/40 border-[#334155]/40 opacity-40 grayscale'
                }`}
              >
                <div>
                  <div className="text-2xl mb-1.5">{badge.icon}</div>
                  <h4 className="text-xs font-bold text-[#F8FAFC] font-mono mb-1">{badge.title}</h4>
                  <p className="text-[11px] text-[#94A3B8] leading-snug">{badge.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#334155] flex items-center justify-between text-[10px] font-mono">
                  <span className={`uppercase font-semibold ${
                    badge.tier === 'gold' ? 'text-amber-400' : badge.tier === 'silver' ? 'text-slate-300' : 'text-[#8B5CF6]'
                  }`}>
                    {badge.tier}
                  </span>
                  {unlocked ? (
                    <span className="text-[#10B981] flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[#94A3B8]">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
