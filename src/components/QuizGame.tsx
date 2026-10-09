import React, { useState, useEffect, useRef } from 'react';
import {
  QuizQuestion,
  ParticipantData,
  QuizResult,
} from '../types/quiz';
import {
  determineEnglishLevel,
  MOTIVATOR_MESSAGES,
} from '../services/quizEngine';
import { soundManager } from '../services/audioService';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Heart,
  AlertTriangle,
} from 'lucide-react';

interface QuizGameProps {
  questions: QuizQuestion[];
  participant: ParticipantData;
  onFinishQuiz: (result: QuizResult) => void;
  onBackToMenu: () => void;
  isTvMode: boolean;
}

const QUESTION_TIME_SECONDS = 20;

export const QuizGame: React.FC<QuizGameProps> = ({
  questions,
  participant,
  onFinishQuiz,
  onBackToMenu,
  isTvMode,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // 3 LIVES SYSTEM (3 HEARTS)
  const [lives, setLives] = useState(3);

  // Time state for the active countdown bar
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);

  // Answer state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [motivator, setMotivator] = useState<string>('Let’s go!');

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Active countdown timer per question
  useEffect(() => {
    setTimeLeft(QUESTION_TIME_SECONDS);
    setIsAnswered(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setIsTimeout(false);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.2) {
          clearInterval(countdownIntervalRef.current!);
          handleTimeout();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [currentIndex]);

  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsCorrect(false);
    setIsTimeout(true);
    soundManager.playIncorrect();

    const newLives = Math.max(0, lives - 1);
    setLives(newLives);
    setIncorrectCount((prev) => prev + 1);
    setMotivator(newLives === 0 ? 'Out of hearts!' : 'Time is up! You lost 1 heart.');
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
      const randomMsg = MOTIVATOR_MESSAGES[Math.floor(Math.random() * MOTIVATOR_MESSAGES.length)];
      setMotivator(randomMsg);
    } else {
      soundManager.playIncorrect();
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      setIncorrectCount((prev) => prev + 1);
      setMotivator(newLives === 0 ? 'Out of hearts!' : 'You lost 1 heart.');
    }
  };

  const handleProceedToNext = () => {
    soundManager.playClick();
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    // If lives are 0 or we completed all questions, finish quiz!
    if (lives <= 0 || currentIndex + 1 >= totalQuestions) {
      finishQuiz();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const finishQuiz = () => {
    const totalAttempted = correctCount + incorrectCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const level = determineEnglishLevel(accuracy);

    const result: QuizResult = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      participantId: participant.id,
      participantName: participant.fullName,
      participantType: participant.participantType,
      program: participant.program,
      ficha: participant.ficha,
      photoUrl: participant.photoUrl,
      totalQuestions: totalAttempted,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      accuracyPercentage: accuracy,
      totalScore: score,
      level,
      completedAt: new Date().toISOString(),
    };

    onFinishQuiz(result);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];
  const timePercent = Math.max(0, Math.min(100, (timeLeft / QUESTION_TIME_SECONDS) * 100));
  const isGameOver = lives <= 0;
  const isLastQuestion = currentIndex + 1 >= totalQuestions;

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-8 px-4 flex flex-col justify-center min-h-[84vh]">
      {/* Top Header Row: Return to Main Menu Button */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            onBackToMenu();
          }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 transition-all text-sm sm:text-base font-bold shadow-lg cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
          <span>Regresar al menú principal</span>
        </button>

        <span className="text-xs sm:text-sm font-mono text-emerald-400/80 font-bold uppercase tracking-widest hidden sm:inline px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800">
          {participant.program}
        </span>
      </div>

      {/* Top Status Bar: 3 Hearts & Score (Question number removed per user request) */}
      <div className="flex items-center justify-between gap-4 mb-4 sm:mb-8 text-slate-300 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
        {/* 3 HEARTS: Word "VIDAS" REMOVED per user request */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/80 px-4 sm:px-6 py-2.5 rounded-2xl border border-slate-800">
          {[1, 2, 3].map((heartIndex) => {
            const hasHeart = lives >= heartIndex;
            return (
              <div
                key={heartIndex}
                className="transition-all transform duration-300"
              >
                <Heart
                  className={`w-8 h-8 sm:w-11 sm:h-11 transition-all ${
                    hasHeart
                      ? 'text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-100'
                      : 'text-slate-700 fill-slate-800/50 opacity-30 scale-90'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Score Counter */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-5 sm:px-7 py-2.5 rounded-2xl border border-slate-800">
          <span className="font-mono text-base sm:text-2xl font-black tracking-wider text-slate-400 uppercase">
            SCORE:
          </span>
          <span className="font-mono text-2xl sm:text-4xl font-black text-emerald-400 tabular-nums">
            {score}
          </span>
        </div>
      </div>

      {/* Main Stage: Minimalist, ONLY the English Word (Maximum Two Words) in Giant Font */}
      <div className="w-full text-center py-6 sm:py-10 px-4">
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase break-words leading-none drop-shadow-xl">
          {currentQuestion.prompt}
        </h1>
      </div>

      {/* 4 Large Response Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
        {currentQuestion.options.map((opt, idx) => {
          const letter = optionLetters[idx] || `${idx + 1}`;
          const isThisSelected = selectedOption === opt;
          const isThisCorrect = opt.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

          let btnClass = 'bg-slate-900/90 border-slate-800 text-white hover:border-emerald-500 hover:bg-slate-850';

          if (isAnswered) {
            if (isThisCorrect) {
              btnClass = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-4 ring-emerald-500/30';
            } else if (isThisSelected && !isThisCorrect) {
              btnClass = 'bg-red-950/90 border-red-500 text-red-200 ring-4 ring-red-500/30';
            } else {
              btnClass = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-40';
            }
          }

          return (
            <button
              key={`${currentQuestion.id}-${opt}-${idx}`}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(opt)}
              className={`p-6 sm:p-8 rounded-3xl border-2 text-left transition-all flex items-center gap-4 sm:gap-6 ${btnClass} ${
                !isAnswered ? 'transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg' : 'cursor-default'
              }`}
            >
              <span className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-display font-black text-xl sm:text-3xl shrink-0 border ${
                isAnswered && isThisCorrect
                  ? 'bg-emerald-400 border-emerald-300 text-slate-950'
                  : isAnswered && isThisSelected && !isThisCorrect
                  ? 'bg-red-500 border-red-400 text-white'
                  : 'bg-slate-950 border-slate-700 text-slate-300'
              }`}>
                {letter}
              </span>

              <span className="font-display font-bold text-xl sm:text-2xl md:text-3xl flex-1 leading-tight text-slate-100">
                {opt}
              </span>

              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 shrink-0" />
              )}
              {isAnswered && isThisSelected && !isThisCorrect && (
                <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* TIME BAR: PLACED DIRECTLY BELOW THE RESPONSE OPTIONS & EXTRA THICK (Word changed to "Time") */}
      <div className="w-full max-w-5xl mx-auto mt-6 sm:mt-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Time</span>
          </span>
          <span className="font-bold text-white tabular-nums">
            {Math.ceil(timeLeft)}s
          </span>
        </div>

        {/* Thick Time Bar Container */}
        <div className="w-full h-5 sm:h-6 bg-slate-900 border-2 border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              timeLeft < 4
                ? 'bg-gradient-to-r from-red-600 to-rose-500'
                : timeLeft < 8
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-[#39A900] to-emerald-400'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      </div>

      {/* FEEDBACK BANNER: IN ENGLISH, WITH MANUAL "CONTINUE TO NEXT QUESTION" BUTTON */}
      {isAnswered && (
        <div className={`w-full max-w-5xl mx-auto mt-6 p-6 sm:p-8 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in shadow-2xl ${
          isCorrect
            ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200'
            : 'bg-red-950/95 border-red-500 text-red-200'
        }`}>
          <div className="flex items-center gap-4 sm:gap-6 text-left w-full sm:w-auto">
            {isCorrect ? (
              <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-10 h-10 sm:w-14 sm:h-14 text-red-400 shrink-0" />
            )}
            <div>
              <div className="font-display font-black text-2xl sm:text-4xl">
                {isCorrect
                  ? 'Correct! +10 points'
                  : isTimeout
                  ? 'Time is up! 0 points'
                  : 'Incorrect! 0 points'}
              </div>
              <div className="text-sm sm:text-xl opacity-90 mt-1">
                {isCorrect ? (
                  <span>{motivator}</span>
                ) : (
                  <span>
                    Correct answer:{' '}
                    <strong className="underline text-white font-black">
                      {currentQuestion.correctAnswer}
                    </strong>
                  </span>
                )}
              </div>
              {/* English lives indicator inside the alert */}
              {!isCorrect && (
                <div className="text-amber-300 font-bold text-sm sm:text-base mt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {isGameOver
                      ? 'Out of hearts! Calculating final results.'
                      : `You lost 1 heart! (${lives} ${lives === 1 ? 'heart' : 'hearts'} left)`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* THE MANDATORY BUTTON (IN ENGLISH) */}
          <button
            type="button"
            onClick={handleProceedToNext}
            className="w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-display font-black text-lg sm:text-2xl shrink-0 flex items-center justify-center gap-3 shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>
              {isGameOver || isLastQuestion
                ? 'View final results'
                : 'Continue to next question'}
            </span>
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>
      )}
    </div>
  );
};
