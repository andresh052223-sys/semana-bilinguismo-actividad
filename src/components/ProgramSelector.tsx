import React, { useState } from 'react';
import {
  Coffee,
  MapPin,
  Palmtree,
  Binoculars,
  Sprout,
  Footprints,
  Waves,
  Mountain,
  Compass,
  ArrowRight,
  Check,
  Sparkles,
  Landmark,
} from 'lucide-react';
import { soundManager } from '../services/audioService';

interface ProgramSelectorProps {
  onSelectProgram: (programName: string) => void;
  isTvMode: boolean;
}

const PROGRAM_ICONS: Record<string, React.ReactNode> = {
  'healthy Quick breakfasts': <Coffee className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />,
  'Tolima’s common places to know': <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />,
  'Salento quindio': <Palmtree className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />,
  'Avistamiento de aves (Birdwatching)': <Binoculars className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />,
  'Aulas vivas (Living Classrooms)': <Sprout className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400" />,
  'Senderismo (Hiking)': <Footprints className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />,
  'Cascadas de Padilla': <Waves className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400" />,
  'Alta montaña (High Mountain)': <Mountain className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />,
  'TREKING': <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400" />,
  'Tourist & Tour Guide': <Landmark className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />,
};

const GTD_PROGRAMS = [
  'healthy Quick breakfasts',
  'Tolima’s common places to know',
  'Salento quindio',
  'Avistamiento de aves (Birdwatching)',
  'Aulas vivas (Living Classrooms)',
  'Senderismo (Hiking)',
  'Cascadas de Padilla',
  'Alta montaña (High Mountain)',
  'TREKING',
  'Tourist & Tour Guide',
];

export const ProgramSelector: React.FC<ProgramSelectorProps> = ({
  onSelectProgram,
  isTvMode,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string>('healthy Quick breakfasts');

  const handleProgramClick = (prog: string) => {
    soundManager.playClick();
    setSelectedProgram(prog);
  };

  const handleProceed = () => {
    soundManager.playClick();
    onSelectProgram(selectedProgram);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-12 px-4 flex flex-col justify-center min-h-[80vh]">
      {/* Minimalist Top Title */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase mb-3">
          GLOBAL TOURISM DISTRICT
        </h1>
        <p className="font-display font-bold text-lg sm:text-2xl text-emerald-400 uppercase tracking-wider">
          CHOOSE YOUR TOPIC
        </p>
      </div>

      {/* Grid of 9 Topics with Large Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 max-w-6xl mx-auto w-full">
        {GTD_PROGRAMS.map((prog) => {
          const isSelected = selectedProgram === prog;
          const isTreking = prog === 'TREKING';
          const isTouristGuide = prog === 'Tourist & Tour Guide';
          const icon = PROGRAM_ICONS[prog] || <Mountain className="w-8 h-8 text-emerald-400" />;

          return (
            <button
              key={prog}
              type="button"
              onClick={() => handleProgramClick(prog)}
              className={`p-6 sm:p-7 rounded-3xl border-2 text-left transition-all flex items-center justify-between gap-4 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? isTreking
                    ? 'bg-slate-900 border-cyan-400 ring-4 ring-cyan-500/30 shadow-2xl scale-[1.02]'
                    : isTouristGuide
                    ? 'bg-slate-900 border-amber-400 ring-4 ring-amber-500/30 shadow-2xl scale-[1.02]'
                    : 'bg-slate-900 border-[#39A900] ring-4 ring-[#39A900]/30 shadow-2xl scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {isTreking && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500/20 to-transparent px-3 py-1 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest rounded-bl-xl border-b border-l border-cyan-500/30">
                  Módulo 9
                </div>
              )}
              {isTouristGuide && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/20 to-transparent px-3 py-1 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest rounded-bl-xl border-b border-l border-amber-500/30">
                  Módulo 10
                </div>
              )}

              <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? isTreking
                        ? 'bg-cyan-500/20 border-cyan-500/40'
                        : isTouristGuide
                        ? 'bg-amber-500/20 border-amber-500/40'
                        : 'bg-emerald-500/20 border-emerald-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-display font-black text-lg sm:text-xl lg:text-2xl text-white block leading-tight break-words">
                    {prog}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold block mt-1.5 ${
                      isTreking
                        ? 'text-cyan-300'
                        : isTouristGuide
                        ? 'text-amber-300'
                        : 'text-emerald-400'
                    }`}
                  >
                    {isTreking
                      ? 'Guía PDF & 12 Preguntas'
                      : isTouristGuide
                      ? 'Places · Directions · Quiz'
                      : '100 Questions Challenge'}
                  </span>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? isTreking
                      ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg'
                      : isTouristGuide
                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg'
                      : 'bg-[#39A900] border-[#39A900] text-white shadow-lg'
                    : 'border-slate-700 text-transparent'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Large Minimalist CTA Button */}
      <div className="flex justify-center max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-5 sm:py-6 px-10 rounded-3xl bg-gradient-to-r from-[#39A900] to-emerald-500 hover:from-[#2d8500] hover:to-emerald-600 text-white font-display font-black text-xl sm:text-2xl shadow-2xl shadow-emerald-950/60 flex items-center justify-center gap-4 transition-all transform hover:scale-105 active:scale-95 border border-emerald-300/30"
        >
          <span>CONTINUAR</span>
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
