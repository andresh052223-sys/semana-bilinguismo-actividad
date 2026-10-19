import { QuizQuestion, VocabularyItem } from '../types/quiz';

export interface TrekingEquipmentItem {
  id: string;
  nameEn: string;
  nameEs: string;
  purpose: string;
  purposeEs: string;
  category: 'trekking' | 'birdwatching' | 'hiking';
  iconName: string;
  tip?: string;
  itemImage?: string;
}

export interface SlideEquipment {
  nameEn: string;
  nameEs: string;
  purposeEn: string;
  purposeEs: string;
  itemImage?: string;
  iconName: string;
  tip?: string;
}

export interface TrekingSlide {
  id: string;
  slideNumber: number;
  titleEn: string;
  titleEs: string;
  categoryBadge: string;
  heroImage: string;
  heroImageAlt: string;
  pdfSlideImage?: string;
  descriptionEn: string;
  descriptionEs: string;
  comparison?: {
    hiking: {
      title: string;
      subtitle: string;
      duration: string;
      terrain: string;
      difficulty: string;
      summary: string;
    };
    trekking: {
      title: string;
      subtitle: string;
      duration: string;
      terrain: string;
      difficulty: string;
      summary: string;
    };
  };
  equipment?: SlideEquipment[];
  keyTakeaway: string;
  keyTakeawayEs: string;
  audioScript: string;
}

