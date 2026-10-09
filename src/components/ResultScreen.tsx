import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizResult } from '../types/quiz';
import { getLevelDetails } from '../services/quizEngine';
import { generateCertificatePDF, generateCertificateFile } from '../services/pdfService';
import { soundManager } from '../services/audioService';
import {
  Trophy,
  Download,
  RotateCcw,
  Award,
  CheckCircle,
  XCircle,
  Target,
  FileCheck,
  User,
  Sparkles,
  MessageCircle,
  AlertCircle,
  Send,
} from 'lucide-react';

interface ResultScreenProps {
  result: QuizResult;
  onNewChallenge: () => void;
  onViewRanking: () => void;
  isTvMode: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onNewChallenge,
  onViewRanking,
  isTvMode,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [isSendingWhatsapp, setIsSendingWhatsapp] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [whatsappSuccess, setWhatsappSuccess] = useState(false);

  const levelInfo = getLevelDetails(result.level);

  // Trigger celebration on mount
  useEffect(() => {
    soundManager.playFanfare();

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#39A900', '#F59E0B', '#38BDF8', '#FFFFFF', '#A855F7'],
      });
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#39A900', '#F59E0B', '#FFFFFF'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#39A900', '#F59E0B', '#FFFFFF'],
        });
      }, 400);
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleDownloadPDF = async () => {
    soundManager.playClick();
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      await generateCertificatePDF(result);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (e) {
      console.error('Error generating PDF certificate:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendWhatsApp = async () => {
    soundManager.playClick();
    setWhatsappError(null);
    setWhatsappSuccess(false);

    const rawDigits = whatsappPhone.replace(/\D/g, '');
    if (!rawDigits || rawDigits.length < 7) {
      setWhatsappError('Por favor ingresa un número de WhatsApp válido (mínimo 10 dígitos).');
      return;
    }

    // Standardize Colombian 10-digit mobile (e.g. 3001234567 -> 573001234567)
    let fullPhone = rawDigits;
    if (rawDigits.length === 10 && rawDigits.startsWith('3')) {
      fullPhone = `57${rawDigits}`;
    }

    setIsSendingWhatsapp(true);

    try {
      // 1. Generate & download the PDF certificate
      await generateCertificatePDF(result);

      // 2. Format official certificate message in English/Spanish for WhatsApp
      const certDate = new Date(result.completedAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const messageText = [
        `🎓 *SENA — GLOBAL TOURISM DISTRICT*`,
        `📜 *CERTIFICATE OF RECOGNITION*`,
        ``,
        `Congratulations, *${result.participantName.trim()}*! 🎉`,
        `Here is your official performance summary from SENA Bilingual Week:`,
        ``,
        `📍 *Topic:* ${result.program}`,
        `🏆 *Certified Level:* ${result.level}`,
        `⭐ *Total Score:* ${result.totalScore} pts`,
        `🎯 *Correct Answers:* ${result.correctAnswers} / ${result.totalQuestions} (${result.accuracyPercentage}%)`,
        `📅 *Date of Issue:* ${certDate}`,
        ``,
        `📄 *Your Official PDF Certificate has been generated and downloaded to your device.* Please attach it to this chat to keep or share your diploma!`,
      ].join('\n');

      // 3. Try Web Share API if supported with file attachment
      let sharedWithFile = false;
      try {
        const file = await generateCertificateFile(result);
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Certificate - ${result.participantName}`,
            text: messageText,
          });
          sharedWithFile = true;
        }
      } catch {
        // Fallback to standard WhatsApp url
      }

      // 4. Open WhatsApp Web / App with pre-filled message
      if (!sharedWithFile) {
        const waUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(messageText)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      setWhatsappSuccess(true);
    } catch (e) {
      console.error('Error sharing certificate via WhatsApp:', e);
      setWhatsappError('Ocurrió un error al preparar el certificado. Inténtalo de nuevo.');
    } finally {
      setIsSendingWhatsapp(false);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 ${isTvMode ? 'text-lg max-w-5xl' : ''}`}>
      {/* Main Congratulations Card */}
      <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl backdrop-blur-md text-center">
        {/* Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#39A900]/20 blur-3xl pointer-events-none rounded-full" />

        {/* Celebration Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>¡Reto Completado con Éxito!</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mb-2">
          CONGRATULATIONS!
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          {result.accuracyPercentage >= 95
            ? '¡Eres un auténtico maestro del inglés en Global Tourism District!'
            : 'Has completado con gran éxito tu reto en Global Tourism District.'}
        </p>

        {/* Level Badge Banner */}
        <div
          className={`max-w-xl mx-auto mb-8 p-6 rounded-3xl border-2 ${levelInfo.borderColor} ${levelInfo.bgColor} shadow-xl relative overflow-hidden`}
        >
          <div className="text-xs uppercase tracking-widest font-mono text-slate-300 mb-1">
            Nivel Alcanzado
          </div>
          <div
            className={`font-display font-black text-3xl sm:text-5xl ${levelInfo.textColor} tracking-tight drop-shadow-md`}
          >
            {result.level}
          </div>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            {levelInfo.description}
          </p>
          <div className="mt-3 inline-block text-xs font-bold px-3 py-1 rounded-full bg-black/40 text-white border border-white/10">
            {levelInfo.ribbon}
          </div>
        </div>

        {/* Participant & Score Details Card */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 max-w-2xl mx-auto mb-8 text-left">
          {/* Header row with participant name & photo */}
          <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center">
              {result.photoUrl ? (
                <img
                  src={result.photoUrl}
                  alt={result.participantName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-slate-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white truncate">
                {result.participantName}
              </h2>
              <div className="text-sm text-emerald-400 font-medium">
                {result.program}
              </div>
              <div className="text-xs text-slate-400">
                {result.participantType === 'Aprendiz'
                  ? `Aprendiz SENA · Ficha: ${result.ficha || 'N/A'}`
                  : 'Instructor SENA'}
              </div>
            </div>
          </div>

          {/* 4 Score Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                Score
              </span>
              <div className="font-display font-black text-2xl text-amber-400 font-mono tabular-nums">
                {result.totalScore}
              </div>
              <span className="text-[10px] text-slate-500">points</span>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                Correct Answers
              </span>
              <div className="font-display font-black text-2xl text-emerald-400 font-mono tabular-nums">
                {result.correctAnswers} / {result.totalQuestions}
              </div>
              <span className="text-[10px] text-slate-500">aciertos</span>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                Accuracy
              </span>
              <div className="font-display font-black text-2xl text-cyan-400 font-mono tabular-nums">
                {result.accuracyPercentage}%
              </div>
              <span className="text-[10px] text-slate-500">precisión</span>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                Incorrect
              </span>
              <div className="font-display font-black text-2xl text-rose-400 font-mono tabular-nums">
                {result.incorrectAnswers}
              </div>
              <span className="text-[10px] text-slate-500">fallos</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Certificate Sharing Box */}
        <div className="bg-slate-950/90 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 max-w-2xl mx-auto mb-8 text-left shadow-2xl shadow-emerald-950/40">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <MessageCircle className="w-7 h-7 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-2xl text-white">
                Enviar Certificado a WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Ingresa el número celular del participante para enviarle su resumen y certificado oficial en PDF.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-400 font-mono">
                📱 +57
              </span>
              <input
                type="tel"
                value={whatsappPhone}
                onChange={(e) => {
                  setWhatsappPhone(e.target.value);
                  setWhatsappError(null);
                }}
                placeholder="300 123 4567"
                className="w-full pl-20 pr-4 py-4 bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl text-white font-mono text-base outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={isSendingWhatsapp}
              className="px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-slate-950 font-display font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/60 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 border border-emerald-200/30"
            >
              <Send className="w-5 h-5 fill-slate-950" />
              <span>{isSendingWhatsapp ? 'Enviando...' : 'Enviar a WhatsApp'}</span>
            </button>
          </div>

          {whatsappError && (
            <div className="mt-3 text-xs sm:text-sm text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{whatsappError}</span>
            </div>
          )}

          {whatsappSuccess && (
            <div className="mt-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>¡Certificado PDF descargado con éxito y WhatsApp preparado para enviar!</span>
            </div>
          )}
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          {/* GET MY CERTIFICATE Button */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className={`w-full sm:w-auto flex-1 px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#39A900] to-emerald-500 hover:from-[#2d8500] hover:to-emerald-600 text-white font-display font-bold text-lg sm:text-xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 border border-emerald-300/30 ${
              isTvMode ? 'text-2xl py-6' : ''
            }`}
          >
            <Download className="w-6 h-6" />
            <span>{isGeneratingPdf ? 'Generando PDF...' : 'GET MY CERTIFICATE'}</span>
          </button>

          {/* New Challenge */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNewChallenge();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-base border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5 text-emerald-400" />
            <span>Nuevo Participante</span>
          </button>
        </div>

        {pdfSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm max-w-md mx-auto flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>¡Diploma PDF descargado correctamente! Listo para imprimir o compartir.</span>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs text-slate-400">
          <button
            onClick={() => {
              soundManager.playClick();
              onViewRanking();
            }}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 underline underline-offset-4"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Ver Tabla de Posiciones del Stand</span>
          </button>
        </div>
      </div>
    </div>
  );
};
