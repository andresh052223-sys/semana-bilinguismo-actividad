import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Heart,
  Trophy,
  Sparkles,
  FileText,
  Footprints,
  Package,
  Compass,
  Tent,
  Moon,
  Utensils,
  Navigation,
  Droplets,
  Eye,
  Camera,
  Book,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Lightbulb,
  Tv,
  Layers,
} from 'lucide-react';
import { soundManager } from '../services/audioService';
import {
  TREKING_STUDY_CONTENT,
  TREKING_12_QUESTIONS,
  TREKING_13_PRESENTATION_SLIDES,
  TrekingPresentationSlide,
} from '../data/trekingData';
import { ParticipantData, QuizResult } from '../types/quiz';
import { determineEnglishLevel } from '../services/quizEngine';

// 13 Standalone Article Slides Deck
const TREKING_SLIDES_DECK = TREKING_13_PRESENTATION_SLIDES;

const getQuestionImage = (qNum: number): string => {
  switch (qNum) {
    case 1:
      return '/assets/aistudio/item_hiking_boots.png';
    case 2:
      return '/assets/aistudio/item_backpack.png';
    case 3:
      return '/assets/aistudio/item_tent.png';
    case 4:
      return '/assets/aistudio/item_sleeping_bag.png';
    case 5:
      return '/assets/aistudio/item_map_compass.png';
    case 6:
      return '/assets/aistudio/item_binoculars.png';
    case 7:
      return '/assets/aistudio/item_bird_guide.png';
    case 8:
      return '/assets/aistudio/item_notebook_pencil.jpg';
    case 9:
      return '/assets/aistudio/slide_img_1_hiking_trekking.jpg';
    case 10:
      return '/assets/aistudio/item_birdwatching_desk.png';
    case 11:
      return '/assets/aistudio/item_water_bottle.jpg';
    case 12:
      return '/assets/aistudio/item_poles_hd.jpg';
    default:
      return '/assets/aistudio/slide_img_1_hiking_trekking.jpg';
  }
};

interface TrekkingModuleProps {
  participant: ParticipantData | null;
  onUpdateParticipant: (participant: ParticipantData) => void;
  onFinishQuiz: (result: QuizResult) => void;
  onBackToMenu: () => void;
  isTvMode: boolean;
}

