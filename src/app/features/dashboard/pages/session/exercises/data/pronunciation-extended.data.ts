/* ─── Extended Pronunciation Content: 4-phase pedagogical flow ─── */

export interface ExtendedPronunciationContent {
  id: string;
  title: string;
  ipa: string[];

  /** Phase 1: Explanation */
  explanation: {
    what: string;
    howToProduce: string;
    commonMistake: string;
    selfTest: string;
  };

  /** Phase 2: Demonstration (minimal pairs) */
  minimalPairs: MinimalPair[];

  /** Phase 3: Guided Practice */
  practice: PracticeItem[];

  /** Phase 4: Quiz */
  quiz: { prompt: string; options: string[]; correct: number; explanation?: string }[];
}

export interface MinimalPair {
  wordA: { word: string; ipa: string };
  wordB: { word: string; ipa: string };
  note: string;
}

export type PracticeItem = ClassifyItem | FillBlankItem;

export interface ClassifyItem {
  type: 'classify';
  word: string;
  options: string[];
  answer: number;
}

export interface FillBlankItem {
  type: 'fill_blank';
  sentence: string;
  options: string[];
  answer: number;
}

const EXTENDED_CONTENT: Record<string, ExtendedPronunciationContent> = {
  'th-sounds': {
    id: 'th-sounds',
    title: 'Los sonidos TH: /θ/ vs /ð/',
    ipa: ['/θ/', '/ð/'],
    explanation: {
      what: 'El ingles tiene dos sonidos "th": /θ/ (sordo, como en "think") y /ð/ (sonoro, como en "this"). En espanol no existen estos sonidos, por eso los hispanohablantes suelen sustituirlos por /t/, /d/ o /s/.',
      howToProduce:
        'Coloca la punta de la lengua entre los dientes superiores e inferiores. Para /θ/ (sordo), sopla aire sin vibrar las cuerdas vocales. Para /ð/ (sonoro), haz lo mismo pero anade vibracion en la garganta.',
      commonMistake:
        'Decir "tink" en vez de "think", o "dis" en vez de "this". En espanol no usamos la lengua entre los dientes, asi que el cerebro busca el sonido mas parecido: /t/ o /d/.',
      selfTest:
        'Pon la mano en la garganta: si vibra, estas haciendo /ð/ (voiced). Si no vibra, es /θ/ (voiceless). Prueba alternando "think" y "this".',
    },
    minimalPairs: [
      {
        wordA: { word: 'think', ipa: '/θɪŋk/' },
        wordB: { word: 'sink', ipa: '/sɪŋk/' },
        note: '/θ/ requiere lengua entre dientes; /s/ es solo con la punta detras de los dientes.',
      },
      {
        wordA: { word: 'three', ipa: '/θriː/' },
        wordB: { word: 'tree', ipa: '/triː/' },
        note: 'Si dices "tree" en vez de "three", parece que hablas de un arbol en vez del numero.',
      },
      {
        wordA: { word: 'this', ipa: '/ðɪs/' },
        wordB: { word: 'dis', ipa: '/dɪs/' },
        note: '/ð/ es suave con la lengua entre dientes; /d/ es un golpe con la lengua en el paladar.',
      },
      {
        wordA: { word: 'then', ipa: '/ðen/' },
        wordB: { word: 'den', ipa: '/den/' },
        note: '"Then" (entonces) vs "den" (guarida). Lengua entre dientes marca la diferencia.',
      },
      {
        wordA: { word: 'bath', ipa: '/bæθ/' },
        wordB: { word: 'bass', ipa: '/bæs/' },
        note: '/θ/ al final de palabra: la lengua sale ligeramente entre los dientes.',
      },
    ],
    practice: [
      { type: 'classify', word: 'think', options: ['/θ/ (sordo)', '/ð/ (sonoro)'], answer: 0 },
      { type: 'classify', word: 'the', options: ['/θ/ (sordo)', '/ð/ (sonoro)'], answer: 1 },
      { type: 'classify', word: 'three', options: ['/θ/ (sordo)', '/ð/ (sonoro)'], answer: 0 },
      { type: 'classify', word: 'this', options: ['/θ/ (sordo)', '/ð/ (sonoro)'], answer: 1 },
      { type: 'classify', word: 'birthday', options: ['/θ/ (sordo)', '/ð/ (sonoro)'], answer: 0 },
      { type: 'classify', word: 'weather', options: ['/θ/ (sordo)', '/ð/ (sonoro)'], answer: 1 },
      {
        type: 'fill_blank',
        sentence: 'I ___ it is a good idea. (think/sink)',
        options: ['think', 'sink'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: '___ are ___ apples on the table. (There/Their, three/tree)',
        options: ['There, three', 'Their, tree'],
        answer: 0,
      },
    ],
    quiz: [
      {
        prompt: '¿Que palabra tiene /θ/ (sordo)?',
        options: ['this', 'think', 'the'],
        correct: 1,
        explanation: '"Think" usa /θ/ (sordo): la lengua entre los dientes sin vibracion.',
      },
      {
        prompt: '¿Cual es la transcripcion correcta de "three"?',
        options: ['/triː/', '/θriː/', '/ðriː/'],
        correct: 1,
        explanation: '"Three" empieza con /θ/, no con /t/. Lengua entre dientes.',
      },
      {
        prompt: '"Weather" tiene el sonido...',
        options: ['/θ/ sordo', '/ð/ sonoro', 'No tiene sonido th'],
        correct: 1,
        explanation: '"Weather" /ˈweðər/ usa /ð/ sonoro en el medio.',
      },
    ],
  },

  'v-b': {
    id: 'v-b',
    title: 'Distincion /v/ vs /b/',
    ipa: ['/v/', '/b/'],
    explanation: {
      what: 'En espanol, /v/ y /b/ se pronuncian igual (ambas como /b/). En ingles son sonidos completamente diferentes que cambian el significado de las palabras.',
      howToProduce:
        'Para /v/: coloca los dientes superiores sobre el labio inferior y haz vibrar las cuerdas vocales mientras soplas aire. Para /b/: cierra ambos labios y suelta el aire de golpe.',
      commonMistake:
        'Decir "berry" en vez de "very", o "ban" en vez de "van". Los hispanohablantes tienden a cerrar ambos labios para todo, eliminando la /v/.',
      selfTest:
        'Ponte un dedo en el labio inferior. Para /v/, sentiras los dientes tocando el dedo. Para /b/, sentiras ambos labios presionando.',
    },
    minimalPairs: [
      {
        wordA: { word: 'very', ipa: '/ˈveri/' },
        wordB: { word: 'berry', ipa: '/ˈberi/' },
        note: '"Very" (muy) vs "berry" (baya). Dientes en el labio vs labios cerrados.',
      },
      {
        wordA: { word: 'van', ipa: '/væn/' },
        wordB: { word: 'ban', ipa: '/bæn/' },
        note: '"Van" (furgoneta) vs "ban" (prohibir). Diferente posicion de labios.',
      },
      {
        wordA: { word: 'vest', ipa: '/vest/' },
        wordB: { word: 'best', ipa: '/best/' },
        note: '"Vest" (chaleco) vs "best" (mejor). El /v/ es labiodental.',
      },
      {
        wordA: { word: 'vote', ipa: '/voʊt/' },
        wordB: { word: 'boat', ipa: '/boʊt/' },
        note: '"Vote" (votar) vs "boat" (barco). Cuidado en contextos politicos.',
      },
    ],
    practice: [
      {
        type: 'classify',
        word: 'very',
        options: ['/v/ (dientes-labio)', '/b/ (labios cerrados)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'bus',
        options: ['/v/ (dientes-labio)', '/b/ (labios cerrados)'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'voice',
        options: ['/v/ (dientes-labio)', '/b/ (labios cerrados)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'boy',
        options: ['/v/ (dientes-labio)', '/b/ (labios cerrados)'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'violin',
        options: ['/v/ (dientes-labio)', '/b/ (labios cerrados)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'butter',
        options: ['/v/ (dientes-labio)', '/b/ (labios cerrados)'],
        answer: 1,
      },
      {
        type: 'fill_blank',
        sentence: 'She drives a white ___. (van/ban)',
        options: ['van', 'ban'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: 'This is the ___ movie I have seen. (vest/best)',
        options: ['vest', 'best'],
        answer: 1,
      },
    ],
    quiz: [
      {
        prompt: '¿Como se pronuncia "very"?',
        options: [
          'Con ambos labios (como B)',
          'Dientes sobre el labio inferior (V)',
          'Igual que en espanol',
        ],
        correct: 1,
        explanation:
          '"Very" requiere los dientes superiores sobre el labio inferior para producir /v/.',
      },
      {
        prompt: '"Vest" y "best" suenan igual?',
        options: ['Si, son iguales', 'No — /v/ vs /b/', 'Depende del acento'],
        correct: 1,
        explanation:
          '"Vest" /vest/ y "best" /best/ son palabras diferentes. /v/ es labiodental, /b/ es bilabial.',
      },
      {
        prompt: '¿Que palabra empieza con /v/?',
        options: ['boat', 'vote', 'both'],
        correct: 1,
        explanation: '"Vote" /voʊt/ empieza con /v/: dientes superiores sobre el labio inferior.',
      },
    ],
  },

  'vowel-length': {
    id: 'vowel-length',
    title: 'Vocales cortas vs largas',
    ipa: ['/ɪ/ vs /iː/', '/ʊ/ vs /uː/'],
    explanation: {
      what: 'En ingles, la duracion de una vocal cambia el significado de la palabra. Las vocales cortas (/ɪ/, /ʊ/) son rapidas y relajadas. Las largas (/iː/, /uː/) se mantienen el doble de tiempo y la boca esta mas tensa.',
      howToProduce:
        'Para vocales largas, mantien la posicion de la boca durante mas tiempo (casi el doble). Para /iː/, estira los labios como si sonrieras. Para /ɪ/, relaja la boca y haz el sonido breve.',
      commonMistake:
        'Decir "ship" y "sheep" de la misma forma. En espanol, las vocales siempre duran lo mismo, asi que no distinguimos por longitud.',
      selfTest:
        'Di "ship" rapidamente y luego "sheep" alargando la vocal. Si suenan diferente, vas bien. Tambien prueba con "full" (corto) y "fool" (largo).',
    },
    minimalPairs: [
      {
        wordA: { word: 'ship', ipa: '/ʃɪp/' },
        wordB: { word: 'sheep', ipa: '/ʃiːp/' },
        note: 'Barco vs oveja. La unica diferencia es la longitud de la vocal.',
      },
      {
        wordA: { word: 'hit', ipa: '/hɪt/' },
        wordB: { word: 'heat', ipa: '/hiːt/' },
        note: '"Hit" (golpear) vs "heat" (calor). Vocal corta vs larga.',
      },
      {
        wordA: { word: 'full', ipa: '/fʊl/' },
        wordB: { word: 'fool', ipa: '/fuːl/' },
        note: '"Full" (lleno) vs "fool" (tonto). /ʊ/ corto vs /uː/ largo.',
      },
      {
        wordA: { word: 'pull', ipa: '/pʊl/' },
        wordB: { word: 'pool', ipa: '/puːl/' },
        note: '"Pull" (tirar) vs "pool" (piscina). La vocal larga cambia todo.',
      },
    ],
    practice: [
      {
        type: 'classify',
        word: 'ship',
        options: ['Vocal corta /ɪ/', 'Vocal larga /iː/'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'sheep',
        options: ['Vocal corta /ɪ/', 'Vocal larga /iː/'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'hit',
        options: ['Vocal corta /ɪ/', 'Vocal larga /iː/'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'heat',
        options: ['Vocal corta /ɪ/', 'Vocal larga /iː/'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'full',
        options: ['Vocal corta /ʊ/', 'Vocal larga /uː/'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'fool',
        options: ['Vocal corta /ʊ/', 'Vocal larga /uː/'],
        answer: 1,
      },
      {
        type: 'fill_blank',
        sentence: 'The ___ is swimming in the lake. (ship/sheep)',
        options: ['ship', 'sheep'],
        answer: 1,
      },
      {
        type: 'fill_blank',
        sentence: 'The room is ___. Please sit down. (full/fool)',
        options: ['full', 'fool'],
        answer: 0,
      },
    ],
    quiz: [
      {
        prompt: '"Ship" y "sheep" se diferencian en...',
        options: ['La consonante', 'La longitud de la vocal', 'El acento'],
        correct: 1,
        explanation: '"Ship" /ʃɪp/ tiene vocal corta /ɪ/ y "sheep" /ʃiːp/ tiene vocal larga /iː/.',
      },
      {
        prompt: '¿Cual tiene vocal larga?',
        options: ['hit', 'heat', 'bit'],
        correct: 1,
        explanation: '"Heat" /hiːt/ tiene la vocal larga /iː/. "Hit" y "bit" tienen /ɪ/ corta.',
      },
      {
        prompt: '¿Que par tiene vocales /ʊ/ vs /uː/?',
        options: ['ship/sheep', 'pull/pool', 'hit/heat'],
        correct: 1,
        explanation: '"Pull" /pʊl/ tiene /ʊ/ corta y "pool" /puːl/ tiene /uː/ larga.',
      },
    ],
  },

  schwa: {
    id: 'schwa',
    title: 'El sonido schwa /ə/',
    ipa: ['/ə/'],
    explanation: {
      what: 'El schwa /ə/ es el sonido vocal mas comun del ingles. Aparece en silabas no acentuadas y suena como una "a" muy relajada y corta. Es el sonido que hacemos cuando dudamos: "uh".',
      howToProduce:
        'Relaja completamente la boca y la mandibula. No redondees los labios ni los estires. Emite un sonido muy corto y neutro, como un "uh" perezoso.',
      commonMistake:
        'Pronunciar todas las vocales con la misma fuerza, como en espanol. En ingles, las silabas no acentuadas se reducen a schwa. "Banana" no es "ba-NA-na" sino /bəˈnænə/.',
      selfTest:
        'Di "banana" de forma natural y rapida. Las silabas "ba-" y "-na" final deben sonar como "buh" y "nuh". Si suenan como "ba" y "na" claras, estas usando vocales espanolas.',
    },
    minimalPairs: [
      {
        wordA: { word: 'about', ipa: '/əˈbaʊt/' },
        wordB: { word: 'a boat', ipa: '/ə boʊt/' },
        note: 'La primera silaba de "about" es un schwa puro /ə/.',
      },
      {
        wordA: { word: 'the book', ipa: '/ðə bʊk/' },
        wordB: { word: 'thee book', ipa: '/ðiː bʊk/' },
        note: '"The" normalmente se pronuncia /ðə/, no /ðiː/.',
      },
      {
        wordA: { word: 'to go', ipa: '/tə ɡoʊ/' },
        wordB: { word: 'two go', ipa: '/tuː ɡoʊ/' },
        note: '"To" atono se reduce a /tə/, no se dice /tuː/.',
      },
      {
        wordA: { word: 'banana', ipa: '/bəˈnænə/' },
        wordB: { word: 'bandana', ipa: '/bænˈdænə/' },
        note: 'En "banana", la primera vocal es schwa. En "bandana", es /æ/ acentuada.',
      },
    ],
    practice: [
      {
        type: 'classify',
        word: 'about',
        options: ['Empieza con schwa /ə/', 'Empieza con /a/ clara'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'apple',
        options: ['Empieza con schwa /ə/', 'Empieza con /æ/ clara'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'computer',
        options: ['Tiene schwa(s)', 'No tiene schwa'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'elephant',
        options: ['Tiene schwa(s)', 'No tiene schwa'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'family',
        options: ['Tiene schwa(s)', 'No tiene schwa'],
        answer: 0,
      },
      { type: 'classify', word: 'cat', options: ['Tiene schwa', 'No tiene schwa'], answer: 1 },
      {
        type: 'fill_blank',
        sentence: '¿Cuantos schwas tiene "banana" /bəˈnænə/?',
        options: ['Uno', 'Dos'],
        answer: 1,
      },
      {
        type: 'fill_blank',
        sentence: 'La palabra "the" normalmente suena como...',
        options: ['/ðə/ (con schwa)', '/ðiː/ (con i larga)'],
        answer: 0,
      },
    ],
    quiz: [
      {
        prompt: '¿Cual es el sonido vocal mas comun en ingles?',
        options: ['/a/', '/ə/ (schwa)', '/i/'],
        correct: 1,
        explanation:
          'El schwa /ə/ aparece en casi todas las palabras de mas de una silaba, en las silabas no acentuadas.',
      },
      {
        prompt: '¿Cuantos schwas tiene "banana"?',
        options: ['1', '2', '3'],
        correct: 1,
        explanation: '"Banana" /bəˈnænə/ tiene dos schwas: en la primera y ultima silaba.',
      },
      {
        prompt: '¿Donde aparece el schwa?',
        options: ['En silabas acentuadas', 'En silabas no acentuadas', 'Solo al final de palabras'],
        correct: 1,
        explanation:
          'El schwa solo aparece en silabas no acentuadas. Es el sonido de la "pereza" vocal.',
      },
    ],
  },

  'h-sound': {
    id: 'h-sound',
    title: 'El sonido /h/',
    ipa: ['/h/'],
    explanation: {
      what: 'El sonido /h/ en ingles es un soplo suave de aire desde la garganta, como cuando empanas un espejo. NO es el sonido fuerte de la "j" espanola (/x/).',
      howToProduce:
        'Abre la boca, relaja la garganta y sopla aire suavemente, como si quisieras calentar tus manos con el aliento. No uses la parte de atras de la garganta como para la "j" espanola.',
      commonMistake:
        'Pronunciar "hello" como "jello" con el sonido /x/ de la "j" espanola. Tambien es comun omitir la /h/ completamente (como se hace en espanol con la "h" muda).',
      selfTest:
        'Pon la mano delante de la boca y di "hello". Deberias sentir un soplo suave de aire caliente. Si suena aspero o fuerte, estas usando la "j" espanola.',
    },
    minimalPairs: [
      {
        wordA: { word: 'heat', ipa: '/hiːt/' },
        wordB: { word: 'eat', ipa: '/iːt/' },
        note: '"Heat" (calor) vs "eat" (comer). La /h/ es solo un soplo de aire.',
      },
      {
        wordA: { word: 'hair', ipa: '/heər/' },
        wordB: { word: 'air', ipa: '/eər/' },
        note: '"Hair" (pelo) vs "air" (aire). Sin la /h/, cambias el significado.',
      },
      {
        wordA: { word: 'heart', ipa: '/hɑːrt/' },
        wordB: { word: 'art', ipa: '/ɑːrt/' },
        note: '"Heart" (corazon) vs "art" (arte). La /h/ inicial es clave.',
      },
      {
        wordA: { word: 'hill', ipa: '/hɪl/' },
        wordB: { word: 'ill', ipa: '/ɪl/' },
        note: '"Hill" (colina) vs "ill" (enfermo). Un soplo de aire marca la diferencia.',
      },
    ],
    practice: [
      {
        type: 'classify',
        word: 'hello',
        options: ['Tiene /h/ (soplo suave)', 'H muda (no suena)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'hour',
        options: ['Tiene /h/ (soplo suave)', 'H muda (no suena)'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'house',
        options: ['Tiene /h/ (soplo suave)', 'H muda (no suena)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'honest',
        options: ['Tiene /h/ (soplo suave)', 'H muda (no suena)'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'happy',
        options: ['Tiene /h/ (soplo suave)', 'H muda (no suena)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'hospital',
        options: ['Tiene /h/ (soplo suave)', 'H muda (no suena)'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: 'My ___ hurts. (heart/art)',
        options: ['heart', 'art'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: 'She has beautiful ___. (hair/air)',
        options: ['hair', 'air'],
        answer: 0,
      },
    ],
    quiz: [
      {
        prompt: '¿Como se pronuncia la /h/ en ingles?',
        options: ['Como la "j" espanola', 'Como un soplo suave de aire', 'No se pronuncia nunca'],
        correct: 1,
        explanation:
          'La /h/ inglesa es un soplo suave, como empanar un espejo. Nunca es la "j" fuerte espanola.',
      },
      {
        prompt: '¿En cual de estas la "h" NO se pronuncia?',
        options: ['hello', 'hour', 'happy'],
        correct: 1,
        explanation: '"Hour" /aʊər/ tiene la h muda. "Hello" y "happy" si pronuncian la /h/.',
      },
      {
        prompt: '"Heat" sin la /h/ suena como...',
        options: ['hit', 'eat', 'hate'],
        correct: 1,
        explanation:
          '"Heat" /hiːt/ sin /h/ se convierte en "eat" /iːt/. La /h/ cambia el significado.',
      },
    ],
  },

  'ed-endings': {
    id: 'ed-endings',
    title: 'Terminaciones -ed: /t/, /d/, /ɪd/',
    ipa: ['/t/', '/d/', '/ɪd/'],
    explanation: {
      what: 'La terminacion -ed del pasado en ingles se pronuncia de 3 formas diferentes segun el sonido final del verbo: /t/ despues de sonidos sordos, /d/ despues de sonidos sonoros, y /ɪd/ despues de /t/ o /d/.',
      howToProduce:
        'Regla 1: Si el verbo termina en sonido sordo (/p/, /k/, /f/, /s/, /ʃ/, /tʃ/), la -ed suena /t/: "walked" = /wɔːkt/. Regla 2: Si termina en sonido sonoro (vocales, /b/, /g/, /v/, /z/, /m/, /n/), suena /d/: "played" = /pleɪd/. Regla 3: Si termina en /t/ o /d/, suena /ɪd/: "wanted" = /ˈwɒntɪd/.',
      commonMistake:
        'Pronunciar siempre -ed como una silaba extra: "walked" como "walk-ed" (2 silabas) en vez de "walkt" (1 silaba). Solo se anade silaba cuando el verbo termina en /t/ o /d/.',
      selfTest:
        'Di "walked" y "wanted". "Walked" debe tener 1 silaba (walkt). "Wanted" debe tener 2 silabas (won-tid). Si "walked" te suena con 2 silabas, estas anadiendo una vocal extra.',
    },
    minimalPairs: [
      {
        wordA: { word: 'walked', ipa: '/wɔːkt/' },
        wordB: { word: 'wanted', ipa: '/ˈwɒntɪd/' },
        note: '"Walked" = 1 silaba (/t/). "Wanted" = 2 silabas (/ɪd/) porque termina en /t/.',
      },
      {
        wordA: { word: 'played', ipa: '/pleɪd/' },
        wordB: { word: 'planted', ipa: '/ˈplæntɪd/' },
        note: '"Played" = 1 silaba (/d/ sonoro). "Planted" = 2 silabas (/ɪd/).',
      },
      {
        wordA: { word: 'stopped', ipa: '/stɒpt/' },
        wordB: { word: 'started', ipa: '/ˈstɑːrtɪd/' },
        note: '"Stopped" = /t/ (sordo). "Started" = /ɪd/ (silaba extra por la /t/ final).',
      },
      {
        wordA: { word: 'loved', ipa: '/lʌvd/' },
        wordB: { word: 'looked', ipa: '/lʊkt/' },
        note: '"Loved" = /d/ (sonoro tras /v/). "Looked" = /t/ (sordo tras /k/).',
      },
    ],
    practice: [
      {
        type: 'classify',
        word: 'walked',
        options: ['/t/ (sordo)', '/d/ (sonoro)', '/ɪd/ (silaba extra)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'played',
        options: ['/t/ (sordo)', '/d/ (sonoro)', '/ɪd/ (silaba extra)'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'wanted',
        options: ['/t/ (sordo)', '/d/ (sonoro)', '/ɪd/ (silaba extra)'],
        answer: 2,
      },
      {
        type: 'classify',
        word: 'stopped',
        options: ['/t/ (sordo)', '/d/ (sonoro)', '/ɪd/ (silaba extra)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'loved',
        options: ['/t/ (sordo)', '/d/ (sonoro)', '/ɪd/ (silaba extra)'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'needed',
        options: ['/t/ (sordo)', '/d/ (sonoro)', '/ɪd/ (silaba extra)'],
        answer: 2,
      },
      {
        type: 'fill_blank',
        sentence: '"Watched" se pronuncia con...',
        options: ['/t/ (1 silaba)', '/ɪd/ (2 silabas)'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: '"Decided" se pronuncia con...',
        options: ['/d/ (2 silabas)', '/ɪd/ (3 silabas)'],
        answer: 1,
      },
    ],
    quiz: [
      {
        prompt: '¿Como se pronuncia la -ed en "walked"?',
        options: ['/wɔːkɪd/ (2 silabas)', '/wɔːkt/ (1 silaba)', '/wɔːkd/ (1 silaba)'],
        correct: 1,
        explanation: '"Walk" termina en /k/ (sordo), asi que -ed suena /t/: "walkt".',
      },
      {
        prompt: '¿Cuando -ed se pronuncia /ɪd/?',
        options: [
          'Siempre',
          'Cuando el verbo termina en /t/ o /d/',
          'Cuando el verbo termina en vocal',
        ],
        correct: 1,
        explanation:
          'Solo se anade una silaba extra /ɪd/ cuando el verbo ya termina en /t/ o /d/: wanted, needed, decided.',
      },
      {
        prompt: '"Played" tiene...',
        options: ['1 silaba', '2 silabas', '3 silabas'],
        correct: 0,
        explanation:
          '"Play" termina en sonido sonoro (vocal), asi que -ed suena /d/ sin silaba extra: /pleɪd/.',
      },
    ],
  },

  'silent-letters': {
    id: 'silent-letters',
    title: 'Letras mudas en ingles',
    ipa: [],
    explanation: {
      what: 'El ingles tiene muchas letras que se escriben pero no se pronuncian. Esto ocurre porque la ortografia inglesa refleja pronunciaciones antiguas que han cambiado con el tiempo.',
      howToProduce:
        'No hay un truco de produccion especial: simplemente debes memorizar que ciertas combinaciones de letras tienen letras mudas. Los patrones mas comunes son: kn- (k muda), wr- (w muda), -mb (b muda), -lk (l muda), -sten (t muda).',
      commonMistake:
        'Pronunciar la "k" en "know", la "w" en "write", la "b" en "climb", la "l" en "walk" o la "t" en "listen". Los hispanohablantes tienden a pronunciar todas las letras porque en espanol casi todo se pronuncia.',
      selfTest:
        'Di "know" en voz alta. Si suena diferente a "no", estas pronunciando la "k". Deben sonar identicos: /noʊ/.',
    },
    minimalPairs: [
      {
        wordA: { word: 'know', ipa: '/noʊ/' },
        wordB: { word: 'no', ipa: '/noʊ/' },
        note: '"Know" y "no" se pronuncian exactamente igual. La "k" es muda.',
      },
      {
        wordA: { word: 'write', ipa: '/raɪt/' },
        wordB: { word: 'right', ipa: '/raɪt/' },
        note: '"Write" y "right" se pronuncian igual. La "w" es muda en "write".',
      },
      {
        wordA: { word: 'walk', ipa: '/wɔːk/' },
        wordB: { word: 'wok', ipa: '/wɒk/' },
        note: 'En "walk" la "l" es muda. No se dice "wolk".',
      },
      {
        wordA: { word: 'listen', ipa: '/ˈlɪsən/' },
        wordB: { word: 'lessen', ipa: '/ˈlesən/' },
        note: 'En "listen" la "t" es muda. Se dice "lisen", no "listen" con t.',
      },
    ],
    practice: [
      {
        type: 'classify',
        word: 'knife',
        options: ['La "k" se pronuncia', 'La "k" es muda'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'king',
        options: ['La "k" se pronuncia', 'La "k" es muda'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'wrong',
        options: ['La "w" se pronuncia', 'La "w" es muda'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'climb',
        options: ['La "b" se pronuncia', 'La "b" es muda'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'walk',
        options: ['La "l" se pronuncia', 'La "l" es muda'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'listen',
        options: ['La "t" se pronuncia', 'La "t" es muda'],
        answer: 1,
      },
      {
        type: 'fill_blank',
        sentence: '"Knight" se pronuncia como...',
        options: ['/naɪt/ (k y gh mudas)', '/knaɪt/ (con k)'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: '"Doubt" se pronuncia...',
        options: ['/daʊt/ (b muda)', '/daʊbt/ (con b)'],
        answer: 0,
      },
    ],
    quiz: [
      {
        prompt: '¿Que letra es muda en "know"?',
        options: ['La "n"', 'La "k"', 'La "o"'],
        correct: 1,
        explanation: 'En el patron kn-, la "k" siempre es muda: know, knife, knee, knock.',
      },
      {
        prompt: '¿Que letra es muda en "climb"?',
        options: ['La "c"', 'La "l"', 'La "b"'],
        correct: 2,
        explanation:
          'En el patron -mb al final de palabra, la "b" es muda: climb, lamb, thumb, bomb.',
      },
      {
        prompt: '"Listen" y "lessen" riman?',
        options: ['No, son muy diferentes', 'Si, suenan parecido', 'Solo en ingles britanico'],
        correct: 1,
        explanation: '"Listen" /ˈlɪsən/ tiene la "t" muda. Ambas terminan en /sən/.',
      },
    ],
  },

  'dj-vs-j': {
    id: 'dj-vs-j',
    title: 'Sonidos /dʒ/ vs /j/',
    ipa: ['/dʒ/', '/j/'],
    explanation: {
      what: 'El ingles tiene dos sonidos que los hispanohablantes a menudo confunden: /dʒ/ (como en "judge", un sonido fuerte y africado) y /j/ (como en "yes", un sonido suave como la "y" espanola).',
      howToProduce:
        'Para /dʒ/: presiona la lengua contra el paladar y suelta el aire con fuerza, como diciendo "ch" pero con vibracion. Para /j/: acerca la lengua al paladar sin tocarlo y deja pasar el aire suavemente, como la "y" de "yo" en espanol.',
      commonMistake:
        'Pronunciar "yes" con /dʒ/ ("jes") o pronunciar "judge" demasiado suave como /j/. Son sonidos muy diferentes en ingles.',
      selfTest:
        'Di "yet" y "jet". "Yet" debe sonar suave (como "iet"). "Jet" debe sonar fuerte con un golpe de lengua. Si suenan igual, practica el contraste.',
    },
    minimalPairs: [
      {
        wordA: { word: 'jet', ipa: '/dʒet/' },
        wordB: { word: 'yet', ipa: '/jet/' },
        note: '"Jet" (avion) con golpe fuerte vs "yet" (todavia) suave como "y" espanola.',
      },
      {
        wordA: { word: 'jam', ipa: '/dʒæm/' },
        wordB: { word: 'yam', ipa: '/jæm/' },
        note: '"Jam" (mermelada) vs "yam" (batata). /dʒ/ es explosivo, /j/ es suave.',
      },
      {
        wordA: { word: 'joke', ipa: '/dʒoʊk/' },
        wordB: { word: 'yoke', ipa: '/joʊk/' },
        note: '"Joke" (chiste) vs "yoke" (yugo). La /dʒ/ requiere contacto con el paladar.',
      },
      {
        wordA: { word: 'juice', ipa: '/dʒuːs/' },
        wordB: { word: 'use', ipa: '/juːs/' },
        note: '"Juice" (zumo) empieza con /dʒ/, "use" (nombre) con /j/.',
      },
    ],
    practice: [
      {
        type: 'classify',
        word: 'yellow',
        options: ['/dʒ/ (fuerte, como "judge")', '/j/ (suave, como "yes")'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'jump',
        options: ['/dʒ/ (fuerte, como "judge")', '/j/ (suave, como "yes")'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'year',
        options: ['/dʒ/ (fuerte, como "judge")', '/j/ (suave, como "yes")'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'jelly',
        options: ['/dʒ/ (fuerte, como "judge")', '/j/ (suave, como "yes")'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'you',
        options: ['/dʒ/ (fuerte, como "judge")', '/j/ (suave, como "yes")'],
        answer: 1,
      },
      {
        type: 'classify',
        word: 'general',
        options: ['/dʒ/ (fuerte, como "judge")', '/j/ (suave, como "yes")'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: 'She told a funny ___. (joke/yoke)',
        options: ['joke', 'yoke'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: 'Is the plane a ___? (jet/yet)',
        options: ['jet', 'yet'],
        answer: 0,
      },
    ],
    quiz: [
      {
        prompt: '¿Que sonido tiene "yes"?',
        options: ['/dʒ/ como "judge"', '/j/ suave como "y" espanola', '/ʃ/ como "shoe"'],
        correct: 1,
        explanation: '"Yes" /jes/ usa /j/, un sonido suave parecido a la "y" espanola.',
      },
      {
        prompt: '"Jet" y "yet" suenan igual?',
        options: ['Si', 'No — /dʒ/ vs /j/', 'Depende del dialecto'],
        correct: 1,
        explanation: '"Jet" /dʒet/ tiene un sonido fuerte africado. "Yet" /jet/ es suave.',
      },
      {
        prompt: '¿Que palabra tiene /dʒ/?',
        options: ['year', 'yellow', 'judge'],
        correct: 2,
        explanation:
          '"Judge" /dʒʌdʒ/ tiene /dʒ/ al principio y al final. "Year" y "yellow" usan /j/.',
      },
    ],
  },

  's-vs-z': {
    id: 's-vs-z',
    title: 'Sonidos /s/ vs /z/',
    ipa: ['/s/', '/z/'],
    explanation: {
      what: 'En espanol, la "z" se pronuncia como /θ/ (en Espana) o como /s/ (en Latinoamerica), pero NUNCA como /z/ (zumbido). En ingles, /s/ y /z/ son sonidos diferentes que cambian significados.',
      howToProduce:
        'Para /s/: coloca la punta de la lengua detras de los dientes superiores y sopla aire. Las cuerdas vocales NO vibran. Para /z/: misma posicion de lengua, pero ANADE vibracion en las cuerdas vocales. Es como una abeja: "zzzzz".',
      commonMistake:
        'Pronunciar "zoo" como "su" o "zip" como "sip". Los hispanohablantes no tienen el habito de hacer vibrar las cuerdas para la "z".',
      selfTest:
        'Pon la mano en la garganta. Di "sssss" (no vibra) y luego "zzzzz" (vibra). Ahora di "bus" (no vibra al final) y "buzz" (vibra al final).',
    },
    minimalPairs: [
      {
        wordA: { word: 'bus', ipa: '/bʌs/' },
        wordB: { word: 'buzz', ipa: '/bʌz/' },
        note: '"Bus" (autobus) vs "buzz" (zumbido). /s/ sordo vs /z/ sonoro al final.',
      },
      {
        wordA: { word: 'price', ipa: '/praɪs/' },
        wordB: { word: 'prize', ipa: '/praɪz/' },
        note: '"Price" (precio) vs "prize" (premio). La vibracion cambia el significado.',
      },
      {
        wordA: { word: 'ice', ipa: '/aɪs/' },
        wordB: { word: 'eyes', ipa: '/aɪz/' },
        note: '"Ice" (hielo) vs "eyes" (ojos). /s/ vs /z/ al final.',
      },
      {
        wordA: { word: 'sip', ipa: '/sɪp/' },
        wordB: { word: 'zip', ipa: '/zɪp/' },
        note: '"Sip" (sorbo) vs "zip" (cremallera). /s/ vs /z/ al inicio.',
      },
    ],
    practice: [
      {
        type: 'classify',
        word: 'see',
        options: ['/s/ (sordo, sin vibracion)', '/z/ (sonoro, con vibracion)'],
        answer: 0,
      },
      {
        type: 'classify',
        word: 'zoo',
        options: ['/s/ (sordo, sin vibracion)', '/z/ (sonoro, con vibracion)'],
        answer: 1,
      },
      { type: 'classify', word: 'bus', options: ['/s/ al final', '/z/ al final'], answer: 0 },
      { type: 'classify', word: 'buzz', options: ['/s/ al final', '/z/ al final'], answer: 1 },
      { type: 'classify', word: 'rice', options: ['/s/ al final', '/z/ al final'], answer: 0 },
      { type: 'classify', word: 'rise', options: ['/s/ al final', '/z/ al final'], answer: 1 },
      {
        type: 'fill_blank',
        sentence: 'The ___ of the ticket is 10 pounds. (price/prize)',
        options: ['price', 'prize'],
        answer: 0,
      },
      {
        type: 'fill_blank',
        sentence: 'She won first ___ in the competition. (price/prize)',
        options: ['price', 'prize'],
        answer: 1,
      },
    ],
    quiz: [
      {
        prompt: '¿Como se produce el sonido /z/?',
        options: [
          'Igual que /s/',
          'Como /s/ pero con vibracion en la garganta',
          'Como la "z" espanola de Espana',
        ],
        correct: 1,
        explanation:
          '/z/ es /s/ + vibracion de las cuerdas vocales. La "z" espanola de Espana es /θ/, un sonido diferente.',
      },
      {
        prompt: '"Eyes" termina en sonido...',
        options: ['/s/ (sordo)', '/z/ (sonoro)', '/aɪ/'],
        correct: 1,
        explanation: '"Eyes" /aɪz/ termina en /z/ sonoro. "Ice" /aɪs/ termina en /s/ sordo.',
      },
      {
        prompt: '¿Que par muestra el contraste /s/ vs /z/?',
        options: ['bus/but', 'bus/buzz', 'but/buzz'],
        correct: 1,
        explanation:
          '"Bus" /bʌs/ termina en /s/ y "buzz" /bʌz/ termina en /z/. Mismo sonido vocal, diferente consonante final.',
      },
    ],
  },
};

/**
 * Look up extended content by unit title.
 * Matches using common keywords in the title.
 */
export function getExtendedPronunciationContent(
  unitTitle: string,
): ExtendedPronunciationContent | null {
  const lower = unitTitle.toLowerCase();

  if (
    lower.includes('θ') ||
    lower.includes('ð') ||
    lower.includes('th sound') ||
    lower.includes('th-sound')
  ) {
    return EXTENDED_CONTENT['th-sounds'] ?? null;
  }
  if (
    lower.includes('/v/') ||
    lower.includes('/b/') ||
    lower.includes('v-b') ||
    lower.includes('v vs b')
  ) {
    return EXTENDED_CONTENT['v-b'] ?? null;
  }
  if (
    lower.includes('vowel') ||
    lower.includes('vocal') ||
    lower.includes('ship') ||
    lower.includes('sheep') ||
    lower.includes('vowel-length')
  ) {
    return EXTENDED_CONTENT['vowel-length'] ?? null;
  }
  if (lower.includes('schwa') || lower.includes('/ə/')) {
    return EXTENDED_CONTENT['schwa'] ?? null;
  }
  if (lower.includes('/h/') || lower.includes('h-sound') || lower.includes('h sound')) {
    return EXTENDED_CONTENT['h-sound'] ?? null;
  }
  if (
    lower.includes('-ed') ||
    lower.includes('ed ending') ||
    lower.includes('ed-ending') ||
    lower.includes('past ending')
  ) {
    return EXTENDED_CONTENT['ed-endings'] ?? null;
  }
  if (lower.includes('silent') || lower.includes('muda') || lower.includes('silent-letter')) {
    return EXTENDED_CONTENT['silent-letters'] ?? null;
  }
  if (
    lower.includes('/dʒ/') ||
    lower.includes('/j/') ||
    lower.includes('dj-vs-j') ||
    lower.includes('judge') ||
    lower.includes('yes sound')
  ) {
    return EXTENDED_CONTENT['dj-vs-j'] ?? null;
  }
  if (
    lower.includes('/s/') ||
    lower.includes('/z/') ||
    lower.includes('s-vs-z') ||
    lower.includes('s vs z')
  ) {
    return EXTENDED_CONTENT['s-vs-z'] ?? null;
  }

  return null;
}
