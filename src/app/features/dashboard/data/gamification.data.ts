import { GamificationLevel, SoundOfTheDay, PhraseRoulette } from '../models/gamification.model';

export const XP_PER_SESSION = 50;
export const XP_PER_FLASHCARD = 5;
export const XP_PER_LEVEL_UP = 200;
export const XP_STREAK_BONUS = 20;

export const GAMIFICATION_LEVELS: GamificationLevel[] = [
  { name: 'Beginner', minXP: 0 },
  { name: 'Listener', minXP: 200 },
  { name: 'Explorer', minXP: 500 },
  { name: 'Practitioner', minXP: 1000 },
  { name: 'Achiever', minXP: 2000 },
  { name: 'Advanced', minXP: 3500 },
  { name: 'Expert', minXP: 5000 },
  { name: 'Master', minXP: 7000 },
];

export const SOUNDS_OF_THE_DAY: SoundOfTheDay[] = [
  { sound: '/ə/', name: 'Schwa', words: ['about', 'banana', 'camera'], tip: 'El sonido mas comun — aparece en CADA frase' },
  { sound: '/ɪ/', name: 'Short I', words: ['ship', 'bit', 'fish'], tip: 'No es la "i" espanola — es mas relajada' },
  { sound: '/iː/', name: 'Long I', words: ['sheep', 'beat', 'see'], tip: 'Alarga el sonido el doble que en espanol' },
  { sound: '/æ/', name: 'Cat vowel', words: ['cat', 'hat', 'bad'], tip: 'Sonrisa estirada, entre "a" y "e"' },
  { sound: '/ʌ/', name: 'Cup vowel', words: ['cup', 'but', 'love'], tip: 'Como un gruñido breve — "ah" rapido' },
  { sound: '/ɒ/', name: 'Hot vowel', words: ['hot', 'dog', 'stop'], tip: 'Boca redonda y abierta' },
  { sound: '/ʊ/', name: 'Short U', words: ['put', 'book', 'good'], tip: '"U" relajada, sin redondear mucho' },
  { sound: '/uː/', name: 'Long U', words: ['food', 'blue', 'moon'], tip: 'Labios muy redondeados y alargados' },
  { sound: '/v/', name: 'V sound', words: ['very', 'love', 'give'], tip: 'Dientes superiores en labio inferior — NO es /b/' },
  { sound: '/θ/', name: 'TH sorda', words: ['think', 'three', 'bath'], tip: 'Lengua entre los dientes + aire' },
  { sound: '/ð/', name: 'TH sonora', words: ['this', 'the', 'mother'], tip: 'Igual que /θ/ pero vibra' },
  { sound: '/ʃ/', name: 'SH sound', words: ['she', 'fish', 'nation'], tip: 'Shhh — pide silencio' },
  { sound: '/ʒ/', name: 'Vision sound', words: ['vision', 'measure', 'pleasure'], tip: 'Como /ʃ/ pero con vibracion' },
  { sound: '/r/', name: 'English R', words: ['red', 'car', 'world'], tip: 'NO toques el paladar — curva la lengua' },
  { sound: '/w/', name: 'W sound', words: ['water', 'with', 'want'], tip: 'Labios de beso, luego abre — NO es "gu"' },
  { sound: '/h/', name: 'H sound', words: ['have', 'hello', 'behind'], tip: 'Solo un suspiro — NO es la "j" espanola' },
  { sound: '/eɪ/', name: 'Day diphthong', words: ['day', 'make', 'play'], tip: 'Empieza en "e", desliza a "i"' },
  { sound: '/aɪ/', name: 'My diphthong', words: ['my', 'time', 'fly'], tip: 'Igual que "ai" en "aire"' },
  { sound: '/ɔɪ/', name: 'Boy diphthong', words: ['boy', 'toy', 'enjoy'], tip: 'Igual que "oi" en "hoy"' },
  { sound: '/aʊ/', name: 'How diphthong', words: ['how', 'now', 'about'], tip: 'Igual que "au" en "causa"' },
];

export const PHRASE_ROULETTE_DATA: PhraseRoulette[] = [
  { en: "It's raining cats and dogs", es: 'Llueve a cantaros', hint: 'Expresion para lluvia intensa' },
  { en: 'Break a leg!', es: 'Buena suerte!', hint: 'Se dice antes de una actuacion' },
  { en: 'Piece of cake', es: 'Pan comido', hint: 'Algo muy facil' },
  { en: 'Hit the nail on the head', es: 'Dar en el clavo', hint: 'Acertar exactamente' },
  { en: 'Once in a blue moon', es: 'De higos a brevas', hint: 'Algo que pasa muy raramente' },
  { en: 'The ball is in your court', es: 'La pelota esta en tu tejado', hint: 'Es tu turno de decidir' },
  { en: 'Speak of the devil', es: 'Hablando del rey de Roma', hint: 'Cuando aparece alguien de quien hablabas' },
  { en: 'Better late than never', es: 'Mas vale tarde que nunca', hint: 'Llegar tarde es mejor que no llegar' },
  { en: 'Bite the bullet', es: 'Apretar los dientes / Tragar el sapo', hint: 'Hacer algo dificil con valentia' },
  { en: 'Let the cat out of the bag', es: 'Descubrir el pastel', hint: 'Revelar un secreto sin querer' },
  { en: 'Cost an arm and a leg', es: 'Costar un ojo de la cara', hint: 'Algo muy caro' },
  { en: 'Kill two birds with one stone', es: 'Matar dos pajaros de un tiro', hint: 'Lograr dos cosas a la vez' },
  { en: 'Under the weather', es: 'Estar pachucho', hint: 'Sentirse enfermo' },
  { en: 'Actions speak louder than words', es: 'Los hechos hablan mas que las palabras', hint: 'Lo que haces importa mas que lo que dices' },
  { en: 'Every cloud has a silver lining', es: 'No hay mal que por bien no venga', hint: 'Algo positivo en toda situacion mala' },
  { en: 'When pigs fly', es: 'Cuando las ranas crien pelo', hint: 'Algo que nunca va a pasar' },
  { en: 'The early bird catches the worm', es: 'A quien madruga Dios le ayuda', hint: 'Levantarse temprano tiene ventajas' },
  { en: "Don't count your chickens before they hatch", es: 'No vendas la piel del oso antes de cazarlo', hint: 'No celebres antes de tiempo' },
];

export const MOTIVATIONS: string[] = [
  'Un bebe escucha 2 años antes de hablar. Tu ya llevas ventaja.',
  'Cada sesion es un paso mas hacia la fluidez.',
  'La consistencia vence al talento. Sigue adelante.',
  'No necesitas ser perfecto, solo constante.',
  'Tu cerebro esta formando nuevas conexiones ahora mismo.',
  'Los errores son prueba de que lo estas intentando.',
  'Hoy es un gran dia para aprender algo nuevo.',
  'La practica no hace la perfeccion, hace el progreso.',
  'Cada palabra nueva es una puerta que se abre.',
  'El ingles se aprende hablando, no solo estudiando.',
];
