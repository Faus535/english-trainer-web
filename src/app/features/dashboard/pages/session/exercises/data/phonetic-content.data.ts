import { Level } from '../../../../../../shared/models/learning.model';

export interface SoundLesson {
  id: string;
  ipa: string[];
  level: Level;
  unitIndex: number;
  title: string;
  explanation: {
    what: string;
    where: string;
    why: string;
    commonMistake: string;
    selfTest: string;
  };
  examples: SoundExample[];
  minimalPairs: MinimalPair[];
}

export interface SoundExample {
  word: string;
  ipa: string;
  note: string;
}

export interface MinimalPair {
  correct: { word: string; ipa: string };
  incorrect: { word: string; ipa: string };
}

const A1_SOUND_LESSONS: SoundLesson[] = [
  {
    id: 'schwa',
    ipa: ['/ə/'],
    level: 'a1',
    unitIndex: 1,
    title: 'Schwa /ə/',
    explanation: {
      what: 'El sonido mas comun del ingles. Es una vocal corta, relajada, casi "perezosa". Suena como un "uh" muy breve. No existe en espanol.',
      where:
        'Aparece en TODAS las silabas que no llevan acento. En ingles, solo las silabas acentuadas se dicen "fuerte"; las demas se relajan hasta convertirse en /ə/.',
      why: 'El ingles es un idioma "stress-timed": las silabas acentuadas duran mas y las no acentuadas se comprimen. Esa compresion convierte cualquier vocal en /ə/.',
      commonMistake:
        'El hispanohablante pronuncia TODAS las vocales claramente, como en espanol. En ingles, si dices "a-BOUT" con una "a" clara, suena extranjero. Debe sonar como "uh-BOUT".',
      selfTest:
        'Di "banana" rapido. Las dos "a" que no acentuas (la primera y la ultima) son schwas. Si suenan como "uh" suave, lo estas haciendo bien.',
    },
    examples: [
      { word: 'about', ipa: '/əˈbaʊt/', note: 'La "a" inicial es /ə/' },
      { word: 'family', ipa: '/ˈfæməli/', note: 'La "i" final se relaja a /ə/' },
      { word: 'banana', ipa: '/bəˈnænə/', note: 'Dos schwas en una palabra' },
      { word: 'computer', ipa: '/kəmˈpjuːtər/', note: 'Dos schwas: la "o" y la "er"' },
      { word: 'the', ipa: '/ðə/', note: 'La palabra mas comun del ingles tiene schwa' },
      { word: 'elephant', ipa: '/ˈeləfənt/', note: 'Dos schwas en las silabas sin acento' },
    ],
    minimalPairs: [
      {
        correct: { word: 'about', ipa: '/əˈbaʊt/' },
        incorrect: { word: 'a bout', ipa: '/aˈbaʊt/' },
      },
      { correct: { word: 'the', ipa: '/ðə/' }, incorrect: { word: 'thee', ipa: '/ðiː/' } },
      {
        correct: { word: 'support', ipa: '/səˈpɔːrt/' },
        incorrect: { word: 'sue-port', ipa: '/suːˈpɔːrt/' },
      },
      {
        correct: { word: 'today', ipa: '/təˈdeɪ/' },
        incorrect: { word: 'too-day', ipa: '/tuːˈdeɪ/' },
      },
    ],
  },
  {
    id: 'th-sounds',
    ipa: ['/θ/', '/ð/'],
    level: 'a1',
    unitIndex: 2,
    title: '/θ/ vs /ð/ (th sounds)',
    explanation: {
      what: 'Ingles tiene DOS sonidos de "th": /θ/ (sordo — solo aire, sin vibracion) y /ð/ (sonoro — con vibracion de las cuerdas vocales). Ambos requieren poner la lengua entre los dientes.',
      where:
        '/θ/ aparece en: think, three, birthday, bath, math. /ð/ aparece en: this, the, weather, mother, together. En general, las palabras de contenido usan /θ/ y las palabras gramaticales (the, this, that, there) usan /ð/.',
      why: 'La lengua entre los dientes crea una friccion especial que no existe en espanol. La unica diferencia entre /θ/ y /ð/ es si las cuerdas vocales vibran o no.',
      commonMistake:
        'Los hispanohablantes sustituyen /θ/ por /t/ o /s/: "think" suena "tink" o "sink". Y sustituyen /ð/ por /d/: "this" suena "dis", "the" suena "de". Esto cambia el significado.',
      selfTest:
        'Pon la mano en la garganta. Di "the" — debe vibrar (es /ð/). Ahora di "think" — NO debe vibrar (es /θ/). Si ambos vibran, estas usando /d/ en vez de /θ/.',
    },
    examples: [
      { word: 'think', ipa: '/θɪŋk/', note: '/θ/ sordo — solo aire, lengua entre dientes' },
      { word: 'this', ipa: '/ðɪs/', note: '/ð/ sonoro — lengua entre dientes + vibracion' },
      { word: 'three', ipa: '/θriː/', note: 'Error comun: decir "tree"' },
      { word: 'the', ipa: '/ðə/', note: 'La palabra mas usada del ingles' },
      { word: 'birthday', ipa: '/ˈbɜːrθdeɪ/', note: '/θ/ en mitad de palabra' },
      { word: 'weather', ipa: '/ˈweðər/', note: '/ð/ en mitad de palabra' },
    ],
    minimalPairs: [
      { correct: { word: 'think', ipa: '/θɪŋk/' }, incorrect: { word: 'sink', ipa: '/sɪŋk/' } },
      { correct: { word: 'three', ipa: '/θriː/' }, incorrect: { word: 'tree', ipa: '/triː/' } },
      { correct: { word: 'this', ipa: '/ðɪs/' }, incorrect: { word: 'dis', ipa: '/dɪs/' } },
      { correct: { word: 'then', ipa: '/ðen/' }, incorrect: { word: 'den', ipa: '/den/' } },
      { correct: { word: 'bath', ipa: '/bɑːθ/' }, incorrect: { word: 'bass', ipa: '/bæs/' } },
    ],
  },
  {
    id: 'v-b',
    ipa: ['/v/', '/b/'],
    level: 'a1',
    unitIndex: 3,
    title: '/v/ vs /b/',
    explanation: {
      what: 'En ingles, /v/ y /b/ son sonidos completamente diferentes. /v/ se hace con los dientes superiores sobre el labio inferior + vibracion. /b/ se hace juntando los dos labios y soltando.',
      where:
        '/v/: very, have, love, van, vest, vote. /b/: big, but, job, ban, best, boat. Cambiar uno por otro cambia el significado de la palabra.',
      why: '/v/ es una fricativa labiodental: los dientes tocan el labio y el aire pasa con friccion. /b/ es una oclusiva bilabial: ambos labios se cierran y se abren de golpe.',
      commonMistake:
        'En espanol, /v/ y /b/ suenan igual. Los hispanohablantes dicen "berry" cuando quieren decir "very", "ban" en vez de "van", "best" en vez de "vest".',
      selfTest:
        'Muerde suavemente tu labio inferior con los dientes superiores y vibra. Ese es /v/. Ahora junta ambos labios y suelta. Ese es /b/. Practica: "very" (dientes) vs "berry" (labios).',
    },
    examples: [
      { word: 'very', ipa: '/ˈveri/', note: 'Dientes en labio inferior — NO "berry"' },
      { word: 'best', ipa: '/best/', note: 'Ambos labios cerrados' },
      { word: 'van', ipa: '/væn/', note: 'Dientes en labio — NO "ban"' },
      { word: 'ban', ipa: '/bæn/', note: 'Ambos labios — significado diferente' },
      { word: 'vest', ipa: '/vest/', note: '/v/ — NO "best"' },
      { word: 'vote', ipa: '/voʊt/', note: '/v/ — NO "boat"' },
    ],
    minimalPairs: [
      { correct: { word: 'very', ipa: '/ˈveri/' }, incorrect: { word: 'berry', ipa: '/ˈberi/' } },
      { correct: { word: 'van', ipa: '/væn/' }, incorrect: { word: 'ban', ipa: '/bæn/' } },
      { correct: { word: 'vest', ipa: '/vest/' }, incorrect: { word: 'best', ipa: '/best/' } },
      { correct: { word: 'vote', ipa: '/voʊt/' }, incorrect: { word: 'boat', ipa: '/boʊt/' } },
    ],
  },
  {
    id: 'vowel-length',
    ipa: ['/ɪ/', '/iː/'],
    level: 'a1',
    unitIndex: 4,
    title: '/ɪ/ vs /iː/ (short vs long)',
    explanation: {
      what: 'En ingles, la duracion de las vocales cambia el significado. /ɪ/ es corta y relajada (como una "i" rapida). /iː/ es larga y tensa (como "ii" estirada). Son dos sonidos DIFERENTES.',
      where:
        '/ɪ/ (corta): ship, sit, bit, hit, fill, live. /iː/ (larga): sheep, seat, beat, heat, feel, leave. Cada par tiene un significado completamente diferente.',
      why: 'La posicion de la lengua cambia: para /iː/ la lengua esta mas alta y mas adelante; para /ɪ/ esta mas relajada y centrada. Ademas, /iː/ dura el doble que /ɪ/.',
      commonMistake:
        'En espanol solo existe una "i". Los hispanohablantes pronuncian "ship" y "sheep" exactamente igual. Esto causa confusion: ship (barco) vs sheep (oveja) son palabras muy diferentes.',
      selfTest:
        'Di "sheep" alargando la "i" (shiiip). Ahora di "ship" cortando la "i" al minimo (sh-ip). Si puedes notar la diferencia de duracion, vas bien.',
    },
    examples: [
      { word: 'ship', ipa: '/ʃɪp/', note: 'Corta /ɪ/ — rapida' },
      { word: 'sheep', ipa: '/ʃiːp/', note: 'Larga /iː/ — estirada' },
      { word: 'hit', ipa: '/hɪt/', note: 'Corta — golpear' },
      { word: 'heat', ipa: '/hiːt/', note: 'Larga — calor' },
      { word: 'fill', ipa: '/fɪl/', note: 'Corta — llenar' },
      { word: 'feel', ipa: '/fiːl/', note: 'Larga — sentir' },
    ],
    minimalPairs: [
      { correct: { word: 'sheep', ipa: '/ʃiːp/' }, incorrect: { word: 'ship', ipa: '/ʃɪp/' } },
      { correct: { word: 'heat', ipa: '/hiːt/' }, incorrect: { word: 'hit', ipa: '/hɪt/' } },
      { correct: { word: 'feel', ipa: '/fiːl/' }, incorrect: { word: 'fill', ipa: '/fɪl/' } },
      { correct: { word: 'leave', ipa: '/liːv/' }, incorrect: { word: 'live', ipa: '/lɪv/' } },
    ],
  },
  {
    id: 'h-sound',
    ipa: ['/h/'],
    level: 'a1',
    unitIndex: 5,
    title: '/h/ aspirada',
    explanation: {
      what: 'La /h/ inglesa es un soplo suave de aire desde la garganta. NO es la "j" espanola (/x/). Es mucho mas suave — como el vaho que echas para limpiar unas gafas.',
      where:
        'Siempre al inicio de silaba: hello, house, happy, have, how, behind, perhaps. Nunca al final de palabra (la "h" de "oh" es muda).',
      why: 'Se produce relajando la garganta y dejando pasar aire sin friccion fuerte. La "j" espanola frota en el velo del paladar; la /h/ inglesa no frota en ningun sitio.',
      commonMistake:
        'Dos errores opuestos: 1) Omitir la /h/ completamente ("ello" por "hello"). 2) Pronunciarla como "j" espanola ("jello" por "hello"). Ambos suenan mal.',
      selfTest:
        'Pon la mano frente a la boca y di "hello". Debes sentir un soplo suave de aire en la "h". Si sientes vibracion fuerte en la garganta, estas haciendo la "j" espanola.',
    },
    examples: [
      { word: 'hello', ipa: '/həˈloʊ/', note: 'Soplo suave, no "jello"' },
      { word: 'house', ipa: '/haʊs/', note: 'Aire suave al inicio' },
      { word: 'happy', ipa: '/ˈhæpi/', note: 'La h se aspira, no se omite' },
      { word: 'have', ipa: '/hæv/', note: 'No digas "ave"' },
      { word: 'behind', ipa: '/bɪˈhaɪnd/', note: '/h/ en mitad de palabra' },
      { word: 'hospital', ipa: '/ˈhɒspɪtəl/', note: 'Aspirar la h inicial' },
    ],
    minimalPairs: [
      { correct: { word: 'heat', ipa: '/hiːt/' }, incorrect: { word: 'eat', ipa: '/iːt/' } },
      { correct: { word: 'hair', ipa: '/heər/' }, incorrect: { word: 'air', ipa: '/eər/' } },
      { correct: { word: 'heart', ipa: '/hɑːrt/' }, incorrect: { word: 'art', ipa: '/ɑːrt/' } },
      { correct: { word: 'hill', ipa: '/hɪl/' }, incorrect: { word: 'ill', ipa: '/ɪl/' } },
    ],
  },
  {
    id: 'review-1-5',
    ipa: ['/ə/', '/θ/', '/ð/', '/v/', '/b/', '/ɪ/', '/iː/', '/h/'],
    level: 'a1',
    unitIndex: 6,
    title: 'Repaso sonidos 1-5',
    explanation: {
      what: 'Repaso de los 5 sonidos vistos: schwa /ə/, los dos sonidos th (/θ/ y /ð/), /v/ vs /b/, vocales cortas vs largas (/ɪ/ vs /iː/), y la /h/ aspirada.',
      where:
        'Estos sonidos aparecen en las palabras mas comunes del ingles. Dominarlos mejora enormemente tu comprension y pronunciacion.',
      why: 'La repeticion espaciada es clave para automatizar estos sonidos. Este repaso te ayuda a consolidar lo aprendido.',
      commonMistake:
        'El error mas comun en repaso es relajarse y volver a los habitos del espanol. Mantente atento a cada sonido.',
      selfTest:
        'Di esta frase: "The three very happy sheep think about the hill." Contiene todos los sonidos. Si puedes decirla correctamente, has dominado los basicos.',
    },
    examples: [
      { word: 'about', ipa: '/əˈbaʊt/', note: 'Schwa /ə/ en la primera silaba' },
      { word: 'think', ipa: '/θɪŋk/', note: '/θ/ sordo — lengua entre dientes' },
      { word: 'the', ipa: '/ðə/', note: '/ð/ sonoro + schwa' },
      { word: 'very', ipa: '/ˈveri/', note: '/v/ — dientes en labio inferior' },
      { word: 'sheep', ipa: '/ʃiːp/', note: '/iː/ larga' },
      { word: 'happy', ipa: '/ˈhæpi/', note: '/h/ aspirada suave' },
    ],
    minimalPairs: [
      { correct: { word: 'think', ipa: '/θɪŋk/' }, incorrect: { word: 'sink', ipa: '/sɪŋk/' } },
      { correct: { word: 'very', ipa: '/ˈveri/' }, incorrect: { word: 'berry', ipa: '/ˈberi/' } },
      { correct: { word: 'sheep', ipa: '/ʃiːp/' }, incorrect: { word: 'ship', ipa: '/ʃɪp/' } },
      { correct: { word: 'heart', ipa: '/hɑːrt/' }, incorrect: { word: 'art', ipa: '/ɑːrt/' } },
    ],
  },
  {
    id: 'ed-endings',
    ipa: ['/t/', '/d/', '/ɪd/'],
    level: 'a1',
    unitIndex: 7,
    title: 'Terminaciones -ed',
    explanation: {
      what: 'La terminacion -ed de los verbos regulares en pasado tiene 3 pronunciaciones diferentes: /t/ (walked), /d/ (played), /ɪd/ (wanted). NO siempre se pronuncia como silaba extra.',
      where:
        '/t/ despues de sonidos sordos (k, p, f, s, sh, ch): walked, stopped, laughed. /d/ despues de sonidos sonoros (b, g, v, z, m, n, l) y vocales: played, lived, called. /ɪd/ solo despues de /t/ o /d/: wanted, needed, started.',
      why: 'Es cuestion de economia del habla: despues de un sonido sordo, la lengua hace naturalmente /t/; despues de uno sonoro, hace /d/. Solo cuando el verbo ya termina en /t/ o /d/, necesitas la silaba extra /ɪd/ para que se oiga.',
      commonMistake:
        'El hispanohablante siempre anade una silaba extra: "walk-ED", "play-ED", "stop-ED". En realidad, "walked" es 1 silaba (workt), "played" es 1 silaba (pleyd).',
      selfTest:
        'Di "walked" como UNA sola silaba: "workt". Si le estas anadiendo una "e" antes de la "d", lo estas haciendo mal. Ahora di "wanted" — ESTE si tiene silaba extra: "won-tid".',
    },
    examples: [
      { word: 'walked', ipa: '/wɔːkt/', note: '/t/ — una silaba, NO "walk-ed"' },
      { word: 'played', ipa: '/pleɪd/', note: '/d/ — una silaba, NO "play-ed"' },
      { word: 'wanted', ipa: '/ˈwɒntɪd/', note: '/ɪd/ — ESTE si es dos silabas' },
      { word: 'stopped', ipa: '/stɒpt/', note: '/t/ despues de /p/ sordo' },
      { word: 'lived', ipa: '/lɪvd/', note: '/d/ despues de /v/ sonoro' },
      { word: 'needed', ipa: '/ˈniːdɪd/', note: '/ɪd/ despues de /d/' },
    ],
    minimalPairs: [
      {
        correct: { word: 'walked', ipa: '/wɔːkt/' },
        incorrect: { word: 'walk-ed', ipa: '/ˈwɔːkɪd/' },
      },
      {
        correct: { word: 'played', ipa: '/pleɪd/' },
        incorrect: { word: 'play-ed', ipa: '/ˈpleɪɪd/' },
      },
      {
        correct: { word: 'stopped', ipa: '/stɒpt/' },
        incorrect: { word: 'stop-ed', ipa: '/ˈstɒpɪd/' },
      },
      {
        correct: { word: 'called', ipa: '/kɔːld/' },
        incorrect: { word: 'call-ed', ipa: '/ˈkɔːlɪd/' },
      },
    ],
  },
  {
    id: 'silent-letters',
    ipa: [],
    level: 'a1',
    unitIndex: 8,
    title: 'Letras mudas',
    explanation: {
      what: 'El ingles tiene muchas letras que se escriben pero NO se pronuncian. Esto es porque la ortografia del ingles refleja pronunciaciones antiguas que cambiaron con el tiempo, pero la escritura no se actualizo.',
      where:
        'Patrones comunes: kn- (know, knife, knee), wr- (write, wrong, wrap), -mb (climb, bomb, lamb), -lk (walk, talk, chalk), -sten (listen, fasten).',
      why: 'Hace siglos, los ingleses SI pronunciaban la "k" en "know" y la "w" en "write". La pronunciacion cambio pero la escritura se quedo igual.',
      commonMistake:
        'El hispanohablante pronuncia TODAS las letras porque en espanol casi todo se pronuncia como se escribe. En ingles, decir "k-now" o "w-rite" suena muy raro.',
      selfTest:
        'Di "know" — debe sonar exactamente como "no". Di "write" — debe sonar exactamente como "right". Si puedes oir diferencia, estas pronunciando la letra muda.',
    },
    examples: [
      { word: 'know', ipa: '/noʊ/', note: 'La K es muda — suena como "no"' },
      { word: 'write', ipa: '/raɪt/', note: 'La W es muda — suena como "right"' },
      { word: 'listen', ipa: '/ˈlɪsən/', note: 'La T es muda — "lisen"' },
      { word: 'walk', ipa: '/wɔːk/', note: 'La L es muda — "wok"' },
      { word: 'climb', ipa: '/klaɪm/', note: 'La B es muda — "clime"' },
      { word: 'wednesday', ipa: '/ˈwenzdeɪ/', note: 'La primera D es muda — "wensday"' },
    ],
    minimalPairs: [
      { correct: { word: 'know', ipa: '/noʊ/' }, incorrect: { word: 'k-now', ipa: '/knoʊ/' } },
      { correct: { word: 'write', ipa: '/raɪt/' }, incorrect: { word: 'w-rite', ipa: '/wraɪt/' } },
      {
        correct: { word: 'listen', ipa: '/ˈlɪsən/' },
        incorrect: { word: 'lis-ten', ipa: '/ˈlɪstən/' },
      },
      { correct: { word: 'walk', ipa: '/wɔːk/' }, incorrect: { word: 'wolk', ipa: '/wɔːlk/' } },
    ],
  },
  {
    id: 'dj-vs-j',
    ipa: ['/dʒ/', '/j/'],
    level: 'a1',
    unitIndex: 9,
    title: '/dʒ/ vs /j/ (judge vs yes)',
    explanation: {
      what: '/dʒ/ es como una "ch" pero sonora (con vibracion) — el sonido de "judge", "gym", "change". /j/ es como la "y" de "yo" — el sonido de "yes", "you", "year". Son sonidos MUY diferentes en ingles.',
      where:
        '/dʒ/ aparece con las letras J (just, job), G antes de E/I (gym, general, change), y DG (bridge, judge). /j/ aparece con Y (yes, you, year, young) y a veces U (use, music).',
      why: '/dʒ/ es un sonido africado: la lengua bloquea el aire y luego lo suelta con friccion. /j/ es una semiconsonante: la lengua se acerca al paladar sin tocarlo.',
      commonMistake:
        'Los hispanohablantes confunden ambos. Dicen "jes" en vez de "yes" (usando /dʒ/ donde va /j/). "Yes" empieza con un sonido suave de "y", NO con "j" fuerte.',
      selfTest:
        'Di "yes" — la lengua NO toca el paladar, es un sonido suave y continuo. Ahora di "just" — la lengua toca el paladar y suelta. Si "yes" suena como "jest", estas usando /dʒ/ donde va /j/.',
    },
    examples: [
      { word: 'just', ipa: '/dʒʌst/', note: '/dʒ/ — la lengua toca y suelta' },
      { word: 'yes', ipa: '/jes/', note: '/j/ — suave, la lengua no toca' },
      { word: 'gym', ipa: '/dʒɪm/', note: '/dʒ/ — la G suena como "y" fuerte' },
      { word: 'you', ipa: '/juː/', note: '/j/ — suave como "y" espanola' },
      { word: 'change', ipa: '/tʃeɪndʒ/', note: '/dʒ/ al final' },
      { word: 'year', ipa: '/jɪər/', note: '/j/ — NO "jear"' },
    ],
    minimalPairs: [
      { correct: { word: 'yes', ipa: '/jes/' }, incorrect: { word: 'jest', ipa: '/dʒest/' } },
      { correct: { word: 'yet', ipa: '/jet/' }, incorrect: { word: 'jet', ipa: '/dʒet/' } },
      { correct: { word: 'year', ipa: '/jɪər/' }, incorrect: { word: 'jeer', ipa: '/dʒɪər/' } },
      { correct: { word: 'yolk', ipa: '/joʊk/' }, incorrect: { word: 'joke', ipa: '/dʒoʊk/' } },
    ],
  },
  {
    id: 's-vs-z',
    ipa: ['/s/', '/z/'],
    level: 'a1',
    unitIndex: 10,
    title: '/s/ vs /z/',
    explanation: {
      what: '/s/ es sordo (sin vibracion) — el sonido de "bus", "sit", "price". /z/ es sonoro (con vibracion) — el sonido de "buzz", "zoo", "prize". La posicion de la lengua es identica; la unica diferencia es la vibracion.',
      where:
        '/s/ al inicio: sit, sun, see. Con C: city, price. Con SS: miss, pass. /z/ al inicio: zoo, zero. Con S entre vocales: music, easy, nose. Con Z: buzz, prize, freeze.',
      why: 'Ambos son fricativas alveolares — el aire pasa por la misma ranura detras de los dientes. Para /z/, simplemente activas las cuerdas vocales. Es el mismo mecanismo que /f/ vs /v/.',
      commonMistake:
        'En espanol no existe /z/ como fonema separado. Los hispanohablantes dicen "price" y "prize" exactamente igual (ambos con /s/). En ingles tienen significados diferentes.',
      selfTest:
        'Pon la mano en la garganta. Di "ssss" — no vibra (es /s/). Ahora di "zzzz" sin cambiar la posicion de la lengua, solo anade vibracion — eso es /z/.',
    },
    examples: [
      { word: 'bus', ipa: '/bʌs/', note: '/s/ final — sin vibracion' },
      { word: 'buzz', ipa: '/bʌz/', note: '/z/ final — CON vibracion' },
      { word: 'price', ipa: '/praɪs/', note: '/s/ — precio' },
      { word: 'prize', ipa: '/praɪz/', note: '/z/ — premio (¡diferente!)' },
      { word: 'sit', ipa: '/sɪt/', note: '/s/ sordo al inicio' },
      { word: 'zoo', ipa: '/zuː/', note: '/z/ sonoro al inicio' },
    ],
    minimalPairs: [
      { correct: { word: 'buzz', ipa: '/bʌz/' }, incorrect: { word: 'bus', ipa: '/bʌs/' } },
      { correct: { word: 'prize', ipa: '/praɪz/' }, incorrect: { word: 'price', ipa: '/praɪs/' } },
      { correct: { word: 'eyes', ipa: '/aɪz/' }, incorrect: { word: 'ice', ipa: '/aɪs/' } },
      { correct: { word: 'lose', ipa: '/luːz/' }, incorrect: { word: 'loose', ipa: '/luːs/' } },
    ],
  },
];

