import React, { useState } from 'react';
import {
  AdminStats,
  QuestionCategory,
  QuizResult,
  VocabularyItem,
} from '../types/quiz';
import {
  addProgramIfNew,
  addVocabularyItem,
  clearAllResults,
  computeAdminStats,
  deleteVocabularyItem,
  exportResultsToCSV,
  getStoredPrograms,
  getStoredResults,
  getStoredVocabulary,
  getTopParticipants,
  getTopPrograms,
  ProgramRank,
  resetVocabularyToDefaults,
  seedDemoData,
  updateVocabularyItem,
  verifyAdminPassword,
} from '../services/storageService';
import { soundManager } from '../services/audioService';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Users,
  Award,
  TrendingUp,
  Download,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Sparkles,
  BarChart3,
  CheckCircle,
  X,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
  isTvMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBack,
  isTvMode,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Dashboard subview tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'vocabulary' | 'participants'>('analytics');

  // Data states
  const [results, setResults] = useState<QuizResult[]>(() => getStoredResults());
  const [stats, setStats] = useState<AdminStats>(() => computeAdminStats(results));
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(() => getStoredVocabulary());
  const [programs, setPrograms] = useState<string[]>(() => getStoredPrograms());

  // Vocabulary filter and modal
  const [vocabFilterProgram, setVocabFilterProgram] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New program modal
  const [newProgramName, setNewProgramName] = useState<string>('');
  const [showAddProgModal, setShowAddProgModal] = useState<boolean>(false);

  // New/Edit vocabulary form state
  const [formData, setFormData] = useState({
    program: 'healthy Quick breakfasts',
    category: 'technical' as QuestionCategory,
    spanish: '',
    english: '',
    distractorEn1: '',
    distractorEn2: '',
    distractorEn3: '',
    distractorEs1: '',
    distractorEs2: '',
    distractorEs3: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    if (verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. (Por defecto: sena2026)');
    }
  };

  const refreshData = () => {
    const res = getStoredResults();
    setResults(res);
    setStats(computeAdminStats(res));
    setVocabulary(getStoredVocabulary());
    setPrograms(getStoredPrograms());
  };

  const handleExportCSV = () => {
    soundManager.playClick();
    exportResultsToCSV(results);
  };

  const handleSeedData = () => {
    soundManager.playClick();
    if (window.confirm('¿Deseas cargar datos de demostración para visualizar las estadísticas completas?')) {
      seedDemoData();
      refreshData();
    }
  };

  const handleClearResults = () => {
    soundManager.playClick();
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los resultados del stand?')) {
      clearAllResults();
      refreshData();
    }
  };

  const handleOpenAddVocab = () => {
    soundManager.playClick();
    setEditingItem(null);
    setFormData({
      program: programs[0] || 'Gestión Contable',
      category: 'technical',
      spanish: '',
      english: '',
      distractorEn1: '',
      distractorEn2: '',
      distractorEn3: '',
      distractorEs1: '',
      distractorEs2: '',
      distractorEs3: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditVocab = (item: VocabularyItem) => {
    soundManager.playClick();
    setEditingItem(item);
    setFormData({
      program: item.program,
      category: item.category,
      spanish: item.spanish,
      english: item.english,
      distractorEn1: item.distractorsEn[0] || '',
      distractorEn2: item.distractorsEn[1] || '',
      distractorEn3: item.distractorsEn[2] || '',
      distractorEs1: item.distractorsEs[0] || '',
      distractorEs2: item.distractorsEs[1] || '',
      distractorEs3: item.distractorsEs[2] || '',
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteVocab = (id: string) => {
    soundManager.playClick();
    if (window.confirm('¿Eliminar este término del banco de preguntas?')) {
      deleteVocabularyItem(id);
      refreshData();
    }
  };

  const handleSaveVocab = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    if (!formData.spanish.trim() || !formData.english.trim()) {
      alert('Ingresa la palabra en español y en inglés');
      return;
    }

    const distractorsEn = [
      formData.distractorEn1.trim() || 'Option A',
      formData.distractorEn2.trim() || 'Option B',
      formData.distractorEn3.trim() || 'Option C',
    ];

    const distractorsEs = [
      formData.distractorEs1.trim() || 'Opción A',
      formData.distractorEs2.trim() || 'Opción B',
      formData.distractorEs3.trim() || 'Opción C',
    ];

    if (editingItem) {
      updateVocabularyItem({
        ...editingItem,
        program: formData.program,
        category: formData.category,
        spanish: formData.spanish.trim(),
        english: formData.english.trim(),
        distractorsEn,
        distractorsEs,
      });
    } else {
      addVocabularyItem({
        program: formData.program,
        category: formData.category,
        spanish: formData.spanish.trim(),
        english: formData.english.trim(),
        distractorsEn,
        distractorsEs,
      });
    }

    setIsAddModalOpen(false);
    refreshData();
  };

  const handleAddNewProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgramName.trim()) return;
    const updated = addProgramIfNew(newProgramName.trim());
    setPrograms(updated);
    setNewProgramName('');
    setShowAddProgModal(false);
  };

  const filteredVocabulary = vocabFilterProgram === 'All'
    ? vocabulary
    : vocabulary.filter((v) => v.program === vocabFilterProgram);

  const topParticipants = getTopParticipants(results, 10);
  const topPrograms: ProgramRank[] = getTopPrograms(results);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white">Panel de Administración</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Ingresa la contraseña para acceder a las estadísticas, banco de preguntas y exportación.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Contraseña de administrador"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-slate-500 text-center text-sm outline-none"
                autoFocus
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Pista por defecto: <code className="text-slate-400 font-mono">sena2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-display font-bold text-sm shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Ingresar al Dashboard</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="text-xs text-slate-400 hover:text-white pt-2 block mx-auto"
            >
              Regresar al inicio
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className={`w-full max-w-7xl mx-auto py-6 sm:py-8 px-4 ${isTvMode ? 'text-lg' : ''}`}>
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 mb-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
              Admin Console
            </span>
            <span className="text-xs text-slate-400">· Global Tourism District</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Dashboard Administrativo & Analítica
          </h1>
        </div>

        {/* Action Buttons: Export & Demo Seeds */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-colors"
            title="Descargar archivo CSV compatible con Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV / Excel</span>
          </button>

          {results.length === 0 && (
            <button
              onClick={handleSeedData}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cargar Datos Demo</span>
            </button>
          )}

          <button
            onClick={handleClearResults}
            className="px-3 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs font-medium border border-red-800/40 transition-colors"
            title="Reiniciar base de datos"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onBack}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('analytics');
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-[#39A900] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analítica & Estadísticas</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('vocabulary');
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'vocabulary'
              ? 'bg-[#39A900] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Banco de Preguntas ({vocabulary.length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('participants');
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'participants'
              ? 'bg-[#39A900] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Historial de Participantes ({results.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & STATS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Participantes */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Total Participantes
              </span>
              <div className="font-display font-black text-3xl text-white font-mono tabular-nums">
                {stats.totalParticipants}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex gap-2">
                <span className="text-emerald-400 font-bold">{stats.totalAprendices}</span> aprendices ·{' '}
                <span className="text-cyan-400 font-bold">{stats.totalInstructores}</span> instructores
              </div>
            </div>

            {/* Promedio General Puntuación */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Promedio Puntuación
              </span>
              <div className="font-display font-black text-3xl text-amber-400 font-mono tabular-nums">
                {stats.averageScore} <span className="text-xs text-slate-500 font-sans font-normal">pts</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Escala sobre 150 puntos máximos</p>
            </div>

            {/* Promedio General Precisión */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Promedio Precisión
              </span>
              <div className="font-display font-black text-3xl text-emerald-400 font-mono tabular-nums">
                {stats.averageAccuracy}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Porcentaje global de aciertos</p>
            </div>

            {/* Total Programas Participantes */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Programas Activos
              </span>
              <div className="font-display font-black text-3xl text-cyan-400 font-mono tabular-nums">
                {stats.totalPrograms}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Áreas de formación presentes</p>
            </div>
          </div>

          {/* Highlighting Top Programs & Level Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Programs Performance Highlight */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Programas Destacados</span>
              </h3>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">
                    Mayor Participación
                  </span>
                  <div className="font-display font-bold text-xl text-emerald-300">
                    {stats.topProgramByParticipation}
                  </div>
                  <span className="text-xs text-slate-500">
                    Programa con mayor concurrencia de aprendices en el stand
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">
                    Mejor Rendimiento Promedio
                  </span>
                  <div className="font-display font-bold text-xl text-amber-300">
                    {stats.topProgramByScore}
                  </div>
                  <span className="text-xs text-slate-500">
                    Programa con mayor precisión y promedio de puntos
                  </span>
                </div>
              </div>
            </div>

            {/* Distribution by Level */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Distribución por Nivel Bilingüe</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30">
                  <span className="text-xs text-purple-400 font-bold block">ENGLISH EXPLORER</span>
                  <div className="font-display font-black text-2xl text-white font-mono tabular-nums my-1">
                    {stats.levelsCount.explorer}
                  </div>
                  <span className="text-[10px] text-slate-400">0% – 59% aciertos</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30">
                  <span className="text-xs text-cyan-400 font-bold block">ENGLISH CHALLENGER</span>
                  <div className="font-display font-black text-2xl text-white font-mono tabular-nums my-1">
                    {stats.levelsCount.challenger}
                  </div>
                  <span className="text-[10px] text-slate-400">60% – 79% aciertos</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
                  <span className="text-xs text-emerald-400 font-bold block">ENGLISH PRO</span>
                  <div className="font-display font-black text-2xl text-white font-mono tabular-nums my-1">
                    {stats.levelsCount.pro}
                  </div>
                  <span className="text-[10px] text-slate-400">80% – 94% aciertos</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-transparent">
                  <span className="text-xs text-amber-400 font-bold block">ENGLISH MASTER 🏆</span>
                  <div className="font-display font-black text-2xl text-amber-300 font-mono tabular-nums my-1">
                    {stats.levelsCount.master}
                  </div>
                  <span className="text-[10px] text-slate-400">95% – 100% aciertos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Participants Preview in Analytics */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-white">
                Top 5 Participantes Destacados
              </h3>
              <button
                onClick={() => setActiveTab('participants')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Ver todos ({results.length}) →
              </button>
            </div>

            {topParticipants.length === 0 ? (
              <p className="text-sm text-slate-400">Sin datos registrados aún.</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {topParticipants.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400 w-5">#{i + 1}</span>
                      <div>
                        <span className="font-semibold text-white block">{p.participantName}</span>
                        <span className="text-xs text-slate-400">{p.program}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-400">{p.totalScore} pts</span>
                      <span className="text-xs text-slate-400 block">{p.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VOCABULARY BANK MANAGER */}
      {activeTab === 'vocabulary' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Gestión del Banco de Vocabulario
              </h3>
              <p className="text-xs text-slate-400">
                Agrega, edita o elimina términos en inglés y sus distractores por programa formativo.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenAddVocab}
                className="px-4 py-2.5 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Pregunta / Término</span>
              </button>

              <button
                onClick={() => setShowAddProgModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Nuevo Programa</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('¿Restablecer el banco de preguntas a los valores por defecto del SENA?')) {
                    resetVocabularyToDefaults();
                    refreshData();
                  }
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs border border-slate-700"
                title="Restablecer vocabulario inicial"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 mb-6 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Filtrar por Programa:</span>
            <select
              value={vocabFilterProgram}
              onChange={(e) => setVocabFilterProgram(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none"
            >
              <option value="All">Todos los programas ({vocabulary.length})</option>
              <option value="General SENA">General SENA</option>
              <option value="General Workplace">General Workplace / Laboral</option>
              {programs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Vocabulary List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
                  <th className="py-3 px-4">Español</th>
                  <th className="py-3 px-4">Inglés (Correcta)</th>
                  <th className="py-3 px-4">Programa</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Distractores Inglés</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredVocabulary.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-white">{item.spanish}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{item.english}</td>
                    <td className="py-3 px-4 text-slate-300">{item.program}</td>
                    <td className="py-3 px-4 text-slate-400 capitalize">{item.category}</td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {item.distractorsEn.join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditVocab(item)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVocab(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/40"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PARTICIPANTS HISTORY */}
      {activeTab === 'participants' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Historial Completo de Participantes
              </h3>
              <p className="text-xs text-slate-400">
                Registros guardados en el stand durante la Semana de Bilingüismo.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar CSV Completo</span>
            </button>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Sin participantes registrados aún.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
                    <th className="py-3 px-3">Fecha</th>
                    <th className="py-3 px-3">Participante</th>
                    <th className="py-3 px-3">Tipo</th>
                    <th className="py-3 px-3">Programa</th>
                    <th className="py-3 px-3">Ficha</th>
                    <th className="py-3 px-3 text-right">Puntaje</th>
                    <th className="py-3 px-3 text-right">Aciertos</th>
                    <th className="py-3 px-3 text-right">%</th>
                    <th className="py-3 px-3 text-center">Nivel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {new Date(r.completedAt).toLocaleDateString('es-CO', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">{r.participantName}</td>
                      <td className="py-3 px-3 text-slate-300">{r.participantType}</td>
                      <td className="py-3 px-3 text-slate-300">{r.program}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{r.ficha || 'N/A'}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                        {r.totalScore}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {r.correctAnswers}/{r.totalQuestions}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400">
                        {r.accuracyPercentage}%
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-200">
                        {r.level}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD/EDIT VOCABULARY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-xl text-white">
                {editingItem ? 'Editar Término de Vocabulario' : 'Nuevo Término de Vocabulario'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVocab} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Programa</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="General SENA">General SENA</option>
                    <option value="General Workplace">General Workplace</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as QuestionCategory })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="technical">Técnico del Programa</option>
                    <option value="sena_general">General SENA</option>
                    <option value="workplace">Laboral / Cotidiano</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Palabra en Español *
                  </label>
                  <input
                    type="text"
                    value={formData.spanish}
                    onChange={(e) => setFormData({ ...formData, spanish: e.target.value })}
                    placeholder="Ej. Factura"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Traducción Correcta (Inglés) *
                  </label>
                  <input
                    type="text"
                    value={formData.english}
                    onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                    placeholder="Ej. Invoice"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    required
                  />
                </div>
              </div>

              {/* Distractors in English */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-emerald-400 block">
                  3 Opciones Incorrectas en Inglés (Distractores)
                </label>
                <input
                  type="text"
                  value={formData.distractorEn1}
                  onChange={(e) => setFormData({ ...formData, distractorEn1: e.target.value })}
                  placeholder="Distractor 1 (ej. Salary)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={formData.distractorEn2}
                  onChange={(e) => setFormData({ ...formData, distractorEn2: e.target.value })}
                  placeholder="Distractor 2 (ej. Tax)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={formData.distractorEn3}
                  onChange={(e) => setFormData({ ...formData, distractorEn3: e.target.value })}
                  placeholder="Distractor 3 (ej. Receipt)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              {/* Distractors in Spanish */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-cyan-400 block">
                  3 Opciones Incorrectas en Español (Distractores)
                </label>
                <input
                  type="text"
                  value={formData.distractorEs1}
                  onChange={(e) => setFormData({ ...formData, distractorEs1: e.target.value })}
                  placeholder="Distractor español 1 (ej. Salario)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={formData.distractorEs2}
                  onChange={(e) => setFormData({ ...formData, distractorEs2: e.target.value })}
                  placeholder="Distractor español 2 (ej. Impuesto)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={formData.distractorEs3}
                  onChange={(e) => setFormData({ ...formData, distractorEs3: e.target.value })}
                  placeholder="Distractor español 3 (ej. Recibo)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white font-semibold text-xs"
                >
                  Guardar Término
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW PROGRAM MODAL */}
      {showAddProgModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Agregar Nuevo Programa
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Añade una nueva especialidad para registrar vocabulario técnico.
            </p>

            <form onSubmit={handleAddNewProgram} className="space-y-4">
              <input
                type="text"
                value={newProgramName}
                onChange={(e) => setNewProgramName(e.target.value)}
                placeholder="Nombre del programa"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none"
                autoFocus
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProgModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#39A900] text-white font-semibold text-xs"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
