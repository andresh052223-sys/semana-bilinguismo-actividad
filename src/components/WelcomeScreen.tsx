import React from 'react';
import { Play, Trophy, CheckCircle2, Award, Zap, BookOpen, Users } from 'lucide-react';
import { soundManager } from '../services/audioService';

interface WelcomeScreenProps {
  onStart: () => void;
  onViewRanking: () => void;
  isTvMode: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onViewRanking,
  isTvMode,
}) => {
  const handleStart = () => {
    soundManager.playClick();
    onStart();
  };

  return (
    <div className={`w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 transition-all ${isTvMode ? 'text-lg' : ''}`}>
      {/* Hero Game Show Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center shadow-2xl shadow-emerald-950/20">
        {/* Subtle background glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#39A900]/20 blur-3xl pointer-events-none rounded-full" />
        
        {/* Institutional Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-6">
          <Award className="w-4 h-4 text-[#39A900]" />
          <span>SENA · Semana de Bilingüismo 2026</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase mb-4 leading-none">
          SENA <span className="text-[#39A900]">BILINGUAL</span> CHALLENGE
        </h1>

        {/* Official Slogan */}
        <p className="font-display font-medium text-xl sm:text-3xl text-emerald-300/90 mb-8 max-w-3xl mx-auto italic">
          “Choose your program. Test your English. Win your prize!”
        </p>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Demuestra tu dominio del vocabulario técnico en inglés para tu programa de formación. 
          Responde el quiz de 15 preguntas tipo concurso, acumula puntos y descarga tu{' '}
          <strong className="text-white font-semibold">Certificado Oficial en PDF</strong> al instante.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={handleStart}
            className={`w-full sm:w-auto flex-1 group relative px-8 py-4 sm:py-5 bg-gradient-to-r from-[#39A900] to-emerald-500 hover:from-[#2d8500] hover:to-emerald-600 text-white font-display font-bold text-lg sm:text-xl rounded-2xl shadow-xl shadow-emerald-900/40 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-emerald-300/30 ${
              isTvMode ? 'text-2xl py-6' : ''
            }`}
          >
            <Play className="w-6 h-6 fill-current" />
            <span>START CHALLENGE</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans font-bold">
              15 Qs
            </span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onViewRanking();
            }}
            className={`w-full sm:w-auto px-6 py-4 sm:py-5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-medium text-base rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 ${
              isTvMode ? 'text-xl py-6' : ''
            }`}
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Ver Ranking</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#39A900] flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">
            Vocabulario Técnico
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            60% vocabulario específico de tu programa formativo, 20% institucional SENA y 20% laboral cotidiano.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">
            100% Selección Múltiple
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Preguntas dinámicas Español → Inglés e Inglés → Español con 4 opciones. +10 puntos por acierto.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">
            Certificado PDF & Premios
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Genera al instante tu diploma institucional con tu foto, puntaje, porcentaje y nivel alcanzado.
          </p>
        </div>
      </div>

      {/* Levels Showcase */}
      <div className="mt-12 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
            Niveles y Reconocimientos del Concurso
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tu porcentaje de aciertos determina tu insignia y categoría de premiación en el stand:
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-semibold block mb-1">
              0% – 59%
            </span>
            <div className="font-display font-bold text-purple-300 text-sm sm:text-base">
              ENGLISH EXPLORER
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Primer paso en la ruta bilingüe SENA</p>
          </div>

          <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold block mb-1">
              60% – 79%
            </span>
            <div className="font-display font-bold text-cyan-300 text-sm sm:text-base">
              ENGLISH CHALLENGER
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Buen dominio base en expansión</p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold block mb-1">
              80% – 94%
            </span>
            <div className="font-display font-bold text-emerald-300 text-sm sm:text-base">
              ENGLISH PRO
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Excelente precisión técnica</p>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-4 text-center bg-gradient-to-b from-amber-500/10 to-transparent">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold block mb-1">
              95% – 100%
            </span>
            <div className="font-display font-bold text-amber-300 text-sm sm:text-base">
              ENGLISH MASTER 🏆
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Máximo puntaje y reconocimiento</p>
          </div>
        </div>
      </div>
    </div>
  );
};
