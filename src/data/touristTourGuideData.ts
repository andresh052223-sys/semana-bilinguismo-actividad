export interface PlaceVocabularySlide {
  id: string;
  slideNumber: number;
  word: string;
  definition: string;
  spanishTitle: string;
  spanishDefinition: string;
  sampleSentence: string;
  imageUrl: string;
  badge: string;
  category: string;
}

export interface DirectionExpressionSlide {
  id: string;
  slideNumber: number;
  expression: string;
  definition: string;
  spanishTitle: string;
  spanishDefinition: string;
  sampleSentence: string;
  directionType: 'straight' | 'left' | 'right' | 'past' | 'cross' | 'next_to' | 'across' | 'between' | 'corner';
  imageUrl: string;
  tip: string;
}

export interface TouristQuestionSlide {
  id: string;
  questionNumber: number;
  prompt: string;
  options: {
    letter: 'A' | 'B' | 'C';
    text: string;
  }[];
  correctAnswerLetter: 'A' | 'B' | 'C';
  correctAnswerText: string;
  explanation: string;
  imageUrl?: string;
}

// 1. Tourism Vocabulary – Places (8 Slides, 1 word per slide)
export const PLACES_SLIDES: PlaceVocabularySlide[] = [
  {
    id: 'place-1-museum',
    slideNumber: 1,
    word: 'Museum',
    definition: 'A place where you can learn about history, art, and culture.',
    spanishTitle: 'Museo',
    spanishDefinition: 'Un lugar donde puedes aprender sobre historia, arte y cultura.',
    sampleSentence: 'The national museum houses ancient artifacts and world-renowned art galleries.',
    imageUrl: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=1200&auto=format&fit=crop&q=80',
    badge: 'Cultural Landmark',
    category: 'Places & Heritage',
  },
  {
    id: 'place-2-hotel',
    slideNumber: 2,
    word: 'Hotel',
    definition: 'A place where tourists can stay and sleep.',
    spanishTitle: 'Hotel',
    spanishDefinition: 'Un lugar donde los turistas pueden alojarse y dormir.',
    sampleSentence: 'Many international tourists stay at comfortable hotels in the downtown area.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    badge: 'Hospitality',
    category: 'Accommodations',
  },
  {
    id: 'place-3-restaurant',
    slideNumber: 3,
    word: 'Restaurant',
    definition: 'A place where people can eat and try different dishes.',
    spanishTitle: 'Restaurante',
    spanishDefinition: 'Un lugar donde las personas pueden comer y probar diferentes platillos.',
    sampleSentence: 'The local restaurant offers traditional Colombian dishes and tropical juices.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    badge: 'Gastronomy',
    category: 'Food & Dining',
  },
  {
    id: 'place-4-park',
    slideNumber: 4,
    word: 'Park',
    definition: 'A place where people can walk, relax, and enjoy nature.',
    spanishTitle: 'Parque',
    spanishDefinition: 'Un lugar donde las personas pueden caminar, relajarse y disfrutar la naturaleza.',
    sampleSentence: 'Visitors love to walk through the central park under the shade of ancient trees.',
    imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=1200&auto=format&fit=crop&q=80',
    badge: 'Outdoor Space',
    category: 'Nature & Recreation',
  },
  {
    id: 'place-5-cathedral',
    slideNumber: 5,
    word: 'Cathedral',
    definition: 'A large church that tourists can visit.',
    spanishTitle: 'Catedral',
    spanishDefinition: 'Una gran iglesia que los turistas pueden visitar.',
    sampleSentence: 'The historic cathedral features monumental arches and stunning stained-glass windows.',
    imageUrl: '/assets/aistudio/Catedral_metropolitana_de_Guadalajara_01_e1988333.jpg',
    badge: 'Architectural Wonder',
    category: 'Religious & Heritage',
  },
  {
    id: 'place-6-shopping-mall',
    slideNumber: 6,
    word: 'Shopping Mall',
    definition: 'A place where people can go shopping, eat, and have fun.',
    spanishTitle: 'Centro Comercial',
    spanishDefinition: 'Un lugar donde la gente puede ir de compras, comer y divertirse.',
    sampleSentence: 'The modern shopping mall has boutiques, a cinema, and a vibrant food court.',
    imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&auto=format&fit=crop&q=80',
    badge: 'Commercial Hub',
    category: 'Shopping & Leisure',
  },
  {
    id: 'place-7-botanical-garden',
    slideNumber: 7,
    word: 'Botanical Garden',
    definition: 'A place where visitors can see different plants, flowers, and trees.',
    spanishTitle: 'Jardín Botánico',
    spanishDefinition: 'Un lugar donde los visitantes pueden observar diferentes plantas, flores y árboles.',
    sampleSentence: 'The botanical garden is famous for its collection of exotic orchids and walking trails.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&auto=format&fit=crop&q=80',
    badge: 'Ecotourism',
    category: 'Flora & Conservation',
  },
  {
    id: 'place-8-theater',
    slideNumber: 8,
    word: 'Theater',
    definition: 'A place where people can watch plays, concerts, and performances.',
    spanishTitle: 'Teatro',
    spanishDefinition: 'Un lugar donde la gente puede ver obras de teatro, conciertos y espectáculos.',
    sampleSentence: 'Tour guides often recommend attending a musical performance at the municipal theater.',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
    badge: 'Performing Arts',
    category: 'Culture & Entertainment',
  },
];

