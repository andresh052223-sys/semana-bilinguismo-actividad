import React from 'react';
import { Award, Volume2, VolumeX, Tv, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { soundManager } from '../services/audioService';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: 'cover' | 'program' | 'ranking' | 'admin' | 'welcome') => void;
  isTvMode: boolean;
  onToggleTvMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  isTvMode,
  onToggleTvMode,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('cover')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1 transition-transform hover:scale-[1.01]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#39A900] to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30 text-white">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white leading-none">
                GLOBAL TOURISM <span className="text-[#39A900]">DISTRICT</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              English Vocabulary Quiz
            </p>
          </div>
        </button>

        {/* Center / Navigation Zone */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => onNavigate('program')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              currentView === 'welcome' || currentView === 'register' || currentView === 'program' || currentView === 'quiz' || currentView === 'result'
                ? 'bg-[#39A900] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reto Bilingüe</span>
          </button>

          <button
            onClick={() => onNavigate('ranking')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              currentView === 'ranking'
                ? 'bg-[#39A900] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranking Stand</span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              currentView === 'admin'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrador</span>
          </button>
        </div>

        {/* Right Utilities: TV Mode & Audio */}
        <div className="flex items-center gap-2">
          {/* TV Projection Mode toggle */}
          <button
            onClick={onToggleTvMode}
            title={isTvMode ? 'Desactivar Modo TV (Tamaño estándar)' : 'Activar Modo TV / Pantalla Gigante'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isTvMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">{isTvMode ? 'Modo TV: ON' : 'Modo TV'}</span>
          </button>

          {/* Sound FX toggle */}
          <button
            onClick={() => {
              onToggleMute();
              soundManager.playClick();
            }}
            title={isMuted ? 'Activar Efectos de Sonido' : 'Silenciar Sonido'}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              isMuted
                ? 'bg-slate-900 text-slate-500 border-slate-800'
                : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Mobile Admin & Ranking Quick Access */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => onNavigate('ranking')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              title="Ranking"
            >
              <Trophy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              title="Admin"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
