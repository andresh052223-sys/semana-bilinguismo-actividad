import {
  AdminStats,
  EnglishLevel,
  QuizResult,
  VocabularyItem,
} from '../types/quiz';
import {
  ALL_DEFAULT_VOCABULARY,
  INITIAL_PROGRAMS,
} from '../data/defaultVocabulary';

const STORAGE_KEYS = {
  VOCABULARY: 'gtd_vocabulary_v6',
  PROGRAMS: 'gtd_programs_v3',
  RESULTS: 'gtd_results_v3',
  ADMIN_PASSWORD: 'gtd_admin_pwd_v2',
};

// Initial flatten of all vocabularies
function getDefaultVocabularyList(): VocabularyItem[] {
  return ALL_DEFAULT_VOCABULARY;
}

export function getStoredPrograms(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure TREKING is included
        if (!parsed.includes('TREKING')) {
          parsed.push('TREKING');
          localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading stored programs:', e);
  }
  localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(INITIAL_PROGRAMS));
  return INITIAL_PROGRAMS;
}

export function saveStoredPrograms(programs: string[]): void {
  localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
}

export function addProgramIfNew(newProg: string): string[] {
  const current = getStoredPrograms();
  const trimmed = newProg.trim();
  if (!trimmed || current.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
    return current;
  }
  // Insert before 'Otros'
  const otrosIdx = current.indexOf('Otros');
  const updated = otrosIdx >= 0
    ? [...current.slice(0, otrosIdx), trimmed, ...current.slice(otrosIdx)]
    : [...current, trimmed];
  saveStoredPrograms(updated);
  return updated;
}

export function getStoredVocabulary(): VocabularyItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading vocabulary:', e);
  }
  const defaultList = getDefaultVocabularyList();
  localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(defaultList));
  return defaultList;
}

export function saveStoredVocabulary(items: VocabularyItem[]): void {
  localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(items));
}

export function addVocabularyItem(item: Omit<VocabularyItem, 'id'>): VocabularyItem {
  const list = getStoredVocabulary();
  const newItem: VocabularyItem = {
    ...item,
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
  const updated = [newItem, ...list];
  saveStoredVocabulary(updated);
  return newItem;
}

export function updateVocabularyItem(updatedItem: VocabularyItem): void {
  const list = getStoredVocabulary();
  const updated = list.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  saveStoredVocabulary(updated);
}

export function deleteVocabularyItem(id: string): void {
  const list = getStoredVocabulary();
  const updated = list.filter((item) => item.id !== id);
  saveStoredVocabulary(updated);
}

export function resetVocabularyToDefaults(): VocabularyItem[] {
  const defaults = getDefaultVocabularyList();
  saveStoredVocabulary(defaults);
  saveStoredPrograms(INITIAL_PROGRAMS);
  return defaults;
}

// RESULTS STORAGE
export function getStoredResults(): QuizResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Seed initial demo data for stand presentation
    seedDemoData();
    const seeded = localStorage.getItem(STORAGE_KEYS.RESULTS);
    if (seeded) {
      const parsed = JSON.parse(seeded);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading results:', e);
  }
  return [];
}

export function saveQuizResult(result: QuizResult): void {
  const current = getStoredResults();
  const updated = [result, ...current];
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));
}

export function clearAllResults(): void {
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify([]));
}

export function computeAdminStats(results: QuizResult[]): AdminStats {
  if (results.length === 0) {
    return {
      totalParticipants: 0,
      totalAprendices: 0,
      totalInstructores: 0,
      totalPrograms: 0,
      averageScore: 0,
      averageAccuracy: 0,
      topProgramByParticipation: 'N/A',
      topProgramByScore: 'N/A',
      levelsCount: {
        explorer: 0,
        challenger: 0,
        pro: 0,
        master: 0,
      },
    };
  }

  const totalParticipants = results.length;
  let totalAprendices = 0;
  let totalInstructores = 0;
  let sumScore = 0;
  let sumAccuracy = 0;

  const levelsCount = {
    explorer: 0,
    challenger: 0,
    pro: 0,
    master: 0,
  };

  const programParticipation: Record<string, number> = {};
  const programScoreSum: Record<string, { totalScore: number; count: number }> = {};

  results.forEach((r) => {
    if (r.participantType === 'Aprendiz') totalAprendices++;
    if (r.participantType === 'Instructor') totalInstructores++;

    sumScore += r.totalScore;
    sumAccuracy += r.accuracyPercentage;

    switch (r.level) {
      case 'ENGLISH MASTER':
        levelsCount.master++;
        break;
      case 'ENGLISH PRO':
        levelsCount.pro++;
        break;
      case 'ENGLISH CHALLENGER':
        levelsCount.challenger++;
        break;
      case 'ENGLISH EXPLORER':
      default:
        levelsCount.explorer++;
        break;
    }

    programParticipation[r.program] = (programParticipation[r.program] || 0) + 1;

    if (!programScoreSum[r.program]) {
      programScoreSum[r.program] = { totalScore: 0, count: 0 };
    }
    programScoreSum[r.program].totalScore += r.totalScore;
    programScoreSum[r.program].count++;
  });

  const uniquePrograms = Object.keys(programParticipation);

  // Top program by participation
  let topProgramByParticipation = 'N/A';
  let maxPart = -1;
  for (const prog in programParticipation) {
    if (programParticipation[prog] > maxPart) {
      maxPart = programParticipation[prog];
      topProgramByParticipation = prog;
    }
  }

  // Top program by average score
  let topProgramByScore = 'N/A';
  let maxAvgScore = -1;
  for (const prog in programScoreSum) {
    const avg = programScoreSum[prog].totalScore / programScoreSum[prog].count;
    if (avg > maxAvgScore) {
      maxAvgScore = avg;
      topProgramByScore = prog;
    }
  }

  return {
    totalParticipants,
    totalAprendices,
    totalInstructores,
    totalPrograms: uniquePrograms.length,
    averageScore: Math.round(sumScore / totalParticipants),
    averageAccuracy: Math.round(sumAccuracy / totalParticipants),
    topProgramByParticipation,
    topProgramByScore,
    levelsCount,
  };
}

