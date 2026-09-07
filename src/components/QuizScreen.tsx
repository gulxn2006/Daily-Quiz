import React, { useState, useEffect } from 'react';
import { Clock, HelpCircle, ArrowRight, CheckCircle2, AlertCircle, Sparkles, X, ChevronRight, Zap } from 'lucide-react';
import { QuizSession, Question, QuestionOption } from '../types.ts';
import { CodeBlock } from './CodeBlock.tsx';
import { LANGUAGES } from '../data/languages.ts';

interface QuizScreenProps {
  session: QuizSession;
  onAnswerQuestion: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  onCompleteQuiz: () => void;
  onExitQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  session,
  onAnswerQuestion,
  onCompleteQuiz,
  onExitQuiz,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(session.timeRemainingSeconds || 300); // 5 minutes standard
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [instantReview, setInstantReview] = useState(false); // Can reveal explanation immediately after pick
  const [revealedCurrent, setRevealedCurrent] = useState(false);

  const currentQuestion = session.questions[currentIdx];
  const selectedAnswer = session.userAnswers[currentQuestion?.question_id];

  // Language info helper
  const langInfo = LANGUAGES.find(l => l.id === currentQuestion?.language);

  // Timer countdown
  useEffect(() => {
    if (secondsRemaining <= 0) {
      onCompleteQuiz();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onCompleteQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onCompleteQuiz]);

  // Reset revealed state on question change
  useEffect(() => {
    setRevealedCurrent(false);
  }, [currentIdx]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    onAnswerQuestion(currentQuestion.question_id, optId);
    if (instantReview) {
      setRevealedCurrent(true);
    }
  };

  const handleNext = () => {
    if (currentIdx < session.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onCompleteQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  if (!currentQuestion) {
    return <div className="text-center py-20 text-slate-400">Loading questions...</div>;
  }

  const answeredCount = Object.keys(session.userAnswers).length;
  const isLastQuestion = currentIdx === session.questions.length - 1;

  // Question type display label
  const formatQuestionType = (t: string) => {
    return t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Quiz Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#1E293B] border border-[#334155]">
        {/* Left: Language & Difficulty */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-xs font-mono text-[#F8FAFC]">
            <span>{langInfo?.icon || '💻'}</span>
            <span className="font-semibold capitalize">{currentQuestion.language}</span>
            <span className="text-[#334155]">•</span>
            <span className="text-[#38BDF8] capitalize">{currentQuestion.difficulty}</span>
          </div>

          {session.mode === 'adaptive' && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Adaptive Active</span>
            </div>
          )}
        </div>

        {/* Center: Question Progress */}
        <div className="text-xs font-mono text-[#94A3B8]">
          Question <span className="text-[#F8FAFC] font-bold">{currentIdx + 1}</span> / {session.questions.length}
        </div>

        {/* Right: Timer & Exit */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors ${
              secondsRemaining < 60
                ? 'bg-rose-950/60 text-rose-400 border-rose-800 animate-pulse'
                : 'bg-[#0F172A] text-[#F8FAFC] border-[#334155]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A] transition-colors"
            title="Exit quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#1E293B] rounded-xl border border-[#334155] p-6 md:p-8 shadow-sm relative">
        {/* Concept and Type Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#0F172A] text-[#38BDF8] border border-[#38BDF8]/40">
            {formatQuestionType(currentQuestion.question_type)}
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-[#94A3B8] bg-[#0F172A] border border-[#334155]">
            {currentQuestion.concept_name}
          </span>
          {currentQuestion.topic && (
            <span className="text-[11px] font-mono text-[#94A3B8] hidden sm:inline">
              Topic: {currentQuestion.topic}
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#F8FAFC] mb-4 leading-snug">
          {currentQuestion.prompt}
        </h2>

        {/* Optional Code Block */}
        {currentQuestion.code && (
          <div className="mb-6">
            <CodeBlock
              code={currentQuestion.code}
              language={currentQuestion.language}
              title={`${currentQuestion.language} snippet`}
            />
          </div>
        )}

        {/* Option Selection List (A, B, C, D) */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option: QuestionOption) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.id === currentQuestion.correct_answer;
            const showFeedback = instantReview && revealedCurrent;

            let borderClass = 'border-[#334155] hover:border-slate-500 bg-[#0F172A]/70';
            let badgeClass = 'bg-[#1E293B] text-[#94A3B8] border-[#334155]';

            if (isSelected && !showFeedback) {
              borderClass = 'border-[#38BDF8] bg-[#38BDF8]/10 ring-1 ring-[#38BDF8]/50';
              badgeClass = 'bg-[#38BDF8] text-[#0F172A] font-bold border-[#38BDF8]';
            } else if (showFeedback) {
              if (isCorrect) {
                borderClass = 'border-[#10B981] bg-[#10B981]/10 ring-1 ring-[#10B981]/50';
                badgeClass = 'bg-[#10B981] text-[#0F172A] font-bold border-[#10B981]';
              } else if (isSelected && !isCorrect) {
                borderClass = 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/50';
                badgeClass = 'bg-rose-500 text-white font-bold border-rose-400';
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3.5 group ${borderClass}`}
              >
                {/* Option Letter Badge (A, B, C, D) */}
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs border transition-colors flex-shrink-0 ${badgeClass}`}
                >
                  {option.id}
                </div>

                {/* Option Text */}
                <div className="flex-1 text-sm md:text-base text-[#F8FAFC] group-hover:text-white pt-0.5 leading-relaxed">
                  {option.text}
                </div>

                {/* Optional Status Icon in Instant Feedback mode */}
                {showFeedback && (
                  <div className="flex-shrink-0 pt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    ) : isSelected ? (
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Instant explanation drawer if user requested it */}
        {instantReview && revealedCurrent && (
          <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] mb-6 text-xs text-[#94A3B8] space-y-2">
            <div className="font-bold text-[#38BDF8] font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explanation Preview:</span>
            </div>
            <p className="leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Action Controls & Navigation Dots */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#334155]">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="text-xs font-mono px-4 py-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← Previous
          </button>

          {/* Navigation Dots */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {session.questions.map((q, idx) => {
              const isAnswered = !!session.userAnswers[q.question_id];
              const isCurrent = idx === currentIdx;

              let dotClass = 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]';
              if (isCurrent) {
                dotClass = 'bg-[#38BDF8] text-[#0F172A] font-bold ring-2 ring-[#38BDF8]/40 scale-110';
              } else if (isAnswered) {
                dotClass = 'bg-[#10B981] text-[#0F172A] font-bold';
              }

              return (
                <button
                  key={q.question_id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-6 h-6 rounded-md text-[10px] font-mono flex items-center justify-center transition-all ${dotClass}`}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Next / Submit Button */}
          <button
            onClick={handleNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#38BDF8] hover:bg-sky-300 text-[#0F172A] font-bold text-xs font-mono transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>{isLastQuestion ? `Submit Quiz (${answeredCount}/10)` : 'Next Question'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer controls: Instant feedback toggle */}
      <div className="flex items-center justify-between text-xs text-[#94A3B8] px-2 font-mono">
        <label className="flex items-center gap-2 cursor-pointer hover:text-[#F8FAFC] select-none">
          <input
            type="checkbox"
            checked={instantReview}
            onChange={e => setInstantReview(e.target.checked)}
            className="rounded border-[#334155] bg-[#1E293B] text-[#38BDF8] focus:ring-0"
          />
          <span>Instant Feedback Mode (Practice)</span>
        </label>

        <span>Answered: {answeredCount} / 10</span>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] p-6 rounded-xl max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#F8FAFC] font-mono">Leave this Quiz?</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Your progress in this 10-question session will be lost. Are you sure you want to exit?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-[#94A3B8] hover:bg-[#0F172A] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                onClick={onExitQuiz}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
