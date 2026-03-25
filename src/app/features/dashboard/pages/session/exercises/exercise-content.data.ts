import { Level } from '../../../../../shared/models/learning.model';

/* ─── Listening: dictation sentences by level ─── */
export interface DictationItem {
  text: string;
  speed: number;
}

export const LISTENING_SENTENCES: Record<Level, DictationItem[]> = {
  a1: [
    { text: 'I would like a glass of water, please.', speed: 0.8 },
    { text: 'She goes to school every morning.', speed: 0.8 },
    { text: 'Can you help me find the station?', speed: 0.8 },
    { text: 'My name is Anna and I am from Spain.', speed: 0.8 },
    { text: 'The cat is sleeping on the sofa.', speed: 0.8 },
    { text: 'I have two brothers and one sister.', speed: 0.8 },
    { text: 'What time does the shop close?', speed: 0.85 },
    { text: 'We need to buy some milk and bread.', speed: 0.85 },
  ],
  a2: [
    { text: 'I have been waiting here for twenty minutes.', speed: 0.85 },
    { text: 'She should have called me before coming.', speed: 0.85 },
    { text: 'What time does the train leave tomorrow morning?', speed: 0.9 },
    { text: 'Could you tell me where the nearest bank is?', speed: 0.9 },
    { text: 'I used to play football when I was younger.', speed: 0.9 },
    { text: 'They are going to visit their grandparents next weekend.', speed: 0.9 },
    { text: 'Have you ever been to London before?', speed: 0.9 },
    { text: 'I need to finish this report by Friday.', speed: 0.9 },
  ],
  b1: [
    { text: "I'm gonna go to the store. Do you wanna come?", speed: 1.0 },
    { text: 'She should have told him about it earlier.', speed: 1.0 },
    { text: 'If I had more time, I would learn to play the piano.', speed: 1.0 },
    { text: 'The meeting has been postponed until next Thursday.', speed: 1.0 },
    { text: 'He asked me whether I had finished the project yet.', speed: 1.0 },
    { text: 'Despite the rain, they decided to go for a walk.', speed: 1.0 },
    { text: 'I wish I had studied harder when I was at university.', speed: 1.0 },
    { text: 'By the time we arrived, the concert had already started.', speed: 1.0 },
  ],
  b2: [
    { text: "I wouldn't have bothered if I'd known it was gonna be cancelled.", speed: 1.1 },
    { text: "The thing is, he's not exactly what you'd call reliable, is he?", speed: 1.1 },
    {
      text: 'Had I been informed earlier, I could have made alternative arrangements.',
      speed: 1.1,
    },
    { text: "It's not so much that I disagree, but rather that I see it differently.", speed: 1.1 },
    { text: 'The proposal was met with considerable scepticism by the board members.', speed: 1.1 },
    { text: 'What struck me most was the sheer complexity of the whole situation.', speed: 1.1 },
  ],
  c1: [
    { text: "Had I known about the redundancies, I wouldn't have taken the position.", speed: 1.2 },
    {
      text: "She reckons they'll have sorted it out by the time we get there, but I wouldn't count on it.",
      speed: 1.2,
    },
    {
      text: 'Not only did they fail to deliver on time, but they also had the audacity to charge extra.',
      speed: 1.2,
    },
    {
      text: 'The underlying assumption, which has yet to be empirically validated, is that correlation implies causation.',
      speed: 1.15,
    },
    {
      text: 'Notwithstanding the obvious limitations of the study, the findings are broadly consistent with previous research.',
      speed: 1.15,
    },
  ],
  c2: [
    {
      text: "I mean, it's not as though anyone could've foreseen the extent to which things would unravel.",
      speed: 1.25,
    },
    {
      text: 'The juxtaposition of her pragmatism and his idealism made for a rather volatile working relationship.',
      speed: 1.25,
    },
    {
      text: "In retrospect, the committee's decision to acquiesce was predicated on a fundamentally flawed premise.",
      speed: 1.2,
    },
    {
      text: "What's particularly galling is the sheer brazenness with which they've attempted to obfuscate the findings.",
      speed: 1.25,
    },
    {
      text: 'The epistemological implications of this paradigm shift cannot be overstated, notwithstanding the methodological caveats.',
      speed: 1.2,
    },
    {
      text: "She's got this uncanny knack for cutting through the waffle and getting straight to the crux of the matter.",
      speed: 1.25,
    },
    {
      text: 'The conflation of correlation and causation in public discourse has had pernicious consequences for evidence-based policy.',
      speed: 1.2,
    },
    {
      text: 'One might be forgiven for thinking that the entire enterprise was predicated on little more than wishful thinking.',
      speed: 1.25,
    },
  ],
};