// 2. Giving Directions – Useful Expressions (9 Slides, 1 expression per slide)
export const DIRECTIONS_SLIDES: DirectionExpressionSlide[] = [
  {
    id: 'dir-1-straight',
    slideNumber: 1,
    expression: 'Go straight ahead',
    definition: 'Continue walking in the same direction.',
    spanishTitle: 'Sigue derecho / Continúa recto',
    spanishDefinition: 'Continúa caminando en la misma dirección sin desviarte.',
    sampleSentence: 'Go straight ahead for two blocks until you see the town square on your left.',
    directionType: 'straight',
    imageUrl: '/assets/directions/dir_1_go_straight_ahead.png',
    tip: 'Keep going along this main street without turning left or right.',
  },
  {
    id: 'dir-2-left',
    slideNumber: 2,
    expression: 'Turn left',
    definition: 'Go to the left.',
    spanishTitle: 'Gira a la izquierda',
    spanishDefinition: 'Dirígete hacia el lado izquierdo en la intersección.',
    sampleSentence: 'Turn left at the traffic light and you will spot the museum entrance.',
    directionType: 'left',
    imageUrl: '/assets/directions/dir_2_turn_left.png',
    tip: 'Take a 90-degree turn toward your left-hand side at the crossing.',
  },
  {
    id: 'dir-3-right',
    slideNumber: 3,
    expression: 'Turn right',
    definition: 'Go to the right.',
    spanishTitle: 'Gira a la derecha',
    spanishDefinition: 'Dirígete hacia el lado derecho en el cruce.',
    sampleSentence: 'Turn right after passing the bank, and the hotel will be right there.',
    directionType: 'right',
    imageUrl: '/assets/directions/dir_3_turn_right.png',
    tip: 'Pivot toward your right side at the designated street intersection.',
  },
  {
    id: 'dir-4-past',
    slideNumber: 4,
    expression: 'Go past',
    definition: 'Continue walking past a place.',
    spanishTitle: 'Pasa de largo / Sigue pasando el lugar',
    spanishDefinition: 'Continúa caminando más allá de un lugar sin detenerte ni entrar.',
    sampleSentence: 'Go past the central post office and keep walking for one minute.',
    directionType: 'past',
    imageUrl: '/assets/directions/dir_4_go_past.png',
    tip: 'Do not stop inside; leave the reference point behind as you proceed.',
  },
  {
    id: 'dir-5-cross',
    slideNumber: 5,
    expression: 'Cross the street',
    definition: 'Walk from one side of the street to the other.',
    spanishTitle: 'Cruza la calle',
    spanishDefinition: 'Camina desde un lado de la calle hacia el otro lado.',
    sampleSentence: 'Please cross the street at the pedestrian crosswalk to reach the cathedral.',
    directionType: 'cross',
    imageUrl: '/assets/directions/dir_5_cross_the_street.png',
    tip: 'Look both ways and safely traverse from sidewalk to opposite sidewalk.',
  },
  {
    id: 'dir-6-next-to',
    slideNumber: 6,
    expression: 'Next to',
    definition: 'Located beside another place.',
    spanishTitle: 'Al lado de / Junto a',
    spanishDefinition: 'Ubicado inmediatamente al lado de otro lugar o edificio.',
    sampleSentence: 'The souvenir boutique is right next to the historic library.',
    directionType: 'next_to',
    imageUrl: '/assets/directions/dir_6_next_to.png',
    tip: 'Direct adjacent neighbor sharing the same side of the block.',
  },
  {
    id: 'dir-7-across-from',
    slideNumber: 7,
    expression: 'Across from',
    definition: 'Located on the opposite side of the street.',
    spanishTitle: 'En frente de / Al otro lado de la calle',
    spanishDefinition: 'Ubicado en el lado opuesto de la calle o avenida.',
    sampleSentence: 'The artisan coffee shop is directly across from the botanical garden gate.',
    directionType: 'across',
    imageUrl: '/assets/directions/dir_7_across_from.png',
    tip: 'Facing directly across the road or open square.',
  },
  {
    id: 'dir-8-between',
    slideNumber: 8,
    expression: 'Between',
    definition: 'Located in the middle of two places.',
    spanishTitle: 'Entre / En medio de dos lugares',
    spanishDefinition: 'Ubicado en el centro o punto medio entre dos lugares conocidos.',
    sampleSentence: 'The tourist information office is between the bank and the pharmacy.',
    directionType: 'between',
    imageUrl: '/assets/directions/dir_8_between.png',
    tip: 'Flanked by two distinct landmarks on either side (A - Target - B).',
  },
  {
    id: 'dir-9-corner',
    slideNumber: 9,
    expression: 'On the corner',
    definition: 'Located where two streets meet.',
    spanishTitle: 'En la esquina',
    spanishDefinition: 'Ubicado exactamente en el punto donde se cruzan o encuentran dos calles.',
    sampleSentence: 'You will find the city bakery right on the corner of 5th Avenue and Main Street.',
    directionType: 'corner',
    imageUrl: '/assets/directions/dir_9_on_the_corner.png',
    tip: 'At the exact intersection corner building with visibility from two streets.',
  },
];