export const TrekkingModule: React.FC<TrekkingModuleProps> = ({
  participant,
  onUpdateParticipant,
  onFinishQuiz,
  onBackToMenu,
  isTvMode,
}) => {
  // Part 1: Information / Study Guide | Part 2: 12 Questions Questionnaire
  const [activePart, setActivePart] = useState<'part1' | 'part2'>('part1');

  // Slide Deck state for Part 1 (12 Slides matching the screenshots)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [modalImage, setModalImage] = useState<{ url: string; title: string; caption?: string } | null>(
    null
  );

  // Registration state if learner has not entered details yet
  const [localName, setLocalName] = useState(participant?.fullName || '');
  const [localType, setLocalType] = useState<'Aprendiz' | 'Instructor'>(
    participant?.participantType || 'Aprendiz'
  );
  const [localFicha, setLocalFicha] = useState(participant?.ficha || '');
  const [isRegistered, setIsRegistered] = useState(Boolean(participant?.fullName));

  // Quiz state for the 12 questions
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Record<number, { selected: string; isCorrect: boolean }>
  >({});

  // Audio Speech synthesis
  const speakText = (text: string) => {
    soundManager.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartPart2 = () => {
    soundManager.playClick();
    setActivePart('part2');
  };

  // Presentation Mode Handlers
  const handleOpenPresentation = (index?: number) => {
    soundManager.playClick();
    if (activePart === 'part1' && typeof index === 'number') {
      setCurrentSlideIndex(index);
    }
    setIsPresentationMode(true);
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          setIsFullscreenActive(true);
        }).catch(() => {});
      }
    } catch {
      // Graceful fallback if fullscreen is blocked by browser policies
    }
  };

  const handleSwitchPresentationPart = (part: 'part1' | 'part2') => {
    soundManager.playClick();
    setActivePart(part);
  };

  const handleClosePresentation = () => {
    soundManager.playClick();
    setIsPresentationMode(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreenActive(false);
        }).catch(() => {});
      }
    } catch {
      // Graceful fallback
    }
  };

  const toggleBrowserFullscreen = () => {
    soundManager.playClick();
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().then(() => {
            setIsFullscreenActive(true);
          }).catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            setIsFullscreenActive(false);
          }).catch(() => {});
        }
      }
    } catch {
      // Graceful fallback
    }
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isPresentationMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (activePart === 'part1') {
          setCurrentSlideIndex((prev) => {
            if (prev < TREKING_SLIDES_DECK.length - 1) {
              soundManager.playClick();
              return prev + 1;
            }
            return prev;
          });
        } else {
          setCurrentIndex((prev) => {
            const nextIdx = Math.min(prev + 1, TREKING_12_QUESTIONS.length - 1);
            if (nextIdx !== prev) {
              soundManager.playClick();
              const prevAnswer = answeredQuestions[nextIdx];
              if (prevAnswer) {
                setSelectedOption(prevAnswer.selected);
                setIsAnswered(true);
                setIsCorrect(prevAnswer.isCorrect);
              } else {
                setSelectedOption(null);
                setIsAnswered(false);
                setIsCorrect(false);
              }
              return nextIdx;
            }
            return prev;
          });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activePart === 'part1') {
          setCurrentSlideIndex((prev) => {
            if (prev > 0) {
              soundManager.playClick();
              return prev - 1;
            }
            return prev;
          });
        } else {
          setCurrentIndex((prev) => {
            const prevIdx = Math.max(0, prev - 1);
            if (prevIdx !== prev) {
              soundManager.playClick();
              const prevAnswer = answeredQuestions[prevIdx];
              if (prevAnswer) {
                setSelectedOption(prevAnswer.selected);
                setIsAnswered(true);
                setIsCorrect(prevAnswer.isCorrect);
              } else {
                setSelectedOption(null);
                setIsAnswered(false);
                setIsCorrect(false);
              }
              return prevIdx;
            }
            return prev;
          });
        }
      } else if (e.key === 'Escape') {
        handleClosePresentation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, activePart, answeredQuestions]);

  // Track browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenActive(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      soundManager.playClick();
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleNextSlide = () => {
    soundManager.playClick();
    if (currentSlideIndex < TREKING_SLIDES_DECK.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      handleStartPart2();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localName.trim()) return;

    soundManager.playClick();
    const newParticipant: ParticipantData = {
      id: participant?.id || `part-${Date.now()}`,
      fullName: localName.trim(),
      participantType: localType,
      program: 'TREKING',
      ficha: localFicha.trim() || undefined,
      createdAt: participant?.createdAt || new Date().toISOString(),
    };
    onUpdateParticipant(newParticipant);
    setIsRegistered(true);
  };

  const currentQuestion = TREKING_12_QUESTIONS[currentIndex];

  const handleJumpToQuestion = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= TREKING_12_QUESTIONS.length) return;
    soundManager.playClick();
    setCurrentIndex(targetIdx);
    const prevAnswer = answeredQuestions[targetIdx];
    if (prevAnswer) {
      setSelectedOption(prevAnswer.selected);
      setIsAnswered(true);
      setIsCorrect(prevAnswer.isCorrect);
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered || quizFinished) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isAnsCorrect =
      option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsCorrect(isAnsCorrect);

    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentIndex]: { selected: option, isCorrect: isAnsCorrect },
    }));

    if (isAnsCorrect) {
      soundManager.playCorrect();
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + 10);
    } else {
      soundManager.playIncorrect();
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      handleJumpToQuestion(currentIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (lives <= 0 || currentIndex + 1 >= TREKING_12_QUESTIONS.length) {
      finishTrekingQuiz();
    } else {
      handleJumpToQuestion(currentIndex + 1);
    }
  };

  const finishTrekingQuiz = () => {
    const finalAccuracy = Math.round((correctCount / TREKING_12_QUESTIONS.length) * 100);
    const finalScore = correctCount * 10;
    const finalLevel = determineEnglishLevel(finalAccuracy);

    const result: QuizResult = {
      id: `result-${Date.now()}`,
      participantId: participant?.id || `part-${Date.now()}`,
      participantName: participant?.fullName || localName.trim() || 'Participante Treking',
      participantType: participant?.participantType || localType,
      program: 'TREKING',
      ficha: participant?.ficha || localFicha.trim() || undefined,
      totalQuestions: TREKING_12_QUESTIONS.length,
      correctAnswers: correctCount,
      incorrectAnswers: TREKING_12_QUESTIONS.length - correctCount,
      accuracyPercentage: finalAccuracy,
      totalScore: finalScore,
      level: finalLevel,
      completedAt: new Date().toISOString(),
    };

    setQuizFinished(true);
    soundManager.playFanfare();
    onFinishQuiz(result);
  };

  const handleRestartQuiz = () => {
    soundManager.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setCorrectCount(0);
    setLives(3);
    setQuizFinished(false);
    setAnsweredQuestions({});
  };

  const renderEquipmentIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-6 h-6 text-emerald-400" />;
      case 'Package':
        return <Package className="w-6 h-6 text-teal-400" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-amber-400" />;
      case 'Tent':
        return <Tent className="w-6 h-6 text-emerald-400" />;
      case 'Moon':
        return <Moon className="w-6 h-6 text-indigo-400" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6 text-orange-400" />;
      case 'Navigation':
        return <Navigation className="w-6 h-6 text-sky-400" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-blue-400" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-purple-400" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-cyan-400" />;
      case 'Book':
        return <Book className="w-6 h-6 text-lime-400" />;
      case 'Camera':
        return <Camera className="w-6 h-6 text-rose-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-red-400" />;
      default:
        return <Compass className="w-6 h-6 text-emerald-400" />;
    }
  };

  // Render a single slide body matching the screenshots exactly
  const renderSlideContent = (slide: TrekingPresentationSlide, isPresentation = false) => {
    return (
      <div className="w-full">
        {/* Top Slide Badge & Subtitle */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase">
            <span>{slide.badge || `DIAPOSITIVA ${slide.slideNumber} DE ${TREKING_SLIDES_DECK.length}`}</span>
          </div>
          <span className="text-xs sm:text-sm text-slate-400 font-medium">
            Bilingualism Week · 13 Artículos de Treking
          </span>
        </div>

        {/* TYPE 0: STANDALONE ARTICLE SLIDE (13 Standalone Slides: 1 Item Per Slide) */}
        {(slide.type === 'article' || Boolean(slide.itemNameEn)) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left 6 Columns: Extra-Large Item Image Showcase - Fills the space completely */}
            <div className={`flex flex-col items-center justify-center ${isPresentation ? 'lg:col-span-6' : 'lg:col-span-5'}`}>
              <div
                onClick={() =>
                  slide.itemImage &&
                  setModalImage({
                    url: slide.itemImage,
                    title: slide.itemNameEn || 'Artículo de Treking',
                    caption: slide.purposeEn,
                  })
                }
                className={`group relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 hover:border-emerald-400 transition-all shadow-2xl cursor-pointer bg-slate-950 w-full flex items-center justify-center ${
                  isPresentation
                    ? 'aspect-[16/10] max-h-[58vh] sm:max-h-[64vh]'
                    : 'aspect-[16/10] max-h-[44vh] sm:max-h-[50vh]'
                }`}
              >
                {slide.itemImage ? (
                  <img
                    src={slide.itemImage}
                    alt={slide.itemNameEn || 'Artículo de Treking'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="p-8 text-emerald-400">
                    {renderEquipmentIcon(slide.iconName)}
                  </div>
                )}

                {/* Subtle dark gradient overlay at bottom for maximum contrast */}
                <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

                {/* Top Right Zoom Icon */}
                <div className="absolute top-4 right-4 p-2.5 rounded-2xl bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-xl border border-slate-700">
                  <Maximize2 className="w-5 h-5 text-emerald-400" />
                </div>

                {/* Bottom Overlay Info Pill */}
                <div className="absolute bottom-3 sm:bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 pointer-events-none text-left flex items-center justify-between shadow-2xl">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">
                      ARTÍCULO #{slide.slideNumber} DE 13
                    </span>
                    <span className="text-sm sm:text-base text-white font-bold leading-tight">
                      {slide.itemNameEn}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 text-emerald-400">
                    {renderEquipmentIcon(slide.iconName)}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic text-center mt-2.5">
                Haz clic en la imagen para ampliar en alta definición
              </p>
            </div>

            {/* Right 6 Columns: Giant Text, Pronunciation, Meaning and Tips */}
            <div className={`flex flex-col justify-center space-y-5 ${isPresentation ? 'lg:col-span-6' : 'lg:col-span-7'}`}>
              {/* Category Badge & Pronunciation Audio */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
                  {slide.headerCategory || slide.categoryEs || 'EQUIPAMIENTO DE TREKKING'}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    speakText(
                      slide.audioScript || `${slide.itemNameEn}. ${slide.purposeEn}`
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-850 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-750 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
                  title="Escuchar pronunciación en inglés"
                >
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span>Pronunciar</span>
                </button>
              </div>

              {/* Giant Name in English and Spanish */}
              <div>
                <h2
                  className={`font-display font-black text-white tracking-tight uppercase leading-tight ${
                    isPresentation
                      ? 'text-4xl sm:text-6xl lg:text-7xl xl:text-8xl'
                      : 'text-3xl sm:text-5xl lg:text-6xl'
                  }`}
                >
                  {slide.itemNameEn}
                </h2>
                <h3
                  className={`font-bold text-emerald-400 mt-2 ${
                    isPresentation
                      ? 'text-2xl sm:text-3xl lg:text-4xl'
                      : 'text-xl sm:text-2xl lg:text-3xl'
                  }`}
                >
                  {slide.itemNameEs}
                </h3>
              </div>

              {/* Giant Purpose Quote Box */}
              <div
                className={`rounded-3xl bg-slate-950/90 border-2 border-slate-800 space-y-3 shadow-xl ${
                  isPresentation ? 'p-6 sm:p-8' : 'p-5 sm:p-6'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>PROPÓSITO / FUNCIÓN PRINCIPAL:</span>
                </div>
                <p
                  className={`text-slate-100 font-bold leading-relaxed ${
                    isPresentation
                      ? 'text-2xl sm:text-3xl lg:text-4xl'
                      : 'text-lg sm:text-2xl'
                  }`}
                >
                  “{slide.purposeEn}”
                </p>
                <p
                  className={`text-slate-300 font-medium leading-relaxed border-t border-slate-850 pt-3 ${
                    isPresentation ? 'text-lg sm:text-xl lg:text-2xl' : 'text-sm sm:text-base'
                  }`}
                >
                  {slide.purposeEs}
                </p>
              </div>

              {/* Tip / Key Takeaway for the quiz */}
              {slide.tip && (
                <div
                  className={`rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-start gap-4 shadow-lg ${
                    isPresentation ? 'p-5 sm:p-6' : 'p-4'
                  }`}
                >
                  <Lightbulb
                    className={`text-amber-400 shrink-0 mt-0.5 ${
                      isPresentation ? 'w-8 h-8' : 'w-6 h-6'
                    }`}
                  />
                  <div>
                    <strong
                      className={`font-mono uppercase text-amber-400 block tracking-wide ${
                        isPresentation ? 'text-xs sm:text-sm' : 'text-[11px]'
                      }`}
                    >
                      DATO CLAVE PARA EL CUESTIONARIO Y CAMPO:
                    </strong>
                    <span
                      className={`text-slate-100 font-bold block mt-1 leading-snug ${
                        isPresentation ? 'text-base sm:text-xl' : 'text-sm sm:text-base'
                      }`}
                    >
                      {slide.tip}
                    </span>
                    {slide.tipEs && (
                      <span
                        className={`text-slate-300 block mt-1 font-medium ${
                          isPresentation ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                        }`}
                      >
                        {slide.tipEs}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const currentPresentationSlide =
    TREKING_SLIDES_DECK[currentSlideIndex] || TREKING_SLIDES_DECK[0];

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 flex flex-col justify-center min-h-[85vh]">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onBackToMenu();
          }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition-all text-sm font-bold shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Volver a Temas</span>
        </button>

        {/* Action Buttons: Presentar & PDF */}
        <div className="flex items-center gap-3">
          {/* THE REQUESTED 'PRESENTAR' BUTTON IN TOP BAR */}
          <button
            type="button"
            onClick={() => handleOpenPresentation(activePart === 'part1' ? currentSlideIndex : currentIndex)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Ampliar pantalla y ver en Modo Presentación (Diapositivas y Cuestionario a Pantalla Completa)"
          >
            <Tv className="w-4 h-4 text-slate-950" />
            <span>Presentar Pantalla Completa</span>
          </button>

          {/* View PDF File Button */}
          <a
            href={TREKING_STUDY_CONTENT.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 text-cyan-300 hover:text-cyan-200 border border-cyan-800/50 text-xs sm:text-sm font-semibold transition-all"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Ver PDF Oficial</span>
          </a>
        </div>
      </div>

      {/* Module Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MÓDULO 09 · GLOBAL TOURISM DISTRICT</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase leading-none">
          TREKING
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2 font-medium">
          Bilingualism Week · 13 Diapositivas Oficiales & Reto de Cuestionario
        </p>
      </div>

      {/* Two Parts Switcher (Tabs) */}
      <div className="flex items-center justify-center p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 max-w-xl mx-auto w-full mb-8 shadow-xl">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActivePart('part1');
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-display font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activePart === 'part1'
              ? 'bg-gradient-to-r from-emerald-600 to-[#39A900] text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Parte 1: Diapositivas (13 Artículos)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActivePart('part2');
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-display font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activePart === 'part2'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Parte 2: Cuestionario (12 Preguntas)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PARTE 1: ORGANIZADA EN DIAPOSITIVAS SEGÚN LAS IMÁGENES                    */}
      {/* ========================================================================= */}
      {activePart === 'part1' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Slide Deck Controller Bar */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Slide Index Counter & Stepper Pills (1 to 13) */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                Diapositiva {currentSlideIndex + 1} de {TREKING_SLIDES_DECK.length}
              </span>

              {/* Quick Stepper: 13 Slides */}
              <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 flex-wrap">
                {TREKING_SLIDES_DECK.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentSlideIndex(idx);
                    }}
                    title={`Diapositiva ${idx + 1}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                      currentSlideIndex === idx
                        ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Presentar button + TTS */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => speakText(currentPresentationSlide.audioScript)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                title="Escuchar narración en inglés"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Escuchar Audio</span>
                <span className="sm:hidden">Audio</span>
              </button>

              {/* PRIMARY 'PRESENTAR' BUTTON */}
              <button
                type="button"
                onClick={() => handleOpenPresentation(currentSlideIndex)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Tv className="w-4 h-4" />
                <span>Presentar</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
              style={{
                width: `${((currentSlideIndex + 1) / TREKING_SLIDES_DECK.length) * 100}%`,
              }}
            />
          </div>

          {/* Active In-Page Slide Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            {renderSlideContent(currentPresentationSlide, false)}
          </div>

          {/* Bottom In-Page Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                currentSlideIndex === 0
                  ? 'bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-emerald-400" />
              <span>Diapositiva Anterior</span>
            </button>

            {/* Stepper Dots (13 slides) */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {TREKING_SLIDES_DECK.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentSlideIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'w-6 bg-emerald-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Ir a Diapositiva ${idx + 1}`}
                />
              ))}
            </div>

            {currentSlideIndex < TREKING_SLIDES_DECK.length - 1 ? (
              <button
                type="button"
                onClick={handleNextSlide}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-[#39A900] hover:from-emerald-500 hover:to-[#44c400] text-white font-display font-black text-sm shadow-lg transition-all cursor-pointer"
              >
                <span>Siguiente Diapositiva</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartPart2}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-display font-black text-sm shadow-xl transition-all animate-pulse cursor-pointer"
              >
                <span>¡Ir al Cuestionario (Parte 2)!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bottom Callout: Ready for Quiz */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-2 border-emerald-500/40 text-center flex flex-col items-center justify-center shadow-2xl">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mb-2">
              ¿Listo para el Reto de Treking?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-6">
              Has revisado las diapositivas con todo el contenido del archivo PDF. Ahora pon a prueba tus conocimientos respondiendo las 12 preguntas oficiales.
            </p>
            <button
              type="button"
              onClick={handleStartPart2}
              className="py-4 px-10 rounded-2xl bg-gradient-to-r from-[#39A900] via-emerald-500 to-teal-500 hover:from-[#2d8500] hover:to-teal-600 text-white font-display font-black text-lg sm:text-xl shadow-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Ir a la Parte 2: Cuestionario (12 Preguntas)</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PARTE 2: CUESTIONARIO CON LAS 12 PREGUNTAS DEL ARCHIVO PDF               */}
      {/* ========================================================================= */}
      {activePart === 'part2' && (
        <div className="animate-fadeIn">
          {/* If participant is not registered yet, show registration card first */}
          {!isRegistered ? (
            <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
                  Registro del Participante
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Ingresa tus datos para registrar tu puntaje en el ranking y generar tu certificado oficial de Treking.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Rol
                    </label>
                    <select
                      value={localType}
                      onChange={(e) => setLocalType(e.target.value as 'Aprendiz' | 'Instructor')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm cursor-pointer"
                    >
                      <option value="Aprendiz">Aprendiz</option>
                      <option value="Instructor">Instructor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Ficha (Opcional)
                    </label>
                    <input
                      type="text"
                      value={localFicha}
                      onChange={(e) => setLocalFicha(e.target.value)}
                      placeholder="Ej. 2894561"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-display font-black text-base uppercase tracking-wider shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer mt-4"
                >
                  Comenzar Cuestionario
                </button>
              </form>
            </div>
          ) : quizFinished ? (
            /* Quiz Completed Screen */
            <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>

              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                ¡RETO TREKING COMPLETADO!
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase mt-1 mb-2">
                {participant?.fullName || localName}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Has finalizado las 12 preguntas del archivo PDF de Treking.
              </p>

              {/* Score Badges */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium block">Puntaje</span>
                  <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400">
                    {score} pts
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium block">Aciertos</span>
                  <span className="font-display font-black text-2xl sm:text-3xl text-cyan-400">
                    {correctCount} / {TREKING_12_QUESTIONS.length}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium block">Nivel</span>
                  <span className="font-display font-black text-2xl sm:text-3xl text-amber-400">
                    {determineEnglishLevel(
                      Math.round((correctCount / TREKING_12_QUESTIONS.length) * 100)
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reintentar Cuestionario</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setActivePart('part1');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Revisar Diapositivas</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active 12-Question Quiz Player in Wide High-Impact Layout */
            <div className="w-full space-y-6">
              {/* Question Top Header Bar */}
              <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs sm:text-sm font-bold border border-cyan-500/30">
                    Pregunta {currentIndex + 1} de {TREKING_12_QUESTIONS.length}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Página #{currentQuestion.sourcePage} del archivo oficial
                  </span>
                </div>

                {/* Score, Lives & Presentar Button */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    {[1, 2, 3].map((heart) => (
                      <Heart
                        key={heart}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          heart <= lives ? 'text-red-500 fill-red-500' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-base sm:text-lg font-display font-black text-emerald-400 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                    {score} pts
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenPresentation(currentIndex)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-display font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                    title="Presentar esta pregunta en pantalla completa"
                  >
                    <Maximize2 className="w-4 h-4 text-slate-950" />
                    <span className="hidden sm:inline">Presentar Pantalla Completa</span>
                    <span className="sm:hidden">Presentar</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / TREKING_12_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Interactive Grid (7 cols prompt/options + 5 cols illustration) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left 7 Columns: Prompt & Options */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  {/* Prompt Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase">
                        TREKING QUESTION {currentIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakText(currentQuestion.question)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 cursor-pointer shadow-md"
                        title="Escuchar Pregunta"
                      >
                        <Volume2 className="w-5 h-5 text-cyan-400" />
                      </button>
                    </div>

                    <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-3.5">
                    {currentQuestion.options.map((option, optIdx) => {
                      const isSelected = selectedOption === option;
                      const isOptCorrect =
                        option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

                      let btnStyle =
                        'bg-slate-900/90 border-slate-800 text-slate-100 hover:bg-slate-850 hover:border-slate-700';

                      if (isAnswered) {
                        if (isOptCorrect) {
                          btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-xl ring-2 ring-emerald-500/50';
                        } else if (isSelected) {
                          btnStyle = 'bg-red-950/90 border-red-500 text-red-100 shadow-xl ring-2 ring-red-500/50';
                        } else {
                          btnStyle = 'bg-slate-950/60 border-slate-900 text-slate-500 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(option)}
                          className={`w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 font-display font-bold text-base sm:text-xl lg:text-2xl flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3.5 sm:gap-4 text-left">
                            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-950 border-2 border-slate-700 flex items-center justify-center text-sm sm:text-lg font-mono font-black text-cyan-400 shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{option}</span>
                          </div>

                          {isAnswered && (
                            <div className="shrink-0 ml-2">
                              {isOptCorrect ? (
                                <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-scaleIn" />
                              ) : isSelected ? (
                                <XCircle className="w-7 h-7 text-red-400 animate-scaleIn" />
                              ) : null}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback and Next Button */}
                  {isAnswered && (
                    <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/95 border-2 border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                      <div>
                        <span
                          className={`text-xs sm:text-sm font-mono font-black uppercase tracking-wider block ${
                            isCorrect ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isCorrect ? '✓ ¡Respuesta Correcta!' : '✗ Respuesta Incorrecta'}
                        </span>
                        <p className="text-sm sm:text-base text-slate-200 mt-1 font-medium">
                          {currentQuestion.explanation}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-display font-black text-base shadow-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                      >
                        <span>
                          {currentIndex + 1 >= TREKING_12_QUESTIONS.length || lives <= 0
                            ? 'Finalizar y Ver Certificado'
                            : 'Siguiente Pregunta'}
                        </span>
                        <ArrowRight className="w-5 h-5 text-slate-950" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right 5 Columns: Big Question Context Image */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div
                    onClick={() =>
                      setModalImage({
                        url: getQuestionImage(currentQuestion.number),
                        title: `Pregunta #${currentQuestion.number}: ${currentQuestion.question}`,
                        caption: `Respuesta correcta: ${currentQuestion.correctAnswer}`,
                      })
                    }
                    className="group relative rounded-3xl overflow-hidden border-2 border-cyan-500/40 hover:border-cyan-400 transition-all shadow-2xl cursor-pointer bg-slate-950 w-full aspect-[16/10] max-h-[44vh] sm:max-h-[48vh] flex items-center justify-center"
                  >
                    <img
                      src={getQuestionImage(currentQuestion.number)}
                      alt={`Pregunta ${currentQuestion.number}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient overlay for bottom badge */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

                    <div className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-lg border border-slate-700">
                      <Maximize2 className="w-5 h-5 text-cyan-400" />
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 p-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 pointer-events-none text-left">
                      <span className="text-[11px] font-mono text-cyan-300 font-bold block uppercase tracking-wider">
                        ELEMENTO CLAVE DE LA PREGUNTA #{currentQuestion.number}
                      </span>
                      <span className="text-xs text-slate-200 line-clamp-1 font-bold">
                        {currentQuestion.correctAnswer} · Clic para ampliar
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom In-Page Navigation Bar with 12 Interactive Dots */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    currentIndex === 0
                      ? 'bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-400" />
                  <span>Pregunta Anterior</span>
                </button>

                {/* 12 Interactive Stepper Dots */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                  {TREKING_12_QUESTIONS.map((q, idx) => {
                    const answered = answeredQuestions[idx];
                    let dotColor =
                      'bg-slate-900 text-slate-400 hover:text-white border border-slate-800';
                    if (currentIndex === idx) {
                      dotColor = 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 shadow-lg scale-110 font-black';
                    } else if (answered) {
                      dotColor = answered.isCorrect
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-red-600 text-white font-bold';
                    }

                    return (
                      <button
                        key={q.number}
                        type="button"
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${dotColor}`}
                        title={`Ir a pregunta ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-display font-black text-sm shadow-lg transition-all cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 >= TREKING_12_QUESTIONS.length
                      ? 'Finalizar Cuestionario'
                      : 'Siguiente Pregunta'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN PRESENTATION MODE ("PRESENTAR" / AMPLIAR PANTALLA)              */}
      {/* OCCUPIES THE ENTIRE SCREEN FOR BOTH PARTE 1 AND PARTE 2                   */}
      {/* ========================================================================= */}
      {isPresentationMode && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#060911] text-white flex flex-col justify-between p-3 sm:p-5 lg:p-6 select-none w-screen h-screen overflow-hidden"
        >
          {/* Top Presentation Navigation Bar */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
            {/* Left: Presentation Branding & Switcher Tabs */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Tv className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">MODO PRESENTACIÓN PANTALLA COMPLETA</span>
                <span className="sm:hidden">PRESENTACIÓN</span>
              </div>

              {/* Switcher Tabs inside Presentation Mode */}
              <div className="inline-flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSwitchPresentationPart('part1')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activePart === 'part1'
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Parte 1: Diapositivas ({currentSlideIndex + 1}/{TREKING_SLIDES_DECK.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchPresentationPart('part2')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activePart === 'part2'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Parte 2: Cuestionario ({currentIndex + 1}/12)
                </button>
              </div>
            </div>

            {/* Right: Audio Narration, Fullscreen toggle, Slide counter, Exit button */}
            <div className="flex items-center gap-2.5">
              {/* Audio button */}
              <button
                type="button"
                onClick={() =>
                  speakText(
                    activePart === 'part1'
                      ? currentPresentationSlide.audioScript
                      : currentQuestion.question
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all cursor-pointer"
                title="Escuchar audio en inglés"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">Audio</span>
              </button>

              {/* Fullscreen browser toggle */}
              <button
                type="button"
                onClick={toggleBrowserFullscreen}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
                title={isFullscreenActive ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreenActive ? (
                  <Minimize2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              {/* Counter badge */}
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                {activePart === 'part1'
                  ? `${currentSlideIndex + 1} / ${TREKING_SLIDES_DECK.length}`
                  : `${currentIndex + 1} / ${TREKING_12_QUESTIONS.length}`}
              </span>

              {/* Exit Button */}
              <button
                type="button"
                onClick={handleClosePresentation}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all cursor-pointer"
                title="Salir del modo presentación (Escape)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* PRESENTATION CANVAS: PARTE 1 (DIAPOSITIVAS)                         */}
          {/* =================================================================== */}
          {activePart === 'part1' && (
            <>
              <div className="flex-1 flex flex-col justify-center my-auto w-full max-w-[1920px] mx-auto min-h-0 overflow-y-auto lg:overflow-hidden px-2 sm:px-6">
                <div className="p-5 sm:p-8 lg:p-10 rounded-3xl bg-slate-900/95 border-2 border-slate-800 shadow-2xl relative overflow-hidden w-full my-auto">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                  {renderSlideContent(currentPresentationSlide, true)}
                </div>
              </div>

              {/* Presentation Footer Bar for Parte 1 */}
              <div className="max-w-[1920px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800 shrink-0 px-2 sm:px-6">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                    currentSlideIndex === 0
                      ? 'bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 text-emerald-400" />
                  <span>Anterior</span>
                </button>

                {/* 13 Interactive Stepper Dots */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {TREKING_SLIDES_DECK.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setCurrentSlideIndex(idx);
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        currentSlideIndex === idx
                          ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                      title={`Diapositiva ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Next Slide or Finish Button */}
                {currentSlideIndex < TREKING_SLIDES_DECK.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="inline-flex items-center gap-2 px-7 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#39A900] hover:from-emerald-500 hover:to-[#44c400] text-white font-display font-black text-sm shadow-xl transition-all cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSwitchPresentationPart('part2')}
                    className="inline-flex items-center gap-2 px-7 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-display font-black text-sm shadow-2xl transition-all animate-pulse cursor-pointer"
                  >
                    <span>¡Pasar al Cuestionario!</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </>
          )}

          {/* =================================================================== */}
          {/* PRESENTATION CANVAS: PARTE 2 (CUESTIONARIO DE 12 PREGUNTAS)         */}
          {/* OCCUPIES THE ENTIRE SCREEN WITH HUGE QUESTIONS, OPTIONS & PHOTOS     */}
          {/* =================================================================== */}
          {activePart === 'part2' && (
            <>
              <div className="flex-1 flex flex-col justify-center my-auto w-full max-w-[1920px] mx-auto min-h-0 overflow-y-auto lg:overflow-hidden px-2 sm:px-6">
                {quizFinished ? (
                  /* Fullscreen Celebration Screen */
                  <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/50 shadow-2xl text-center my-auto">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-6">
                      <Trophy className="w-14 h-14 animate-bounce" />
                    </div>

                    <span className="text-sm font-mono font-black tracking-widest text-emerald-400 uppercase">
                      ¡RETO TREKING COMPLETADO EN PANTALLA COMPLETA!
                    </span>
                    <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase mt-2 mb-3">
                      {participant?.fullName || localName || 'Participante'}
                    </h2>
                    <p className="text-lg text-slate-300 mb-8">
                      Has finalizado las 12 preguntas del archivo PDF de Treking.
                    </p>

                    <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-xs text-slate-400 font-bold block uppercase">Puntaje</span>
                        <span className="font-display font-black text-3xl sm:text-4xl text-emerald-400">
                          {score} pts
                        </span>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-xs text-slate-400 font-bold block uppercase">Aciertos</span>
                        <span className="font-display font-black text-3xl sm:text-4xl text-cyan-400">
                          {correctCount} / {TREKING_12_QUESTIONS.length}
                        </span>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-xs text-slate-400 font-bold block uppercase">Nivel</span>
                        <span className="font-display font-black text-3xl sm:text-4xl text-amber-400">
                          {determineEnglishLevel(
                            Math.round((correctCount / TREKING_12_QUESTIONS.length) * 100)
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={handleRestartQuiz}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base transition-all cursor-pointer shadow-lg"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>Reintentar Cuestionario</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSwitchPresentationPart('part1')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all shadow-xl cursor-pointer"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>Revisar Diapositivas</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Fullscreen Active Question Slide */
                  <div className="p-5 sm:p-8 lg:p-10 rounded-3xl bg-slate-900/95 border-2 border-slate-800 shadow-2xl relative overflow-hidden w-full my-auto">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Question Header Row inside Card */}
                    <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
                          PREGUNTA #{currentIndex + 1} DE {TREKING_12_QUESTIONS.length}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 font-medium hidden sm:inline">
                          Material PDF Treking · Bilingualism Week
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                          {[1, 2, 3].map((heart) => (
                            <Heart
                              key={heart}
                              className={`w-5 h-5 ${
                                heart <= lives ? 'text-red-500 fill-red-500' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>

                        <span className="text-base sm:text-xl font-display font-black text-emerald-400 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800">
                          {score} pts
                        </span>
                      </div>
                    </div>

                    {/* 12-Column Grid: Giant Question + Giant Image */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      {/* Left 7 Columns: Giant Prompt & Options */}
                      <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
                        <div className="space-y-2">
                          <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white tracking-tight leading-tight">
                            {currentQuestion.question}
                          </h3>
                        </div>

                        {/* Options with massive readable letters and text */}
                        <div className="space-y-3.5 pt-2">
                          {currentQuestion.options.map((option, optIdx) => {
                            const isSelected = selectedOption === option;
                            const isOptCorrect =
                              option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

                            let btnStyle =
                              'bg-slate-950/85 border-slate-800 text-slate-100 hover:bg-slate-800/90 hover:border-slate-700 shadow-md';

                            if (isAnswered) {
                              if (isOptCorrect) {
                                btnStyle =
                                  'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-2xl ring-2 ring-emerald-500/60 font-bold';
                              } else if (isSelected) {
                                btnStyle =
                                  'bg-red-950/90 border-red-500 text-red-100 shadow-2xl ring-2 ring-red-500/60';
                              } else {
                                btnStyle = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-50';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={isAnswered}
                                onClick={() => handleSelectOption(option)}
                                className={`w-full p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                              >
                                <div className="flex items-center gap-4 sm:gap-5">
                                  <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl lg:text-3xl bg-slate-900 border-2 border-slate-700 text-cyan-400 shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug">
                                    {option}
                                  </span>
                                </div>

                                {isAnswered && (
                                  <div className="shrink-0 ml-3">
                                    {isOptCorrect ? (
                                      <div className="flex items-center gap-2 text-emerald-400 text-lg sm:text-2xl font-bold">
                                        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                                        <span>Correcta</span>
                                      </div>
                                    ) : isSelected ? (
                                      <div className="flex items-center gap-2 text-red-400 text-lg sm:text-2xl font-bold">
                                        <XCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                                        <span>Incorrecta</span>
                                      </div>
                                    ) : null}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Box when answered */}
                        {isAnswered && (
                          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/95 border-2 border-slate-800 shadow-2xl space-y-2 animate-fadeIn">
                            <span
                              className={`text-sm sm:text-base font-mono font-black uppercase tracking-wider block ${
                                isCorrect ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {isCorrect ? '✓ ¡Respuesta Correcta!' : '✗ Respuesta Incorrecta'}
                            </span>
                            <p className="text-lg sm:text-2xl text-slate-200 font-medium leading-relaxed">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right 5 Columns: Giant High-Resolution Question Context Image */}
                      <div className="lg:col-span-5 flex flex-col justify-center">
                        <div
                          onClick={() =>
                            setModalImage({
                              url: getQuestionImage(currentQuestion.number),
                              title: `Pregunta #${currentQuestion.number}: ${currentQuestion.question}`,
                              caption: `Respuesta correcta: ${currentQuestion.correctAnswer}`,
                            })
                          }
                          className="group relative rounded-3xl overflow-hidden border-2 border-cyan-500/40 hover:border-cyan-400 transition-all shadow-2xl cursor-pointer bg-slate-950 w-full aspect-[16/10] max-h-[58vh] sm:max-h-[64vh] flex items-center justify-center"
                        >
                          <img
                            src={getQuestionImage(currentQuestion.number)}
                            alt={`Pregunta ${currentQuestion.number}`}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />

                          {/* Gradient overlay for bottom title */}
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

                          <div className="absolute top-4 right-4 p-2.5 rounded-2xl bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-xl border border-slate-700">
                            <Maximize2 className="w-6 h-6 text-cyan-400" />
                          </div>

                          <div className="absolute bottom-4 left-5 right-5 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 pointer-events-none text-left">
                            <span className="text-xs font-mono text-cyan-300 font-bold block uppercase tracking-wider">
                              ILUSTRACIÓN OFICIAL · PREGUNTA #{currentQuestion.number}
                            </span>
                            <span className="text-sm sm:text-base text-slate-200 line-clamp-1 font-bold">
                              {currentQuestion.correctAnswer}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Presentation Footer Bar for Parte 2 */}
              <div className="max-w-[1920px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800 shrink-0 px-2 sm:px-6">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                    currentIndex === 0
                      ? 'bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 text-cyan-400" />
                  <span>Pregunta Anterior</span>
                </button>

                {/* 12 Interactive Question Stepper Dots */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {TREKING_12_QUESTIONS.map((q, idx) => {
                    const answered = answeredQuestions[idx];
                    let dotColor =
                      'bg-slate-900 text-slate-400 hover:text-white border border-slate-800';
                    if (currentIndex === idx) {
                      dotColor =
                        'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 shadow-lg scale-110 font-black';
                    } else if (answered) {
                      dotColor = answered.isCorrect
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-red-600 text-white font-bold';
                    }

                    return (
                      <button
                        key={q.number}
                        type="button"
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${dotColor}`}
                        title={`Ir a pregunta ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-display font-black text-sm shadow-xl transition-all cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 >= TREKING_12_QUESTIONS.length
                      ? 'Finalizar Cuestionario'
                      : 'Siguiente Pregunta'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-950" />
                </button>
              </div>
            </>
          )}

          {/* Keyboard navigation helper */}
          <div className="text-center text-xs text-slate-400 mt-1 shrink-0">
            Navega con las flechas <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">→</kbd> o presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">Esc</kbd> para salir
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal / Lightbox */}
      {modalImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                {modalImage.title}
              </h3>
              <button
                type="button"
                onClick={() => setModalImage(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-slate-950 max-h-[75vh]">
              <img
                src={modalImage.url}
                alt={modalImage.title}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {modalImage.caption && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs sm:text-sm text-slate-300">
                {modalImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