/* ─── Pronunciation: explanations + examples by unit type ─── */
export interface PronunciationContent {
  explanation: string;
  tip: string;
  examples: { word: string; ipa: string; note: string }[];
  quiz: { prompt: string; options: string[]; correct: number }[];
}

export const PRONUNCIATION_CONTENT: Record<string, PronunciationContent> = {
  'th-sounds': {
    explanation:
      'English has two "th" sounds: /θ/ (voiceless, like in "think") and /ð/ (voiced, like in "this"). Spanish speakers often replace them with /t/, /d/, or /s/.',
    tip: 'Put your tongue between your teeth and blow air. For /ð/, add your voice (vibrate your vocal cords).',
    examples: [
      { word: 'think', ipa: '/θɪŋk/', note: 'Voiceless — tongue between teeth, just air' },
      { word: 'this', ipa: '/ðɪs/', note: 'Voiced — tongue between teeth + vibration' },
      { word: 'three', ipa: '/θriː/', note: 'Common mistake: saying "tree"' },
      { word: 'the', ipa: '/ðə/', note: 'Most common word in English — practice it!' },
      { word: 'birthday', ipa: '/ˈbɜːrθdeɪ/', note: '/θ/ in the middle of a word' },
      { word: 'weather', ipa: '/ˈweðər/', note: '/ð/ in the middle — "weDDer" is wrong' },
    ],
    quiz: [
      { prompt: 'Which word has /θ/ (voiceless)?', options: ['this', 'think', 'the'], correct: 1 },
      {
        prompt: 'Which is correct for "three"?',
        options: ['/triː/', '/θriː/', '/ðriː/'],
        correct: 1,
      },
      {
        prompt: '"Weather" has which th sound?',
        options: ['/θ/ voiceless', '/ð/ voiced', 'No th sound'],
        correct: 1,
      },
    ],
  },
  'v-b': {
    explanation:
      'Spanish does not distinguish /v/ and /b/ — both are pronounced as /b/. In English, /v/ requires your top teeth to touch your lower lip.',
    tip: 'For /v/, bite your lower lip gently and vibrate. For /b/, close both lips and release.',
    examples: [
      { word: 'very', ipa: '/ˈveri/', note: 'Top teeth on lower lip — NOT "berry"' },
      { word: 'best', ipa: '/best/', note: 'Both lips closed' },
      { word: 'van', ipa: '/væn/', note: 'Teeth on lip — NOT "ban"' },
      { word: 'ban', ipa: '/bæn/', note: 'Both lips — different meaning!' },
      { word: 'vest', ipa: '/vest/', note: '/v/ — NOT "best"' },
      { word: 'vote', ipa: '/voʊt/', note: '/v/ — NOT "boat"' },
    ],
    quiz: [
      {
        prompt: 'How do you pronounce "very"?',
        options: ['With both lips (like B)', 'Teeth on lower lip (V)', 'Same as Spanish'],
        correct: 1,
      },
      {
        prompt: '"Vest" and "best" sound the same?',
        options: ['Yes', 'No — /v/ vs /b/', 'Depends on accent'],
        correct: 1,
      },
    ],
  },
  'vowel-length': {
    explanation:
      'English vowels can be short or long, and changing the length changes the meaning. Spanish vowels are always the same length.',
    tip: 'Long vowels take about twice as long to say. Hold the sound!',
    examples: [
      { word: 'ship', ipa: '/ʃɪp/', note: 'Short /ɪ/ — quick' },
      { word: 'sheep', ipa: '/ʃiːp/', note: 'Long /iː/ — hold it' },
      { word: 'hit', ipa: '/hɪt/', note: 'Short' },
      { word: 'heat', ipa: '/hiːt/', note: 'Long — different word!' },
      { word: 'full', ipa: '/fʊl/', note: 'Short /ʊ/' },
      { word: 'fool', ipa: '/fuːl/', note: 'Long /uː/' },
    ],
    quiz: [
      {
        prompt: '"Ship" and "sheep" differ in...',
        options: ['Consonant', 'Vowel length', 'Stress'],
        correct: 1,
      },
      { prompt: 'Which has a long vowel?', options: ['hit', 'heat', 'bit'], correct: 1 },
    ],
  },
  default: {
    explanation:
      'In this unit we will practice specific sounds and patterns. Listen carefully to the examples and try to reproduce them.',
    tip: 'Record yourself and compare with the model. Small differences matter!',
    examples: [
      { word: 'hello', ipa: '/həˈloʊ/', note: 'Notice the schwa in the first syllable' },
      { word: 'about', ipa: '/əˈbaʊt/', note: 'Schwa /ə/ is the most common English sound' },
      { word: 'computer', ipa: '/kəmˈpjuːtər/', note: 'Two schwas in one word!' },
      { word: 'banana', ipa: '/bəˈnænə/', note: 'Three syllables, two are schwas' },
    ],
    quiz: [
      {
        prompt: 'What is the most common vowel sound in English?',
        options: ['/a/', '/ə/ (schwa)', '/i/'],
        correct: 1,
      },
      { prompt: 'How many schwas in "banana"?', options: ['1', '2', '3'], correct: 1 },
    ],
  },
};

