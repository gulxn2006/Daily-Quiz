import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HomeHero } from './components/HomeHero.tsx';
import { QuizScreen } from './components/QuizScreen.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { LanguagesExplorer } from './components/LanguagesExplorer.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { CustomMixModal } from './components/CustomMixModal.tsx';
import { UserNameModal } from './components/UserNameModal.tsx';
import { HighDensitySidebar } from './components/HighDensitySidebar.tsx';
import { generateQuizQuestions } from './utils/questionEngine.ts';
import { QuizSession, QuizResult, UserStats, LanguageId, DifficultyLevel, Question } from './types.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'quiz' | 'languages' | 'dashboard' | 'admin'>('home');
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [isCustomMixOpen, setIsCustomMixOpen] = useState(false);

  // User Profile Name - prompts on first visit or can be edited from profile chip
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('zero_trace_username') || '';
    } catch {
      return '';
    }
  });

  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('zero_trace_username');
      return !saved || saved.trim().length === 0;
    } catch {
      return true;
    }
  });

  const handleSaveUserName = (name: string) => {
    const trimmed = name.trim();
    setUserName(trimmed);
    try {
      localStorage.setItem('zero_trace_username', trimmed);
    } catch {}
    setIsNameModalOpen(false);
  };

  // Set of seen question hashes to guarantee 0% repetition across all sessions
  const [seenHashes, setSeenHashes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zero_trace_seen_hashes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User stats initialized to zero and dynamically updated with real-time quiz performance
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('zero_trace_user_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear legacy mock numbers if previously stored
        if (parsed.totalQuizzes === 47 || parsed.questionsSolved === 470) {
          localStorage.removeItem('zero_trace_user_stats');
        } else {
          return {
            totalQuizzes: parsed.totalQuizzes || 0,
            questionsSolved: parsed.questionsSolved || 0,
            accuracy: parsed.accuracy || 0,
            bestScore: parsed.bestScore || 0,
            dayStreak: parsed.dayStreak || 0,
            codingLevelPercent: parsed.codingLevelPercent || 0,
            languageStats: parsed.languageStats || {},
            languageMastery: parsed.languageMastery || {
              python: 0,
              javascript: 0,
              java: 0,
              cpp: 0,
              typescript: 0,
              rust: 0,
              c: 0,
              php: 0,
              ruby: 0,
              go: 0,
            },
            recentSessions: parsed.recentSessions || [],
          };
        }
      }
    } catch {}
    return {
      totalQuizzes: 0,
      questionsSolved: 0,
      accuracy: 0,
      bestScore: 0,
      dayStreak: 0,
      codingLevelPercent: 0,
      languageStats: {},
      languageMastery: {
        python: 0,
        javascript: 0,
        java: 0,
        cpp: 0,
        typescript: 0,
        rust: 0,
        c: 0,
        php: 0,
        ruby: 0,
        go: 0,
      },
      recentSessions: [],
    };
  });

  // Sync hashes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zero_trace_seen_hashes', JSON.stringify(seenHashes));
    } catch {}
  }, [seenHashes]);

  // Sync stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zero_trace_user_stats', JSON.stringify(stats));
    } catch {}
  }, [stats]);

  // Start a new 10-question quiz with guaranteed non-repeating questions
  const handleStartQuiz = async (languages: LanguageId[], difficulty: DifficultyLevel) => {
    let questions: Question[] = [];

    try {
      // First attempt to call the backend endpoint
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          languages,
          difficulty,
          excludeHashes: seenHashes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          questions = data.questions;
        }
      }
    } catch (e) {
      console.warn('Backend API fetch failed or dev server proxying, using client engine:', e);
    }

    // Direct fallback to client question engine (same deterministic variation logic)
    if (questions.length === 0) {
      questions = generateQuizQuestions(languages, difficulty, seenHashes);
    }

    // Register all new question hashes in seenHashes
    const newHashes = questions.map(q => q.question_hash);
    setSeenHashes(prev => Array.from(new Set([...prev, ...newHashes])));

    // Create session
    const session: QuizSession = {
      id: `session-${Date.now()}`,
      userId: 'user-zero-trace',
      languages,
      difficulty,
      mode: difficulty === 'adaptive' ? 'adaptive' : languages.length > 1 ? 'mixed' : 'single',
      questions,
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemainingSeconds: 300, // 5 minutes
      startedAt: Date.now(),
      adaptiveStreak: 0,
      currentAdaptiveDifficulty: 'intermediate',
    };

    setActiveSession(session);
    setLastResult(null);
    setCurrentTab('quiz');
  };

  // Handle user answering a question
  const handleAnswerQuestion = (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    if (!activeSession) return;

    const updatedAnswers = {
      ...activeSession.userAnswers,
      [questionId]: answer,
    };

    // Adaptive mode difficulty dynamic adjustment logic
    let adaptiveStreak = activeSession.adaptiveStreak;
    let currentAdaptiveDifficulty = activeSession.currentAdaptiveDifficulty;

    if (activeSession.mode === 'adaptive') {
      const q = activeSession.questions.find(item => item.question_id === questionId);
      if (q && q.correct_answer === answer) {
        adaptiveStreak += 1;
        if (adaptiveStreak >= 2) {
          // Level up!
          if (currentAdaptiveDifficulty === 'basic') currentAdaptiveDifficulty = 'intermediate';
          else if (currentAdaptiveDifficulty === 'intermediate') currentAdaptiveDifficulty = 'advanced';
        }
      } else {
        // Repeated error shifts down to concept revision
        adaptiveStreak = 0;
        if (currentAdaptiveDifficulty === 'advanced') currentAdaptiveDifficulty = 'intermediate';
        else if (currentAdaptiveDifficulty === 'intermediate') currentAdaptiveDifficulty = 'basic';
      }
    }

    setActiveSession({
      ...activeSession,
      userAnswers: updatedAnswers,
      adaptiveStreak,
      currentAdaptiveDifficulty,
    });
  };

  // Complete Quiz and compile detailed results
  const handleCompleteQuiz = () => {
    if (!activeSession) return;

    const timeSpentSeconds = Math.max(1, 300 - (activeSession.timeRemainingSeconds || 0));
    let correctCount = 0;

    // Per-language delta calculation
    const langDelta: Record<string, { attempted: number; correct: number }> = {};

    activeSession.questions.forEach(q => {
      const l = q.language;
      if (!langDelta[l]) {
        langDelta[l] = { attempted: 0, correct: 0 };
      }
      langDelta[l].attempted += 1;

      if (activeSession.userAnswers[q.question_id] === q.correct_answer) {
        correctCount += 1;
        langDelta[l].correct += 1;
      }
    });

    const totalQuestions = activeSession.questions.length;
    const wrongCount = totalQuestions - correctCount;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const result: QuizResult = {
      sessionId: activeSession.id,
      languages: activeSession.languages,
      difficulty: activeSession.difficulty,
      totalQuestions,
      correctCount,
      wrongCount,
      score: correctCount,
      accuracy,
      timeSpentSeconds,
      questions: activeSession.questions,
      userAnswers: activeSession.userAnswers,
      completedAt: Date.now(),
    };

    setLastResult(result);
    setActiveSession(null);

    // Update user stats with realtime scores
    setStats(prev => {
      const newTotalQuizzes = prev.totalQuizzes + 1;
      const newQuestionsSolved = prev.questionsSolved + totalQuestions;
      const newAccuracy = Math.round(((prev.accuracy * prev.totalQuizzes) + accuracy) / newTotalQuizzes);
      const newBest = Math.max(prev.bestScore, accuracy);

      const updatedLangStats = { ...(prev.languageStats || {}) };
      const updatedLangMastery = { ...(prev.languageMastery || {}) };

      Object.entries(langDelta).forEach(([lang, data]) => {
        const prevLang = updatedLangStats[lang] || { solved: 0, correct: 0, accuracy: 0 };
        const totalSolved = prevLang.solved + data.attempted;
        const totalCorrect = prevLang.correct + data.correct;
        const langAccuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

        updatedLangStats[lang] = {
          solved: totalSolved,
          correct: totalCorrect,
          accuracy: langAccuracy,
        };
        updatedLangMastery[lang] = langAccuracy;
      });

      // Realtime coding level percentage calculation
      const newLevel = Math.min(100, Math.round((newAccuracy * 0.7) + Math.min(30, newTotalQuizzes * 6)));
      const updatedSessions = [result, ...(prev.recentSessions || [])].slice(0, 20);

      return {
        ...prev,
        totalQuizzes: newTotalQuizzes,
        questionsSolved: newQuestionsSolved,
        accuracy: newAccuracy,
        bestScore: newBest,
        codingLevelPercent: newLevel,
        languageStats: updatedLangStats,
        languageMastery: updatedLangMastery,
        recentSessions: updatedSessions,
      };
    });
  };

  // Exit Quiz
  const handleExitQuiz = () => {
    setActiveSession(null);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#38BDF8] selection:text-[#0F172A]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={tab => {
          if (currentTab === 'quiz' && activeSession) {
            if (!window.confirm('Active quiz in progress. Do you want to leave?')) {
              return;
            }
            setActiveSession(null);
          }
          setCurrentTab(tab);
        }}
        streak={stats.dayStreak}
        userName={userName}
        onEditName={() => setIsNameModalOpen(true)}
      />

      {/* Main View Area with High Density Layout */}
      <main className="flex-1 flex flex-col">
        {/* If user is taking an active quiz */}
        {currentTab === 'quiz' && activeSession ? (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            <QuizScreen
              session={activeSession}
              onAnswerQuestion={handleAnswerQuestion}
              onCompleteQuiz={handleCompleteQuiz}
              onExitQuiz={handleExitQuiz}
            />
          </div>
        ) : lastResult ? (
          /* If quiz just completed and result is pending */
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            <ResultScreen
              result={lastResult}
              onRetakeFresh={(langs, diff) => handleStartQuiz(langs, diff)}
              onGoToDashboard={() => {
                setLastResult(null);
                setCurrentTab('dashboard');
              }}
            />
          </div>
        ) : currentTab === 'languages' ? (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            <LanguagesExplorer onStartQuiz={handleStartQuiz} />
          </div>
        ) : currentTab === 'dashboard' ? (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            <DashboardView
              stats={stats}
              userName={userName}
              onStartQuiz={() => setCurrentTab('home')}
            />
          </div>
        ) : currentTab === 'admin' ? (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            <AdminPanel />
          </div>
        ) : (
          /* Default: Home View with High Density Content + Sidebar Panes */
          <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <HomeHero
                onStartQuiz={handleStartQuiz}
                onExploreLanguages={() => setCurrentTab('languages')}
                onOpenCustomMix={() => setIsCustomMixOpen(true)}
              />
            </div>
            <HighDensitySidebar
              stats={stats}
              onNavigateToBadges={() => setCurrentTab('dashboard')}
            />
          </div>
        )}
      </main>

      {/* User Name Entrance & Profile Modal */}
      <UserNameModal
        isOpen={isNameModalOpen}
        currentName={userName}
        onSave={handleSaveUserName}
        canDismiss={Boolean(userName && userName.trim().length > 0)}
        onClose={() => setIsNameModalOpen(false)}
      />

      {/* Custom Mixed Quiz Selection Modal */}
      <CustomMixModal
        isOpen={isCustomMixOpen}
        onClose={() => setIsCustomMixOpen(false)}
        onStartQuiz={handleStartQuiz}
      />

      {/* High Density Footer Bar */}
      <footer className="h-10 border-t border-[#334155] bg-[#0F172A] flex items-center justify-between px-4 sm:px-6 text-[11px] text-[#94A3B8] font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="text-[#38BDF8] font-semibold">zero_trace</span>
          <span>•</span>
          <span>v2.0.4 • [DEBUG_MODE: ACTIVE]</span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span>10 Questions / Test</span>
          <span>•</span>
          <span>Deterministic Anti-Duplication Engine</span>
          <span>•</span>
          <span>&copy; 2026 Coding Quiz Platform</span>
        </div>
      </footer>
    </div>
  );
}
