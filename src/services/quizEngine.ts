import { EnglishLevel, QuizQuestion, VocabularyItem } from '../types/quiz';
import { getStoredVocabulary } from './storageService';
import { formatMaxTwoWords, formatMaxNaturalWords } from '../data/defaultVocabulary';

// Utility to shuffle array immutably
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function determineEnglishLevel(accuracyPercentage: number): EnglishLevel {
  if (accuracyPercentage >= 95) return 'ENGLISH MASTER';
  if (accuracyPercentage >= 80) return 'ENGLISH PRO';
  if (accuracyPercentage >= 60) return 'ENGLISH CHALLENGER';
  return 'ENGLISH EXPLORER';
}

export function getLevelDetails(level: EnglishLevel) {
  switch (level) {
    case 'ENGLISH MASTER':
      return {
        title: 'ENGLISH MASTER',
        badgeColor: 'from-amber-400 via-yellow-300 to-amber-500',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-400',
        bgColor: 'bg-amber-500/10',
        description: '¡Nivel sobresaliente! Dominio total del vocabulario en Global Tourism District.',
        ribbon: '🏆 Nivel Máximo de Excelencia',
      };
    case 'ENGLISH PRO':
      return {
        title: 'ENGLISH PRO',
        badgeColor: 'from-emerald-400 via-green-400 to-teal-500',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-400',
        bgColor: 'bg-emerald-500/10',
        description: '¡Excelente desempeño! Gran solidez en vocabulario turístico y técnico.',
        ribbon: '🌟 Competencia Destacada',
      };
    case 'ENGLISH CHALLENGER':
      return {
        title: 'ENGLISH CHALLENGER',
        badgeColor: 'from-blue-400 via-cyan-400 to-indigo-500',
        textColor: 'text-cyan-400',
        borderColor: 'border-cyan-400',
        bgColor: 'bg-cyan-500/10',
        description: '¡Buen trabajo! Buen conocimiento base con gran potencial.',
        ribbon: '🚀 En Ascenso',
      };
    case 'ENGLISH EXPLORER':
    default:
      return {
        title: 'ENGLISH EXPLORER',
        badgeColor: 'from-purple-400 via-pink-400 to-rose-400',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-400',
        bgColor: 'bg-purple-500/10',
        description: '¡Buen inicio! Sigue explorando y practicando el vocabulario turístico.',
        ribbon: '🌱 Comienzo del Viaje',
      };
  }
}

/**
 * Builds a quiz of `totalCount` questions (default 100) for the selected topic:
 * Directly drawn from the topic's 150 questions bank!
 * ONLY shows the English word as the prompt (clean, minimalist, extra large font).
 * Options are the 4 Spanish translations (1 correct + 3 distractors).
 */
export function generateQuizForProgram(programName: string, totalCount = 100): QuizQuestion[] {
  const allVocab = getStoredVocabulary();

  // Pick from the 150 questions of the selected topic
  let topicPool = allVocab.filter(
    (item) => item.program.trim().toLowerCase() === programName.trim().toLowerCase()
  );

  if (topicPool.length === 0) {
    topicPool = allVocab;
  }

  // Shuffle and pick 15 unique items
  const shuffledPool = shuffleArray(topicPool);
  const selectedItems = shuffledPool.slice(0, Math.min(totalCount, shuffledPool.length));

  // If still fewer than totalCount, fill up from remaining pool
  if (selectedItems.length < totalCount) {
    const remaining = allVocab.filter((item) => !selectedItems.some((s) => s.id === item.id));
    selectedItems.push(...shuffleArray(remaining).slice(0, totalCount - selectedItems.length));
  }

  const finalItems = shuffleArray(selectedItems).slice(0, totalCount);

  // Format each into QuizQuestion:
  // - Prompt: ONLY the English word (maximum 2 words)
  // - No subPrompt or category tags
  // - Options: 4 Spanish choices in random order (natural Spanish, allowing 3 words when needed)
  return finalItems.map((item, index) => {
    // 3 unique distractors - allows complete natural 2-3 words (e.g., "Guantes de sol")
    const correctEs = formatMaxNaturalWords(item.spanish, 3);
    const candidateDistractors = item.distractorsEs.map((d) => formatMaxNaturalWords(d, 3));

    const uniqueDistractors: string[] = [];
    for (const d of candidateDistractors) {
      if (
        d.trim() &&
        d.toLowerCase() !== correctEs.toLowerCase() &&
        !uniqueDistractors.some((u) => u.toLowerCase() === d.toLowerCase())
      ) {
        uniqueDistractors.push(d);
      }
      if (uniqueDistractors.length === 3) break;
    }

    // If still under 3, pull distinct distractors from other items in topicPool
    if (uniqueDistractors.length < 3) {
      for (const other of topicPool) {
        const otherEs = formatMaxNaturalWords(other.spanish, 3);
        if (
          otherEs.trim() &&
          otherEs.toLowerCase() !== correctEs.toLowerCase() &&
          !uniqueDistractors.some((u) => u.toLowerCase() === otherEs.toLowerCase())
        ) {
          uniqueDistractors.push(otherEs);
        }
        if (uniqueDistractors.length === 3) break;
      }
    }

    const options = shuffleArray([correctEs, ...uniqueDistractors.slice(0, 3)]);

    return {
      id: `q-${index + 1}-${item.id}`,
      program: item.program,
      category: item.category,
      type: 'en_to_es',
      prompt: formatMaxTwoWords(item.english), // Maximum 2 words!
      subPrompt: '',
      correctAnswer: correctEs, // Natural Spanish (up to 3 words when required)
      options, // Exactly 4 unique options
      originalItem: item,
    };
  });
}

export const MOTIVATOR_MESSAGES = [
  'Good job!',
  'Excellent!',
  'Keep going!',
  'Almost there!',
  'Great job!',
  'Awesome!',
  'Perfect!',
];