/* ─── Vocabulary: words by level ─── */
export interface VocabItem {
  en: string;
  es: string;
  ipa: string;
  example: string;
}

export const VOCABULARY_WORDS: Record<Level, VocabItem[]> = {
  a1: [
    { en: 'house', es: 'casa', ipa: '/haʊs/', example: 'I live in a small house.' },
    { en: 'water', es: 'agua', ipa: '/ˈwɔːtər/', example: 'Can I have some water?' },
    { en: 'friend', es: 'amigo', ipa: '/frend/', example: 'She is my best friend.' },
    { en: 'work', es: 'trabajar', ipa: '/wɜːrk/', example: 'I work in an office.' },
    { en: 'morning', es: 'mañana', ipa: '/ˈmɔːrnɪŋ/', example: 'Good morning! How are you?' },
    { en: 'food', es: 'comida', ipa: '/fuːd/', example: 'The food here is delicious.' },
    { en: 'happy', es: 'feliz', ipa: '/ˈhæpi/', example: 'I am very happy today.' },
    { en: 'money', es: 'dinero', ipa: '/ˈmʌni/', example: 'I need more money.' },
    { en: 'family', es: 'familia', ipa: '/ˈfæməli/', example: 'My family is very big.' },
    { en: 'school', es: 'escuela', ipa: '/skuːl/', example: 'The children go to school.' },
  ],
  a2: [
    {
      en: 'appointment',
      es: 'cita',
      ipa: '/əˈpɔɪntmənt/',
      example: 'I have a doctor appointment.',
    },
    {
      en: 'comfortable',
      es: 'cómodo',
      ipa: '/ˈkʌmftəbəl/',
      example: 'This chair is very comfortable.',
    },
    { en: 'available', es: 'disponible', ipa: '/əˈveɪləbəl/', example: 'Is this seat available?' },
    {
      en: 'dangerous',
      es: 'peligroso',
      ipa: '/ˈdeɪndʒərəs/',
      example: 'Swimming here is dangerous.',
    },
    {
      en: 'experience',
      es: 'experiencia',
      ipa: '/ɪkˈspɪriəns/',
      example: 'It was an amazing experience.',
    },
    {
      en: 'popular',
      es: 'popular',
      ipa: '/ˈpɒpjʊlər/',
      example: 'This restaurant is very popular.',
    },
    { en: 'improve', es: 'mejorar', ipa: '/ɪmˈpruːv/', example: 'I want to improve my English.' },
    {
      en: 'environment',
      es: 'medio ambiente',
      ipa: '/ɪnˈvaɪrənmənt/',
      example: 'We must protect the environment.',
    },
    {
      en: 'opportunity',
      es: 'oportunidad',
      ipa: '/ˌɒpərˈtjuːnɪti/',
      example: 'This is a great opportunity.',
    },
    { en: 'necessary', es: 'necesario', ipa: '/ˈnesəsəri/', example: 'Is it really necessary?' },
  ],
  b1: [
    { en: 'achieve', es: 'lograr', ipa: '/əˈtʃiːv/', example: 'She achieved her goal.' },
    { en: 'reliable', es: 'fiable', ipa: '/rɪˈlaɪəbəl/', example: 'He is a very reliable person.' },
    {
      en: 'meanwhile',
      es: 'mientras tanto',
      ipa: '/ˈmiːnwaɪl/',
      example: 'Meanwhile, she was studying.',
    },
    {
      en: 'struggle',
      es: 'luchar',
      ipa: '/ˈstrʌɡəl/',
      example: 'They struggle with pronunciation.',
    },
    {
      en: 'apparently',
      es: 'aparentemente',
      ipa: '/əˈpærəntli/',
      example: 'Apparently, it will rain today.',
    },
    {
      en: 'challenge',
      es: 'desafío',
      ipa: '/ˈtʃælɪndʒ/',
      example: 'Learning English is a challenge.',
    },
    {
      en: 'determine',
      es: 'determinar',
      ipa: '/dɪˈtɜːrmɪn/',
      example: 'We need to determine the cause.',
    },
    { en: 'benefit', es: 'beneficio', ipa: '/ˈbenɪfɪt/', example: 'Exercise has many benefits.' },
    {
      en: 'influence',
      es: 'influencia',
      ipa: '/ˈɪnfluəns/',
      example: 'Music has a big influence on me.',
    },
    {
      en: 'despite',
      es: 'a pesar de',
      ipa: '/dɪˈspaɪt/',
      example: 'Despite the cold, we went out.',
    },
  ],
  b2: [
    {
      en: 'thoroughly',
      es: 'a fondo',
      ipa: '/ˈθʌrəli/',
      example: 'Read the instructions thoroughly.',
    },
    {
      en: 'overwhelming',
      es: 'abrumador',
      ipa: '/ˌoʊvərˈwelmɪŋ/',
      example: 'The response was overwhelming.',
    },
    { en: 'subtle', es: 'sutil', ipa: '/ˈsʌtəl/', example: 'There is a subtle difference.' },
    {
      en: 'sophisticated',
      es: 'sofisticado',
      ipa: '/səˈfɪstɪkeɪtɪd/',
      example: 'She has a sophisticated taste.',
    },
    {
      en: 'presumably',
      es: 'presumiblemente',
      ipa: '/prɪˈzjuːməbli/',
      example: 'Presumably, he already knows.',
    },
    { en: 'reluctant', es: 'reacio', ipa: '/rɪˈlʌktənt/', example: 'He was reluctant to speak.' },
    { en: 'inevitable', es: 'inevitable', ipa: '/ɪnˈevɪtəbəl/', example: 'Change is inevitable.' },
    {
      en: 'acknowledge',
      es: 'reconocer',
      ipa: '/əkˈnɒlɪdʒ/',
      example: 'You must acknowledge the mistake.',
    },
  ],
  c1: [
    {
      en: 'ambiguous',
      es: 'ambiguo',
      ipa: '/æmˈbɪɡjuəs/',
      example: 'The instructions were ambiguous.',
    },
    {
      en: 'undermine',
      es: 'socavar',
      ipa: '/ˌʌndərˈmaɪn/',
      example: 'This could undermine trust.',
    },
    { en: 'ephemeral', es: 'efímero', ipa: '/ɪˈfemərəl/', example: 'Fame can be ephemeral.' },
    {
      en: 'scrutinize',
      es: 'escudriñar',
      ipa: '/ˈskruːtɪnaɪz/',
      example: 'They will scrutinize every detail.',
    },
    {
      en: 'pragmatic',
      es: 'pragmático',
      ipa: '/præɡˈmætɪk/',
      example: 'We need a pragmatic approach.',
    },
    {
      en: 'eloquent',
      es: 'elocuente',
      ipa: '/ˈeləkwənt/',
      example: 'She gave an eloquent speech.',
    },
    {
      en: 'unprecedented',
      es: 'sin precedentes',
      ipa: '/ʌnˈpresɪdentɪd/',
      example: 'This is an unprecedented crisis.',
    },
    {
      en: 'meticulous',
      es: 'meticuloso',
      ipa: '/məˈtɪkjʊləs/',
      example: 'He is meticulous about details.',
    },
  ],
  c2: [
    {
      en: 'obsequious',
      es: 'servil',
      ipa: '/əbˈsiːkwiəs/',
      example: 'His obsequious manner was off-putting.',
    },
    {
      en: 'recalcitrant',
      es: 'recalcitrante',
      ipa: '/rɪˈkælsɪtrənt/',
      example: 'The recalcitrant committee refused to budge.',
    },
    {
      en: 'sanguine',
      es: 'optimista',
      ipa: '/ˈsæŋɡwɪn/',
      example: 'She remained sanguine about the outcome.',
    },
    {
      en: 'pernicious',
      es: 'pernicioso',
      ipa: '/pərˈnɪʃəs/',
      example: 'The pernicious effects of misinformation.',
    },
    {
      en: 'redolent',
      es: 'evocador',
      ipa: '/ˈredələnt/',
      example: 'The garden was redolent of jasmine.',
    },
    {
      en: 'mendacious',
      es: 'mendaz',
      ipa: '/menˈdeɪʃəs/',
      example: 'A mendacious account of the events.',
    },
    {
      en: 'quotidian',
      es: 'cotidiano',
      ipa: '/kwoʊˈtɪdiən/',
      example: 'The quotidian rhythms of daily life.',
    },
    {
      en: 'prescient',
      es: 'clarividente',
      ipa: '/ˈpreʃənt/',
      example: 'Her prescient analysis proved correct.',
    },
    {
      en: 'insouciant',
      es: 'despreocupado',
      ipa: '/ɪnˈsuːsiənt/',
      example: 'His insouciant attitude belied his concern.',
    },
    {
      en: 'perspicacious',
      es: 'perspicaz',
      ipa: '/ˌpɜːrspɪˈkeɪʃəs/',
      example: 'A perspicacious observer would have noticed.',
    },
  ],
};

