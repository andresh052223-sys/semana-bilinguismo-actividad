import React, { useState } from 'react';
import {
  QuizResult,
} from '../types/quiz';
import {
  getStoredResults,
  getTopParticipants,
  getTopPrograms,
  ProgramRank,
} from '../services/storageService';
import { soundManager } from '../services/audioService';
import { generateParticipantsReportPDF } from '../services/pdfService';
import {
  Trophy,
  Medal,
  Award,
  Users,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  FileDown,
  Loader2,
} from 'lucide-react';

interface PublicRankingProps {
  onStartChallenge: () => void;
  isTvMode: boolean;
}

export const PublicRanking: React.FC<PublicRankingProps> = ({
  onStartChallenge,
  isTvMode,
}) => {
  const [results] = useState<QuizResult[]>(() => getStoredResults());
  const [activeTab, setActiveTab] = useState<'participants' | 'programs'>('participants');
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState<boolean>(false);

  const handleDownloadReport = async () => {
    try {
      setIsDownloadingReport(true);
      soundManager.playClick();
      await generateParticipantsReportPDF(results);
      soundManager.playCorrect();
    } catch (error) {
      console.error('Error generating participants report PDF:', error);
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const topParticipants = getTopParticipants(results, 15);
  const topPrograms: ProgramRank[] = getTopPrograms(results);

  // Name privacy masker: e.g. "Juan David Pérez" -> "Juan D. P."
  const formatParticipantName = (fullName: string) => {
    if (!privacyMode) return fullName;
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const first = parts[0];
    const initials = parts.slice(1).map((p) => `${p[0]?.toUpperCase() || ''}.`).join(' ');
    return `${first} ${initials}`;
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-amber-900/40 border border-yellow-200">
            🥇 1
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-slate-900/40 border border-slate-100">
            🥈 2
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black flex items-center justify-center text-sm shadow-md shadow-amber-950/40 border border-amber-400">
            🥉 3
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs font-mono border border-slate-700">
            {rank}
          </div>
        );
    }
  };

  const getLevelPill = (level: string) => {
    switch (level) {
      case 'ENGLISH MASTER':
        return <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/30">MASTER 🏆</span>;
      case 'ENGLISH PRO':
        return <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-400/30">PRO ⭐</span>;
      case 'ENGLISH CHALLENGER':
        return <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-400/30">CHALLENGER</span>;
      default:
        return <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-400/30">EXPLORER</span>;
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 ${isTvMode ? 'text-lg max-w-6xl' : ''}`}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Global Tourism District · English Challenge
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Leaderboard Oficial del Stand
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Reconocimiento a los aprendices e instructores con mayor puntuación y precisión.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onStartChallenge();
          }}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#39A900] to-emerald-500 hover:from-[#2d8500] hover:to-emerald-600 text-white font-display font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-950/40 shrink-0 transition-all transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>¡Participar Ahora!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs & Privacy Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('participants');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'participants'
                ? 'bg-[#39A900] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Medal className="w-4 h-4" />
            <span>Top Participantes</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('programs');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'programs'
                ? 'bg-[#39A900] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Top Temas</span>
          </button>
        </div>

        {/* Privacy Toggle for Stand Projection */}
        <button
          onClick={() => {
            soundManager.playClick();
            setPrivacyMode(!privacyMode);
          }}
          className="text-xs text-slate-400 hover:text-slate-200 border border-slate-800 bg-slate-900/60 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
          title="Modo Privacidad para proyección en TV pública"
        >
          {privacyMode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
          <span>{privacyMode ? 'Privacidad: Nombres Abreviados' : 'Nombres Completos'}</span>
        </button>
      </div>

      {/* TAB 1: TOP PARTICIPANTS */}
      {activeTab === 'participants' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {topParticipants.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="font-display font-semibold text-lg text-white">Aún no hay resultados registrados.</p>
              <p className="text-xs text-slate-500 mt-1">¡Sé el primero en participar y liderar la tabla del stand!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
                    <th className="py-3.5 px-4 text-center w-16">Puesto</th>
                    <th className="py-3.5 px-4">Participante</th>
                    <th className="py-3.5 px-4">Tema</th>
                    <th className="py-3.5 px-4 text-right">Puntaje</th>
                    <th className="py-3.5 px-4 text-right">Precisión</th>
                    <th className="py-3.5 px-4 text-center">Nivel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {topParticipants.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        idx < 3 ? 'bg-slate-900/60' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex justify-center">
                          {getRankBadge(idx + 1)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          {p.photoUrl ? (
                            <img
                              src={p.photoUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                              {p.participantName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="block">{formatParticipantName(p.participantName)}</span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              {p.participantType} {p.ficha && !privacyMode ? `· Ficha ${p.ficha}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 text-xs sm:text-sm">
                        {p.program}
                      </td>
                      <td className="py-3.5 px-4 text-right font-display font-bold text-amber-400 font-mono tabular-nums text-base">
                        {p.totalScore} <span className="text-xs text-slate-500 font-sans font-normal">pts</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        {p.accuracyPercentage}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {getLevelPill(p.level)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TOP PROGRAMS */}
      {activeTab === 'programs' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {topPrograms.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="font-display font-semibold text-lg text-white">Sin datos de temas aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
                    <th className="py-3.5 px-4 text-center w-16">Puesto</th>
                    <th className="py-3.5 px-4">Tema</th>
                    <th className="py-3.5 px-4 text-center">Participantes</th>
                    <th className="py-3.5 px-4 text-right">Promedio Puntos</th>
                    <th className="py-3.5 px-4 text-right">Promedio Aciertos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {topPrograms.map((prog, idx) => (
                    <tr
                      key={prog.program}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        idx < 3 ? 'bg-slate-900/60' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex justify-center">
                          {getRankBadge(idx + 1)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {prog.program}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono tabular-nums px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
                          {prog.participantsCount} aprendices
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-amber-400 font-bold">
                        {prog.averageScore} pts
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                        {prog.averageAccuracy}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Bar: Descargar Informe Oficial */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <FileDown className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">
              Informe Oficial de Participantes
            </h3>
            <p className="text-xs text-slate-400">
              Descarga el informe oficial en PDF con todos los aprendices: nombre, tema, puntaje, precisión, nivel y fecha.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          disabled={isDownloadingReport}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#39A900] hover:from-emerald-500 hover:to-[#2d8500] disabled:opacity-60 text-white font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 shrink-0 transition-all transform hover:scale-105 active:scale-95"
          title="Descargar informe oficial en PDF"
        >
          {isDownloadingReport ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generando informe...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Descargar informe</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
