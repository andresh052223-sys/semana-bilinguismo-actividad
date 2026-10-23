import React from 'react';
import {
  Play,
  Compass,
  HeartHandshake,
  Mountain,
  Coffee,
  Globe,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../services/audioService';

interface CoverScreenProps {
  onStart: () => void;
  isTvMode: boolean;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onStart, isTvMode }) => {
  const handleStart = () => {
    soundManager.playClick();
    onStart();
  };

  const sections = [
    {
      id: 'discover',
      num: '01',
      title: 'DISCOVER',
      subtitle: 'Nature & Heritage',
      icon: Compass,
      borderColor: 'border-cyan-500/50 hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/20 text-cyan-300',
      glow: 'shadow-cyan-950/60',
      accent: 'from-cyan-500/20 via-cyan-900/10 to-transparent',
    },
    {
      id: 'welcome',
      num: '02',
      title: 'WELCOME',
      subtitle: 'Hospitality & Warmth',
      icon: HeartHandshake,
      borderColor: 'border-emerald-500/50 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300',
      glow: 'shadow-emerald-950/60',
      accent: 'from-emerald-500/20 via-emerald-900/10 to-transparent',
    },
    {
      id: 'explore',
      num: '03',
      title: 'EXPLORE',
      subtitle: 'Trails & Adventure',
      icon: Mountain,
      borderColor: 'border-amber-500/50 hover:border-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300',
      glow: 'shadow-amber-950/60',
      accent: 'from-amber-500/20 via-amber-900/10 to-transparent',
    },
    {
      id: 'serve',
      num: '04',
      title: 'SERVE',
      subtitle: 'Gastronomy & Coffee',
      icon: Coffee,
      borderColor: 'border-rose-500/50 hover:border-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-300',
      glow: 'shadow-rose-950/60',
      accent: 'from-rose-500/20 via-rose-900/10 to-transparent',
    },
    {
      id: 'communicate',
      num: '05',
      title: 'COMMUNICATE',
      subtitle: 'Bilingual Connection',
      icon: Globe,
      borderColor: 'border-indigo-500/50 hover:border-indigo-400',
      badgeBg: 'bg-indigo-500/20 text-indigo-300',
      glow: 'shadow-indigo-950/60',
      accent: 'from-indigo-500/20 via-indigo-900/10 to-transparent',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[86vh]">
      {/* Top Tag / Subtitle */}
      <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/80 border border-slate-700/70 text-emerald-400 mb-6 sm:mb-8 backdrop-blur-md shadow-lg">
        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="text-xs sm:text-sm font-bold tracking-widest uppercase">
          SENA Global City · Bilingual English Challenge
        </span>
      </div>

      {/* Main Title: GLOBAL TOURISM DISTRICT (Very large and visible) */}
      <div className="text-center w-full max-w-5xl mx-auto">
        <h1
          className={`font-display font-black tracking-tight text-white uppercase text-center leading-[0.95] drop-shadow-2xl ${
            isTvMode
              ? 'text-6xl sm:text-8xl md:text-9xl lg:text-[10rem]'
              : 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl'
          }`}
        >
          <span>GLOBAL TOURISM </span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(16,185,129,0.4)]">
            DISTRICT
          </span>
        </h1>

        {/* Big Visible Slogan: Discover - Welcome - Experience */}
        <div className="mt-6 sm:mt-8">
          <p
            className={`font-display font-extrabold tracking-[0.2em] sm:tracking-[0.28em] text-cyan-300 uppercase text-center drop-shadow-lg ${
              isTvMode
                ? 'text-3xl sm:text-5xl md:text-6xl'
                : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
            }`}
          >
            DISCOVER <span className="text-emerald-400 mx-1 sm:mx-3 font-light">—</span> WELCOME <span className="text-emerald-400 mx-1 sm:mx-3 font-light">—</span> EXPERIENCE
          </p>
        </div>
      </div>

      {/* The 5 Key Sections: Discover, Welcome, Explore, Serve, Communicate */}
      <div className="w-full mt-10 sm:mt-14 max-w-7xl mx-auto px-2">
        <div className="text-center mb-6">
          <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-emerald-400/90 font-mono">
            DISTRICT PILLARS & AREAS
          </span>
        </div>

        {/* 5 Prominent Cards in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                className={`relative group rounded-3xl p-5 sm:p-5 lg:p-4 xl:p-6 bg-slate-900/90 border-2 ${sec.borderColor} bg-gradient-to-b ${sec.accent} backdrop-blur-xl shadow-xl ${sec.glow} transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between items-center text-center overflow-hidden min-h-[170px] sm:min-h-[190px]`}
              >
                {/* Number & Icon */}
                <div className="flex items-center justify-between w-full mb-4">
                  <span className={`text-[11px] font-mono font-black px-2.5 py-1 rounded-lg ${sec.badgeBg} border border-current/20`}>
                    {sec.num}
                  </span>
                  <div className={`p-2 sm:p-2.5 rounded-2xl ${sec.badgeBg} border border-current/20 shadow-md`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* Section Title & Subtitle Centered */}
                <div className="w-full text-center my-auto flex flex-col items-center justify-center">
                  <h3
                    className={`font-display font-black text-white tracking-normal uppercase text-center leading-tight w-full ${
                      sec.title === 'COMMUNICATE'
                        ? 'text-base sm:text-lg lg:text-[15px] xl:text-lg 2xl:text-xl'
                        : 'text-lg sm:text-xl lg:text-base xl:text-xl 2xl:text-2xl'
                    } ${isTvMode ? 'text-xl sm:text-2xl' : ''}`}
                  >
                    {sec.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-2 font-medium text-center leading-snug w-full">
                    {sec.subtitle}
                  </p>
                </div>

                {/* Subtle bottom indicator */}
                <div className="w-8 h-1 rounded-full bg-slate-700/60 group-hover:w-14 group-hover:bg-slate-500 transition-all duration-300 mt-3" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Big Minimalist "START" Button directly beneath the cards */}
      <div className="mt-12 sm:mt-16 w-full max-w-lg mx-auto">
        <button
          type="button"
          onClick={handleStart}
          className={`w-full py-6 sm:py-7 px-10 rounded-3xl bg-gradient-to-r from-[#0097A7] via-[#00ACC1] to-emerald-500 hover:from-[#00838F] hover:to-emerald-600 text-white font-display font-black tracking-wider shadow-2xl shadow-cyan-950/70 flex items-center justify-center gap-4 transition-all transform hover:scale-105 active:scale-95 border-2 border-cyan-200/50 cursor-pointer ${
            isTvMode ? 'py-8 text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'
          }`}
        >
          <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current" />
          <span>START</span>
        </button>
        <p className="text-center text-xs sm:text-sm text-slate-400 mt-3 font-medium">
          Presiona <span className="text-cyan-300 font-bold">START</span> para elegir tu tema e iniciar el reto
        </p>
      </div>
    </div>
  );
};