export const TREKING_SLIDES: TrekingSlide[] = [
  {
    id: 'slide-1',
    slideNumber: 1,
    titleEn: 'Hiking vs. Trekking: Core Differences',
    titleEs: 'Senderismo vs. Travesía: Diferencias Fundamentales',
    categoryBadge: 'DIAPOSITIVA 01 · INTRODUCCIÓN Y COMPARATIVA',
    heroImage: '/assets/aistudio/slide_img_1_hiking_trekking.jpg',
    heroImageAlt: 'Hiking trail in green forest contrasted with mountain trekking group',
    pdfSlideImage: '/assets/aistudio/slide_01.png',
    descriptionEn:
      'Hiking and trekking are outdoor activities that involve walking in nature, but they differ in duration, difficulty, and level of planning.',
    descriptionEs:
      'El senderismo (hiking) y la travesía (trekking) son actividades al aire libre que implican caminar en la naturaleza, pero se diferencian en duración, dificultad y nivel de planificación.',
    comparison: {
      hiking: {
        title: 'Hiking',
        subtitle: 'Senderismo de un día',
        duration: 'Usually completed in a single day, generally taking a few hours.',
        terrain: 'Official, well-marked, and established paths and trails.',
        difficulty: 'Easy to moderate, accessible to beginners, families, and casual explorers.',
        summary: 'Day trip on established nature trails suitable for all fitness levels.',
      },
      trekking: {
        title: 'Trekking',
        subtitle: 'Travesía de varios días (Excursión remota)',
        duration: 'A long-distance journey that lasts several days with overnight camping or mountain shelters.',
        terrain: 'Remote, rugged, or mountainous areas, frequently without clearly marked trails.',
        difficulty: 'Moderate to challenging; requires physical endurance, navigation skills, and planning.',
        summary: 'Multi-day wilderness expedition requiring full autonomous gear.',
      },
    },
    keyTakeaway:
      'Trekking lasts several days with overnight stays outdoors, while hiking is completed in a single day.',
    keyTakeawayEs:
      'El trekking dura varios días con noches en carpa o refugio; el hiking se completa en un solo día.',
    audioScript:
      'Hiking and trekking are outdoor activities that involve walking in nature, but they differ in duration, difficulty, and level of planning. Hiking is completed in a single day on marked trails. Trekking lasts several days and involves camping in remote mountainous areas.',
  },
  {
    id: 'slide-2',
    slideNumber: 2,
    titleEn: 'Essential Footwear & Cargo: Boots and Backpack',
    titleEs: 'Calzado Técnico y Carga: Botas de Montaña y Mochila',
    categoryBadge: 'DIAPOSITIVA 02 · EQUIPAMIENTO ESENCIAL 1',
    heroImage: '/assets/aistudio/slide_img_2_boots_backpack.jpg',
    heroImageAlt: 'Rugged leather hiking boots and large expedition backpack overlook',
    pdfSlideImage: '/assets/aistudio/slide_01.png',
    descriptionEn:
      'Footwear protects your lower joints from rocky terrain, while a high-capacity backpack secures all clothing, hydration, and nutrition for multi-day endurance.',
    descriptionEs:
      'El calzado técnico protege tus articulaciones del terreno pedregoso, mientras que una mochila de gran capacidad resguarda abrigo, hidratación y comida para varios días.',
    equipment: [
      {
        nameEn: 'Hiking boots',
        nameEs: 'Botas de montaña / senderismo',
        purposeEn: 'They protect your feet and help you walk safely.',
        purposeEs: 'Protegen tus pies y te ayudan a caminar de forma segura.',
        itemImage: '/assets/aistudio/item_hiking_boots.png',
        iconName: 'Footprints',
        tip: 'Technical mountain boots with high ankle support prevent sprains and provide traction.',
      },
      {
        nameEn: 'Backpack',
        nameEs: 'Mochila / Morral de travesía',
        purposeEn: 'It carries your water, food, and personal items.',
        purposeEs: 'Lleva tu agua, comida y pertenencias personales.',
        itemImage: '/assets/aistudio/item_backpack.png',
        iconName: 'Package',
        tip: 'A large backpack (50L to 75L) is needed for multi-day expeditions with load lifters.',
      },
    ],
    keyTakeaway:
      'Hiking boots protect your feet on uneven trails, and a large backpack carries your food, water, and clothes.',
    keyTakeawayEs:
      'Las botas protegen tus pies en caminos difíciles, y la mochila transporta tu comida, agua y ropa.',
    audioScript:
      'Hiking boots protect your feet and help you walk safely. A large backpack carries your water, food, and personal items for multi-day expeditions.',
  },
  {
    id: 'slide-3',
    slideNumber: 3,
    titleEn: 'Trail Balance & Outdoor Shelter: Trekking Poles and Tent',
    titleEs: 'Estabilidad y Refugio al Aire Libre: Bastones y Carpa',
    categoryBadge: 'DIAPOSITIVA 03 · EQUIPAMIENTO ESENCIAL 2',
    heroImage: '/assets/aistudio/slide_img_3_tent_poles.jpg',
    heroImageAlt: 'Green mountain tent pitched with trekking poles in meadow',
    pdfSlideImage: '/assets/aistudio/slide_02.png',
    descriptionEn:
      'Trekking poles reduce joint stress and maintain equilibrium over steep paths, while an expedition tent provides shelter and warmth when sleeping under the stars.',
    descriptionEs:
      'Los bastones de trekking reducen el impacto en las articulaciones y mantienen el equilibrio, mientras que una carpa de expedición brinda refugio al dormir a la intemperie.',
    equipment: [
      {
        nameEn: 'Trekking poles',
        nameEs: 'Bastones de trekking',
        purposeEn: 'They help with balance on uneven paths.',
        purposeEs: 'Ayudan a mantener el equilibrio en caminos irregulares.',
        itemImage: '/assets/aistudio/item_poles.png',
        iconName: 'Compass',
        tip: 'Reduces impact on your knees and distributes workload across upper body muscles.',
      },
      {
        nameEn: 'Tent',
        nameEs: 'Carpa / Tienda de campaña',
        purposeEn: 'It gives you shelter when you sleep outdoors.',
        purposeEs: 'Te brinda refugio cuando duermes al aire libre.',
        itemImage: '/assets/aistudio/item_tent.png',
        iconName: 'Tent',
        tip: 'Provides vital windproof and waterproof shelter against unpredictable mountain rain and cold.',
      },
    ],
    keyTakeaway:
      'Trekking poles give balance on uneven trails; a tent gives you shelter when you sleep outdoors.',
    keyTakeawayEs:
      'Los bastones dan balance en senderos irregulares; la carpa te da refugio al dormir al aire libre.',
    audioScript:
      'Trekking poles help with balance on uneven paths. A tent gives you shelter when you sleep outdoors.',
  },
  {
    id: 'slide-4',
    slideNumber: 4,
    titleEn: 'Thermal Warmth & Sustenance: Sleeping Bag, Food and Hydration',
    titleEs: 'Calor Térmico y Sustento: Sleeping, Comida e Hidratación',
    categoryBadge: 'DIAPOSITIVA 04 · DESCANSO Y NUTRICIÓN',
    heroImage: '/assets/aistudio/slide_img_4_sleeping_sustenance.jpg',
    heroImageAlt: 'Rolled sleeping bag with trail mix snacks and stainless steel water bottle',
    pdfSlideImage: '/assets/aistudio/slide_03.png',
    descriptionEn:
      'Endurance on long treks requires insulating warmth through the night and constant replenishment of calories and fluids along the trail.',
    descriptionEs:
      'La resistencia en travesías largas exige aislamiento térmico nocturno y reposición continua de calorías e hidratación en el sendero.',
    equipment: [
      {
        nameEn: 'Sleeping bag',
        nameEs: 'Bolsa de dormir / Sleeping',
        purposeEn: 'It keeps you warm while you sleep.',
        purposeEs: 'Te mantiene abrigado mientras duermes.',
        itemImage: '/assets/aistudio/item_sleeping_bag.png',
        iconName: 'Moon',
        tip: 'Mummy-style thermal bags trap core heat during sub-zero mountain temperatures.',
      },
      {
        nameEn: 'Trail food',
        nameEs: 'Comida de marcha / Alimentos energéticos',
        purposeEn: 'It gives you energy during a long journey.',
        purposeEs: 'Te da energía durante una larga travesía.',
        itemImage: '/assets/aistudio/item_trail_food.png',
        iconName: 'Utensils',
        tip: 'Dense calorie snacks like nuts, dried bananas, dark chocolate, and energy bars.',
      },
      {
        nameEn: 'Water bottle',
        nameEs: 'Botella de agua / Hidratación',
        purposeEn: 'It helps you stay hydrated.',
        purposeEs: 'Te ayuda a mantenerte hidratado en todo momento.',
        itemImage: '/assets/aistudio/item_water_bottle.jpg',
        iconName: 'Droplets',
        tip: 'Carry sufficient water and always treat raw mountain streams before drinking.',
      },
    ],
    keyTakeaway:
      'A sleeping bag keeps you warm while you sleep; trail food provides energy and water maintains hydration.',
    keyTakeawayEs:
      'La bolsa de dormir te mantiene abrigado; la comida de marcha aporta energía y el agua hidratación.',
    audioScript:
      'A sleeping bag keeps you warm while you sleep. Trail food gives you energy during a long journey, and a water bottle helps you stay hydrated.',
  },
  {
    id: 'slide-5',
    slideNumber: 5,
    titleEn: 'Wilderness Navigation & Safety: Map, Compass and First Aid',
    titleEs: 'Navegación Silvestre y Seguridad: Mapa, Brújula y Primeros Auxilios',
    categoryBadge: 'DIAPOSITIVA 05 · ORIENTACIÓN Y SEGURIDAD',
    heroImage: '/assets/aistudio/slide_img_5_map_navigation.jpg',
    heroImageAlt: 'Topographic contour map with magnetic compass and red medical first aid pouch',
    pdfSlideImage: '/assets/aistudio/slide_03.png',
    descriptionEn:
      'Remote mountain routes often lack cellular reception. Dependable analog navigation tools and a medical emergency kit are vital safety safeguards.',
    descriptionEs:
      'Las rutas de montaña remotas carecen de señal de celular. Las herramientas de navegación analógicas y un botiquín médico son seguros vitales de supervivencia.',
    equipment: [
      {
        nameEn: 'Map and compass',
        nameEs: 'Mapa y brújula',
        purposeEn: 'They help you find your way.',
        purposeEs: 'Te ayudan a encontrar tu camino y orientarte.',
        itemImage: '/assets/aistudio/item_map_compass.png',
        iconName: 'Navigation',
        tip: 'Paper topographic contour maps and magnetic compasses function in all weather without batteries.',
      },
      {
        nameEn: 'First aid kit',
        nameEs: 'Botiquín de primeros auxilios',
        purposeEn: 'Provides emergency care for cuts, blisters, and trail injuries.',
        purposeEs: 'Proporciona atención de emergencia para cortes, ampollas y lesiones en ruta.',
        itemImage: '/assets/aistudio/item_first_aid_kit.jpg',
        iconName: 'ShieldCheck',
        tip: 'Include blister bandages, antiseptic wipes, sterile gauze, pain relievers, and medical tape.',
      },
    ],
    keyTakeaway:
      'A map and compass help you find your way in remote areas without phone signal.',
    keyTakeawayEs:
      'El mapa y la brújula te ayudan a encontrar tu camino en zonas remotas sin señal telefónica.',
    audioScript:
      'A map and compass help you find your way. A first aid kit provides emergency medical care outdoors.',
  },
  {
    id: 'slide-6',
    slideNumber: 6,
    titleEn: 'Specialized Activity: Birdwatching (Avistamiento de Aves)',
    titleEs: 'Actividad Especializada: Avistamiento de Aves (Birdwatching)',
    categoryBadge: 'DIAPOSITIVA 06 · FAUNA Y OBSERVACIÓN',
    heroImage: '/assets/aistudio/slide_img_6_birdwatching.jpg',
    heroImageAlt: 'Birdwatching binoculars, illustrated bird guide book and field notes notebook',
    pdfSlideImage: '/assets/aistudio/slide_04.png',
    descriptionEn:
      'Birdwatching is observing birds in their natural habitats. It pairs outdoor trekking with optics, field identification guides, and ecological notes.',
    descriptionEs:
      'El avistamiento de aves es observar aves en sus hábitats naturales. Combina senderismo con óptica, guías de identificación de campo y notas ecológicas.',
    equipment: [
      {
        nameEn: 'Binoculars',
        nameEs: 'Binoculares / Prismáticos',
        purposeEn: 'They help you see birds from far away.',
        purposeEs: 'Te ayudan a ver las aves desde lejos.',
        itemImage: '/assets/aistudio/item_binoculars.png',
        iconName: 'Eye',
        tip: 'Optical magnification (8x42) reveals tiny plumage colors without scaring wildlife.',
      },
      {
        nameEn: 'Bird guide',
        nameEs: 'Guía de aves / Manual de identificación',
        purposeEn: 'It helps you identify different bird species.',
        purposeEs: 'Te ayuda a identificar diferentes especies de aves.',
        itemImage: '/assets/aistudio/item_bird_guide.png',
        iconName: 'Book',
        tip: 'Features regional species range maps, scientific names, and behavioral clues.',
      },
      {
        nameEn: 'Camera',
        nameEs: 'Cámara fotográfica',
        purposeEn: 'It lets you take pictures of birds without disturbing them.',
        purposeEs: 'Te permite tomar fotos de aves sin perturbarlas.',
        itemImage: '/assets/aistudio/item_birdwatching_desk.png',
        iconName: 'Camera',
        tip: 'Zoom lenses allow documentation for citizen science biodiversity platforms.',
      },
      {
        nameEn: 'Notebook and pencil',
        nameEs: 'Cuaderno de campo y lápiz',
        purposeEn: 'What you use to write your observations.',
        purposeEs: 'Lo que usas para registrar tus observaciones de campo.',
        itemImage: '/assets/aistudio/item_notebook_pencil.jpg',
        iconName: 'BookOpen',
        tip: 'Record species counts, elevation, plumage variations, and time of sighting.',
      },
    ],
    keyTakeaway:
      'Binoculars help see birds far away, the bird guide identifies species, and the notebook records observations.',
    keyTakeawayEs:
      'Los binoculares permiten ver aves a lo lejos, la guía identifica especies y el cuaderno registra observaciones.',
    audioScript:
      'Birdwatching is observing birds in their natural habitats. Binoculars help you see birds from far away. A bird guide helps you identify different bird species. A camera lets you take pictures without disturbing them, and a notebook and pencil are what you use to write your observations.',
  },
];

