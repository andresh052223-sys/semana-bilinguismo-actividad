import { VocabularyItem } from '../types/quiz';
import {
  TOPIC_BREAKFASTS_150,
  TOPIC_TOLIMA_150,
  TOPIC_SALENTO_150,
  TOPIC_BIRDWATCHING_150,
  TOPIC_LIVING_CLASSROOMS_150,
  TOPIC_HIKING_150,
  TOPIC_CASCADAS_PADILLA_150,
  TOPIC_HIGH_MOUNTAIN_150,
  TopicWordPair,
} from './topicsData';

export const INITIAL_PROGRAMS: string[] = [
  'healthy Quick breakfasts',
  'Tolima’s common places to know',
  'Salento quindio',
  'Avistamiento de aves (Birdwatching)',
  'Aulas vivas (Living Classrooms)',
  'Senderismo (Hiking)',
  'Cascadas de Padilla',
  'Alta montaña (High Mountain)',
];

export function formatMaxTwoWords(text: string): string {
  if (!text) return '';
  const parts = text.trim().split(/\s+/);
  if (parts.length <= 2) return text.trim();
  return parts.slice(0, 2).join(' ');
}

export function formatMaxNaturalWords(text: string, maxWords = 3): string {
  if (!text) return '';
  const parts = text.trim().split(/\s+/);
  if (parts.length <= maxWords) return text.trim();
  return parts.slice(0, maxWords).join(' ');
}

function buildVocabularyItems(programName: string, pairs: TopicWordPair[]): VocabularyItem[] {
  const n = pairs.length;
  return pairs.map((item, idx) => {
    // Generate 3 unique distractors from other elements in the list
    const d1Idx = (idx + 13) % n;
    const d2Idx = (idx + 47) % n;
    const d3Idx = (idx + 89) % n;

    const distractorsEs = [
      formatMaxNaturalWords(pairs[d1Idx].es, 3),
      formatMaxNaturalWords(pairs[d2Idx].es, 3),
      formatMaxNaturalWords(pairs[d3Idx].es, 3),
    ];
    const distractorsEn = [
      formatMaxTwoWords(pairs[d1Idx].en),
      formatMaxTwoWords(pairs[d2Idx].en),
      formatMaxTwoWords(pairs[d3Idx].en),
    ];

    // Generate safe clean slug ID
    const slug = programName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 10);

    return {
      id: `${slug}-${String(idx + 1).padStart(3, '0')}`,
      program: programName,
      category: 'technical',
      english: formatMaxTwoWords(item.en),
      spanish: formatMaxNaturalWords(item.es, 3),
      distractorsEn,
      distractorsEs,
    };
  });
}

// Map of all 8 topics, each containing exactly 150 items
export const TECHNICAL_PROGRAM_VOCABULARY: Record<string, VocabularyItem[]> = {
  'healthy Quick breakfasts': buildVocabularyItems('healthy Quick breakfasts', TOPIC_BREAKFASTS_150),
  'Tolima’s common places to know': buildVocabularyItems('Tolima’s common places to know', TOPIC_TOLIMA_150),
  'Salento quindio': buildVocabularyItems('Salento quindio', TOPIC_SALENTO_150),
  'Avistamiento de aves (Birdwatching)': buildVocabularyItems('Avistamiento de aves (Birdwatching)', TOPIC_BIRDWATCHING_150),
  'Aulas vivas (Living Classrooms)': buildVocabularyItems('Aulas vivas (Living Classrooms)', TOPIC_LIVING_CLASSROOMS_150),
  'Senderismo (Hiking)': buildVocabularyItems('Senderismo (Hiking)', TOPIC_HIKING_150),
  'Cascadas de Padilla': buildVocabularyItems('Cascadas de Padilla', TOPIC_CASCADAS_PADILLA_150),
  'Alta montaña (High Mountain)': buildVocabularyItems('Alta montaña (High Mountain)', TOPIC_HIGH_MOUNTAIN_150),
};

// Flatten of all 1,200 items (150 per topic)
export const ALL_DEFAULT_VOCABULARY: VocabularyItem[] = Object.values(TECHNICAL_PROGRAM_VOCABULARY).flat();