const SOUND_LESSONS: Record<Level, SoundLesson[]> = {
  a1: A1_SOUND_LESSONS,
  a2: [],
  b1: [],
  b2: [],
  c1: [],
  c2: [],
};

export function getSoundLessonForUnit(level: Level, unitTitle: string): SoundLesson | null {
  const lessons = SOUND_LESSONS[level] ?? [];
  const lower = unitTitle.toLowerCase();

  for (const lesson of lessons) {
    const id = lesson.id.toLowerCase();
    if (lower.includes(id)) return lesson;

    for (const ipa of lesson.ipa) {
      if (lower.includes(ipa.replace(/\//g, ''))) return lesson;
    }
  }

  if (lower.includes('schwa') || lower.includes('/ə/'))
    return lessons.find((l) => l.id === 'schwa') ?? null;
  if (lower.includes('th sound') || lower.includes('θ') || lower.includes('ð'))
    return lessons.find((l) => l.id === 'th-sounds') ?? null;
  if (lower.includes('/v/') && lower.includes('/b/'))
    return lessons.find((l) => l.id === 'v-b') ?? null;
  if (
    lower.includes('ship') ||
    lower.includes('sheep') ||
    lower.includes('vowel') ||
    (lower.includes('/ɪ/') && lower.includes('/iː/'))
  )
    return lessons.find((l) => l.id === 'vowel-length') ?? null;
  if (lower.includes('/h/') || lower.includes('aspirad'))
    return lessons.find((l) => l.id === 'h-sound') ?? null;
  if (lower.includes('repaso') || lower.includes('review'))
    return lessons.find((l) => l.id === 'review-1-5') ?? null;
  if (lower.includes('-ed') || lower.includes('ending'))
    return lessons.find((l) => l.id === 'ed-endings') ?? null;
  if (lower.includes('silent') || lower.includes('muda'))
    return lessons.find((l) => l.id === 'silent-letters') ?? null;
  if (lower.includes('/dʒ/') || lower.includes('judge'))
    return lessons.find((l) => l.id === 'dj-vs-j') ?? null;
  if (lower.includes('/s/') && lower.includes('/z/'))
    return lessons.find((l) => l.id === 's-vs-z') ?? null;

  return null;
}
