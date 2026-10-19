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
  TREKING_12_PRESENTATION_SLIDES,
  TrekingPresentationSlide,
} from '../data/trekingData';
import { ParticipantData, QuizResult } from '../types/quiz';
import { determineEnglishLevel } from '../services/quizEngine';

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
    if (isPresentationMode) {
      handleClosePresentation();
    }
    setActivePart('part2');
  };

  // Presentation Mode Handlers
  const handleOpenPresentation = (index = currentSlideIndex) => {
    soundManager.playClick();
    setCurrentSlideIndex(index);
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
        setCurrentSlideIndex((prev) => {
          if (prev < TREKING_12_PRESENTATION_SLIDES.length - 1) {
            soundManager.playClick();
            return prev + 1;
          }
          return prev;
        });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => {
          if (prev > 0) {
            soundManager.playClick();
            return prev - 1;
          }
          return prev;
        });
      } else if (e.key === 'Escape') {
        handleClosePresentation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode]);

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
    if (currentSlideIndex < TREKING_12_PRESENTATION_SLIDES.length - 1) {
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

  const handleSelectOption = (option: string) => {
    if (isAnswered || quizFinished) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isAnsCorrect =
      option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsCorrect(isAnsCorrect);

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

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (lives <= 0 || currentIndex + 1 >= TREKING_12_QUESTIONS.length) {
      finishTrekingQuiz();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
            <span>{slide.badge}</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Bilingualism Week · Material Oficial
          </span>
        </div>

        {/* TYPE 1: CONCEPT SLIDES (1, 3, 5, 7, 9, 11) */}
        {slide.type === 'concept' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Hero Image with Caption */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <div
                onClick={() =>
                  slide.heroImage &&
                  setModalImage({
                    url: slide.heroImage,
                    title: slide.titleEn || 'Imagen Temática',
                    caption: slide.heroImageAlt,
                  })
                }
                className="group relative rounded-2xl overflow-hidden border-2 border-slate-750 hover:border-emerald-500/70 transition-all shadow-2xl cursor-pointer aspect-video bg-slate-950 flex items-center justify-center"
              >
                {slide.heroImage && (
                  <img
                    src={slide.heroImage}
                    alt={slide.heroImageAlt || 'Imagen Temática'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-left pointer-events-none">
                  <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase tracking-wider">
                    IMAGEN TEMÁTICA
                  </span>
                  <span className="text-xs text-slate-200 line-clamp-1 font-medium">
                    {slide.heroImageAlt}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic text-center">
                Haz clic en la imagen para ampliar en alta definición
              </p>
            </div>

            {/* Right Column: Title, Quotes & Dato Clave */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <h2
                  className={`font-display font-black text-white tracking-tight uppercase leading-tight ${
                    isPresentation ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
                  }`}
                >
                  {slide.titleEn}
                </h2>
                <h3 className="text-sm sm:text-lg font-bold text-emerald-400 mt-1 mb-3">
                  {slide.titleEs}
                </h3>

                {/* Main Definition Card */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 mb-3">
                  <p className="text-sm sm:text-base text-slate-100 font-semibold leading-relaxed">
                    {slide.descriptionEn}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed border-t border-slate-850 pt-2">
                    {slide.descriptionEs}
                  </p>
                </div>
              </div>

              {/* Dato Clave para el Cuestionario */}
              {slide.keyTakeaway && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-mono uppercase text-amber-400 block tracking-wide">
                      DATO CLAVE PARA EL CUESTIONARIO:
                    </strong>
                    <span className="text-xs sm:text-sm text-slate-200 font-medium block mt-0.5">
                      {slide.keyTakeaway}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {slide.keyTakeawayEs}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TYPE 2: COMPARISON SLIDE (Slide 2: Hiking vs Trekking) */}
        {slide.type === 'comparison' && slide.comparison && (
          <div>
            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>{slide.sectionTitle || 'COMPARATIVA DETALLADA: HIKING VS. TREKKING'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Hiking Column */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Footprints className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-xl text-white">
                          {slide.comparison.hiking.title}
                        </h4>
                        <span className="text-xs text-emerald-400 font-medium">
                          {slide.comparison.hiking.subtitle}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `Hiking. Duration: ${slide.comparison?.hiking.duration} Terrain: ${slide.comparison?.hiking.terrain} Difficulty: ${slide.comparison?.hiking.difficulty}`
                        )
                      }
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Escuchar pronunciación"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm mt-3">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <strong className="text-emerald-400 block text-[11px] font-mono uppercase mb-0.5">
                        DURATION:
                      </strong>
                      <span className="text-slate-200">{slide.comparison.hiking.duration}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <strong className="text-emerald-400 block text-[11px] font-mono uppercase mb-0.5">
                        TERRAIN AND ROUTES:
                      </strong>
                      <span className="text-slate-200">{slide.comparison.hiking.terrain}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <strong className="text-emerald-400 block text-[11px] font-mono uppercase mb-0.5">
                        DIFFICULTY:
                      </strong>
                      <span className="text-slate-200">{slide.comparison.hiking.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 text-xs text-slate-400 italic">
                  Resumen: {slide.comparison.hiking.summary}
                </div>
              </div>

              {/* Trekking Column */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-cyan-500/40 hover:border-cyan-500/70 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-xl text-white">
                          {slide.comparison.trekking.title}
                        </h4>
                        <span className="text-xs text-cyan-400 font-medium">
                          {slide.comparison.trekking.subtitle}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `Trekking. Duration: ${slide.comparison?.trekking.duration} Terrain: ${slide.comparison?.trekking.terrain} Difficulty: ${slide.comparison?.trekking.difficulty}`
                        )
                      }
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Escuchar pronunciación"
                    >
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm mt-3">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <strong className="text-cyan-400 block text-[11px] font-mono uppercase mb-0.5">
                        DURATION:
                      </strong>
                      <span className="text-slate-200">{slide.comparison.trekking.duration}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <strong className="text-cyan-400 block text-[11px] font-mono uppercase mb-0.5">
                        TERRAIN AND ROUTES:
                      </strong>
                      <span className="text-slate-200">{slide.comparison.trekking.terrain}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <strong className="text-cyan-400 block text-[11px] font-mono uppercase mb-0.5">
                        DIFFICULTY:
                      </strong>
                      <span className="text-slate-200">{slide.comparison.trekking.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 text-xs text-cyan-300/80 italic">
                  Resumen: {slide.comparison.trekking.summary}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 3: EQUIPMENT SLIDES (4, 6, 8, 10, 12) */}
        {slide.type === 'equipment' && slide.equipmentItems && (
          <div>
            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              <span>{slide.sectionTitle || 'ELEMENTOS & EQUIPAMIENTO DEL TEMA'}</span>
            </h3>

            <div
              className={`grid gap-4 ${
                slide.equipmentItems.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : slide.equipmentItems.length === 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {slide.equipmentItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Item Photo from PDF or Fallback Icon */}
                    {item.itemImage ? (
                      <div
                        onClick={() =>
                          setModalImage({
                            url: item.itemImage!,
                            title: item.nameEn,
                            caption: item.purposeEn,
                          })
                        }
                        className="mb-3 h-32 rounded-xl overflow-hidden bg-white/95 border border-slate-800 relative group cursor-pointer flex items-center justify-center p-2"
                      >
                        <img
                          src={item.itemImage}
                          alt={item.nameEn}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 h-24 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                        {renderEquipmentIcon(item.iconName)}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-black text-lg text-white leading-tight">
                        {item.nameEn}
                      </h4>
                      <button
                        type="button"
                        onClick={() => speakText(`${item.nameEn}. ${item.purposeEn}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 cursor-pointer"
                        title="Escuchar pronunciación"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </div>

                    <span className="text-xs text-emerald-400 font-medium block mb-2">
                      {item.nameEs}
                    </span>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-850 mb-2">
                      <p className="text-xs text-slate-200 leading-snug font-medium">
                        “{item.purposeEn}”
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {item.purposeEs}
                      </p>
                    </div>
                  </div>

                  {item.tip && (
                    <div className="pt-2 border-t border-slate-850/80 text-[11px] text-slate-400 leading-tight">
                      💡 {item.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const currentPresentationSlide = TREKING_12_PRESENTATION_SLIDES[currentSlideIndex];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-4 flex flex-col justify-center min-h-[85vh]">
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
            onClick={() => handleOpenPresentation(currentSlideIndex)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Ampliar pantalla y ver en Modo Presentación (12 Diapositivas)"
          >
            <Tv className="w-4 h-4 text-slate-950" />
            <span>Presentar</span>
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
          Bilingualism Week · 12 Diapositivas Oficiales & Reto de Cuestionario
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
          <span>Parte 1: Diapositivas</span>
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
            {/* Slide Index Counter & Stepper Pills (1 to 12) */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                Diapositiva {currentSlideIndex + 1} de {TREKING_12_PRESENTATION_SLIDES.length}
              </span>

              {/* Quick Stepper: 12 Slides */}
              <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 flex-wrap">
                {TREKING_12_PRESENTATION_SLIDES.map((slide, idx) => (
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
                width: `${((currentSlideIndex + 1) / TREKING_12_PRESENTATION_SLIDES.length) * 100}%`,
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

            {/* Stepper Dots (12 slides) */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {TREKING_12_PRESENTATION_SLIDES.map((_, idx) => (
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

            {currentSlideIndex < TREKING_12_PRESENTATION_SLIDES.length - 1 ? (
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
            /* Active 12-Question Quiz Player */
            <div className="max-w-3xl mx-auto">
              {/* Question Top Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-slate-850 text-slate-300 font-mono text-xs font-bold border border-slate-800">
                    Pregunta {currentIndex + 1} de {TREKING_12_QUESTIONS.length}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Página PDF #{currentQuestion.sourcePage}
                  </span>
                </div>

                {/* Score and Lives */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((heart) => (
                      <Heart
                        key={heart}
                        className={`w-4 h-4 ${
                          heart <= lives ? 'text-red-500 fill-red-500' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-sm font-display font-black text-emerald-400">
                    {score} pts
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 mb-6">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / TREKING_12_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Prompt Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    TREKING QUESTION {currentIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakText(currentQuestion.question)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="Escuchar Pregunta"
                  >
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedOption === option;
                  const isOptCorrect =
                    option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

                  let btnStyle =
                    'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700';

                  if (isAnswered) {
                    if (isOptCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-950/80 border-red-500 text-red-200 shadow-lg';
                    } else {
                      btnStyle = 'bg-slate-950/60 border-slate-855 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full p-4 sm:p-5 rounded-2xl border-2 font-display font-bold text-base sm:text-lg flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswered && (
                        <div>
                          {isOptCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-scaleIn" />
                          ) : isSelected ? (
                            <XCircle className="w-6 h-6 text-red-400 animate-scaleIn" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Next Button */}
              {isAnswered && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                  <div>
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wider block ${
                        isCorrect ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isCorrect ? '✓ ¡Respuesta Correcta!' : '✗ Respuesta Incorrecta'}
                    </span>
                    <p className="text-sm text-slate-300 mt-1 font-medium">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-display font-black text-base shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>
                      {currentIndex + 1 >= TREKING_12_QUESTIONS.length || lives <= 0
                        ? 'Finalizar y Ver Certificado'
                        : 'Siguiente Pregunta'}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN PRESENTATION MODE ("PRESENTAR" / AMPLIAR PANTALLA)              */}
      {/* ========================================================================= */}
      {isPresentationMode && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070b14] text-white flex flex-col justify-between p-4 sm:p-8 md:p-10 select-none overflow-y-auto"
        >
          {/* Presentation Header Bar */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
            {/* Left: Presentation Branding & Slide Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Tv className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>MODO PRESENTACIÓN</span>
              </div>
              <span className="text-xs text-slate-400 hidden md:inline">
                Global Tourism District · Bilingualism Week
              </span>
            </div>

            {/* Right: Audio Narration, Fullscreen toggle, Slide counter, Exit button */}
            <div className="flex items-center gap-3">
              {/* Audio button */}
              <button
                type="button"
                onClick={() => speakText(currentPresentationSlide.audioScript)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all cursor-pointer"
                title="Escuchar narración en inglés"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Audio</span>
              </button>

              {/* Fullscreen toggle */}
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

              {/* Slide Counter */}
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                {currentSlideIndex + 1} / {TREKING_12_PRESENTATION_SLIDES.length}
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

          {/* Presentation Main Slide Canvas */}
          <div className="flex-1 flex flex-col justify-center my-6 max-w-6xl mx-auto w-full">
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              {renderSlideContent(currentPresentationSlide, true)}
            </div>
          </div>

          {/* Presentation Footer Bar */}
          <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            {/* Previous Slide Button */}
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                currentSlideIndex === 0
                  ? 'bg-slate-950 text-slate-600 border border-slate-850 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-emerald-400" />
              <span>Anterior</span>
            </button>

            {/* 12 Interactive Stepper Dots */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {TREKING_12_PRESENTATION_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentSlideIndex(idx);
                  }}
                  className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                  title={`Diapositiva ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Next Slide or Finish Button */}
            {currentSlideIndex < TREKING_12_PRESENTATION_SLIDES.length - 1 ? (
              <button
                type="button"
                onClick={handleNextSlide}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#39A900] hover:from-emerald-500 hover:to-[#44c400] text-white font-display font-black text-sm shadow-xl transition-all cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartPart2}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-display font-black text-sm shadow-2xl transition-all animate-pulse cursor-pointer"
              >
                <span>¡Iniciar Cuestionario!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Keyboard navigation helper */}
          <div className="text-center text-[11px] text-slate-400 mt-2">
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
