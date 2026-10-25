import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CoverScreen } from './components/CoverScreen';
import { ProgramSelector } from './components/ProgramSelector';
import { RegistrationForm } from './components/RegistrationForm';
import { QuizGame } from './components/QuizGame';
import { ResultScreen } from './components/ResultScreen';
import { PublicRanking } from './components/PublicRanking';
import { AdminDashboard } from './components/AdminDashboard';
import { TrekkingModule } from './components/TrekkingModule';
import { TouristTourGuideModule } from './components/TouristTourGuideModule';
import { ParticipantData, QuizQuestion, QuizResult } from './types/quiz';
import { generateQuizForProgram } from './services/quizEngine';
import { saveQuizResult } from './services/storageService';
import { soundManager } from './services/audioService';

type AppView =
  | 'cover'
  | 'program'
  | 'register'
  | 'quiz'
  | 'result'
  | 'ranking'
  | 'admin'
  | 'treking'
  | 'tourist_guide';

export default function App() {
  // App opens directly in the COVER SCREEN with image and START button!
  const [currentView, setCurrentView] = useState<AppView>('cover');
  const [selectedProgram, setSelectedProgram] = useState<string>('healthy Quick breakfasts');
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [latestResult, setLatestResult] = useState<QuizResult | null>(null);

  // TV Mode state
  const [isTvMode, setIsTvMode] = useState<boolean>(() => {
    return localStorage.getItem('gtd_tv_mode') === 'true';
  });

  // Sound Muted state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Hidden admin access via keyboard shortcut (Ctrl + Shift + A) or URL hash (#admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView('admin');
      }
    };

    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHash);
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const handleToggleTvMode = () => {
    const updated = !isTvMode;
    setIsTvMode(updated);
    localStorage.setItem('gtd_tv_mode', String(updated));
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Step 1: Start from Cover -> Goes to Topic Selection
  const handleStartFromCover = () => {
    setCurrentView('program');
  };

  // Step 2: Topic Selected -> Advances to Registration, Trekking, or Tourist Guide Module
  const handleProgramSelected = (programName: string) => {
    setSelectedProgram(programName);
    if (programName === 'TREKING') {
      setCurrentView('treking');
    } else if (programName === 'Tourist & Tour Guide') {
      setCurrentView('tourist_guide');
    } else {
      setCurrentView('register');
    }
  };

  // Step 3: Completed Registration form -> Generates 100 questions & starts Quiz
  const handleRegistrationComplete = (data: Partial<ParticipantData>) => {
    const participantData: ParticipantData = {
      id: data.id || `part-${Date.now()}`,
      fullName: data.fullName || 'Participante',
      participantType: data.participantType || 'Aprendiz',
      program: selectedProgram,
      ficha: data.ficha,
      photoUrl: data.photoUrl,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    setParticipant(participantData);

    // Generate 100 questions from the 150 questions bank of the chosen topic
    const questions = generateQuizForProgram(selectedProgram, 100);
    setCurrentQuestions(questions);
    setCurrentView('quiz');
  };

  // Step 4: Finished Quiz -> Saves result & shows Result Screen
  const handleFinishQuiz = (result: QuizResult) => {
    saveQuizResult(result);
    setLatestResult(result);
    setCurrentView('result');
  };

  // Reset back to cover for the next participant
  const handleNewChallenge = () => {
    setParticipant(null);
    setCurrentQuestions([]);
    setCurrentView('cover');
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#39A900] selection:text-white ${
      isTvMode ? 'text-lg' : ''
    }`}>
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'welcome') {
            setCurrentView('cover');
          } else {
            setCurrentView(view as AppView);
          }
        }}
        isTvMode={isTvMode}
        onToggleTvMode={handleToggleTvMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {/* Step 1: COVER SCREEN WITH IMAGE AND START BUTTON */}
        {currentView === 'cover' && (
          <CoverScreen
            onStart={handleStartFromCover}
            isTvMode={isTvMode}
          />
        )}

        {/* Step 2: CHOOSE YOUR TOPIC */}
        {currentView === 'program' && (
          <ProgramSelector
            onSelectProgram={handleProgramSelected}
            isTvMode={isTvMode}
          />
        )}

        {/* Step 3: REGISTRATION FORM */}
        {currentView === 'register' && (
          <RegistrationForm
            selectedProgram={selectedProgram}
            onComplete={handleRegistrationComplete}
            onBack={() => setCurrentView('program')}
            isTvMode={isTvMode}
          />
        )}

        {/* Step 3.5: NOVENO MÓDULO: TREKING (Parte 1: Información & Parte 2: 12 Preguntas) */}
        {currentView === 'treking' && (
          <TrekkingModule
            participant={participant}
            onUpdateParticipant={(updated) => setParticipant(updated)}
            onFinishQuiz={handleFinishQuiz}
            onBackToMenu={() => setCurrentView('program')}
            isTvMode={isTvMode}
          />
        )}

        {/* Step 3.6: DÉCIMO MÓDULO: TOURIST & TOUR GUIDE (Places, Directions, Multiple Choice Quiz) */}
        {currentView === 'tourist_guide' && (
          <TouristTourGuideModule
            participant={participant}
            onUpdateParticipant={(updated) => setParticipant(updated)}
            onFinishQuiz={handleFinishQuiz}
            onBackToMenu={() => setCurrentView('program')}
            isTvMode={isTvMode}
          />
        )}

        {/* Step 4: QUIZ GAME (3 Hearts, Max 2 Words, Time bar, Manual Navigation) */}
        {currentView === 'quiz' && participant && currentQuestions.length > 0 && (
          <QuizGame
            questions={currentQuestions}
            participant={participant}
            onFinishQuiz={handleFinishQuiz}
            onBackToMenu={() => setCurrentView('cover')}
            isTvMode={isTvMode}
          />
        )}

        {/* Step 5: RESULT & CERTIFICATE SCREEN */}
        {currentView === 'result' && latestResult && (
          <ResultScreen
            result={latestResult}
            onNewChallenge={handleNewChallenge}
            onViewRanking={() => setCurrentView('ranking')}
            isTvMode={isTvMode}
          />
        )}

        {/* PUBLIC RANKING LEADERBOARD */}
        {currentView === 'ranking' && (
          <PublicRanking
            onStartChallenge={() => setCurrentView('program')}
            isTvMode={isTvMode}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            onBack={() => setCurrentView('cover')}
            isTvMode={isTvMode}
          />
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-3 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div>
            <strong className="text-slate-300">GLOBAL TOURISM DISTRICT</strong> · SENA Global City
          </div>
          <div className="text-slate-500">
            Speak · Create · Connect · 100 Questions Challenge
          </div>
        </div>
      </footer>
    </div>
  );
}