/* ─── Grammar: explanation + exercises by level ─── */
export interface GrammarExercise {
  sentence: string;
  options: string[];
  correct: number;
}

export interface GrammarContent {
  explanation: string;
  examples: string[];
  exercises: GrammarExercise[];
}

export const GRAMMAR_CONTENT: Record<Level, GrammarContent[]> = {
  a1: [
    {
      explanation:
        'Present Simple: We use it for habits, routines, and general truths. Add -s/-es for he/she/it.',
      examples: ['I work every day.', 'She goes to school.', 'They play football on Sundays.'],
      exercises: [
        { sentence: 'She ___ to work by bus.', options: ['go', 'goes', 'going'], correct: 1 },
        {
          sentence: 'I ___ coffee every morning.',
          options: ['drinks', 'drink', 'drinking'],
          correct: 1,
        },
        { sentence: 'They ___ live in Madrid.', options: ["don't", "doesn't", 'not'], correct: 0 },
        {
          sentence: 'He ___ English and Spanish.',
          options: ['speak', 'speaks', 'speaking'],
          correct: 1,
        },
      ],
    },
    {
      explanation:
        'Past Simple: For completed actions in the past. Regular verbs add -ed. Many common verbs are irregular.',
      examples: [
        'I watched a movie yesterday.',
        'She went to London last week.',
        'They played tennis.',
      ],
      exercises: [
        {
          sentence: 'I ___ a great book last week.',
          options: ['read', 'readed', 'reading'],
          correct: 0,
        },
        {
          sentence: 'She ___ to the party last night.',
          options: ['go', 'went', 'gone'],
          correct: 1,
        },
        {
          sentence: 'We ___ TV all evening.',
          options: ['watched', 'watch', 'watching'],
          correct: 0,
        },
        {
          sentence: 'They ___ arrive on time.',
          options: ["don't", "didn't", "hasn't"],
          correct: 1,
        },
      ],
    },
  ],
  a2: [
    {
      explanation:
        'Present Perfect: for past actions connected to NOW. Use have/has + past participle. Key words: already, yet, just, ever, never.',
      examples: [
        'I have already finished.',
        'She has never been to Italy.',
        'Have you ever tried sushi?',
      ],
      exercises: [
        { sentence: 'I have ___ this movie before.', options: ['see', 'saw', 'seen'], correct: 2 },
        {
          sentence: 'She has ___ finished her homework.',
          options: ['already', 'yet', 'since'],
          correct: 0,
        },
        { sentence: '___ you ever been to London?', options: ['Did', 'Have', 'Are'], correct: 1 },
        { sentence: "They haven't arrived ___.", options: ['already', 'just', 'yet'], correct: 2 },
      ],
    },
  ],
  b1: [
    {
      explanation:
        'Second Conditional: for hypothetical/unreal present situations. Structure: If + Past Simple, would + infinitive.',
      examples: [
        'If I were rich, I would travel the world.',
        'If she had time, she would learn Japanese.',
      ],
      exercises: [
        {
          sentence: 'If I ___ more money, I would buy a house.',
          options: ['have', 'had', 'would have'],
          correct: 1,
        },
        {
          sentence: 'She ___ travel if she had a passport.',
          options: ['will', 'would', 'can'],
          correct: 1,
        },
        {
          sentence: 'If I ___ you, I would apologize.',
          options: ['am', 'was', 'were'],
          correct: 2,
        },
        {
          sentence: 'What ___ you do if you won the lottery?',
          options: ['will', 'would', 'did'],
          correct: 1,
        },
      ],
    },
  ],
  b2: [
    {
      explanation:
        'Mixed Conditionals: combine different time references. Past condition → present result, or present condition → past result.',
      examples: [
        'If I had studied medicine, I would be a doctor now.',
        'If she were braver, she would have applied.',
      ],
      exercises: [
        {
          sentence: 'If I ___ harder at school, I would have a better job now.',
          options: ['studied', 'had studied', 'would study'],
          correct: 1,
        },
        {
          sentence: 'If she ___ more confident, she would have spoken up.',
          options: ['was', 'were', 'had been'],
          correct: 1,
        },
        {
          sentence: 'I ___ living in Paris now if I had accepted that job.',
          options: ['would be', 'will be', 'am'],
          correct: 0,
        },
      ],
    },
  ],
  c1: [
    {
      explanation:
        'Inversions for emphasis: move auxiliary before subject. Used in formal writing and speech.',
      examples: [
        'No sooner had I arrived than it started raining.',
        'Not only is she smart, but she is also kind.',
      ],
      exercises: [
        {
          sentence: '___ had I sat down than the phone rang.',
          options: ['No sooner', 'Hardly', 'Not until'],
          correct: 0,
        },
        {
          sentence: 'Not only ___ she speak French, but also German.',
          options: ['does', 'did', 'is'],
          correct: 0,
        },
        {
          sentence: 'Rarely ___ I seen such a beautiful sunset.',
          options: ['do', 'have', 'am'],
          correct: 1,
        },
      ],
    },
  ],
  c2: [
    {
      explanation:
        'Register & Tone: The same idea expressed differently depending on context — formal, neutral, informal, academic.',
      examples: [
        'Formal: "I would be grateful if you could..."',
        'Academic: "It is posited that..."',
        'Informal: "Could you...?"',
      ],
      exercises: [
        {
          sentence: 'Which is most appropriate for an academic paper?',
          options: ['People think that...', 'It is widely held that...', 'Everyone knows...'],
          correct: 1,
        },
        {
          sentence: '"Terminate the contract" is equivalent informally to...',
          options: ['End the deal', 'Cease the agreement', 'Nullify the contract'],
          correct: 0,
        },
        {
          sentence: 'Academic register for "things got worse":',
          options: ['The situation deteriorated', 'Things went downhill', 'It all fell apart'],
          correct: 0,
        },
      ],
    },
    {
      explanation:
        'Hedging & Mitigation: Academic and diplomatic language uses hedging to soften claims.',
      examples: [
        'The data would seem to suggest...',
        'It could be argued that...',
        'There is a tendency for...',
      ],
      exercises: [
        {
          sentence: 'Which is the most hedged statement?',
          options: ['This proves...', 'This suggests...', 'This shows...'],
          correct: 1,
        },
        {
          sentence: 'Academic hedging for "X causes Y":',
          options: ['X causes Y', 'X appears to contribute to Y', 'X makes Y happen'],
          correct: 1,
        },
        {
          sentence: '"It might be worth considering..." is an example of:',
          options: ['Assertion', 'Hedging', 'Imperative'],
          correct: 1,
        },
      ],
    },
  ],
};

