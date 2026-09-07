import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, Layers } from 'lucide-react';
import { LANGUAGES } from '../data/languages.ts';
import { LanguageId, DifficultyLevel } from '../types.ts';

interface LanguagesExplorerProps {
  onStartQuiz: (languages: LanguageId[], difficulty: DifficultyLevel) => void;
}

export const LanguagesExplorer: React.FC<LanguagesExplorerProps> = ({ onStartQuiz }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('intermediate');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Programming Languages
        </h1>
        <p className="text-sm text-slate-400 font-sans leading-relaxed">
          Select any language to launch a targeted 10-question test on memory semantics, concurrency, scoping, and internal runtime behavior.
        </p>

        {/* Global difficulty switcher */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="px-2 text-slate-500">Difficulty:</span>
          {(['basic', 'intermediate', 'advanced', 'adaptive'] as DifficultyLevel[]).map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                selectedDifficulty === diff
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LANGUAGES.map(lang => (
          <div
            key={lang.id}
            className="rounded-2xl p-6 bg-[#0e1522] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg group"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{lang.icon}</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  10 Qs • {selectedDifficulty}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {lang.name}
              </h3>
              <p className="text-xs font-medium text-slate-300 mb-2">{lang.tagline}</p>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{lang.description}</p>

              {/* Popular Concepts Tags */}
              <div className="space-y-1.5 mb-6">
                <div className="text-[11px] font-mono text-slate-500">Tested Concepts:</div>
                <div className="flex flex-wrap gap-1.5">
                  {lang.popularConcepts.map((concept, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch button */}
            <button
              onClick={() => onStartQuiz([lang.id], selectedDifficulty)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold text-xs font-mono transition-all border border-slate-800 hover:border-cyan-400"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch {lang.name} Quiz</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