export interface TrekingStudyContent {
  title: string;
  subtitle: string;
  pdfUrl: string;
  introduction: {
    title: string;
    description: string;
  };
  comparison: {
    hiking: {
      name: string;
      duration: string;
      terrain: string;
      difficulty: string;
      summary: string;
    };
    trekking: {
      name: string;
      spanishName: string;
      duration: string;
      terrain: string;
      difficulty: string;
      summary: string;
    };
  };
  equipmentList: TrekingEquipmentItem[];
  birdwatching: {
    title: string;
    spanishTitle: string;
    definition: string;
    definitionEs: string;
    items: TrekingEquipmentItem[];
  };
}

export const TREKING_STUDY_CONTENT: TrekingStudyContent = {
  title: 'TREKING',
  subtitle: 'Bilingualism Week · Global Tourism District',
  pdfUrl: '/assets/aistudio/Bilingualism_Week-treking_.___1__f1615e64.pdf',
  introduction: {
    title: 'Bilingualism Week',
    description:
      'Hiking and trekking are outdoor activities that involve walking in nature, but they differ in duration, difficulty, and level of planning.',
  },
  comparison: {
    hiking: {
      name: 'Hiking (Senderismo de un día)',
      duration: 'It is usually completed in a single day, generally taking a few hours.',
      terrain: 'It takes place on official, well-marked, and established paths and trails.',
      difficulty:
        'Easy to moderate, making it accessible to beginners, families, and people with a moderate level of physical fitness.',
      summary: 'Day trip on marked paths suitable for general audiences.',
    },
    trekking: {
      name: 'Trekking',
      spanishName: 'Travesía de varios días',
      duration:
        'It is a long-distance journey that lasts several days and includes overnight stays (camping or sleeping in mountain shelters).',
      terrain:
        'It involves exploring more remote, rugged, or mountainous areas, sometimes without clearly marked trails.',
      difficulty:
        'Moderate to challenging; it requires good physical endurance, navigation skills, and previous experience.',
      summary: 'Multi-day demanding expedition across wild trails with full camping gear.',
    },
  },
  equipmentList: [
    {
      id: 'hiking-boots',
      nameEn: 'Hiking boots',
      nameEs: 'Botas de montaña / senderismo',
      purpose: 'They protect your feet and help you walk safely.',
      purposeEs: 'Protegen tus pies y te ayudan a caminar de forma segura.',
      category: 'trekking',
      iconName: 'Footprints',
      tip: 'Technical mountain boots with high ankle support.',
      itemImage: '/assets/aistudio/item_hiking_boots.png',
    },
    {
      id: 'backpack',
      nameEn: 'Backpack',
      nameEs: 'Mochila / Morral de travesía',
      purpose: 'It carries your water, food, and personal items.',
      purposeEs: 'Lleva tu agua, comida y pertenencias personales.',
      category: 'trekking',
      iconName: 'Package',
      tip: 'A large backpack is needed for multi-day expeditions.',
      itemImage: '/assets/aistudio/item_backpack.png',
    },
    {
      id: 'trekking-poles',
      nameEn: 'Trekking poles',
      nameEs: 'Bastones de trekking',
      purpose: 'They help with balance on uneven paths.',
      purposeEs: 'Ayudan a mantener el equilibrio en caminos irregulares.',
      category: 'trekking',
      iconName: 'Compass',
      tip: 'Essential for stability on steep slopes and rocky trails.',
      itemImage: '/assets/aistudio/item_poles.png',
    },
    {
      id: 'tent',
      nameEn: 'Tent',
      nameEs: 'Carpa / Tienda de acampar',
      purpose: 'It gives you shelter when you sleep outdoors.',
      purposeEs: 'Te brinda refugio cuando duermes al aire libre.',
      category: 'trekking',
      iconName: 'Tent',
      tip: 'Provides protection against wind, rain, and cold nights.',
      itemImage: '/assets/aistudio/item_tent.png',
    },
    {
      id: 'sleeping-bag',
      nameEn: 'Sleeping bag',
      nameEs: 'Bolsa de dormir / Sleeping',
      purpose: 'It keeps you warm while you sleep.',
      purposeEs: 'Te mantiene abrigado mientras duermes.',
      category: 'trekking',
      iconName: 'Moon',
      tip: 'Crucial for resting comfortably in low mountain temperatures.',
      itemImage: '/assets/aistudio/item_sleeping_bag.png',
    },
    {
      id: 'trail-food',
      nameEn: 'Trail food',
      nameEs: 'Comida de marcha / Alimentos energéticos',
      purpose: 'It gives you energy during a long journey.',
      purposeEs: 'Te da energía durante una larga travesía.',
      category: 'trekking',
      iconName: 'Utensils',
      tip: 'Nuts, dried fruits, energy bars and nutritious trail rations.',
      itemImage: '/assets/aistudio/item_trail_food.png',
    },
    {
      id: 'map-and-compass',
      nameEn: 'Map and compass',
      nameEs: 'Mapa y brújula',
      purpose: 'They help you find your way.',
      purposeEs: 'Te ayudan a encontrar tu camino y orientarte.',
      category: 'trekking',
      iconName: 'Navigation',
      tip: 'Reliable tools for navigation in remote areas without signal.',
      itemImage: '/assets/aistudio/item_map_compass.png',
    },
    {
      id: 'water-bottle',
      nameEn: 'Water bottle',
      nameEs: 'Botella de agua / Hidratación',
      purpose: 'It helps you stay hydrated.',
      purposeEs: 'Te ayuda a mantenerte hidratado.',
      category: 'trekking',
      iconName: 'Droplets',
      tip: 'Clean hydration is indispensable on continuous trails.',
      itemImage: '/assets/aistudio/item_water_bottle.jpg',
    },
    {
      id: 'notebook-pencil',
      nameEn: 'Notebook and pencil',
      nameEs: 'Libreta de apuntes y lápiz',
      purpose: 'What you use to write your observations.',
      purposeEs: 'Lo que usas para registrar tus observaciones de campo.',
      category: 'trekking',
      iconName: 'BookOpen',
      tip: 'Record trail logs, coordinates, species spotted, and times.',
      itemImage: '/assets/aistudio/item_notebook_pencil.jpg',
    },
  ],
  birdwatching: {
    title: 'Birdwatching',
    spanishTitle: 'Avistamiento de aves',
    definition: 'Birdwatching is observing birds in their natural habitats.',
    definitionEs: 'El avistamiento de aves es observar aves en sus hábitats naturales.',
    items: [
      {
        id: 'binoculars',
        nameEn: 'Binoculars',
        nameEs: 'Binoculares / Prismáticos',
        purpose: 'They help you see birds from far away.',
        purposeEs: 'Te ayudan a ver las aves desde lejos.',
        category: 'birdwatching',
        iconName: 'Eye',
        tip: 'Allows clear viewing of plumage and behaviors at distance.',
        itemImage: '/assets/aistudio/item_binoculars.png',
      },
      {
        id: 'bird-guide',
        nameEn: 'Bird guide',
        nameEs: 'Guía de aves',
        purpose: 'It helps you identify different bird species.',
        purposeEs: 'Te ayuda a identificar diferentes especies de aves.',
        category: 'birdwatching',
        iconName: 'Book',
        tip: 'Field book with illustrations, songs, and geographic distributions.',
        itemImage: '/assets/aistudio/item_bird_guide.png',
      },
      {
        id: 'camera',
        nameEn: 'Camera',
        nameEs: 'Cámara fotográfica',
        purpose: 'It lets you take pictures of birds without disturbing them.',
        purposeEs: 'Te permite tomar fotos de aves sin perturbarlas.',
        category: 'birdwatching',
        iconName: 'Camera',
        tip: 'Telephoto lenses capture wildlife ethically and sharply.',
        itemImage: '/assets/aistudio/item_birdwatching_desk.png',
      },
    ],
  },
};

