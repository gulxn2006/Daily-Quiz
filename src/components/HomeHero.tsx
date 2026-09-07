import React, { useState } from 'react';
import { Play, Sparkles, Zap, ShieldCheck, ArrowRight, Layers, Shuffle, Terminal, ChevronDown } from 'lucide-react';
import { LANGUAGES, PRESET_MIXED_MODES } from '../data/languages.ts';
import { LanguageId, DifficultyLevel } from '../types.ts';

interface HomeHeroProps {
  onStartQuiz: (languages: LanguageId[], difficulty: DifficultyLevel) => void;
  onExploreLanguages: () => void;
  onOpenCustomMix: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartQuiz,
  onExploreLanguages,
  onOpenCustomMix,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('intermediate');
  const [selectedSingleLanguage, setSelectedSingleLanguage] = useState<LanguageId>('python');

  return (
    <div className="space-y-6">
      {/* High Density Hero Section */}
      <div className="relative rounded-xl border border-[#334155] p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
        <div className="relative z-10 max-w-xl">
          <div className="stats-label text-[#38BDF8] mb-2 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
            <span>Challenge of the day • zero_trace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#F8FAFC] tracking-[-1.5px] leading-tight mb-2">
            LEVEL UP YOUR<br />
            CODING SKILLS
          </h1>

          <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-md">
            Adaptive difficulty and fresh questions generated for every session. Zero duplicate questions, just pure conceptual learning.
          </p>

          <div className="space-y-3.5">
            {/* Individual Single Language Quiz Field */}
            <div className="bg-[#0F172A]/90 border border-[#334155] rounded-lg p-3 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#38BDF8] flex items-center gap-1.5 font-semibold">
                  <Terminal className="w-3.5 h-3.5" />
                  Individual Language Quiz
                </span>
                <span className="text-[#94A3B8] text-[11px]">Select 1 language to start</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedSingleLanguage}
                    onChange={(e) => setSelectedSingleLanguage(e.target.value as LanguageId)}
                    className="w-full appearance-none bg-[#1E293B] border border-[#334155] hover:border-[#38BDF8]/60 focus:border-[#38BDF8] text-[#F8FAFC] text-xs sm:text-sm font-mono rounded-md px-3 py-2 pr-8 outline-none cursor-pointer transition-colors"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id} className="bg-[#1E293B] text-[#F8FAFC]">
                        {lang.icon} {lang.name} Quiz ({lang.popularConcepts.length} concepts)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  onClick={() => onStartQuiz([selectedSingleLanguage], selectedDifficulty)}
                  className="px-4 py-2 rounded-md bg-[#38BDF8] hover:bg-sky-300 text-[#0F172A] font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start {LANGUAGES.find(l => l.id === selectedSingleLanguage)?.name || 'Language'} Quiz</span>
                </button>
              </div>

              {/* Quick Language Select Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#334155]/60">
                <span className="text-[10px] font-mono text-[#64748B] mr-0.5">Quick pick:</span>
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedSingleLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedSingleLanguage(lang.id)}
                      onDoubleClick={() => onStartQuiz([lang.id], selectedDifficulty)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#38BDF8]/20 border border-[#38BDF8] text-[#38BDF8] font-bold'
                          : 'bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-slate-500'
                      }`}
                      title={`Select ${lang.name} (Double-click to start immediately)`}
                    >
                      <span>{lang.icon}</span>
                      <span>{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Mixed Quiz & Custom Options */}
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              <button
                onClick={() => onStartQuiz(['python', 'javascript', 'java'], selectedDifficulty)}
                className="px-3.5 py-2 rounded-md bg-transparent hover:bg-[#1E293B] border border-[#334155] text-[#F8FAFC] font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Start Mixed Quiz</span>
              </button>

              <button
                onClick={onOpenCustomMix}
                className="px-3.5 py-2 rounded-md bg-transparent hover:bg-[#1E293B] border border-[#334155] text-[#F8FAFC] font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Custom Mix</span>
              </button>

              <button
                onClick={onExploreLanguages}
                className="px-3 py-2 rounded-md text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View All 10 Languages</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Monospace Code Watermark */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-[90px] text-white opacity-[0.04] font-black select-none pointer-events-none hidden sm:block">
          {'{...}'}
        </div>
      </div>

      {/* Difficulty Level Selection Strip */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="stats-label text-[#F8FAFC]">Difficulty Tier</h3>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">10 Questions Per Quiz Session</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Basic */}
          <button
            onClick={() => setSelectedDifficulty('basic')}
            className={`p-3 rounded-lg text-left border transition-all ${
              selectedDifficulty === 'basic'
                ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981]'
                : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono text-[#10B981]">Basic</span>
              {selectedDifficulty === 'basic' && <span className="text-[10px] font-mono">Active</span>}
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-tight">Syntax, variables, conditions & loops</p>
          </button>

          {/* Intermediate */}
          <button
            onClick={() => setSelectedDifficulty('intermediate')}
            className={`p-3 rounded-lg text-left border transition-all ${
              selectedDifficulty === 'intermediate'
                ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono text-amber-400">Intermediate</span>
              {selectedDifficulty === 'intermediate' && <span className="text-[10px] font-mono">Active</span>}
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-tight">OOP, collections, closures & exceptions</p>
          </button>

          {/* Advanced */}
          <button
            onClick={() => setSelectedDifficulty('advanced')}
            className={`p-3 rounded-lg text-left border transition-all ${
              selectedDifficulty === 'advanced'
                ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono text-rose-400">Advanced</span>
              {selectedDifficulty === 'advanced' && <span className="text-[10px] font-mono">Active</span>}
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-tight">Memory, async, concurrency & internals</p>
          </button>

          {/* Adaptive */}
          <button
            onClick={() => setSelectedDifficulty('adaptive')}
            className={`p-3 rounded-lg text-left border transition-all ${
              selectedDifficulty === 'adaptive'
                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-purple-300'
                : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono text-[#8B5CF6] flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Adaptive
              </span>
              {selectedDifficulty === 'adaptive' && <span className="text-[10px] font-mono">Active</span>}
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-tight">Dynamic leveling based on live accuracy</p>
          </button>
        </div>
      </div>

      {/* Explore Languages - High Density Grid Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="stats-label text-[#94A3B8]">Explore Languages</h2>
          <span className="text-[11px] font-mono text-[#38BDF8] cursor-pointer hover:underline" onClick={onExploreLanguages}>
            View All 10 →
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Python Card */}
          <div
            onClick={() => onStartQuiz(['python'], selectedDifficulty)}
            className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 hover:border-[#38BDF8] transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-[#3776AB] text-white flex items-center justify-center font-bold font-mono text-xs shadow-sm">
                  PY
                </div>
                <div className="text-[11px] px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono font-medium">
                  Basic
                </div>
              </div>
              <div className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                Python Core
              </div>
              <div className="text-[12px] text-[#94A3B8] my-1.5 leading-snug">
                Master mutability, decorators & generators.
              </div>
            </div>
            <div className="stats-label pt-2 border-t border-[#334155]/60 flex items-center justify-between">
              <span>Success Rate: 92%</span>
              <span className="text-[#38BDF8] font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">Launch →</span>
            </div>
          </div>

          {/* JavaScript Card */}
          <div
            onClick={() => onStartQuiz(['javascript'], selectedDifficulty)}
            className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 hover:border-[#38BDF8] transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-[#F7DF1E] text-slate-900 flex items-center justify-center font-bold font-mono text-xs shadow-sm">
                  JS
                </div>
                <div className="text-[11px] px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] font-mono font-medium">
                  Expert
                </div>
              </div>
              <div className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                JavaScript Async
              </div>
              <div className="text-[12px] text-[#94A3B8] my-1.5 leading-snug">
                Promises, Event Loop & Closures.
              </div>
            </div>
            <div className="stats-label pt-2 border-t border-[#334155]/60 flex items-center justify-between">
              <span>Success Rate: 64%</span>
              <span className="text-[#38BDF8] font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">Launch →</span>
            </div>
          </div>

          {/* Mixed Challenge Card (Highlighted) */}
          <div
            onClick={() => onStartQuiz(['python', 'javascript', 'rust', 'go'], selectedDifficulty)}
            className="bg-[#1E293B] border border-[#8B5CF6] rounded-lg p-4 hover:border-[#38BDF8] transition-colors cursor-pointer group flex flex-col justify-between relative overflow-hidden bg-opacity-90"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] text-white flex items-center justify-center font-bold font-mono text-xs shadow-sm">
                  MX
                </div>
                <div className="text-[11px] px-2 py-0.5 rounded bg-[#8B5CF6] text-white font-mono font-medium">
                  Multi
                </div>
              </div>
              <div className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                Mixed Challenge
              </div>
              <div className="text-[12px] text-[#94A3B8] my-1.5 leading-snug">
                Py + JS + Go + Rust random mix.
              </div>
            </div>
            <div className="stats-label pt-2 border-t border-[#334155]/60 flex items-center justify-between">
              <span className="text-[#38BDF8]">10 Questions • Fresh Set</span>
              <span className="text-[#8B5CF6] font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">Launch →</span>
            </div>
          </div>

          {/* Java OOP Card */}
          <div
            onClick={() => onStartQuiz(['java'], selectedDifficulty)}
            className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 hover:border-[#38BDF8] transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-[#007396] text-white flex items-center justify-center font-bold font-mono text-xs shadow-sm">
                  JV
                </div>
                <div className="text-[11px] px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono font-medium">
                  Basic
                </div>
              </div>
              <div className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                Java OOP
              </div>
              <div className="text-[12px] text-[#94A3B8] my-1.5 leading-snug">
                Inheritance, JVM & Streams.
              </div>
            </div>
            <div className="stats-label pt-2 border-t border-[#334155]/60 flex items-center justify-between">
              <span>Success Rate: 88%</span>
              <span className="text-[#38BDF8] font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">Launch →</span>
            </div>
          </div>

          {/* TypeScript Card */}
          <div
            onClick={() => onStartQuiz(['typescript'], selectedDifficulty)}
            className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 hover:border-[#38BDF8] transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-[#3178C6] text-white flex items-center justify-center font-bold font-mono text-xs shadow-sm">
                  TS
                </div>
                <div className="text-[11px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-medium">
                  Intermediate
                </div>
              </div>
              <div className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                TypeScript Types
              </div>
              <div className="text-[12px] text-[#94A3B8] my-1.5 leading-snug">
                Generics, Unions & Type Guards.
              </div>
            </div>
            <div className="stats-label pt-2 border-t border-[#334155]/60 flex items-center justify-between">
              <span>Success Rate: 72%</span>
              <span className="text-[#38BDF8] font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">Launch →</span>
            </div>
          </div>

          {/* C++ Card */}
          <div
            onClick={() => onStartQuiz(['cpp'], selectedDifficulty)}
            className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 hover:border-[#38BDF8] transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-[#00599C] text-white flex items-center justify-center font-bold font-mono text-xs shadow-sm">
                  C+
                </div>
                <div className="text-[11px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-medium">
                  Intermediate
                </div>
              </div>
              <div className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                C++ Algorithms
              </div>
              <div className="text-[12px] text-[#94A3B8] my-1.5 leading-snug">
                STL, Pointers & Memory Mgmt.
              </div>
            </div>
            <div className="stats-label pt-2 border-t border-[#334155]/60 flex items-center justify-between">
              <span>Success Rate: 45%</span>
              <span className="text-[#38BDF8] font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">Launch →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Mixed Modes Section */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
        <h3 className="stats-label text-[#F8FAFC] mb-3">More Polyglot Combos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_MIXED_MODES.map(preset => (
            <div
              key={preset.id}
              onClick={() => onStartQuiz(preset.languages, selectedDifficulty)}
              className="p-3 rounded-lg bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-base">{preset.icon}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1E293B] text-[#94A3B8]">
                  {preset.badge}
                </span>
              </div>
              <h4 className="font-bold text-[#F8FAFC] text-xs mb-0.5">{preset.title}</h4>
              <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">{preset.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Engine Guarantee Box */}
      <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#38BDF8] flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#F8FAFC] font-mono">
              Deterministic Hash Tracking • Zero Repetition
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              Each session samples procedural variants across values, AST constructs, and formats.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#1E293B] border border-[#334155] text-[#10B981]">
            0.0% Dupes
          </span>
          <span className="px-2.5 py-1 rounded bg-[#1E293B] border border-[#334155] text-[#38BDF8]">
            10 Languages
          </span>
        </div>
      </div>
    </div>
  );
};

