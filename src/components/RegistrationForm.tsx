import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, User, UserCheck, AlertCircle, ArrowRight, X, ArrowLeft } from 'lucide-react';
import { ParticipantData, ParticipantType } from '../types/quiz';
import { soundManager } from '../services/audioService';

interface RegistrationFormProps {
  selectedProgram: string;
  onComplete: (data: Partial<ParticipantData>) => void;
  onBack: () => void;
  isTvMode: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  selectedProgram,
  onComplete,
  onBack,
  isTvMode,
}) => {
  const [fullName, setFullName] = useState('');
  const [participantType, setParticipantType] = useState<ParticipantType>('Aprendiz');
  const [ficha, setFicha] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    soundManager.playClick();
    setCameraError('');
    setIsCameraActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo acceder a la cámara';
      setCameraError(`Cámara no disponible (${msg}). Puedes subir una foto desde tu dispositivo.`);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    soundManager.playClick();
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoUrl(dataUrl);
    }
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 500;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setPhotoUrl(canvas.toDataURL('image/jpeg', 0.85));
            setErrorMsg('');
          }
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    if (!fullName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (fullName.trim().length < 3) {
      setErrorMsg('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (participantType === 'Aprendiz') {
      if (!ficha.trim()) {
        setErrorMsg('El número de ficha es obligatorio para aprendices.');
        return;
      }
      if (!/^\d{5,9}$/.test(ficha.trim())) {
        setErrorMsg('Ingresa un número de ficha válido (solo números, entre 5 y 9 dígitos).');
        return;
      }
    }

    setErrorMsg('');
    onComplete({
      id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: fullName.trim(),
      participantType,
      program: selectedProgram,
      ficha: participantType === 'Aprendiz' ? ficha.trim() : undefined,
      photoUrl: photoUrl || undefined,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 flex flex-col justify-center min-h-[80vh]">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl backdrop-blur-md">
        {/* Selected Program Kicker */}
        <div className="text-center mb-8">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 font-mono">
            PROGRAMA SELECCIONADO
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase mt-1">
            {selectedProgram}
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Tipo de participante */}
          <div>
            <label className="block text-sm sm:text-base font-bold uppercase tracking-wider text-slate-300 mb-3">
              Tipo de Participante
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setParticipantType('Aprendiz');
                }}
                className={`py-4 px-6 rounded-2xl border-2 font-display font-black text-base sm:text-xl flex items-center justify-center gap-3 transition-all ${
                  participantType === 'Aprendiz'
                    ? 'bg-[#39A900] text-white border-emerald-400 shadow-xl'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>APRENDIZ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setParticipantType('Instructor');
                }}
                className={`py-4 px-6 rounded-2xl border-2 font-display font-black text-base sm:text-xl flex items-center justify-center gap-3 transition-all ${
                  participantType === 'Instructor'
                    ? 'bg-[#00324D] text-white border-cyan-400 shadow-xl'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>INSTRUCTOR</span>
              </button>
            </div>
          </div>

          {/* Nombre completo */}
          <div>
            <label className="block text-sm sm:text-base font-bold uppercase tracking-wider text-slate-300 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Juan David Pérez"
              className="w-full px-5 py-4 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 text-white placeholder-slate-500 font-display font-bold text-lg sm:text-xl outline-none transition-all"
              required
            />
          </div>

          {/* Número de ficha (Obligatorio únicamente para aprendices) */}
          {participantType === 'Aprendiz' && (
            <div>
              <label className="block text-sm sm:text-base font-bold uppercase tracking-wider text-slate-300 mb-2">
                Número de Ficha *
              </label>
              <input
                type="text"
                value={ficha}
                onChange={(e) => setFicha(e.target.value.replace(/\D/g, ''))}
                placeholder="Ej. 2691450"
                maxLength={9}
                className="w-full px-5 py-4 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 text-white placeholder-slate-500 font-mono font-bold text-lg sm:text-xl outline-none transition-all tabular-nums"
                required
              />
            </div>
          )}

          {/* Fotografía (File Upload + Live Camera) */}
          <div className="pt-2">
            <label className="block text-sm sm:text-base font-bold uppercase tracking-wider text-slate-300 mb-3">
              Fotografía (Para tu Certificado)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center shrink-0">
                {photoUrl ? (
                  <>
                    <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <User className="w-8 h-8 text-slate-600" />
                )}
              </div>

              <div className="flex-1 w-full flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Tomar Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Cargar Imagen</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {cameraError && (
                  <p className="text-xs text-amber-400 w-full mt-1">{cameraError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Live Camera Modal */}
          {isCameraActive && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-center">
                <h3 className="font-display font-black text-xl text-white mb-4">Capturar Fotografía</h3>
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square mb-5 border-2 border-emerald-500">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-6 py-3 rounded-2xl bg-[#39A900] text-white font-bold text-sm flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capturar</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-300 text-sm font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onBack();
              }}
              className="px-6 py-4 rounded-2xl text-slate-400 hover:text-white font-bold text-base flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Cambiar Programa</span>
            </button>

            <button
              type="submit"
              className="px-8 py-5 rounded-2xl bg-gradient-to-r from-[#39A900] to-emerald-500 hover:from-[#2d8500] hover:to-emerald-600 text-white font-display font-black text-lg sm:text-xl flex items-center gap-3 shadow-xl shadow-emerald-950/60 transition-all transform hover:scale-105 active:scale-95"
            >
              <span>INICIAR RETO (100 PREGUNTAS)</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