export interface TrekingPdfQuestion {
  number: number;
  question: string;
  options: string[];
  correctAnswer: string;
  sourcePage: number;
  explanation: string;
}

export const TREKING_12_QUESTIONS: TrekingPdfQuestion[] = [
  {
    number: 1,
    question: 'Which item protects your feet on a trail?',
    options: ['Binoculars', 'Hiking boots', 'Tent'],
    correctAnswer: 'Hiking boots',
    sourcePage: 5,
    explanation: 'Hiking boots protect your feet and help you walk safely.',
  },
  {
    number: 2,
    question: 'What do you use to carry your food and clothes?',
    options: ['Backpack', 'Compass', 'Camera'],
    correctAnswer: 'Backpack',
    sourcePage: 5,
    explanation: 'A backpack carries your water, food, and personal items.',
  },
  {
    number: 3,
    question: 'Which item gives you shelter at night?',
    options: ['Bird guide', 'Sun hat', 'Tent'],
    correctAnswer: 'Tent',
    sourcePage: 5,
    explanation: 'A tent gives you shelter when you sleep outdoors.',
  },
  {
    number: 4,
    question: 'What keeps you warm while you sleep?',
    options: ['Sleeping bag', 'Water bottle', 'Notebook'],
    correctAnswer: 'Sleeping bag',
    sourcePage: 5,
    explanation: 'A sleeping bag keeps you warm while you sleep.',
  },
  {
    number: 5,
    question: 'What helps you find your way?',
    options: ['Camera', 'Map and compass', 'Binoculars'],
    correctAnswer: 'Map and compass',
    sourcePage: 6,
    explanation: 'A map and compass help you find your way in the outdoors.',
  },
  {
    number: 6,
    question: 'What do you use to see birds far away?',
    options: ['Binoculars', 'Trekking poles', 'Sleeping bag'],
    correctAnswer: 'Binoculars',
    sourcePage: 6,
    explanation: 'Binoculars help you see birds and distant wildlife from far away.',
  },
  {
    number: 7,
    question: 'Which item helps you identify bird species?',
    options: ['Tent', 'Bird guide', 'Hiking boots'],
    correctAnswer: 'Bird guide',
    sourcePage: 6,
    explanation: 'A bird guide helps you identify different bird species.',
  },
  {
    number: 8,
    question: 'What do you use to write your observations?',
    options: ['Notebook and pencil', 'Water bottle', 'Backpack'],
    correctAnswer: 'Notebook and pencil',
    sourcePage: 6,
    explanation: 'A notebook and pencil are used to write your field observations.',
  },
  {
    number: 9,
    question: 'Which activity usually lasts several days?',
    options: ['Birdwatching', 'Hiking', 'Trekking'],
    correctAnswer: 'Trekking',
    sourcePage: 6,
    explanation: 'Trekking is a long-distance journey that lasts several days and includes overnight stays.',
  },
  {
    number: 10,
    question: 'Which activity focuses on observing birds?',
    options: ['Trekking', 'Birdwatching', 'Hiking'],
    correctAnswer: 'Birdwatching',
    sourcePage: 7,
    explanation: 'Birdwatching is observing birds in their natural habitats.',
  },
  {
    number: 11,
    question: 'What helps you stay hydrated?',
    options: ['Water bottle', 'Camera', 'Compass'],
    correctAnswer: 'Water bottle',
    sourcePage: 7,
    explanation: 'A water bottle carries fluids and helps you stay hydrated.',
  },
  {
    number: 12,
    question: 'Which item helps you keep your balance while walking?',
    options: ['Bird guide', 'Trekking poles', 'Sleeping bag'],
    correctAnswer: 'Trekking poles',
    sourcePage: 7,
    explanation: 'Trekking poles help with balance on uneven paths.',
  },
];

