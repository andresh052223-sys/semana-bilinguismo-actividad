import React from 'react';
import { Play } from 'lucide-react';
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

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 flex flex-col items-center justify-center min-h-[82vh]">
      {/* Enhanced Graphic Card from User Upload */}
      <div className="relative group w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/50 border-4 border-cyan-500/40 bg-white transition-all transform hover:scale-[1.01]">
        <img
          src="/src/assets/images/global_tourism_card_1791509637338.jpg"
          alt="Global Tourism District - Sena Global City"
          className="w-full h-auto object-cover aspect-square block"
          loading="eager"
        />
        {/* Subtle overlay reflection */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Big Minimalist "START" Button directly beneath the card */}
      <div className="mt-8 sm:mt-10 w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={handleStart}
          className={`w-full py-5 sm:py-6 px-10 rounded-3xl bg-gradient-to-r from-[#0097A7] via-[#00ACC1] to-emerald-500 hover:from-[#00838F] hover:to-emerald-600 text-white font-display font-black text-2xl sm:text-3xl tracking-wider shadow-2xl shadow-cyan-950/60 flex items-center justify-center gap-4 transition-all transform hover:scale-105 active:scale-95 border-2 border-cyan-200/40 cursor-pointer ${
            isTvMode ? 'py-7 text-4xl' : ''
          }`}
        >
          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
          <span>START</span>
        </button>
      </div>
    </div>
  );
};
