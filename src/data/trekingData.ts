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
        itemImage: '/assets/aistudio/item_poles_hd.jpg',
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
      itemImage: '/assets/aistudio/item_poles_hd.jpg',
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

export type PresentationSlideType = 'article' | 'concept' | 'comparison' | 'equipment';

export interface TrekingPresentationSlide {
  id: string;
  slideNumber: number;
  totalSlides: number;
  type: PresentationSlideType;
  badge: string;
  headerCategory: string;
  itemNameEn: string;
  itemNameEs: string;
  itemImage: string;
  categoryEn: string;
  categoryEs: string;
  purposeEn: string;
  purposeEs: string;
  tip: string;
  tipEs: string;
  audioScript: string;
  iconName?: string;
  // Backward compatibility fields:
  titleEn?: string;
  titleEs?: string;
  descriptionEn?: string;
  descriptionEs?: string;
  heroImage?: string;
  heroImageAlt?: string;
  keyTakeaway?: string;
  keyTakeawayEs?: string;
  equipmentItems?: Array<{
    nameEn: string;
    nameEs: string;
    purposeEn: string;
    purposeEs: string;
    itemImage?: string;
    iconName?: string;
    tip?: string;
  }>;
}

export const TREKING_13_PRESENTATION_SLIDES: TrekingPresentationSlide[] = [
  // 1. Hiking boots
  {
    id: 'pslide-01',
    slideNumber: 1,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 01 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'CALZADO TÉCNICO DE MONTAÑA',
    itemNameEn: 'Hiking boots',
    itemNameEs: 'Botas de montaña / senderismo',
    itemImage: '/assets/aistudio/item_hiking_boots.png',
    categoryEn: 'Technical Footwear',
    categoryEs: 'Calzado Técnico de Montaña',
    purposeEn: 'They protect your feet and help you walk safely.',
    purposeEs: 'Protegen tus pies y te ayudan a caminar de forma segura.',
    tip: 'Technical mountain boots with high ankle support prevent sprains and provide traction on rocky trails.',
    tipEs: 'Las botas técnicas con caña alta protegen el tobillo contra esguinces y brindan tracción.',
    audioScript: 'Hiking boots. They protect your feet and help you walk safely on rugged mountain trails.',
    iconName: 'Footprints',
    titleEn: 'Hiking boots',
    titleEs: 'Botas de montaña / senderismo',
    descriptionEn: 'They protect your feet and help you walk safely.',
    descriptionEs: 'Protegen tus pies y te ayudan a caminar de forma segura.',
  },

  // 2. Backpack
  {
    id: 'pslide-02',
    slideNumber: 2,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 02 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'CARGA Y TRANSPORTE',
    itemNameEn: 'Backpack',
    itemNameEs: 'Mochila / Morral de travesía',
    itemImage: '/assets/aistudio/item_backpack.png',
    categoryEn: 'Load & Cargo',
    categoryEs: 'Carga y Transporte',
    purposeEn: 'It carries your water, food, and personal items.',
    purposeEs: 'Lleva tu agua, comida y pertenencias personales.',
    tip: 'A large backpack (50L to 75L) with load lifters and hip belt is essential for multi-day expeditions.',
    tipEs: 'Una mochila grande (50L a 75L) con soporte lumbar distribuye el peso para travesías largas.',
    audioScript: 'Backpack. It carries your water, food, and personal items for multi-day expeditions.',
    iconName: 'Package',
    titleEn: 'Backpack',
    titleEs: 'Mochila / Morral de travesía',
    descriptionEn: 'It carries your water, food, and personal items.',
    descriptionEs: 'Lleva tu agua, comida y pertenencias personales.',
  },

  // 3. Trekking poles
  {
    id: 'pslide-03',
    slideNumber: 3,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 03 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'EQUILIBRIO Y ESTABILIDAD',
    itemNameEn: 'Trekking poles',
    itemNameEs: 'Bastones de trekking',
    itemImage: '/assets/aistudio/item_poles_hd.jpg',
    categoryEn: 'Stability & Balance',
    categoryEs: 'Estabilidad y Equilibrio',
    purposeEn: 'They help with balance on uneven paths.',
    purposeEs: 'Ayudan a mantener el equilibrio en caminos irregulares.',
    tip: 'Reduces impact on your knees and distributes workload across your upper body muscles.',
    tipEs: 'Reducen hasta un 25% el impacto en las rodillas y ayudan a sortear terrenos resbalosos.',
    audioScript: 'Trekking poles. They help with balance on uneven paths and reduce impact on knees.',
    iconName: 'Compass',
    titleEn: 'Trekking poles',
    titleEs: 'Bastones de trekking',
    descriptionEn: 'They help with balance on uneven paths.',
    descriptionEs: 'Ayudan a mantener el equilibrio en caminos irregulares.',
  },

  // 4. Tent
  {
    id: 'pslide-04',
    slideNumber: 4,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 04 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'REFUGIO AL AIRE LIBRE',
    itemNameEn: 'Tent',
    itemNameEs: 'Carpa / Tienda de campaña',
    itemImage: '/assets/aistudio/item_tent.png',
    categoryEn: 'Wilderness Shelter',
    categoryEs: 'Refugio al Aire Libre',
    purposeEn: 'It gives you shelter when you sleep outdoors.',
    purposeEs: 'Te brinda refugio cuando duermes al aire libre.',
    tip: 'Provides vital windproof and waterproof shelter against unpredictable mountain rain and cold.',
    tipEs: 'Brinda resguardo impermeable contra lluvia torrencial, viento y bajas temperaturas nocturnas.',
    audioScript: 'Tent. It gives you shelter when you sleep outdoors in remote mountainous areas.',
    iconName: 'Tent',
    titleEn: 'Tent',
    titleEs: 'Carpa / Tienda de campaña',
    descriptionEn: 'It gives you shelter when you sleep outdoors.',
    descriptionEs: 'Te brinda refugio cuando duermes al aire libre.',
  },

  // 5. Sleeping bag
  {
    id: 'pslide-05',
    slideNumber: 5,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 05 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'DESCANSO Y AISLAMIENTO TÉRMICO',
    itemNameEn: 'Sleeping bag',
    itemNameEs: 'Bolsa de dormir / Sleeping',
    itemImage: '/assets/aistudio/item_sleeping_bag.png',
    categoryEn: 'Thermal Rest',
    categoryEs: 'Descanso y Aislamiento Térmico',
    purposeEn: 'It keeps you warm while you sleep.',
    purposeEs: 'Te mantiene abrigado mientras duermes.',
    tip: 'Mummy-style thermal bags trap core heat during sub-zero mountain temperatures.',
    tipEs: 'Las bolsas térmicas tipo momia conservan el calor corporal durante las noches gélidas.',
    audioScript: 'Sleeping bag. It keeps you warm while you sleep outdoors.',
    iconName: 'Moon',
    titleEn: 'Sleeping bag',
    titleEs: 'Bolsa de dormir / Sleeping',
    descriptionEn: 'It keeps you warm while you sleep.',
    descriptionEs: 'Te mantiene abrigado mientras duermes.',
  },

  // 6. Trail food
  {
    id: 'pslide-06',
    slideNumber: 6,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 06 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'NUTRICIÓN Y ENERGÍA',
    itemNameEn: 'Trail food',
    itemNameEs: 'Comida de marcha / Alimentos energéticos',
    itemImage: '/assets/aistudio/item_trail_food.png',
    categoryEn: 'Nutrition & Energy',
    categoryEs: 'Nutrición y Energía',
    purposeEn: 'It gives you energy during a long journey.',
    purposeEs: 'Te da energía durante una larga travesía.',
    tip: 'Dense calorie snacks like nuts, dried fruits, dark chocolate, and energy bars sustain physical endurance.',
    tipEs: 'Alimentos ricos en calorías y nutrientes aportan energía sostenida durante caminatas extenuantes.',
    audioScript: 'Trail food. It gives you energy during a long journey.',
    iconName: 'Utensils',
    titleEn: 'Trail food',
    titleEs: 'Comida de marcha / Alimentos energéticos',
    descriptionEn: 'It gives you energy during a long journey.',
    descriptionEs: 'Te da energía durante una larga travesía.',
  },

  // 7. Water bottle
  {
    id: 'pslide-07',
    slideNumber: 7,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 07 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'HIDRATACIÓN VITAL',
    itemNameEn: 'Water bottle',
    itemNameEs: 'Botella de agua / Hidratación',
    itemImage: '/assets/aistudio/item_water_bottle.jpg',
    categoryEn: 'Hydration',
    categoryEs: 'Hidratación Vital',
    purposeEn: 'It helps you stay hydrated.',
    purposeEs: 'Te ayuda a mantenerte hidratado en todo momento.',
    tip: 'Carry sufficient water and always treat raw mountain streams with filters or purification tablets before drinking.',
    tipEs: 'Mantenerse hidratado previene la fatiga; desinfecta siempre el agua silvestre antes de beber.',
    audioScript: 'Water bottle. It helps you stay hydrated throughout the hike.',
    iconName: 'Droplets',
    titleEn: 'Water bottle',
    titleEs: 'Botella de agua / Hidratación',
    descriptionEn: 'It helps you stay hydrated.',
    descriptionEs: 'Te ayuda a mantenerte hidratado en todo momento.',
  },

  // 8. Map and compass
  {
    id: 'pslide-08',
    slideNumber: 8,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 08 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'ORIENTACIÓN Y NAVEGACIÓN',
    itemNameEn: 'Map and compass',
    itemNameEs: 'Mapa y brújula',
    itemImage: '/assets/aistudio/item_map_compass.png',
    categoryEn: 'Wilderness Navigation',
    categoryEs: 'Orientación y Navegación',
    purposeEn: 'They help you find your way.',
    purposeEs: 'Te ayudan a encontrar tu camino y orientarte.',
    tip: 'Paper topographic contour maps and magnetic compasses function in all weather without batteries or cellular signal.',
    tipEs: 'Herramientas análogas confiables que operan en cualquier clima sin depender de batería ni señal.',
    audioScript: 'Map and compass. They help you find your way in remote areas.',
    iconName: 'Navigation',
    titleEn: 'Map and compass',
    titleEs: 'Mapa y brújula',
    descriptionEn: 'They help you find your way.',
    descriptionEs: 'Te ayudan a encontrar tu camino y orientarte.',
  },

  // 9. First aid kit
  {
    id: 'pslide-09',
    slideNumber: 9,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 09 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'SEGURIDAD Y PRIMEROS AUXILIOS',
    itemNameEn: 'First aid kit',
    itemNameEs: 'Botiquín de primeros auxilios',
    itemImage: '/assets/aistudio/item_first_aid_kit.jpg',
    categoryEn: 'Emergency Care',
    categoryEs: 'Seguridad y Primeros Auxilios',
    purposeEn: 'Provides emergency care for cuts, blisters, and trail injuries.',
    purposeEs: 'Proporciona atención de emergencia para cortes, ampollas y lesiones en ruta.',
    tip: 'Include blister bandages, antiseptic wipes, sterile gauze, pain relievers, and medical adhesive tape.',
    tipEs: 'Debe contener apósitos para ampollas, antisépticos, gasa estéril y analgésicos para imprevistos.',
    audioScript: 'First aid kit. Provides emergency care for cuts, blisters, and trail injuries.',
    iconName: 'ShieldCheck',
    titleEn: 'First aid kit',
    titleEs: 'Botiquín de primeros auxilios',
    descriptionEn: 'Provides emergency care for cuts, blisters, and trail injuries.',
    descriptionEs: 'Proporciona atención de emergencia para cortes, ampollas y lesiones en ruta.',
  },

  // 10. Binoculars
  {
    id: 'pslide-10',
    slideNumber: 10,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 10 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'ÓPTICA Y OBSERVACIÓN DE AVES',
    itemNameEn: 'Binoculars',
    itemNameEs: 'Binoculares / Prismáticos',
    itemImage: '/assets/aistudio/item_binoculars.png',
    categoryEn: 'Birdwatching Optics',
    categoryEs: 'Óptica y Observación de Aves',
    purposeEn: 'They help you see birds from far away.',
    purposeEs: 'Te ayudan a ver las aves desde lejos.',
    tip: 'Optical magnification (8x42) reveals tiny plumage colors without scaring or disturbing wildlife.',
    tipEs: 'Permiten apreciar detalles minuciosos del plumaje y comportamiento de las aves a distancia.',
    audioScript: 'Binoculars. They help you see birds and wildlife from far away.',
    iconName: 'Eye',
    titleEn: 'Binoculars',
    titleEs: 'Binoculares / Prismáticos',
    descriptionEn: 'They help you see birds from far away.',
    descriptionEs: 'Te ayudan a ver las aves desde lejos.',
  },

  // 11. Bird guide
  {
    id: 'pslide-11',
    slideNumber: 11,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 11 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'GUÍA DE CAMPO E IDENTIFICACIÓN',
    itemNameEn: 'Bird guide',
    itemNameEs: 'Guía de aves / Manual de identificación',
    itemImage: '/assets/aistudio/item_bird_guide.png',
    categoryEn: 'Species Identification',
    categoryEs: 'Guía de Campo e Identificación',
    purposeEn: 'It helps you identify different bird species.',
    purposeEs: 'Te ayuda a identificar diferentes especies de aves.',
    tip: 'Features regional species range maps, scientific names, plumage variations, and behavioral clues.',
    tipEs: 'Manual ilustrado con nombres científicos, cantos y mapas para clasificar especies en campo.',
    audioScript: 'Bird guide. It helps you identify different bird species.',
    iconName: 'Book',
    titleEn: 'Bird guide',
    titleEs: 'Guía de aves / Manual de identificación',
    descriptionEn: 'It helps you identify different bird species.',
    descriptionEs: 'Te ayuda a identificar diferentes especies de aves.',
  },

  // 12. Camera
  {
    id: 'pslide-12',
    slideNumber: 12,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 12 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'REGISTRO VISUAL DE BIODIVERSIDAD',
    itemNameEn: 'Camera',
    itemNameEs: 'Cámara fotográfica',
    itemImage: '/assets/aistudio/item_birdwatching_desk.png',
    categoryEn: 'Visual Documentation',
    categoryEs: 'Registro Visual de Biodiversidad',
    purposeEn: 'It lets you take pictures of birds without disturbing them.',
    purposeEs: 'Te permite tomar fotos de aves sin perturbarlas.',
    tip: 'Zoom telephoto lenses allow ethical documentation for citizen science biodiversity platforms.',
    tipEs: 'El teleobjetivo permite fotografiar aves a gran distancia sin alterar su comportamiento natural.',
    audioScript: 'Camera. It lets you take pictures of birds without disturbing them.',
    iconName: 'Camera',
    titleEn: 'Camera',
    titleEs: 'Cámara fotográfica',
    descriptionEn: 'It lets you take pictures of birds without disturbing them.',
    descriptionEs: 'Te permite tomar fotos de aves sin perturbarlas.',
  },

  // 13. Notebook and pencil
  {
    id: 'pslide-13',
    slideNumber: 13,
    totalSlides: 13,
    type: 'article',
    badge: 'DIAPOSITIVA 13 DE 13 · ARTÍCULOS & EQUIPAMIENTO',
    headerCategory: 'NOTAS DE CAMPO Y OBSERVACIONES',
    itemNameEn: 'Notebook and pencil',
    itemNameEs: 'Cuaderno de campo y lápiz',
    itemImage: '/assets/aistudio/item_notebook_pencil.jpg',
    categoryEn: 'Field Logs',
    categoryEs: 'Notas de Campo y Observaciones',
    purposeEn: 'What you use to write your observations.',
    purposeEs: 'Lo que usas para registrar tus observaciones de campo.',
    tip: 'Record species counts, elevation, geographic coordinates, weather, and exact sighting times.',
    tipEs: 'Herramienta fundamental para anotar datos ecológicos, fecha, hora y descripción de hábitat.',
    audioScript: 'Notebook and pencil. What you use to write your observations.',
    iconName: 'BookOpen',
    titleEn: 'Notebook and pencil',
    titleEs: 'Cuaderno de campo y lápiz',
    descriptionEn: 'What you use to write your observations.',
    descriptionEs: 'Lo que usas para registrar tus observaciones de campo.',
  },
];

// Alias for backwards compatibility
export const TREKING_12_PRESENTATION_SLIDES = TREKING_13_PRESENTATION_SLIDES;
export const TREKING_PRESENTATION_SLIDES = TREKING_13_PRESENTATION_SLIDES;
