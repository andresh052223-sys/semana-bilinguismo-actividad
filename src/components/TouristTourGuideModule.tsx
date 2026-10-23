import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  MapPin,
  Navigation,
  Compass,
  Building,
  Store,
  Trees,
  UtensilsCrossed,
  BedDouble,
  CornerUpLeft,
  CornerUpRight,
  MoveUp,
  Footprints,
  Split,
  Layers,
  Heart,
  BookOpen,
  Award,
  X,
  Play,
} from 'lucide-react';
import { soundManager } from '../services/audioService';
import {
  PLACES_SLIDES,
  DIRECTIONS_SLIDES,
  TOURIST_QUESTIONS_SLIDES,
  PlaceVocabularySlide,
  DirectionExpressionSlide,
  TouristQuestionSlide,
} from '../data/touristTourGuideData';
import { ParticipantData, QuizResult } from '../types/quiz';
import { determineEnglishLevel } from '../services/quizEngine';

interface TouristTourGuideModuleProps {
  participant: ParticipantData | null;
  onUpdateParticipant: (participant: ParticipantData) => void;
  onFinishQuiz: (result: QuizResult) => void;
  onBackToMenu: () => void;
  isTvMode: boolean;
}

export const TouristTourGuideModule: React.FC<TouristTourGuideModuleProps> = ({
  participant,
  onUpdateParticipant,
  onFinishQuiz,
  onBackToMenu,
  isTvMode,
}) => {
  // 3 Sections:
  // 'places' = 1. Tourism Vocabulary – Places
  // 'directions' = 2. Giving Directions – Useful Expressions
  // 'quiz' = 3. Questionnaire – Multiple Choice
  const [activeSection, setActiveSection] = useState<'places' | 'directions' | 'quiz'>('places');

  // Slide indices for each section
  const [placeIndex, setPlaceIndex] = useState(0);
  const [directionIndex, setDirectionIndex] = useState(0);
  const [quizSlideIndex, setQuizSlideIndex] = useState(0);

  // Fullscreen Presentation Mode
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);

  // Modal Image view
  const [modalImage, setModalImage] = useState<{ url: string; title: string; caption?: string } | null>(
    null
  );

  // Registration state for Quiz participant if needed
  const [localName, setLocalName] = useState(participant?.fullName || '');
  const [localType, setLocalType] = useState<'Aprendiz' | 'Instructor'>(
    participant?.participantType || 'Aprendiz'
  );
  const [localFicha, setLocalFicha] = useState(participant?.ficha || '');
  const [isRegistered, setIsRegistered] = useState(Boolean(participant?.fullName));

  // Questionnaire interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState<Record<number, boolean>>({});
  const [lives, setLives] = useState(3);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Text-To-Speech pronunciation helper
  const speakText = (text: string) => {
    soundManager.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keyboard navigation for Presentation Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresentationMode) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        setIsPresentationMode(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, activeSection, placeIndex, directionIndex, quizSlideIndex]);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreenActive(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreenActive(false);
      }
    } catch {
      setIsFullscreenActive((prev) => !prev);
    }
  };

  // Sync fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenActive(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleStartPresentation = () => {
    soundManager.playClick();
    setIsPresentationMode(true);
    // Automatically attempt browser native fullscreen for maximum screen immersion
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreenActive(true);
      }).catch(() => {
        // Fallback for sandboxed iframes
      });
    }
  };

  const handleExitPresentation = () => {
    soundManager.playClick();
    setIsPresentationMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreenActive(false);
  };

  // Slide navigation
  const handlePrevSlide = () => {
    soundManager.playClick();
    if (activeSection === 'places') {
      setPlaceIndex((prev) => (prev > 0 ? prev - 1 : PLACES_SLIDES.length - 1));
    } else if (activeSection === 'directions') {
      setDirectionIndex((prev) => (prev > 0 ? prev - 1 : DIRECTIONS_SLIDES.length - 1));
    } else {
      setQuizSlideIndex((prev) => (prev > 0 ? prev - 1 : TOURIST_QUESTIONS_SLIDES.length - 1));
    }
  };

  const handleNextSlide = () => {
    soundManager.playClick();
    if (activeSection === 'places') {
      setPlaceIndex((prev) => (prev < PLACES_SLIDES.length - 1 ? prev + 1 : 0));
    } else if (activeSection === 'directions') {
      setDirectionIndex((prev) => (prev < DIRECTIONS_SLIDES.length - 1 ? prev + 1 : 0));
    } else {
      setQuizSlideIndex((prev) => (prev < TOURIST_QUESTIONS_SLIDES.length - 1 ? prev + 1 : 0));
    }
  };

  // Registration handler for Quiz
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localName.trim()) return;
    const newParticipant: ParticipantData = {
      id: participant?.id || `tourist-${Date.now()}`,
      fullName: localName.trim(),
      participantType: localType,
      program: 'Tourist & Tour Guide',
      ficha: localFicha.trim() || undefined,
      createdAt: participant?.createdAt || new Date().toISOString(),
    };
    onUpdateParticipant(newParticipant);
    setIsRegistered(true);
    soundManager.playCorrect();
  };

  // Quiz answer handling
  const handleSelectOption = (qIdx: number, letter: string) => {
    if (isAnswerConfirmed[qIdx] || quizFinished) return;

    const currentQ = TOURIST_QUESTIONS_SLIDES[qIdx];
    const isCorrect = letter === currentQ.correctAnswerLetter;

    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: letter }));
    setIsAnswerConfirmed((prev) => ({ ...prev, [qIdx]: true }));

    if (isCorrect) {
      soundManager.playCorrect();
      setQuizScore((prev) => prev + 10);
    } else {
      soundManager.playIncorrect();
      setLives((prev) => Math.max(0, prev - 1));
    }

    // Check if this was the last question
    const answeredCount = Object.keys(isAnswerConfirmed).length + 1;
    if (answeredCount >= TOURIST_QUESTIONS_SLIDES.length) {
      setTimeout(() => {
        setQuizFinished(true);
        soundManager.playFanfare();
      }, 700);
    }
  };

  const handleResetQuiz = () => {
    soundManager.playClick();
    setSelectedAnswers({});
    setIsAnswerConfirmed({});
    setLives(3);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizSlideIndex(0);
  };

  const handleCompleteAndCertify = () => {
    soundManager.playFanfare();
    const correctCount = Object.entries(selectedAnswers).filter(
      ([idx, ans]) => ans === TOURIST_QUESTIONS_SLIDES[Number(idx)].correctAnswerLetter
    ).length;

    const totalQ = TOURIST_QUESTIONS_SLIDES.length;
    const accuracy = Math.round((correctCount / totalQ) * 100);
    const finalScore = correctCount * 10;
    const level = determineEnglishLevel(accuracy);

    const result: QuizResult = {
      id: `result-${Date.now()}`,
      participantId: participant?.id || `tourist-${Date.now()}`,
      participantName: participant?.fullName || localName || 'Tourist Guide Learner',
      participantType: participant?.participantType || localType,
      program: 'Tourist & Tour Guide',
      ficha: participant?.ficha || localFicha,
      totalQuestions: totalQ,
      correctAnswers: correctCount,
      incorrectAnswers: totalQ - correctCount,
      accuracyPercentage: accuracy,
      totalScore: finalScore,
      level,
      completedAt: new Date().toISOString(),
    };

    onFinishQuiz(result);
  };

  // Direction visual icon helper
  const renderDirectionIcon = (type: DirectionExpressionSlide['directionType']) => {
    switch (type) {
      case 'straight':
        return <MoveUp className="w-20 h-20 sm:w-28 sm:h-28 text-emerald-400 animate-pulse stroke-[2.5]" />;
      case 'left':
        return <CornerUpLeft className="w-20 h-20 sm:w-28 sm:h-28 text-cyan-400 stroke-[2.5]" />;
      case 'right':
        return <CornerUpRight className="w-20 h-20 sm:w-28 sm:h-28 text-amber-400 stroke-[2.5]" />;
      case 'past':
        return <Footprints className="w-20 h-20 sm:w-28 sm:h-28 text-purple-400 stroke-[2.5]" />;
      case 'cross':
        return <Split className="w-20 h-20 sm:w-28 sm:h-28 text-sky-400 stroke-[2.5]" />;
      case 'next_to':
        return <Building className="w-20 h-20 sm:w-28 sm:h-28 text-teal-400 stroke-[2.5]" />;
      case 'across':
        return <Compass className="w-20 h-20 sm:w-28 sm:h-28 text-rose-400 stroke-[2.5]" />;
      case 'between':
        return <Layers className="w-20 h-20 sm:w-28 sm:h-28 text-indigo-400 stroke-[2.5]" />;
      case 'corner':
        return <MapPin className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 stroke-[2.5]" />;
      default:
        return <Navigation className="w-20 h-20 sm:w-28 sm:h-28 text-emerald-400 stroke-[2.5]" />;
    }
  };

  // Active items
  const currentPlace = PLACES_SLIDES[placeIndex];
  const currentDirection = DIRECTIONS_SLIDES[directionIndex];
  const currentQuestion = TOURIST_QUESTIONS_SLIDES[quizSlideIndex];

  // --------------------------------------------------------------------------
  // PRESENTATION OVERLAY MODE ("Presentar" - FULLSCREEN & MAXIMUM SIZING)
  // --------------------------------------------------------------------------
  if (isPresentationMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-3 sm:p-6 lg:p-8 select-none w-screen h-screen overflow-hidden">
        {/* Top presentation toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="font-display font-black text-sm sm:text-lg tracking-widest uppercase text-emerald-400">
              TOURIST & TOUR GUIDE · FULL PRESENTATION
            </span>
            <span className="text-xs sm:text-sm px-3 py-1 rounded-lg bg-slate-800/90 text-slate-300 font-mono border border-slate-700">
              {activeSection === 'places' && `Section 1: Places (${placeIndex + 1} / ${PLACES_SLIDES.length})`}
              {activeSection === 'directions' &&
                `Section 2: Directions (${directionIndex + 1} / ${DIRECTIONS_SLIDES.length})`}
              {activeSection === 'quiz' &&
                `Section 3: Questionnaire (${quizSlideIndex + 1} / ${TOURIST_QUESTIONS_SLIDES.length})`}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 text-xs sm:text-sm font-bold"
              title="Alternar Pantalla Completa"
            >
              {isFullscreenActive ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
              <span className="hidden md:inline">{isFullscreenActive ? 'Salir Pantalla Completa' : 'Pantalla Completa'}</span>
            </button>
            <button
              onClick={handleExitPresentation}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-rose-100 border border-rose-500/40 transition text-xs sm:text-sm font-bold"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Center Presentation Slide Content - Occupies entire height & width */}
        <div className="flex-1 flex items-center justify-center py-2 px-2 sm:px-6 lg:px-10 w-full max-w-[1920px] mx-auto min-h-0 overflow-y-auto lg:overflow-hidden">
          {/* SECTION 1 PRESENTATION SLIDE (MASSIVE SIZE) */}
          {activeSection === 'places' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full h-full my-auto">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md">
                    {currentPlace.badge}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-mono tracking-wider">
                    SLIDE {currentPlace.slideNumber} DE {PLACES_SLIDES.length}
                  </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight leading-none drop-shadow-2xl">
                    {currentPlace.word}
                  </h1>
                  <button
                    onClick={() => speakText(`${currentPlace.word}. ${currentPlace.definition}`)}
                    className="p-3.5 sm:p-5 rounded-3xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/40 transition transform hover:scale-105 shadow-xl shrink-0"
                    title="Escuchar pronunciación"
                  >
                    <Volume2 className="w-8 h-8 sm:w-12 sm:h-12" />
                  </button>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700 shadow-2xl space-y-2">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400">
                    English Definition:
                  </span>
                  <p className="text-2xl sm:text-3xl md:text-4xl text-slate-100 font-semibold leading-relaxed">
                    "{currentPlace.definition}"
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">
                    Traducción al Español:
                  </div>
                  <div className="text-lg sm:text-2xl text-slate-200">
                    <strong className="text-emerald-400 font-bold">{currentPlace.spanishTitle}:</strong>{' '}
                    {currentPlace.spanishDefinition}
                  </div>
                </div>

                <div className="text-base sm:text-xl text-slate-300 italic flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <span><strong>Context:</strong> "{currentPlace.sampleSentence}"</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center h-full">
                <div className="relative group w-full h-[50vh] sm:h-[60vh] lg:h-[72vh] rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/20 bg-slate-900">
                  <img
                    src={currentPlace.imageUrl}
                    alt={currentPlace.word}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-85" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest">
                        {currentPlace.category}
                      </div>
                      <div className="text-xl sm:text-3xl font-display font-black text-white">{currentPlace.word}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2 PRESENTATION SLIDE (MASSIVE SIZE) */}
          {activeSection === 'directions' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full h-full my-auto">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md">
                    Giving Directions
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-mono tracking-wider">
                    EXPRESSION {currentDirection.slideNumber} DE {DIRECTIONS_SLIDES.length}
                  </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-none drop-shadow-2xl">
                    {currentDirection.expression}
                  </h1>
                  <button
                    onClick={() => speakText(`${currentDirection.expression}. ${currentDirection.definition}`)}
                    className="p-3.5 sm:p-5 rounded-3xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/40 transition transform hover:scale-105 shadow-xl shrink-0"
                    title="Escuchar pronunciación"
                  >
                    <Volume2 className="w-8 h-8 sm:w-12 sm:h-12" />
                  </button>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700 shadow-2xl space-y-2">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-400">
                    Meaning / Definition:
                  </span>
                  <p className="text-2xl sm:text-3xl md:text-4xl text-slate-100 font-semibold leading-relaxed">
                    "{currentDirection.definition}"
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">
                    Traducción al Español:
                  </div>
                  <div className="text-lg sm:text-2xl text-slate-200">
                    <strong className="text-cyan-400 font-bold">{currentDirection.spanishTitle}:</strong>{' '}
                    {currentDirection.spanishDefinition}
                  </div>
                </div>

                <div className="text-base sm:text-xl text-slate-300 italic flex items-center gap-2">
                  <span className="text-xl">🧭</span>
                  <span><strong>Tour Guide Tip:</strong> "{currentDirection.tip}"</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 h-full">
                <div className="relative group w-full h-[45vh] sm:h-[50vh] lg:h-[56vh] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-slate-950 flex items-center justify-center p-3">
                  <img
                    src={currentDirection.imageUrl}
                    alt={currentDirection.expression}
                    className="max-w-full max-h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-400/40 shadow-xl">
                    {renderDirectionIcon(currentDirection.directionType)}
                  </div>
                </div>

                <div className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 shadow-lg">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Example:</div>
                  <div className="text-base sm:text-lg text-slate-100 font-medium mt-0.5">"{currentDirection.sampleSentence}"</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3 PRESENTATION SLIDE (MASSIVE SIZE QUESTIONNAIRE OCCUPYING FULL SCREEN) */}
          {activeSection === 'quiz' && (
            <div className="w-full h-full my-auto flex flex-col justify-center">
              {quizFinished ? (
                <div className="text-center space-y-8 max-w-4xl mx-auto py-8">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                    <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white">
                      ¡Cuestionario Completado!
                    </h2>
                    <p className="text-2xl sm:text-4xl text-slate-300 font-semibold">
                      Puntaje Final: <strong className="text-amber-400 font-black">{quizScore} / 100 puntos</strong>
                    </p>
                    <p className="text-lg sm:text-2xl text-slate-400">
                      Has respondido las 10 preguntas de Tourist & Tour Guide.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                    <button
                      onClick={handleResetQuiz}
                      className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg sm:text-xl transition shadow-xl"
                    >
                      <RotateCcw className="w-6 h-6" />
                      <span>Intentar de nuevo</span>
                    </button>
                    <button
                      onClick={handleCompleteAndCertify}
                      className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg sm:text-xl transition shadow-2xl"
                    >
                      <Sparkles className="w-6 h-6" />
                      <span>Generar Certificado Oficial</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full h-full my-auto">
                  {/* Left Column: Huge Question + Options (lg:col-span-7) */}
                  <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md">
                          Tourist Guide Questionnaire
                        </span>
                        <span className="text-sm sm:text-base text-slate-400 font-mono tracking-wider">
                          PREGUNTA {currentQuestion.questionNumber} DE {TOURIST_QUESTIONS_SLIDES.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3].map((heart) => (
                            <Heart
                              key={heart}
                              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                                heart <= lives
                                  ? 'fill-rose-500 text-rose-500'
                                  : 'fill-transparent text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="px-3.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-black text-sm sm:text-base">
                          {quizScore} pts
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white leading-tight tracking-tight drop-shadow-xl">
                        {currentQuestion.prompt}
                      </h2>
                      <button
                        onClick={() => speakText(currentQuestion.prompt)}
                        className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 border border-amber-500/40 transition transform hover:scale-105 shadow-xl shrink-0"
                        title="Escuchar pregunta en inglés"
                      >
                        <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" />
                      </button>
                    </div>

                    {/* Massive options */}
                    <div className="grid grid-cols-1 gap-3.5 sm:gap-4 pt-1">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = selectedAnswers[quizSlideIndex] === opt.letter;
                        const isAnswered = isAnswerConfirmed[quizSlideIndex];
                        const isOptionCorrect = opt.letter === currentQuestion.correctAnswerLetter;

                        let btnStyle =
                          'bg-slate-900/90 border-slate-700/80 text-slate-100 hover:bg-slate-800 hover:border-amber-400/60 shadow-lg';
                        if (isAnswered) {
                          if (isOptionCorrect) {
                            btnStyle =
                              'bg-emerald-600/35 border-emerald-400 text-emerald-100 font-black shadow-2xl shadow-emerald-950/70 ring-2 ring-emerald-400/50';
                          } else if (isSelected) {
                            btnStyle =
                              'bg-rose-600/35 border-rose-400 text-rose-100 shadow-2xl shadow-rose-950/70 ring-2 ring-rose-400/50';
                          } else {
                            btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-amber-500/30 border-amber-400 text-white ring-2 ring-amber-400/60';
                        }

                        return (
                          <button
                            key={opt.letter}
                            onClick={() => handleSelectOption(quizSlideIndex, opt.letter)}
                            disabled={isAnswered}
                            className={`w-full p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-2 sm:border-3 text-left flex items-center justify-between transition-all transform hover:scale-[1.01] ${btnStyle}`}
                          >
                            <div className="flex items-center gap-4 sm:gap-6">
                              <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black text-2xl sm:text-3xl bg-slate-950 border-2 border-slate-700 text-amber-400 shrink-0 shadow-inner">
                                {opt.letter}
                              </span>
                              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
                                {opt.text}
                              </span>
                            </div>

                            {isAnswered && isOptionCorrect && (
                              <div className="flex items-center gap-2 text-emerald-400 font-black text-xl sm:text-2xl shrink-0">
                                <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9" />
                                <span className="hidden sm:inline">Correcto</span>
                              </div>
                            )}
                            {isAnswered && isSelected && !isOptionCorrect && (
                              <div className="flex items-center gap-2 text-rose-400 font-black text-xl sm:text-2xl shrink-0">
                                <XCircle className="w-7 h-7 sm:w-9 sm:h-9" />
                                <span className="hidden sm:inline">Incorrecto</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Massive Explanation Box */}
                    {isAnswerConfirmed[quizSlideIndex] && (
                      <div className="p-5 sm:p-7 rounded-3xl bg-slate-950/95 border-2 border-slate-700 space-y-2 shadow-2xl animate-fadeIn">
                        <div className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6" />
                          <span>Explicación / Pedagogical Note:</span>
                        </div>
                        <p className="text-lg sm:text-2xl text-slate-100 font-semibold leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Giant Visual Hint / Question Illustration (lg:col-span-5) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center h-full space-y-3">
                    <div className="relative group w-full h-[45vh] sm:h-[55vh] lg:h-[65vh] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-amber-950/50 bg-slate-950 flex items-center justify-center p-3">
                      <img
                        src={currentQuestion.imageUrl}
                        alt={currentQuestion.prompt}
                        className="max-w-full max-h-full object-contain rounded-2xl transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-xs sm:text-sm font-bold text-amber-300 shadow-xl flex items-center gap-2">
                        <span>💡</span>
                        <span>Visual Context / Pista</span>
                      </div>
                      <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 font-mono shadow-md">
                        Pregunta #{currentQuestion.questionNumber}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation Toolbar - Full width, large controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 sm:pt-4 shrink-0">
          <button
            onClick={handlePrevSlide}
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-base sm:text-lg transition shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-xl px-2">
            {activeSection === 'places' &&
              PLACES_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundManager.playClick();
                    setPlaceIndex(idx);
                  }}
                  className={`h-3 sm:h-3.5 rounded-full transition-all ${
                    idx === placeIndex ? 'w-10 sm:w-14 bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'w-3 sm:w-3.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Diapositiva ${idx + 1}: ${s.word}`}
                />
              ))}

            {activeSection === 'directions' &&
              DIRECTIONS_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundManager.playClick();
                    setDirectionIndex(idx);
                  }}
                  className={`h-3 sm:h-3.5 rounded-full transition-all ${
                    idx === directionIndex ? 'w-10 sm:w-14 bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'w-3 sm:w-3.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Diapositiva ${idx + 1}: ${s.expression}`}
                />
              ))}

            {activeSection === 'quiz' &&
              TOURIST_QUESTIONS_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundManager.playClick();
                    setQuizSlideIndex(idx);
                  }}
                  className={`h-3 sm:h-3.5 rounded-full transition-all ${
                    idx === quizSlideIndex ? 'w-10 sm:w-14 bg-amber-400 shadow-lg shadow-amber-400/50' : 'w-3 sm:w-3.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Pregunta ${idx + 1}`}
                />
              ))}
          </div>

          <button
            onClick={handleNextSlide}
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg transition shadow-xl shadow-emerald-600/30"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STANDARD INTERACTIVE MODULE VIEW (Tabs & Deck Controls)
  // --------------------------------------------------------------------------
  return (
    <div className="w-full max-w-[1440px] mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8 flex flex-col justify-start">
      {/* Top Header / Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToMenu();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Temas</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                MÓDULO 10
              </span>
              <span className="text-xs text-slate-400 font-mono">Global Tourism District</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
              Tourist & Tour Guide
            </h1>
          </div>
        </div>

        {/* Presentar button (Launches Fullscreen Slides) */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleStartPresentation}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black shadow-xl shadow-emerald-950/60 border border-emerald-400/40 transition transform hover:scale-105"
          >
            <Maximize2 className="w-5 h-5 text-emerald-200 animate-pulse" />
            <span className="uppercase tracking-wider text-sm sm:text-base">Presentar en Pantalla Completa</span>
          </button>
        </div>
      </div>

      {/* 3 Section Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveSection('places');
          }}
          className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
            activeSection === 'places'
              ? 'bg-emerald-950/70 border-emerald-500 shadow-xl shadow-emerald-950/60 scale-[1.01]'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base ${
                activeSection === 'places'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              1
            </div>
            <div>
              <div
                className={`text-base font-bold ${
                  activeSection === 'places' ? 'text-white' : 'text-slate-300'
                }`}
              >
                Tourism Vocabulary
              </div>
              <div className="text-xs text-emerald-400/90 font-medium">Places · 8 Diapositivas</div>
            </div>
          </div>
          <Building
            className={`w-6 h-6 ${
              activeSection === 'places' ? 'text-emerald-400' : 'text-slate-600'
            }`}
          />
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveSection('directions');
          }}
          className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
            activeSection === 'directions'
              ? 'bg-cyan-950/70 border-cyan-500 shadow-xl shadow-cyan-950/60 scale-[1.01]'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base ${
                activeSection === 'directions'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              2
            </div>
            <div>
              <div
                className={`text-base font-bold ${
                  activeSection === 'directions' ? 'text-white' : 'text-slate-300'
                }`}
              >
                Giving Directions
              </div>
              <div className="text-xs text-cyan-400/90 font-medium">Useful Expressions · 9 Diapositivas</div>
            </div>
          </div>
          <Navigation
            className={`w-6 h-6 ${
              activeSection === 'directions' ? 'text-cyan-400' : 'text-slate-600'
            }`}
          />
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveSection('quiz');
          }}
          className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
            activeSection === 'quiz'
              ? 'bg-amber-950/70 border-amber-500 shadow-xl shadow-amber-950/60 scale-[1.01]'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base ${
                activeSection === 'quiz'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              3
            </div>
            <div>
              <div
                className={`text-base font-bold ${
                  activeSection === 'quiz' ? 'text-white' : 'text-slate-300'
                }`}
              >
                Questionnaire
              </div>
              <div className="text-xs text-amber-400/90 font-medium">Multiple Choice · 10 Preguntas</div>
            </div>
          </div>
          <HelpCircle
            className={`w-6 h-6 ${
              activeSection === 'quiz' ? 'text-amber-400' : 'text-slate-600'
            }`}
          />
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 1: TOURISM VOCABULARY - PLACES (8 SLIDES)                      */}
      {/* ---------------------------------------------------------------------- */}
      {activeSection === 'places' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Top row with slide counter & speak button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {currentPlace.badge}
                </span>
                <span className="text-sm font-mono text-slate-400">
                  Diapositiva {placeIndex + 1} de {PLACES_SLIDES.length}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => speakText(`${currentPlace.word}. ${currentPlace.definition}`)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition text-sm font-semibold border border-slate-700"
                  title="Pronunciación en inglés"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Audio</span>
                </button>
                <button
                  onClick={handleStartPresentation}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition text-sm font-bold shadow-md"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Presentar</span>
                </button>
              </div>
            </div>

            {/* Slide Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
                    Palabra / Word:
                  </span>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight mt-1 leading-none">
                    {currentPlace.word}
                  </h2>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 shadow-inner">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Definición en Inglés:
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl text-slate-100 font-semibold leading-relaxed">
                    "{currentPlace.definition}"
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-300 space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Significado en Español:
                  </div>
                  <div className="text-lg sm:text-xl text-slate-200">
                    <strong className="text-emerald-400 font-bold">{currentPlace.spanishTitle}:</strong>{' '}
                    {currentPlace.spanishDefinition}
                  </div>
                </div>

                <div className="text-base text-slate-400 italic">
                  💬 <strong className="text-slate-300">Ejemplo de uso:</strong> "{currentPlace.sampleSentence}"
                </div>
              </div>

              <div className="lg:col-span-5">
                <div
                  onClick={() =>
                    setModalImage({
                      url: currentPlace.imageUrl,
                      title: currentPlace.word,
                      caption: currentPlace.definition,
                    })
                  }
                  className="relative group cursor-pointer w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl"
                >
                  <img
                    src={currentPlace.imageUrl}
                    alt={currentPlace.word}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent opacity-85" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs sm:text-sm text-slate-200">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider">{currentPlace.category}</span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 opacity-90 group-hover:opacity-100 font-medium">
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> Clic para Ampliar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Navigation Buttons & Dots */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800/60">
              <button
                onClick={handlePrevSlide}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior Diapositiva</span>
              </button>

              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {PLACES_SLIDES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundManager.playClick();
                      setPlaceIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === placeIndex ? 'w-8 bg-emerald-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={p.word}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-950/50 w-full sm:w-auto justify-center"
              >
                <span>Siguiente Diapositiva</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Grid Selector for All 8 Words */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLACES_SLIDES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  soundManager.playClick();
                  setPlaceIndex(idx);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  idx === placeIndex
                    ? 'bg-emerald-950/50 border-emerald-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs text-emerald-400/80 font-mono">#{idx + 1}</div>
                <div className="font-bold text-sm text-slate-200 mt-1">{p.word}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{p.spanishTitle}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 2: GIVING DIRECTIONS – USEFUL EXPRESSIONS (9 SLIDES)           */}
      {/* ---------------------------------------------------------------------- */}
      {activeSection === 'directions' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Top row with slide counter & speak button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  Direcciones
                </span>
                <span className="text-sm font-mono text-slate-400">
                  Expresión {directionIndex + 1} de {DIRECTIONS_SLIDES.length}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() =>
                    speakText(`${currentDirection.expression}. ${currentDirection.definition}`)
                  }
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition text-sm font-semibold border border-slate-700"
                  title="Pronunciación en inglés"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Audio</span>
                </button>
                <button
                  onClick={handleStartPresentation}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 transition text-sm font-bold shadow-md"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Presentar</span>
                </button>
              </div>
            </div>

            {/* Slide Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl shrink-0">
                    {renderDirectionIcon(currentDirection.directionType)}
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">
                      Expresión / Useful Expression:
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight mt-0.5 leading-none">
                      {currentDirection.expression}
                    </h2>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 shadow-inner">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Significado en Inglés / Meaning:
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl text-slate-100 font-semibold leading-relaxed">
                    "{currentDirection.definition}"
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-300 space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Traducción al Español:
                  </div>
                  <div className="text-lg sm:text-xl text-slate-200">
                    <strong className="text-cyan-400 font-bold">{currentDirection.spanishTitle}:</strong>{' '}
                    {currentDirection.spanishDefinition}
                  </div>
                </div>

                <div className="text-base text-slate-300 italic">
                  💬 <strong className="text-slate-200">Ejemplo de uso:</strong> "{currentDirection.sampleSentence}"
                </div>

                <div className="text-base text-slate-400 italic">
                  🧭 <strong className="text-slate-300">Guía práctica:</strong> "{currentDirection.tip}"
                </div>
              </div>

              <div className="lg:col-span-5">
                <div
                  onClick={() =>
                    setModalImage({
                      url: currentDirection.imageUrl,
                      title: currentDirection.expression,
                      caption: currentDirection.sampleSentence,
                    })
                  }
                  className="relative group cursor-pointer w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl flex items-center justify-center p-3"
                >
                  <img
                    src={currentDirection.imageUrl}
                    alt={currentDirection.expression}
                    className="max-w-full max-h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 opacity-90 group-hover:opacity-100 font-medium shadow-xl">
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Clic para Ampliar
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Navigation Buttons & Dots */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800/60">
              <button
                onClick={handlePrevSlide}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior Expresión</span>
              </button>

              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {DIRECTIONS_SLIDES.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      soundManager.playClick();
                      setDirectionIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === directionIndex ? 'w-8 bg-cyan-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={d.expression}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow-lg shadow-cyan-950/50 w-full sm:w-auto justify-center"
              >
                <span>Siguiente Expresión</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Grid Selector for All 9 Expressions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DIRECTIONS_SLIDES.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => {
                  soundManager.playClick();
                  setDirectionIndex(idx);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  idx === directionIndex
                    ? 'bg-cyan-950/50 border-cyan-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs text-cyan-400/80 font-mono">#{idx + 1}</div>
                <div className="font-bold text-sm text-slate-200 mt-1">{d.expression}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{d.spanishTitle}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 3: QUESTIONNAIRE – MULTIPLE CHOICE (10 SLIDES)                 */}
      {/* ---------------------------------------------------------------------- */}
      {activeSection === 'quiz' && (
        <div className="space-y-6">
          {/* Registration banner if not registered yet */}
          {!isRegistered && (
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-amber-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Registro para Certificado & Ranking de Tourist Guide
                </h3>
              </div>
              <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Rol en SENA
                  </label>
                  <select
                    value={localType}
                    onChange={(e) => setLocalType(e.target.value as 'Aprendiz' | 'Instructor')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Aprendiz">Aprendiz</option>
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
                  >
                    Confirmar Registro
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quiz Card - Massive High-Impact Slide Format */}
          <div className="bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Quiz Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Pregunta {quizSlideIndex + 1} de {TOURIST_QUESTIONS_SLIDES.length}
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-200">
                  Puntaje: <strong className="text-amber-400 font-black">{quizScore} pts</strong>
                </span>
                <div className="flex items-center gap-1.5 ml-2">
                  {[1, 2, 3].map((heart) => (
                    <Heart
                      key={heart}
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        heart <= lives
                          ? 'fill-rose-500 text-rose-500'
                          : 'fill-transparent text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => speakText(currentQuestion.prompt)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition text-sm font-semibold border border-slate-700"
                  title="Pronunciación de la pregunta"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Audio</span>
                </button>
                <button
                  onClick={handleStartPresentation}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 transition transform hover:scale-105"
                  title="Ampliar diapositivas a pantalla completa"
                >
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Presentar en Pantalla Completa</span>
                </button>
              </div>
            </div>

            {/* If Quiz is finished, show congratulations screen */}
            {quizFinished ? (
              <div className="py-10 text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-2xl">
                  <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white">
                    ¡Cuestionario de Tourist Guide Completado!
                  </h2>
                  <p className="text-slate-300 text-lg sm:text-xl mt-3">
                    Has respondido las 10 preguntas con un puntaje de{' '}
                    <strong className="text-amber-400 font-black">{quizScore} / 100 puntos</strong>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-base transition w-full sm:w-auto justify-center"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Intentar de nuevo</span>
                  </button>
                  <button
                    onClick={handleCompleteAndCertify}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base transition shadow-xl shadow-emerald-500/20 w-full sm:w-auto justify-center"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generar Certificado Oficial</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Question Slide Interactive Viewer in 12-Column Layout */
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Big Question Title & Options (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs sm:text-sm font-black tracking-widest text-amber-400 uppercase">
                        Pregunta #{currentQuestion.questionNumber} de {TOURIST_QUESTIONS_SLIDES.length}:
                      </span>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight">
                        {currentQuestion.prompt}
                      </h3>
                    </div>

                    {/* Question Options with massive readable letters and text */}
                    <div className="grid grid-cols-1 gap-3.5 pt-2">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = selectedAnswers[quizSlideIndex] === opt.letter;
                        const isAnswered = isAnswerConfirmed[quizSlideIndex];
                        const isOptionCorrect = opt.letter === currentQuestion.correctAnswerLetter;

                        let btnStyle =
                          'bg-slate-950/80 border-slate-800 text-slate-100 hover:bg-slate-800/90 hover:border-slate-700 shadow-md';
                        if (isAnswered) {
                          if (isOptionCorrect) {
                            btnStyle =
                              'bg-emerald-600/30 border-emerald-500 text-emerald-100 font-bold shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/50';
                          } else if (isSelected) {
                            btnStyle =
                              'bg-rose-600/30 border-rose-500 text-rose-100 shadow-lg shadow-rose-950/50 ring-2 ring-rose-500/50';
                          } else {
                            btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-amber-500/30 border-amber-500 text-white ring-2 ring-amber-500/60';
                        }

                        return (
                          <button
                            key={opt.letter}
                            onClick={() => handleSelectOption(quizSlideIndex, opt.letter)}
                            disabled={isAnswered}
                            className={`w-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-left flex items-center justify-between transition-all ${btnStyle}`}
                          >
                            <div className="flex items-center gap-4 sm:gap-5">
                              <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl bg-slate-900 border-2 border-slate-700 text-amber-400 shrink-0">
                                {opt.letter}
                              </span>
                              <span className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug">
                                {opt.text}
                              </span>
                            </div>
                            {isAnswered && isOptionCorrect && (
                              <div className="flex items-center gap-2 text-emerald-400 text-base sm:text-xl font-bold shrink-0">
                                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                                <span>Correcta</span>
                              </div>
                            )}
                            {isAnswered && isSelected && !isOptionCorrect && (
                              <div className="flex items-center gap-2 text-rose-400 text-base sm:text-xl font-bold shrink-0">
                                <XCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                                <span>Incorrecta</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isAnswerConfirmed[quizSlideIndex] && (
                      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/95 border border-slate-800 space-y-1.5 shadow-inner animate-fadeIn">
                        <div className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Respuesta Correcta: {currentQuestion.correctAnswerLetter}. {currentQuestion.correctAnswerText}</span>
                        </div>
                        <p className="text-base sm:text-xl text-slate-200 font-medium leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Question Visual Hint / Context Image (5 cols) */}
                  <div className="lg:col-span-5">
                    <div
                      onClick={() =>
                        currentQuestion.imageUrl &&
                        setModalImage({
                          url: currentQuestion.imageUrl,
                          title: `Pregunta #${currentQuestion.questionNumber}: ${currentQuestion.prompt}`,
                          caption: `Respuesta correcta: ${currentQuestion.correctAnswerLetter}. ${currentQuestion.correctAnswerText}`,
                        })
                      }
                      className="relative group cursor-pointer w-full h-[360px] sm:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl flex items-center justify-center p-3"
                    >
                      <img
                        src={currentQuestion.imageUrl}
                        alt={currentQuestion.prompt}
                        className="max-w-full max-h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-amber-300 shadow-md">
                          💡 Pista Visual / Context
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 opacity-90 group-hover:opacity-100 font-medium shadow-md">
                          <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Clic para Ampliar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation for Questions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/60">
                  <button
                    onClick={handlePrevSlide}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-base transition w-full sm:w-auto justify-center"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Pregunta Anterior</span>
                  </button>

                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {TOURIST_QUESTIONS_SLIDES.map((q, idx) => {
                      const isAnswered = isAnswerConfirmed[idx];
                      const isCorrect = selectedAnswers[idx] === q.correctAnswerLetter;
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            soundManager.playClick();
                            setQuizSlideIndex(idx);
                          }}
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center ${
                            idx === quizSlideIndex
                              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-lg shadow-amber-400/30'
                              : isAnswered
                              ? isCorrect
                                ? 'bg-emerald-600/70 text-white'
                                : 'bg-rose-600/70 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextSlide}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base transition shadow-lg shadow-amber-500/20 w-full sm:w-auto justify-center"
                  >
                    <span>Siguiente Pregunta</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal image viewer if user taps image */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={modalImage.url}
                alt={modalImage.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <h3 className="text-xl font-bold text-white">{modalImage.title}</h3>
              {modalImage.caption && (
                <p className="text-sm text-slate-300 mt-1">{modalImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