// 3. Questionnaire – Multiple Choice (10 Questions, each on its own slide)
export const TOURIST_QUESTIONS_SLIDES: TouristQuestionSlide[] = [
  {
    id: 'q-1',
    questionNumber: 1,
    prompt: 'Where can tourists learn about history and culture?',
    options: [
      { letter: 'A', text: 'Hotel' },
      { letter: 'B', text: 'Museum' },
      { letter: 'C', text: 'Restaurant' },
    ],
    correctAnswerLetter: 'B',
    correctAnswerText: 'Museum',
    explanation: 'A Museum is a place where you can learn about history, art, and culture.',
    imageUrl: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'q-2',
    questionNumber: 2,
    prompt: 'Where can tourists stay and sleep?',
    options: [
      { letter: 'A', text: 'Theater' },
      { letter: 'B', text: 'Park' },
      { letter: 'C', text: 'Hotel' },
    ],
    correctAnswerLetter: 'C',
    correctAnswerText: 'Hotel',
    explanation: 'A Hotel is a place where tourists can stay and sleep.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'q-3',
    questionNumber: 3,
    prompt: 'Where can visitors see different plants and flowers?',
    options: [
      { letter: 'A', text: 'Botanical Garden' },
      { letter: 'B', text: 'Shopping Mall' },
      { letter: 'C', text: 'Cathedral' },
    ],
    correctAnswerLetter: 'A',
    correctAnswerText: 'Botanical Garden',
    explanation: 'A Botanical Garden is a place where visitors can see different plants, flowers, and trees.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'q-4',
    questionNumber: 4,
    prompt: 'Where can people watch plays and performances?',
    options: [
      { letter: 'A', text: 'Restaurant' },
      { letter: 'B', text: 'Theater' },
      { letter: 'C', text: 'Hotel' },
    ],
    correctAnswerLetter: 'B',
    correctAnswerText: 'Theater',
    explanation: 'A Theater is a place where people can watch plays, concerts, and performances.',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'q-5',
    questionNumber: 5,
    prompt: 'What does "Go straight ahead" mean?',
    options: [
      { letter: 'A', text: 'Turn left' },
      { letter: 'B', text: 'Stop walking' },
      { letter: 'C', text: 'Continue in the same direction' },
    ],
    correctAnswerLetter: 'C',
    correctAnswerText: 'Continue in the same direction',
    explanation: '"Go straight ahead" means to continue walking in the same direction without turning.',
    imageUrl: '/assets/directions/dir_1_go_straight_ahead.png',
  },
  {
    id: 'q-6',
    questionNumber: 6,
    prompt: 'Which expression means "Gira a la derecha"?',
    options: [
      { letter: 'A', text: 'Turn right' },
      { letter: 'B', text: 'Turn left' },
      { letter: 'C', text: 'Go past' },
    ],
    correctAnswerLetter: 'A',
    correctAnswerText: 'Turn right',
    explanation: '"Turn right" translates directly to "Gira a la derecha".',
    imageUrl: '/assets/directions/dir_3_turn_right.png',
  },
  {
    id: 'q-7',
    questionNumber: 7,
    prompt: 'What does "Next to" mean?',
    options: [
      { letter: 'A', text: 'Far away from' },
      { letter: 'B', text: 'Beside another place' },
      { letter: 'C', text: 'Behind another place' },
    ],
    correctAnswerLetter: 'B',
    correctAnswerText: 'Beside another place',
    explanation: '"Next to" means located beside or directly next to another place.',
    imageUrl: '/assets/directions/dir_6_next_to.png',
  },
  {
    id: 'q-8',
    questionNumber: 8,
    prompt: 'What does "Across from" mean?',
    options: [
      { letter: 'A', text: 'On the opposite side' },
      { letter: 'B', text: 'In the middle' },
      { letter: 'C', text: 'On the corner' },
    ],
    correctAnswerLetter: 'A',
    correctAnswerText: 'On the opposite side',
    explanation: '"Across from" means located on the opposite side of the street or open area.',
    imageUrl: '/assets/directions/dir_7_across_from.png',
  },
  {
    id: 'q-9',
    questionNumber: 9,
    prompt: 'Which question can a tourist use to ask for directions?',
    options: [
      { letter: 'A', text: 'What is your name?' },
      { letter: 'B', text: 'How old are you?' },
      { letter: 'C', text: 'How do I get to the museum?' },
    ],
    correctAnswerLetter: 'C',
    correctAnswerText: 'How do I get to the museum?',
    explanation: '"How do I get to the museum?" is the standard polite question used by tourists asking for directions.',
    imageUrl: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'q-10',
    questionNumber: 10,
    prompt: 'Which expression can a tour guide use to recommend a place?',
    options: [
      { letter: 'A', text: 'I recommend visiting the museum.' },
      { letter: 'B', text: 'I am from Colombia.' },
      { letter: 'C', text: 'My name is Daniel.' },
    ],
    correctAnswerLetter: 'A',
    correctAnswerText: 'I recommend visiting the museum.',
    explanation: '"I recommend visiting the museum." is the natural professional phrasing a tour guide uses to offer recommendations.',
    imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80',
  },
];
