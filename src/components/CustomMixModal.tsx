import React, { useState } from 'react';
import { X, Shuffle, Check, Play } from 'lucide-react';
import { LANGUAGES } from '../data/languages.ts';
import { LanguageId, DifficultyLevel } from '../types.ts';

interface CustomMixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (languages: LanguageId[], difficulty: DifficultyLevel) => void;
}

export const CustomMixModal: React.FC<CustomMixModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
}) => {
  const [selectedLangs, setSelectedLangs] = useState<LanguageId[]>(['python', 'javascript']);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');

  if (!isOpen) return null;

  const toggleLang = (id: LanguageId) => {
    if (selectedLangs.includes(id)) {
      if (selectedLangs.length > 1) {
        setSelectedLangs(selectedLangs.filter(l => l !== id));
      }
    } else {
      setSelectedLangs([...selectedLangs, id]);
    }
  };

  const handleQuickPreset = (presetLangs: LanguageId[]) => {
    setSelectedLangs(presetLangs);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#38BDF8]">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC] font-mono">Custom Mixed Quiz</h3>
              <p className="text-xs text-[#94A3B8]">Combine multiple programming languages in 1 test</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <div className="stats-label text-[#94A3B8]">Quick Presets:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickPreset(['python', 'javascript'])}
              className="px-2.5 py-1 rounded-md bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] text-xs font-mono text-[#F8FAFC] cursor-pointer"
            >
              🐍 Python + ⚡ JS
            </button>
            <button
              onClick={() => handleQuickPreset(['c', 'cpp'])}
              className="px-2.5 py-1 rounded-md bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] text-xs font-mono text-[#F8FAFC] cursor-pointer"
            >
              💻 C + ⚡ C++
            </button>
            <button
              onClick={() => handleQuickPreset(['java', 'python', 'javascript'])}
              className="px-2.5 py-1 rounded-md bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] text-xs font-mono text-[#F8FAFC] cursor-pointer"
            >
              ☕ Java + 🐍 Py + ⚡ JS
            </button>
            <button
              onClick={() => handleQuickPreset(['rust', 'go', 'typescript'])}
              className="px-2.5 py-1 rounded-md bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] text-xs font-mono text-[#F8FAFC] cursor-pointer"
            >
              🦀 Rust + 🐹 Go + 🟦 TS
            </button>
          </div>
        </div>

        {/* Language Multi-select Grid */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between stats-label text-[#94A3B8]">
            <span>Select Languages ({selectedLangs.length} active):</span>
            <span>Min: 1</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGES.map(lang => {
              const isSelected = selectedLangs.includes(lang.id);
              return (
                <div
                  key={lang.id}
                  onClick={() => toggleLang(lang.id)}
                  className={`p-2 rounded-lg border cursor-pointer text-xs font-mono flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-[#38BDF8] font-semibold'
                      : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.icon}</span>
                    <span className={isSelected ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}>{lang.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#38BDF8]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-1.5">
          <div className="stats-label text-[#94A3B8]">Difficulty:</div>
          <div className="grid grid-cols-4 gap-2">
            {(['basic', 'intermediate', 'advanced', 'adaptive'] as DifficultyLevel[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`py-2 rounded-md text-xs font-mono capitalize border transition-all cursor-pointer ${
                  difficulty === d
                    ? 'bg-[#38BDF8] text-[#0F172A] font-bold border-[#38BDF8]'
                    : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Submit action */}
        <button
          onClick={() => {
            onStartQuiz(selectedLangs, difficulty);
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#38BDF8] hover:bg-sky-300 text-[#0F172A] font-bold text-xs font-mono transition-all shadow-sm cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Mixed Quiz (10 Questions)</span>
        </button>
      </div>
    </div>
  );
};