// TOP PARTICIPANTS RANKING
export function getTopParticipants(results: QuizResult[], limit = 10): QuizResult[] {
  return [...results]
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return b.accuracyPercentage - a.accuracyPercentage;
    })
    .slice(0, limit);
}

// TOP PROGRAMS RANKING
export interface ProgramRank {
  program: string;
  participantsCount: number;
  averageScore: number;
  averageAccuracy: number;
}

export function getTopPrograms(results: QuizResult[]): ProgramRank[] {
  const map: Record<
    string,
    { count: number; totalScore: number; totalAccuracy: number }
  > = {};

  results.forEach((r) => {
    if (!map[r.program]) {
      map[r.program] = { count: 0, totalScore: 0, totalAccuracy: 0 };
    }
    map[r.program].count++;
    map[r.program].totalScore += r.totalScore;
    map[r.program].totalAccuracy += r.accuracyPercentage;
  });

  const list: ProgramRank[] = Object.keys(map).map((prog) => {
    const data = map[prog];
    return {
      program: prog,
      participantsCount: data.count,
      averageScore: Math.round(data.totalScore / data.count),
      averageAccuracy: Math.round(data.totalAccuracy / data.count),
    };
  });

  return list.sort((a, b) => b.participantsCount - a.participantsCount);
}

// CSV EXPORT
export function exportResultsToCSV(results: QuizResult[]): void {
  const headers = [
    'ID Participante',
    'Nombre Completo',
    'Tipo de Participante',
    'Programa de Formación',
    'Número de Ficha',
    'Puntaje Total',
    'Respuestas Correctas',
    'Respuestas Incorrectas',
    'Porcentaje de Aciertos (%)',
    'Nivel Alcanzado',
    'Fecha de Finalización',
  ];

  const rows = results.map((r) => [
    `"${r.participantId}"`,
    `"${r.participantName.replace(/"/g, '""')}"`,
    `"${r.participantType}"`,
    `"${r.program.replace(/"/g, '""')}"`,
    `"${r.ficha || 'N/A'}"`,
    r.totalScore,
    r.correctAnswers,
    r.incorrectAnswers,
    `${r.accuracyPercentage}%`,
    `"${r.level}"`,
    `"${new Date(r.completedAt).toLocaleString('es-CO')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SENA_Bilingual_Challenge_Resultados_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ADMIN AUTH
export function verifyAdminPassword(input: string): boolean {
  const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'sena2026';
  return input === stored;
}

export function updateAdminPassword(newPwd: string): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPwd);
}

// SEED DEMO DATA FOR IMMEDIATE VISIBILITY
export function seedDemoData(): void {
  const demoResults: QuizResult[] = [
    {
      id: 'res-demo-1',
      participantId: 'part-demo-1',
      participantName: 'Juan David Pérez Gómez',
      participantType: 'Aprendiz',
      program: 'Avistamiento de aves (Birdwatching)',
      ficha: '2691450',
      totalQuestions: 20,
      correctAnswers: 20,
      incorrectAnswers: 0,
      accuracyPercentage: 100,
      totalScore: 200,
      level: 'ENGLISH MASTER',
      completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'res-demo-2',
      participantId: 'part-demo-2',
      participantName: 'Maria Paula Rodriguez',
      participantType: 'Aprendiz',
      program: 'Tolima’s common places to know',
      ficha: '2712984',
      totalQuestions: 20,
      correctAnswers: 19,
      incorrectAnswers: 1,
      accuracyPercentage: 95,
      totalScore: 190,
      level: 'ENGLISH MASTER',
      completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'res-demo-3',
      participantId: 'part-demo-3',
      participantName: 'Carlos Andrés Muñoz',
      participantType: 'Instructor',
      program: 'Senderismo (Hiking)',
      ficha: undefined,
      totalQuestions: 20,
      correctAnswers: 18,
      incorrectAnswers: 2,
      accuracyPercentage: 90,
      totalScore: 180,
      level: 'ENGLISH PRO',
      completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'res-demo-4',
      participantId: 'part-demo-4',
      participantName: 'Valentina Restrepo',
      participantType: 'Aprendiz',
      program: 'healthy Quick breakfasts',
      ficha: '2655312',
      totalQuestions: 20,
      correctAnswers: 17,
      incorrectAnswers: 3,
      accuracyPercentage: 85,
      totalScore: 170,
      level: 'ENGLISH PRO',
      completedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      id: 'res-demo-5',
      participantId: 'part-demo-5',
      participantName: 'Santiago Londoño',
      participantType: 'Aprendiz',
      program: 'Salento quindio',
      ficha: '2804511',
      totalQuestions: 20,
      correctAnswers: 15,
      incorrectAnswers: 5,
      accuracyPercentage: 75,
      totalScore: 150,
      level: 'ENGLISH CHALLENGER',
      completedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'res-demo-6',
      participantId: 'part-demo-6',
      participantName: 'Camila Andrea Ospina',
      participantType: 'Aprendiz',
      program: 'Cascadas de Padilla',
      ficha: '2648719',
      totalQuestions: 20,
      correctAnswers: 13,
      incorrectAnswers: 7,
      accuracyPercentage: 65,
      totalScore: 130,
      level: 'ENGLISH CHALLENGER',
      completedAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(demoResults));
}