export function getTrekingQuizQuestions(): QuizQuestion[] {
  return TREKING_12_QUESTIONS.map((q) => {
    const vocabItem: VocabularyItem = {
      id: `treking-q-${q.number}`,
      program: 'TREKING',
      category: 'technical',
      spanish: q.explanation,
      english: q.correctAnswer,
      distractorsEn: q.options.filter((o) => o !== q.correctAnswer),
      distractorsEs: [],
    };

    return {
      id: `treking-q-${q.number}`,
      program: 'TREKING',
      category: 'technical',
      type: 'en_to_es',
      prompt: q.question,
      subPrompt: `Pregunta ${q.number} de 12 (PDF Treking)`,
      correctAnswer: q.correctAnswer,
      options: q.options,
      originalItem: vocabItem,
    };
  });
}

export type PresentationSlideType = 'concept' | 'comparison' | 'equipment';

export interface TrekingPresentationSlide {
  id: string;
  slideNumber: number;
  totalSlides: number;
  type: PresentationSlideType;
  badge: string;
  headerCategory: string;
  titleEn?: string;
  titleEs?: string;
  sectionTitle?: string;
  heroImage?: string;
  heroImageAlt?: string;
  descriptionEn?: string;
  descriptionEs?: string;
  keyTakeaway?: string;
  keyTakeawayEs?: string;
  comparison?: {
    hiking: {
      title: string;
      subtitle: string;
      duration: string;
      terrain: string;
      difficulty: string;
      summary: string;
    };
    trekking: {
      title: string;
      subtitle: string;
      duration: string;
      terrain: string;
      difficulty: string;
      summary: string;
    };
  };
  equipmentItems?: Array<{
    nameEn: string;
    nameEs: string;
    purposeEn: string;
    purposeEs: string;
    itemImage?: string;
    iconName?: string;
    tip?: string;
  }>;
  audioScript: string;
}