/* ─── Phrases: by level ─── */
export interface PhraseItem {
  en: string;
  es: string;
  context: string;
}

export const PHRASE_CONTENT: Record<Level, PhraseItem[]> = {
  a1: [
    {
      en: 'Nice to meet you!',
      es: 'Encantado de conocerte',
      context: 'Greeting someone for the first time',
    },
    {
      en: "I'd like a coffee, please.",
      es: 'Me gustaría un café, por favor',
      context: 'Ordering at a café',
    },
    { en: 'How much does this cost?', es: '¿Cuánto cuesta esto?', context: 'Shopping' },
    {
      en: 'Could you repeat that, please?',
      es: '¿Podría repetir eso, por favor?',
      context: "When you don't understand",
    },
    {
      en: 'Where is the nearest station?',
      es: '¿Dónde está la estación más cercana?',
      context: 'Asking for directions',
    },
    { en: "I don't understand.", es: 'No entiendo.', context: 'When something is unclear' },
    {
      en: 'Can I have the bill, please?',
      es: '¿Me trae la cuenta, por favor?',
      context: 'At a restaurant',
    },
    { en: "I'm sorry, I'm late.", es: 'Lo siento, llego tarde.', context: 'Apologizing' },
  ],
  a2: [
    { en: 'What do you do for a living?', es: '¿A qué te dedicas?', context: 'Small talk' },
    {
      en: "I'm looking forward to it.",
      es: 'Tengo muchas ganas.',
      context: 'Expressing excitement',
    },
    { en: 'It depends on the weather.', es: 'Depende del tiempo.', context: 'Being uncertain' },
    {
      en: 'Could you give me a hand?',
      es: '¿Podrías echarme una mano?',
      context: 'Asking for help',
    },
    {
      en: "I'm afraid I can't make it.",
      es: 'Me temo que no puedo ir.',
      context: 'Declining an invitation',
    },
    {
      en: 'That sounds like a great idea!',
      es: '¡Eso suena genial!',
      context: 'Agreeing with a suggestion',
    },
    {
      en: 'Let me know if you need anything.',
      es: 'Avísame si necesitas algo.',
      context: 'Offering help',
    },
    {
      en: "Sorry, I didn't catch that.",
      es: 'Perdona, no lo he pillado.',
      context: 'Asking to repeat',
    },
  ],
  b1: [
    {
      en: 'I see your point, but...',
      es: 'Entiendo tu punto, pero...',
      context: 'Disagreeing politely',
    },
    {
      en: "That's easier said than done.",
      es: 'Del dicho al hecho hay un trecho.',
      context: 'Common idiom',
    },
    { en: "I'll get back to you on that.", es: 'Te respondo sobre eso.', context: 'Work meetings' },
    { en: "It's not a big deal.", es: 'No es para tanto.', context: 'Minimizing a problem' },
    {
      en: 'To be honest, I have mixed feelings.',
      es: 'Siendo sincero, tengo sentimientos encontrados.',
      context: 'Expressing opinion',
    },
    { en: "Let's call it a day.", es: 'Dejémoslo por hoy.', context: 'Ending work' },
    { en: "I didn't mean to offend you.", es: 'No pretendía ofenderte.', context: 'Apologizing' },
    {
      en: 'Could we move on to the next point?',
      es: '¿Podemos pasar al siguiente punto?',
      context: 'Meetings',
    },
  ],
  b2: [
    {
      en: "I couldn't agree more.",
      es: 'No podría estar más de acuerdo.',
      context: 'Strong agreement',
    },
    { en: "That's beside the point.", es: 'Eso no viene al caso.', context: 'Staying on topic' },
    {
      en: "I'd rather not, if you don't mind.",
      es: 'Preferiría que no, si no te importa.',
      context: 'Polite refusal',
    },
    {
      en: 'It goes without saying that...',
      es: 'Ni que decir tiene que...',
      context: 'Stating the obvious',
    },
    {
      en: "For what it's worth, I think...",
      es: 'Por lo que pueda valer, creo que...',
      context: 'Humble opinion',
    },
    {
      en: "Let's not beat around the bush.",
      es: 'No nos andemos con rodeos.',
      context: 'Being direct',
    },
  ],
  c1: [
    {
      en: 'With all due respect, I beg to differ.',
      es: 'Con todo el respeto, discrepo.',
      context: 'Formal disagreement',
    },
    {
      en: "I'd be inclined to argue that...",
      es: 'Me inclinaría a argumentar que...',
      context: 'Academic register',
    },
    {
      en: 'Be that as it may, the fact remains.',
      es: 'Sea como sea, el hecho es que...',
      context: 'Conceding a point',
    },
    { en: 'The bottom line is...', es: 'En resumidas cuentas...', context: 'Summarizing' },
    {
      en: "It's a double-edged sword.",
      es: 'Es un arma de doble filo.',
      context: 'Nuanced opinion',
    },
    {
      en: 'I take your point, however...',
      es: 'Entiendo lo que dices, sin embargo...',
      context: 'Partial agreement',
    },
  ],
  c2: [
    {
      en: "I'm not at liberty to disclose that.",
      es: 'No estoy autorizado a revelar eso.',
      context: 'Diplomatic refusal',
    },
    {
      en: 'One could be forgiven for thinking...',
      es: 'Seria comprensible pensar que...',
      context: 'Subtle criticism',
    },
    {
      en: 'It would be remiss of me not to mention...',
      es: 'Seria negligente por mi parte no mencionar...',
      context: 'Obligation to mention',
    },
    {
      en: "Let's not mince words.",
      es: 'No nos andemos con paños calientes.',
      context: 'Being very direct',
    },
    {
      en: 'The writing is on the wall.',
      es: 'Las señales son claras.',
      context: 'Predicting an outcome',
    },
    {
      en: 'I stand to be corrected, but...',
      es: 'Que me corrijan si me equivoco, pero...',
      context: 'Humble assertion',
    },
    { en: "It's a moot point.", es: 'Es un punto discutible.', context: 'Dismissing an argument' },
    { en: 'Lest we forget...', es: 'Para que no olvidemos...', context: 'Solemn reminder' },
  ],
};

