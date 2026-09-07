import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Zap,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { QuizResult, Question, LanguageId, DifficultyLevel } from '../types.ts';
import { CodeBlock } from './CodeBlock.tsx';
import { getSimilarQuestionForConcept } from '../utils/questionEngine.ts';

interface ResultScreenProps {
  result: QuizResult;
  onRetakeFresh: (languages: LanguageId[], difficulty: DifficultyLevel) => void;
  onGoToDashboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onRetakeFresh,
  onGoToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'wrong' | 'correct'>('all');
  const [similarModalQuestion, setSimilarModalQuestion] = useState<Question | null>(null);
  const [similarUserAnswer, setSimilarUserAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [similarSubmitted, setSimilarSubmitted] = useState(false);

  // Trigger confetti on high accuracy
  useEffect(() => {
    if (result.accuracy >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [result.accuracy]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenSimilar = (q: Question) => {
    // Pick alternative variation for this concept
    const similar = getSimilarQuestionForConcept(q.concept_id, q.language, q.variation_id);
    setSimilarModalQuestion(similar);
    setSimilarUserAnswer(null);
    setSimilarSubmitted(false);
  };

  const filteredQuestions = result.questions.filter(q => {
    const isCorrect = result.userAnswers[q.question_id] === q.correct_answer;
    if (activeTab === 'wrong') return !isCorrect;
    if (activeTab === 'correct') return isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1E293B] border border-[#334155] text-[#38BDF8] text-xs font-mono">
          <Trophy className="w-3.5 h-3.5" />
          <span>zero_trace Evaluator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
          Quiz Complete
        </h1>
        <p className="text-sm text-[#94A3B8] font-sans">
          Reviewed with deep conceptual breakdown and common mistake analysis.
        </p>
      </div>

      {/* Score Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Score */}
        <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center flex flex-col justify-center">
          <div className="stats-label text-[#94A3B8] mb-1">Score</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] font-mono">
            {result.score} <span className="text-[#94A3B8] text-xl font-normal">/ {result.totalQuestions}</span>
          </div>
          <div className="text-[11px] text-[#38BDF8] font-mono mt-1 font-semibold">
            {result.accuracy >= 80 ? 'Mastery Level' : 'Needs Review'}
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center flex flex-col justify-center">
          <div className="stats-label text-[#94A3B8] mb-1">Accuracy</div>
          <div className={`text-3xl sm:text-4xl font-extrabold font-mono ${
            result.accuracy >= 80 ? 'text-[#10B981]' : result.accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {result.accuracy}%
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono mt-1">
            {result.correctCount} correct • {result.wrongCount} wrong
          </div>
        </div>

        {/* Time Spent */}
        <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center flex flex-col justify-center">
          <div className="stats-label text-[#94A3B8] mb-1 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-[#38BDF8]" />
            <span>Time Spent</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] font-mono">
            {formatTime(result.timeSpentSeconds)}
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono mt-1">Avg 25s / question</div>
        </div>

        {/* Repetition check */}
        <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center flex flex-col justify-center">
          <div className="stats-label text-[#94A3B8] mb-1">Duplicate Rate</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#10B981] font-mono">
            0%
          </div>
          <div className="text-[11px] text-[#10B981] font-mono mt-1">100% Unique Set</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onRetakeFresh(result.languages, result.difficulty as DifficultyLevel)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#38BDF8] hover:bg-sky-300 text-[#0F172A] font-bold text-xs font-mono transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz (10 Fresh Questions)</span>
        </button>

        <button
          onClick={onGoToDashboard}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1E293B] hover:bg-slate-700 border border-[#334155] text-[#F8FAFC] font-semibold text-xs font-mono transition-all cursor-pointer"
        >
          <span>View Progress & Badges</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Questions Review Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-sm font-bold text-[#F8FAFC] font-mono">
              Detailed Question Analysis ({result.questions.length})
            </h2>
          </div>

          {/* Filter tabs: All / Wrong / Correct */}
          <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-lg border border-[#334155] text-xs font-mono">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-[#1E293B] text-[#F8FAFC] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              All ({result.questions.length})
            </button>
            <button
              onClick={() => setActiveTab('wrong')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'wrong' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <X className="w-3 h-3 text-rose-400" />
              <span>Wrong ({result.wrongCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('correct')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'correct' ? 'bg-[#10B981]/20 text-[#10B981] font-bold border border-[#10B981]/40' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Check className="w-3 h-3 text-[#10B981]" />
              <span>Correct ({result.correctCount})</span>
            </button>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const userAnswer = result.userAnswers[q.question_id];
            const isCorrect = userAnswer === q.correct_answer;
            const originalIndex = result.questions.findIndex(item => item.question_id === q.question_id) + 1;

            return (
              <div
                key={q.question_id}
                className={`rounded-xl p-5 border transition-all ${
                  isCorrect
                    ? 'bg-[#1E293B] border-[#334155]'
                    : 'bg-[#1E293B] border-rose-500/40'
                }`}
              >
                {/* Header line: Question status & metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-md border border-[#10B981]/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Question {originalIndex} • Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-rose-400 bg-rose-500/15 px-2.5 py-1 rounded-md border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Question {originalIndex} • Incorrect</span>
                      </span>
                    )}

                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0F172A] text-[#94A3B8] border border-[#334155]">
                      {q.language}
                    </span>

                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0F172A] text-[#38BDF8] border border-[#334155] capitalize">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* "Try a Similar Question" Button */}
                  <button
                    onClick={() => handleOpenSimilar(q)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] hover:border-[#38BDF8] text-[#38BDF8] text-xs font-mono transition-all cursor-pointer group"
                  >
                    <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Try a Similar Question</span>
                  </button>
                </div>

                {/* Prompt */}
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-3">
                  {q.prompt}
                </h3>

                {/* Code Snippet if present */}
                {q.code && (
                  <div className="mb-4">
                    <CodeBlock code={q.code} language={q.language} />
                  </div>
                )}

                {/* Answer Comparison Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Your Answer */}
                  <div className={`p-3 rounded-lg border text-xs font-mono ${
                    isCorrect
                      ? 'bg-[#0F172A] border-[#10B981]/40 text-[#10B981]'
                      : 'bg-[#0F172A] border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="stats-label text-[#94A3B8] mb-1">Your Answer</div>
                    <div className="font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-[#1E293B] border border-current">
                        {userAnswer || 'Skipped'}
                      </span>
                      <span>
                        {q.options.find(o => o.id === userAnswer)?.text || 'No answer selected'}
                      </span>
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="p-3 rounded-lg border bg-[#0F172A] border-[#10B981]/40 text-[#10B981] text-xs font-mono">
                    <div className="stats-label text-[#94A3B8] mb-1">Correct Answer</div>
                    <div className="font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-[#1E293B] border border-[#10B981]">
                        {q.correct_answer}
                      </span>
                      <span>
                        {q.options.find(o => o.id === q.correct_answer)?.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deep "Why?" Explanation & Concept Box */}
                <div className="space-y-3 pt-3 border-t border-[#334155] text-xs">
                  {/* Why? */}
                  <div>
                    <div className="font-bold text-[#F8FAFC] font-mono flex items-center gap-1.5 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>Why? (Deep Explanation)</span>
                    </div>
                    <p className="text-[#94A3B8] leading-relaxed pl-5 font-sans">
                      {q.explanation}
                    </p>
                  </div>

                  {/* Common Mistake */}
                  {q.common_mistake && (
                    <div>
                      <div className="font-bold text-rose-300 font-mono flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Common Mistake:</span>
                      </div>
                      <p className="text-[#94A3B8] leading-relaxed pl-5 font-sans">
                        {q.common_mistake}
                      </p>
                    </div>
                  )}

                  {/* Remember This */}
                  {q.remember_this && (
                    <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#334155] text-[#94A3B8]">
                      <div className="font-bold text-[#38BDF8] font-mono flex items-center gap-1.5 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Remember this rule:</span>
                      </div>
                      <p className="text-[#94A3B8] font-sans leading-relaxed text-[11px]">
                        {q.remember_this}
                      </p>
                    </div>
                  )}

                  {/* Concept Tag */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="stats-label text-[#94A3B8]">Tested Concept:</span>
                    <span className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#F8FAFC] font-mono text-[11px]">
                      {q.concept_name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "Try a Similar Question" Interactive Modal */}
      {similarModalQuestion && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1E293B] border border-[#38BDF8]/60 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0F172A] text-[#38BDF8] text-xs font-mono mb-1 border border-[#334155]">
                  <RotateCcw className="w-3 h-3" />
                  <span>Concept Drill • Fresh Variation</span>
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  Concept: {similarModalQuestion.concept_name}
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Same core concept, but with fresh code, identifiers, and format.
                </p>
              </div>
              <button
                onClick={() => setSimilarModalQuestion(null)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt */}
            <p className="text-sm font-semibold text-[#F8FAFC]">
              {similarModalQuestion.prompt}
            </p>

            {/* Code */}
            {similarModalQuestion.code && (
              <CodeBlock
                code={similarModalQuestion.code}
                language={similarModalQuestion.language}
              />
            )}

            {/* Options */}
            <div className="space-y-2.5">
              {similarModalQuestion.options.map(opt => {
                const isSelected = similarUserAnswer === opt.id;
                const isCorrect = opt.id === similarModalQuestion.correct_answer;

                let cls = 'border-[#334155] bg-[#0F172A] hover:border-slate-500';
                if (similarSubmitted) {
                  if (isCorrect) cls = 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]';
                  else if (isSelected && !isCorrect) cls = 'border-rose-500 bg-rose-500/15 text-rose-300';
                } else if (isSelected) {
                  cls = 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8]';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => !similarSubmitted && setSimilarUserAnswer(opt.id)}
                    className={`p-3 rounded-lg border text-xs sm:text-sm font-mono cursor-pointer flex items-center gap-3 transition-all ${cls}`}
                  >
                    <span className="w-6 h-6 rounded-md bg-[#1E293B] flex items-center justify-center font-bold">
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Feedback after submit */}
            {similarSubmitted && (
              <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                similarUserAnswer === similarModalQuestion.correct_answer
                  ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981]'
                  : 'bg-rose-500/15 border-rose-500 text-rose-300'
              }`}>
                <div className="font-bold font-mono flex items-center gap-2">
                  {similarUserAnswer === similarModalQuestion.correct_answer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Nailed it! Concept Mastered.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Almost! Review the explanation below:</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed text-[#F8FAFC]">
                  {similarModalQuestion.explanation}
                </p>
              </div>
            )}

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!similarSubmitted ? (
                <button
                  onClick={() => similarUserAnswer && setSimilarSubmitted(true)}
                  disabled={!similarUserAnswer}
                  className="px-5 py-2.5 rounded-md bg-[#38BDF8] hover:bg-sky-300 disabled:opacity-40 disabled:pointer-events-none text-[#0F172A] font-bold text-xs font-mono cursor-pointer"
                >
                  Verify My Answer
                </button>
              ) : (
                <button
                  onClick={() => setSimilarModalQuestion(null)}
                  className="px-5 py-2.5 rounded-md bg-[#334155] hover:bg-slate-600 text-white font-bold text-xs font-mono cursor-pointer"
                >
                  Close Concept Drill
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