export const TREKING_12_PRESENTATION_SLIDES: TrekingPresentationSlide[] = [
  // 1. Concept: Hiking vs Trekking
  {
    id: 'pslide-01',
    slideNumber: 1,
    totalSlides: 12,
    type: 'concept',
    badge: 'DIAPOSITIVA 01 · INTRODUCCIÓN Y COMPARATIVA',
    headerCategory: 'INTRODUCCIÓN Y COMPARATIVA',
    heroImage: '/assets/aistudio/slide_img_1_hiking_trekking.jpg',
    heroImageAlt: 'Hiking trail in green forest contrasted with mountain trekking group',
    titleEn: 'HIKING VS. TREKKING: CORE DIFFERENCES',
    titleEs: 'Senderismo vs. Travesía: Diferencias Fundamentales',
    descriptionEn:
      'Hiking and trekking are outdoor activities that involve walking in nature, but they differ in duration, difficulty, and level of planning.',
    descriptionEs:
      'El senderismo (hiking) y la travesía (trekking) son actividades al aire libre que implican caminar en la naturaleza, pero se diferencian en duración, dificultad y nivel de planificación.',
    keyTakeaway:
      'Trekking lasts several days with overnight stays outdoors, while hiking is completed in a single day.',
    keyTakeawayEs:
      '(El trekking dura varios días con noches en carpa o refugio; el hiking se completa en un solo día.)',
    audioScript:
      'Hiking and trekking are outdoor activities that involve walking in nature, but they differ in duration, difficulty, and level of planning. Hiking is completed in a single day. Trekking lasts several days.',
  },

  // 2. Comparison: Hiking vs Trekking Detailed Grid
  {
    id: 'pslide-02',
    slideNumber: 2,
    totalSlides: 12,
    type: 'comparison',
    badge: 'DIAPOSITIVA 02 · COMPARATIVA DETALLADA',
    headerCategory: 'COMPARATIVA DETALLADA',
    sectionTitle: 'COMPARATIVA DETALLADA: HIKING VS. TREKKING',
    comparison: {
      hiking: {
        title: 'Hiking',
        subtitle: 'Senderismo de un día',
        duration: 'Usually completed in a single day, generally taking a few hours.',
        terrain: 'Official, well-marked, and established paths and trails.',
        difficulty: 'Easy to moderate, accessible to beginners, families, and casual explorers.',
        summary: 'Day trip on established nature trails suitable for all fitness levels.',
      },
      trekking: {
        title: 'Trekking',
        subtitle: 'Travesía de varios días (Excursión remota)',
        duration: 'A long-distance journey that lasts several days with overnight camping or mountain shelters.',
        terrain: 'Remote, rugged, or mountainous areas, frequently without clearly marked trails.',
        difficulty: 'Moderate to challenging; requires physical endurance, navigation skills, and planning.',
        summary: 'Multi-day wilderness expedition requiring full autonomous gear.',
      },
    },
    audioScript:
      'Hiking is completed in a single day on official trails. Trekking is a long journey lasting several days with camping.',
  },

  // 3. Concept: Footwear & Backpack
  {
    id: 'pslide-03',
    slideNumber: 3,
    totalSlides: 12,
    type: 'concept',
    badge: 'DIAPOSITIVA 03 · EQUIPAMIENTO ESENCIAL 1',
    headerCategory: 'EQUIPAMIENTO ESENCIAL 1',
    heroImage: '/assets/aistudio/slide_img_2_boots_backpack.jpg',
    heroImageAlt: 'Rugged leather hiking boots and large expedition backpack overlook',
    titleEn: 'ESSENTIAL FOOTWEAR & CARGO: BOOTS AND BACKPACK',
    titleEs: 'Calzado Técnico y Carga: Botas de Montaña y Mochila',
    descriptionEn:
      'Footwear protects your lower joints from rocky terrain, while a high-capacity backpack secures all clothing, hydration, and nutrition for multi-day endurance.',
    descriptionEs:
      'El calzado técnico protege tus articulaciones del terreno pedregoso, mientras que una mochila de gran capacidad resguarda abrigo, hidratación y comida para varios días.',
    keyTakeaway:
      'Hiking boots protect your feet on uneven trails, and a large backpack carries your food, water, and clothes.',
    keyTakeawayEs:
      '(Las botas protegen tus pies en caminos difíciles, y la mochila transporta tu comida, agua y ropa.)',
    audioScript:
      'Hiking boots protect your feet and help you walk safely. A large backpack carries your water, food, and personal items.',
  },

  // 4. Equipment: Boots & Backpack
  {
    id: 'pslide-04',
    slideNumber: 4,
    totalSlides: 12,
    type: 'equipment',
    badge: 'DIAPOSITIVA 04 · ELEMENTOS & EQUIPAMIENTO',
    headerCategory: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    sectionTitle: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    equipmentItems: [
      {
        nameEn: 'Hiking boots',
        nameEs: 'Botas de montaña / senderismo',
        purposeEn: 'They protect your feet and help you walk safely.',
        purposeEs: 'Protegen tus pies y te ayudan a caminar de forma segura.',
        itemImage: '/assets/aistudio/item_hiking_boots.png',
        tip: 'Technical mountain boots with high ankle support prevent sprains and provide traction.',
      },
      {
        nameEn: 'Backpack',
        nameEs: 'Mochila / Morral de travesía',
        purposeEn: 'It carries your water, food, and personal items.',
        purposeEs: 'Lleva tu agua, comida y pertenencias personales.',
        itemImage: '/assets/aistudio/item_backpack.png',
        tip: 'A large backpack (50L to 75L) is needed for multi-day expeditions with load lifters.',
      },
    ],
    audioScript:
      'Hiking boots protect your feet and help you walk safely. A backpack carries your water, food, and personal items.',
  },

  // 5. Concept: Trekking Poles & Tent
  {
    id: 'pslide-05',
    slideNumber: 5,
    totalSlides: 12,
    type: 'concept',
    badge: 'DIAPOSITIVA 05 · EQUIPAMIENTO ESENCIAL 2',
    headerCategory: 'EQUIPAMIENTO ESENCIAL 2',
    heroImage: '/assets/aistudio/slide_img_3_tent_poles.jpg',
    heroImageAlt: 'Green mountain tent pitched with trekking poles in meadow',
    titleEn: 'TRAIL BALANCE & OUTDOOR SHELTER: TREKKING POLES AND TENT',
    titleEs: 'Estabilidad y Refugio al Aire Libre: Bastones y Carpa',
    descriptionEn:
      'Trekking poles reduce joint stress and maintain equilibrium over steep paths, while an expedition tent provides shelter and warmth when sleeping under the stars.',
    descriptionEs:
      'Los bastones de trekking reducen el impacto en las articulaciones y mantienen el equilibrio, mientras que una carpa de expedición brinda refugio al dormir a la intemperie.',
    keyTakeaway:
      'Trekking poles give balance on uneven trails; a tent gives you shelter when you sleep outdoors.',
    keyTakeawayEs:
      '(Los bastones dan balance en senderos irregulares; la carpa te da refugio al dormir al aire libre.)',
    audioScript:
      'Trekking poles help with balance on uneven paths. A tent gives you shelter when you sleep outdoors.',
  },

  // 6. Equipment: Trekking Poles & Tent
  {
    id: 'pslide-06',
    slideNumber: 6,
    totalSlides: 12,
    type: 'equipment',
    badge: 'DIAPOSITIVA 06 · ELEMENTOS & EQUIPAMIENTO',
    headerCategory: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    sectionTitle: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    equipmentItems: [
      {
        nameEn: 'Trekking poles',
        nameEs: 'Bastones de trekking',
        purposeEn: 'They help with balance on uneven paths.',
        purposeEs: 'Ayudan a mantener el equilibrio en caminos irregulares.',
        itemImage: '/assets/aistudio/item_poles.png',
        tip: 'Reduces impact on your knees and distributes workload across upper body muscles.',
      },
      {
        nameEn: 'Tent',
        nameEs: 'Carpa / Tienda de campaña',
        purposeEn: 'It gives you shelter when you sleep outdoors.',
        purposeEs: 'Te brinda refugio cuando duermes al aire libre.',
        itemImage: '/assets/aistudio/item_tent.png',
        tip: 'Provides vital windproof and waterproof shelter against unpredictable mountain rain and cold.',
      },
    ],
    audioScript:
      'Trekking poles help with balance on uneven paths. A tent gives you shelter when you sleep outdoors.',
  },

  // 7. Concept: Sleeping Bag, Food and Hydration
  {
    id: 'pslide-07',
    slideNumber: 7,
    totalSlides: 12,
    type: 'concept',
    badge: 'DIAPOSITIVA 07 · DESCANSO Y NUTRICIÓN',
    headerCategory: 'DESCANSO Y NUTRICIÓN',
    heroImage: '/assets/aistudio/slide_img_4_sleeping_sustenance.jpg',
    heroImageAlt: 'Rolled sleeping bag with trail mix snacks and stainless steel water bottle',
    titleEn: 'THERMAL WARMTH & SUSTENANCE: SLEEPING BAG, FOOD AND HYDRATION',
    titleEs: 'Calor Térmico y Sustento: Sleeping, Comida e Hidratación',
    descriptionEn:
      'Endurance on long treks requires insulating warmth through the night and constant replenishment of calories and fluids along the trail.',
    descriptionEs:
      'La resistencia en travesías largas exige aislamiento térmico nocturno y reposición continua de calorías e hidratación en el sendero.',
    keyTakeaway:
      'A sleeping bag keeps you warm while you sleep; trail food provides energy and water maintains hydration.',
    keyTakeawayEs:
      '(La bolsa de dormir te mantiene abrigado; la comida de marcha aporta energía y el agua hidratación.)',
    audioScript:
      'A sleeping bag keeps you warm while you sleep. Trail food gives you energy during a long journey, and a water bottle helps you stay hydrated.',
  },

  // 8. Equipment: Sleeping Bag, Trail Food, Water bottle
  {
    id: 'pslide-08',
    slideNumber: 8,
    totalSlides: 12,
    type: 'equipment',
    badge: 'DIAPOSITIVA 08 · ELEMENTOS & EQUIPAMIENTO',
    headerCategory: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    sectionTitle: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    equipmentItems: [
      {
        nameEn: 'Sleeping bag',
        nameEs: 'Bolsa de dormir / Sleeping',
        purposeEn: 'It keeps you warm while you sleep.',
        purposeEs: 'Te mantiene abrigado mientras duermes.',
        itemImage: '/assets/aistudio/item_sleeping_bag.png',
        tip: 'Mummy-style thermal bags trap core heat during sub-zero mountain temperatures.',
      },
      {
        nameEn: 'Trail food',
        nameEs: 'Comida de marcha / Alimentos energéticos',
        purposeEn: 'It gives you energy during a long journey.',
        purposeEs: 'Te da energía durante una larga travesía.',
        itemImage: '/assets/aistudio/item_trail_food.png',
        tip: 'Dense calorie snacks like nuts, dried bananas, dark chocolate, and energy bars.',
      },
      {
        nameEn: 'Water bottle',
        nameEs: 'Botella de agua / Hidratación',
        purposeEn: 'It helps you stay hydrated.',
        purposeEs: 'Te ayuda a mantenerte hidratado en todo momento.',
        itemImage: '/assets/aistudio/item_water_bottle.jpg',
        iconName: 'Droplets',
        tip: 'Carry sufficient water and always treat raw mountain streams before drinking.',
      },
    ],
    audioScript:
      'A sleeping bag keeps you warm while you sleep. Trail food gives you energy during a long journey. A water bottle helps you stay hydrated.',
  },

  // 9. Concept: Navigation & First Aid
  {
    id: 'pslide-09',
    slideNumber: 9,
    totalSlides: 12,
    type: 'concept',
    badge: 'DIAPOSITIVA 09 · ORIENTACIÓN Y SEGURIDAD',
    headerCategory: 'ORIENTACIÓN Y SEGURIDAD',
    heroImage: '/assets/aistudio/slide_img_5_map_navigation.jpg',
    heroImageAlt: 'Topographic contour map with magnetic compass and red medical first aid pouch',
    titleEn: 'WILDERNESS NAVIGATION & SAFETY: MAP, COMPASS AND FIRST AID',
    titleEs: 'Navegación Silvestre y Seguridad: Mapa, Brújula y Primeros Auxilios',
    descriptionEn:
      'Remote mountain routes often lack cellular reception. Dependable analog navigation tools and a medical emergency kit are vital safety safeguards.',
    descriptionEs:
      'Las rutas de montaña remotas carecen de señal de celular. Las herramientas de navegación analógicas y un botiquín médico son seguros vitales de supervivencia.',
    keyTakeaway:
      'A map and compass help you find your way in remote areas without phone signal.',
    keyTakeawayEs:
      '(El mapa y la brújula te ayudan a encontrar tu camino en zonas remotas sin señal telefónica.)',
    audioScript:
      'A map and compass help you find your way. A first aid kit provides emergency medical care outdoors.',
  },

  // 10. Equipment: Map and compass, First aid kit
  {
    id: 'pslide-10',
    slideNumber: 10,
    totalSlides: 12,
    type: 'equipment',
    badge: 'DIAPOSITIVA 10 · ELEMENTOS & EQUIPAMIENTO',
    headerCategory: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    sectionTitle: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    equipmentItems: [
      {
        nameEn: 'Map and compass',
        nameEs: 'Mapa y brújula',
        purposeEn: 'They help you find your way.',
        purposeEs: 'Te ayudan a encontrar tu camino y orientarte.',
        itemImage: '/assets/aistudio/item_map_compass.png',
        tip: 'Paper topographic contour maps and magnetic compasses function in all weather without batteries.',
      },
      {
        nameEn: 'First aid kit',
        nameEs: 'Botiquín de primeros auxilios',
        purposeEn: 'Provides emergency care for cuts, blisters, and trail injuries.',
        purposeEs: 'Proporciona atención de emergencia para cortes, ampollas y lesiones en ruta.',
        itemImage: '/assets/aistudio/item_first_aid_kit.jpg',
        iconName: 'ShieldCheck',
        tip: 'Include blister bandages, antiseptic wipes, sterile gauze, pain relievers, and medical tape.',
      },
    ],
    audioScript:
      'A map and compass help you find your way. A first aid kit provides emergency medical care outdoors.',
  },

  // 11. Concept: Birdwatching
  {
    id: 'pslide-11',
    slideNumber: 11,
    totalSlides: 12,
    type: 'concept',
    badge: 'DIAPOSITIVA 11 · FAUNA Y OBSERVACIÓN',
    headerCategory: 'FAUNA Y OBSERVACIÓN',
    heroImage: '/assets/aistudio/slide_img_6_birdwatching.jpg',
    heroImageAlt: 'Birdwatching binoculars, illustrated bird guide book and field notes notebook',
    titleEn: 'SPECIALIZED ACTIVITY: BIRDWATCHING (AVISTAMIENTO DE AVES)',
    titleEs: 'Actividad Especializada: Avistamiento de Aves (Birdwatching)',
    descriptionEn:
      'Birdwatching is observing birds in their natural habitats. It pairs outdoor trekking with optics, field identification guides, and ecological notes.',
    descriptionEs:
      'El avistamiento de aves es observar aves en sus hábitats naturales. Combina senderismo con óptica, guías de identificación de campo y notas ecológicas.',
    keyTakeaway:
      'Binoculars help see birds far away, the bird guide identifies species, and the notebook records observations.',
    keyTakeawayEs:
      '(Los binoculares permiten ver aves a lo lejos, la guía identifica especies y el cuaderno registra observaciones.)',
    audioScript:
      'Birdwatching is observing birds in their natural habitats. Binoculars help you see birds from far away. A bird guide helps you identify different bird species.',
  },

  // 12. Equipment: Birdwatching items
  {
    id: 'pslide-12',
    slideNumber: 12,
    totalSlides: 12,
    type: 'equipment',
    badge: 'DIAPOSITIVA 12 · ELEMENTOS & EQUIPAMIENTO',
    headerCategory: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    sectionTitle: 'ELEMENTOS & EQUIPAMIENTO DEL TEMA',
    equipmentItems: [
      {
        nameEn: 'Binoculars',
        nameEs: 'Binoculares / Prismáticos',
        purposeEn: 'They help you see birds from far away.',
        purposeEs: 'Te ayudan a ver las aves desde lejos.',
        itemImage: '/assets/aistudio/item_binoculars.png',
        tip: 'Optical magnification (8x42) reveals tiny plumage colors without scaring wildlife.',
      },
      {
        nameEn: 'Bird guide',
        nameEs: 'Guía de aves / Manual de identificación',
        purposeEn: 'It helps you identify different bird species.',
        purposeEs: 'Te ayuda a identificar diferentes especies de aves.',
        itemImage: '/assets/aistudio/item_bird_guide.png',
        tip: 'Features regional species range maps, scientific names, and behavioral clues.',
      },
      {
        nameEn: 'Camera',
        nameEs: 'Cámara fotográfica',
        purposeEn: 'It lets you take pictures of birds without disturbing them.',
        purposeEs: 'Te permite tomar fotos de aves sin perturbarlas.',
        itemImage: '/assets/aistudio/item_birdwatching_desk.png',
        tip: 'Zoom lenses allow documentation for citizen science biodiversity platforms.',
      },
      {
        nameEn: 'Notebook and pencil',
        nameEs: 'Cuaderno de campo y lápiz',
        purposeEn: 'What you use to write your observations.',
        purposeEs: 'Lo que usas para registrar tus observaciones de campo.',
        itemImage: '/assets/aistudio/item_notebook_pencil.jpg',
        iconName: 'BookOpen',
        tip: 'Record species counts, elevation, plumage variations, and time of sighting.',
      },
    ],
    audioScript:
      'Binoculars help you see birds from far away. A bird guide helps you identify different bird species. A camera lets you take pictures without disturbing them, and a notebook and pencil are what you use to write your observations.',
  },
];