/* ─── Helpers ─── */
export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffleArray(arr).slice(0, Math.min(count, arr.length));
}

export function getPronunciationKey(unitTitle: string): string {
  const lower = unitTitle.toLowerCase();
  if (lower.includes('θ') || lower.includes('ð') || lower.includes('th sound')) return 'th-sounds';
  if (lower.includes('/v/') || lower.includes('/b/')) return 'v-b';
  if (
    lower.includes('vocal') ||
    lower.includes('vowel') ||
    lower.includes('ship') ||
    lower.includes('sheep')
  )
    return 'vowel-length';
  return 'default';
}

/* ─── Level metadata for UI indicators ─── */
export const LEVEL_METADATA: Record<
  Level,
  { color: string; vocabBand: string; grammarFocus: string }
> = {
  a1: {
    color: 'var(--level-a1)',
    vocabBand: 'Top 300',
    grammarFocus: 'Present Simple, Articles, Possessives',
  },
  a2: {
    color: 'var(--level-a2)',
    vocabBand: 'Top 300-800',
    grammarFocus: 'Past Simple, Comparatives, Going to',
  },
  b1: {
    color: 'var(--level-b1)',
    vocabBand: 'Top 800-1500',
    grammarFocus: 'Conditionals, Relative Clauses, Modals',
  },
  b2: {
    color: 'var(--level-b2)',
    vocabBand: 'Top 1500-2500',
    grammarFocus: 'Passive, Mixed Conditionals, Reported Speech',
  },
  c1: {
    color: 'var(--level-c1)',
    vocabBand: 'Top 2500-3000+',
    grammarFocus: 'Inversions, Subjunctive, Nominalization',
  },
  c2: {
    color: 'var(--level-c2)',
    vocabBand: 'Top 3000+',
    grammarFocus: 'Register, Hedging, Literary Devices',
  },
};
