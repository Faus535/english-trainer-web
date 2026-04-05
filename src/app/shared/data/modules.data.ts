import {
  Level,
  ModuleConfig,
  ModuleLevelConfig,
  ModuleName,
  ModuleUnit,
} from '../models/learning.model';

function generateVocabUnits(
  level: Level,
  count: number,
  range: string,
  focus: string,
): ModuleUnit[] {
  const units: ModuleUnit[] = [];
  for (let i = 1; i <= count; i++) {
    const isReview = i === count;
    units.push({
      id: `v-${level}-${String(i).padStart(2, '0')}`,
      title: isReview ? `Repaso ${level.toUpperCase()} + Mini-test` : `${range} — Bloque ${i}`,
      desc: isReview ? `Repaso de vocabulario ${level.toUpperCase()}` : `${focus} (grupo ${i})`,
      type: isReview ? 'review' : 'vocabulary',
    });
  }
  return units;
}

function generatePhraseUnits(level: Level, topics: string[]): ModuleUnit[] {
  return topics.map((topic, i) => ({
    id: `p-${level}-${String(i + 1).padStart(2, '0')}`,
    title: topic,
    desc: topic.startsWith('Repaso')
      ? `Repaso y evaluacion ${level.toUpperCase()}`
      : `Frases para: ${topic}`,
    type: topic.startsWith('Repaso') ? 'review' : 'phrases',
  }));
}

function generatePronUnits(level: Level, topics: string[]): ModuleUnit[] {
  return topics.map((topic, i) => ({
    id: `pr-${level}-${String(i + 1).padStart(2, '0')}`,
    title: topic,
    desc: topic.startsWith('Repaso')
      ? `Repaso de pronunciacion ${level.toUpperCase()}`
      : `Practica: ${topic}`,
    type: topic.startsWith('Repaso') ? 'review' : 'pronunciation',
  }));
}

export const MODULES: Record<ModuleName, ModuleConfig> = {
  listening: {
    name: 'Listening',
    icon: '\u{1F3A7}',
    weight: 0.35,
    color: 'var(--color-listening)',
    levels: {
      a1: {
        totalUnits: 10,
        units: [
          {
            id: 'l-a1-01',
            title: 'La Schwa: el sonido invisible',
            desc: 'Reconocer /ə/ en palabras comunes',
            type: 'reduced-forms',
          },
          {
            id: 'l-a1-02',
            title: 'Weak forms basicas',
            desc: '"the" suena /ðə/, "to" suena /tə/',
            type: 'reduced-forms',
          },
          {
            id: 'l-a1-03',
            title: 'Gonna, wanna, gotta',
            desc: 'Las 3 reduced forms mas comunes',
            type: 'reduced-forms',
          },
          {
            id: 'l-a1-04',
            title: 'Content vs function words',
            desc: 'Por que unas palabras "desaparecen" al hablar',
            type: 'rhythm',
          },
          {
            id: 'l-a1-05',
            title: 'Dictation: frases simples',
            desc: 'Escucha y escribe frases basicas',
            type: 'dictation',
          },
          {
            id: 'l-a1-06',
            title: 'Linking basico',
            desc: 'Cuando las palabras se conectan: "turn it off"',
            type: 'connected-speech',
          },
          {
            id: 'l-a1-07',
            title: 'Numeros al oido',
            desc: 'Thirteen vs thirty, fourteen vs forty',
            type: 'numbers',
          },
          {
            id: 'l-a1-08',
            title: 'Dictation: dialogos cortos',
            desc: 'Escucha dialogos de 2-3 frases',
            type: 'dictation',
          },
          {
            id: 'l-a1-09',
            title: 'Fillers y muletillas',
            desc: 'Reconocer: uh, um, like, you know',
            type: 'fillers',
          },
          {
            id: 'l-a1-10',
            title: 'Repaso A1 + Mini-test',
            desc: 'Repaso de todo A1 y evaluacion',
            type: 'review',
          },
        ],
      },
      a2: {
        totalUnits: 12,
        units: [
          {
            id: 'l-a2-01',
            title: 'Contracciones avanzadas',
            desc: 'shoulda, coulda, woulda, hafta',
            type: 'reduced-forms',
          },
          {
            id: 'l-a2-02',
            title: 'Fusiones comunes',
            desc: 'gimme, lemme, didja, whatcha, whaddya',
            type: 'reduced-forms',
          },
          {
            id: 'l-a2-03',
            title: 'Elision: letras que desaparecen',
            desc: 'comfortable → /KUMF-ter-bul/',
            type: 'connected-speech',
          },
          {
            id: 'l-a2-04',
            title: 'Assimilation',
            desc: 'Cuando un sonido cambia al siguiente',
            type: 'connected-speech',
          },
          {
            id: 'l-a2-05',
            title: 'Dictation: BBC 6 Minute English',
            desc: 'Dictado con material real educativo',
            type: 'dictation',
          },
          {
            id: 'l-a2-06',
            title: 'Entonacion: falling vs rising',
            desc: 'Como la melodia cambia el significado',
            type: 'intonation',
          },
          {
            id: 'l-a2-07',
            title: 'Shadowing: primer intento',
            desc: 'Repite lo que oyes al mismo tiempo',
            type: 'shadowing',
          },
          {
            id: 'l-a2-08',
            title: 'Stress de oracion',
            desc: 'Por que "DOGS CHASE CATS" dura igual que frases largas',
            type: 'rhythm',
          },
          {
            id: 'l-a2-09',
            title: 'Dictation: English with Lucy',
            desc: 'Dictado con acento britanico',
            type: 'dictation',
          },
          {
            id: 'l-a2-10',
            title: 'Pares minimos al oido',
            desc: 'ship/sheep, bit/beat, cat/cut',
            type: 'minimal-pairs',
          },
          {
            id: 'l-a2-11',
            title: 'Shadowing: TED Talk facil',
            desc: 'Shadowing con charla articulada',
            type: 'shadowing',
          },
          {
            id: 'l-a2-12',
            title: 'Repaso A2 + Mini-test',
            desc: 'Repaso de todo A2 y evaluacion',
            type: 'review',
          },
        ],
      },
      b1: {
        totalUnits: 12,
        units: [
          {
            id: 'l-b1-01',
            title: 'Connected speech avanzado',
            desc: 'Frases de 5-8 palabras encadenadas',
            type: 'connected-speech',
          },
          {
            id: 'l-b1-02',
            title: 'Dictation: podcasts',
            desc: 'All Ears English, Freakonomics',
            type: 'dictation',
          },
          {
            id: 'l-b1-03',
            title: 'Acentos: American vs British',
            desc: 'Diferencias clave y como adaptarte',
            type: 'accents',
          },
          {
            id: 'l-b1-04',
            title: 'Shadowing: conversacion natural',
            desc: 'Dos personas hablando con interrupciones',
            type: 'shadowing',
          },
          {
            id: 'l-b1-05',
            title: 'Series con subtitulos EN',
            desc: 'Friends/The Office — escuchar + leer',
            type: 'immersion',
          },
          {
            id: 'l-b1-06',
            title: 'Expresiones idiomaticas al oido',
            desc: 'Reconocer idioms en audio real',
            type: 'idioms',
          },
          {
            id: 'l-b1-07',
            title: 'Dictation: noticias',
            desc: 'BBC News, CNN — velocidad real',
            type: 'dictation',
          },
          {
            id: 'l-b1-08',
            title: 'Slang basico moderno',
            desc: 'ghost, flex, vibe, lowkey en contexto',
            type: 'slang',
          },
          {
            id: 'l-b1-09',
            title: 'Shadowing: TED Talk normal',
            desc: 'Velocidad natural, tema interesante',
            type: 'shadowing',
          },
          {
            id: 'l-b1-10',
            title: 'Series SIN subtitulos',
            desc: 'Primer intento: 5 minutos sin apoyo',
            type: 'immersion',
          },
          {
            id: 'l-b1-11',
            title: 'Dictation: pelicula',
            desc: 'Fragmento de pelicula real',
            type: 'dictation',
          },
          {
            id: 'l-b1-12',
            title: 'Repaso B1 + Mini-test',
            desc: 'Repaso de todo B1 y evaluacion',
            type: 'review',
          },
        ],
      },
      b2: {
        totalUnits: 10,
        units: [
          {
            id: 'l-b2-01',
            title: 'Acentos variados',
            desc: 'Irish, Scottish, Australian, Indian',
            type: 'accents',
          },
          {
            id: 'l-b2-02',
            title: 'Stand-up comedy',
            desc: 'Humor rapido, slang, juegos de palabras',
            type: 'immersion',
          },
          {
            id: 'l-b2-03',
            title: 'Debates y discusiones',
            desc: 'Multiples hablantes, interrupciones',
            type: 'immersion',
          },
          {
            id: 'l-b2-04',
            title: 'Shadowing: pelicula',
            desc: 'Escenas con habla rapida y emocional',
            type: 'shadowing',
          },
          {
            id: 'l-b2-05',
            title: 'Podcasts largos sin pausar',
            desc: '15 minutos de escucha continua',
            type: 'immersion',
          },
          {
            id: 'l-b2-06',
            title: 'Slang avanzado y jerga',
            desc: 'Expresiones de series y redes sociales',
            type: 'slang',
          },
          {
            id: 'l-b2-07',
            title: 'Noticias en directo',
            desc: 'CNN/BBC live — lo mas dificil',
            type: 'immersion',
          },
          {
            id: 'l-b2-08',
            title: 'Dictation: material nativo',
            desc: 'Sin material para aprendices',
            type: 'dictation',
          },
          {
            id: 'l-b2-09',
            title: 'Pelicula completa',
            desc: '90 min sin subtitulos',
            type: 'immersion',
          },
          {
            id: 'l-b2-10',
            title: 'Repaso B2 + Mini-test',
            desc: 'Repaso de todo B2 y evaluacion',
            type: 'review',
          },
        ],
      },
      c1: {
        totalUnits: 12,
        units: [
          {
            id: 'l-c1-01',
            title: 'Acentos fuertes',
            desc: 'Peaky Blinders, The Wire, Trainspotting',
            type: 'accents',
          },
          {
            id: 'l-c1-02',
            title: 'Conversacion real',
            desc: 'Practica con nativos (apps/Discord)',
            type: 'conversation',
          },
          {
            id: 'l-c1-03',
            title: 'Reality shows',
            desc: 'Sin guion, hablan encima, slang puro',
            type: 'immersion',
          },
          {
            id: 'l-c1-04',
            title: 'Conferencias tecnicas',
            desc: 'Tu area de interes en ingles',
            type: 'immersion',
          },
          {
            id: 'l-c1-05',
            title: 'Humor sutil',
            desc: 'Ironia, sarcasmo, doble sentido',
            type: 'immersion',
          },
          {
            id: 'l-c1-06',
            title: 'Podcasts especializados',
            desc: 'Temas profundos a velocidad nativa',
            type: 'immersion',
          },
          {
            id: 'l-c1-07',
            title: 'Comprension total',
            desc: 'Cualquier material sin esfuerzo',
            type: 'immersion',
          },
          {
            id: 'l-c1-08',
            title: 'Evaluacion final C1',
            desc: 'Test comprehensivo de listening',
            type: 'review',
          },
          {
            id: 'l-c1-09',
            title: 'Debates entre nativos',
            desc: 'Multiples hablantes, interrupciones, turn-taking',
            type: 'immersion',
          },
          {
            id: 'l-c1-10',
            title: 'Peliculas con argot regional',
            desc: 'Cockney, Southern, Australian slang',
            type: 'immersion',
          },
          {
            id: 'l-c1-11',
            title: 'Llamadas telefonicas reales',
            desc: 'Audio comprimido, numeros, confirmacion',
            type: 'immersion',
          },
          {
            id: 'l-c1-12',
            title: 'Presentaciones tecnicas rapidas',
            desc: 'TED talk a 160-180 wpm',
            type: 'immersion',
          },
        ],
      },
      c2: {
        totalUnits: 10,
        units: [
          {
            id: 'l-c2-01',
            title: 'Material autentico sin filtro',
            desc: 'Podcasts nativos sin edicion para aprendices',
            type: 'immersion',
          },
          {
            id: 'l-c2-02',
            title: 'Acentos densos y dialectos',
            desc: 'Glaswegian, Deep South, Jamaican patois',
            type: 'accents',
          },
          {
            id: 'l-c2-03',
            title: 'Conferencias academicas largas',
            desc: '30+ minutos de contenido tecnico denso',
            type: 'immersion',
          },
          {
            id: 'l-c2-04',
            title: 'Comedia improvisada',
            desc: 'Comprender humor no guionizado y juegos de palabras',
            type: 'immersion',
          },
          {
            id: 'l-c2-05',
            title: 'Debates parlamentarios',
            desc: 'House of Commons, Congressional hearings',
            type: 'immersion',
          },
          {
            id: 'l-c2-06',
            title: 'Shadowing: nativo a velocidad real',
            desc: 'Reproduccion perfecta de ritmo y prosodia',
            type: 'shadowing',
          },
          {
            id: 'l-c2-07',
            title: 'Podcasts narrativos complejos',
            desc: 'Serial, This American Life — historias densas',
            type: 'immersion',
          },
          {
            id: 'l-c2-08',
            title: 'Multiples acentos simultaneos',
            desc: 'Panel discussion con 4+ hablantes de distintos paises',
            type: 'immersion',
          },
          {
            id: 'l-c2-09',
            title: 'Audio degradado',
            desc: 'Llamadas, grabaciones antiguas, audio comprimido',
            type: 'immersion',
          },
          {
            id: 'l-c2-10',
            title: 'Evaluacion final C2',
            desc: 'Comprension total de cualquier material en ingles',
            type: 'review',
          },
        ],
      },
    },
  },

  vocabulary: {
    name: 'Vocabulario',
    icon: '\u{1F4DA}',
    weight: 0.15,
    color: 'var(--color-vocabulary)',
    levels: {
      a1: {
        totalUnits: 8,
        units: generateVocabUnits('a1', 8, 'Top 100-300', 'Palabras mas frecuentes'),
      },
      a2: {
        totalUnits: 10,
        units: generateVocabUnits('a2', 10, 'Top 300-800', 'Vocabulario cotidiano activo'),
      },
      b1: {
        totalUnits: 10,
        units: generateVocabUnits(
          'b1',
          10,
          'Top 800-1500',
          'Vocabulario intermedio + phrasal verbs',
        ),
      },
      b2: {
        totalUnits: 8,
        units: generateVocabUnits('b2', 8, 'Top 1500-2500', 'Vocabulario avanzado + collocations'),
      },
      c1: {
        totalUnits: 10,
        units: generateVocabUnits(
          'c1',
          10,
          'Top 2500-3000+',
          'Vocabulario academico y especializado',
        ),
      },
      c2: {
        totalUnits: 8,
        units: generateVocabUnits(
          'c2',
          8,
          'Top 3000+',
          'Vocabulario literario, tecnico y de baja frecuencia',
        ),
      },
    },
  },

  grammar: {
    name: 'Gramatica',
    icon: '\u{1F4DD}',
    weight: 0.15,
    color: 'var(--color-grammar)',
    levels: {
      a1: {
        totalUnits: 8,
        units: [
          {
            id: 'g-a1-01',
            title: 'Present Simple: activa',
            desc: 'Describe tu rutina diaria en ingles',
            type: 'activation',
          },
          {
            id: 'g-a1-02',
            title: 'Past Simple: activa',
            desc: 'Cuenta que hiciste ayer',
            type: 'activation',
          },
          {
            id: 'g-a1-03',
            title: 'Future: will vs going to',
            desc: 'Planes vs predicciones',
            type: 'activation',
          },
          {
            id: 'g-a1-04',
            title: 'Questions & negatives',
            desc: 'Formar preguntas correctamente',
            type: 'production',
          },
          {
            id: 'g-a1-05',
            title: 'There is/are + Some/Any',
            desc: 'Describir lugares y cantidades',
            type: 'activation',
          },
          {
            id: 'g-a1-06',
            title: 'Comparatives & superlatives',
            desc: 'Compara ciudades, personas, cosas',
            type: 'activation',
          },
          {
            id: 'g-a1-07',
            title: 'Modal verbs basicos',
            desc: 'can, must, should en contexto',
            type: 'activation',
          },
          {
            id: 'g-a1-08',
            title: 'Repaso A1 + Mini-test',
            desc: 'Produccion libre con estructuras A1',
            type: 'review',
          },
        ],
      },
      a2: {
        totalUnits: 8,
        units: [
          {
            id: 'g-a2-01',
            title: 'Present Perfect: activa',
            desc: 'Experiencias y resultados',
            type: 'activation',
          },
          {
            id: 'g-a2-02',
            title: 'Past Continuous',
            desc: 'Que estabas haciendo cuando...',
            type: 'activation',
          },
          {
            id: 'g-a2-03',
            title: 'First Conditional',
            desc: 'If + present → will + infinitive',
            type: 'activation',
          },
          {
            id: 'g-a2-04',
            title: 'Prepositions of time/place',
            desc: 'in, on, at sin pensarlo',
            type: 'production',
          },
          {
            id: 'g-a2-05',
            title: 'Present Perfect vs Past Simple',
            desc: 'El eterno problema hispanohablante',
            type: 'contrast',
          },
          {
            id: 'g-a2-06',
            title: 'Connectors',
            desc: 'however, although, despite, in spite of',
            type: 'production',
          },
          {
            id: 'g-a2-07',
            title: 'Modal verbs avanzados',
            desc: 'might, could, would en contexto real',
            type: 'activation',
          },
          {
            id: 'g-a2-08',
            title: 'Repaso A2 + Mini-test',
            desc: 'Produccion libre con estructuras A2',
            type: 'review',
          },
        ],
      },
      b1: {
        totalUnits: 10,
        units: [
          {
            id: 'g-b1-01',
            title: 'Second Conditional',
            desc: 'If I were rich, I would...',
            type: 'activation',
          },
          {
            id: 'g-b1-02',
            title: 'Passive Voice',
            desc: 'En contexto real, no "the ball was kicked"',
            type: 'activation',
          },
          {
            id: 'g-b1-03',
            title: 'Reported Speech',
            desc: 'Contar lo que alguien dijo',
            type: 'activation',
          },
          {
            id: 'g-b1-04',
            title: 'Relative Clauses',
            desc: 'who, which, that sin pensar',
            type: 'production',
          },
          {
            id: 'g-b1-05',
            title: 'Used to + Would',
            desc: 'Hablar del pasado habitual',
            type: 'activation',
          },
          {
            id: 'g-b1-06',
            title: 'Third Conditional',
            desc: 'If I had known, I would have...',
            type: 'activation',
          },
          {
            id: 'g-b1-07',
            title: 'Wish + Past',
            desc: 'Deseos y arrepentimientos',
            type: 'activation',
          },
          {
            id: 'g-b1-08',
            title: 'Indirect Questions',
            desc: 'Could you tell me where...?',
            type: 'production',
          },
          {
            id: 'g-b1-09',
            title: 'Mixed tenses',
            desc: 'Combinar tiempos en un parrafo',
            type: 'production',
          },
          {
            id: 'g-b1-10',
            title: 'Repaso B1 + Mini-test',
            desc: 'Produccion libre con todo B1',
            type: 'review',
          },
        ],
      },
      b2: {
        totalUnits: 8,
        units: [
          {
            id: 'g-b2-01',
            title: 'Inversions',
            desc: 'No sooner had I... / Hardly had...',
            type: 'production',
          },
          {
            id: 'g-b2-02',
            title: 'Cleft sentences',
            desc: 'What I need is... / It was John who...',
            type: 'production',
          },
          {
            id: 'g-b2-03',
            title: 'Future perfect & continuous',
            desc: 'By next year, I will have...',
            type: 'activation',
          },
          {
            id: 'g-b2-04',
            title: 'Mixed conditionals',
            desc: 'If I had studied, I would be...',
            type: 'activation',
          },
          {
            id: 'g-b2-05',
            title: 'Participle clauses',
            desc: 'Having finished the work, she left',
            type: 'production',
          },
          {
            id: 'g-b2-06',
            title: 'Subjunctive',
            desc: 'I suggest that he be / If I were you',
            type: 'production',
          },
          {
            id: 'g-b2-07',
            title: 'Discourse markers',
            desc: 'furthermore, nevertheless, whereas',
            type: 'production',
          },
          {
            id: 'g-b2-08',
            title: 'Repaso B2 + Mini-test',
            desc: 'Produccion libre con todo B2',
            type: 'review',
          },
        ],
      },
      c1: {
        totalUnits: 8,
        units: [
          {
            id: 'g-c1-01',
            title: 'Nuance & register',
            desc: 'Formal vs informal: misma idea, diferente tono',
            type: 'production',
          },
          {
            id: 'g-c1-02',
            title: 'Hedging & softening',
            desc: 'It might be, could perhaps, tend to',
            type: 'production',
          },
          {
            id: 'g-c1-03',
            title: 'Complex nominalizations',
            desc: 'The implementation of → implementing',
            type: 'production',
          },
          {
            id: 'g-c1-04',
            title: 'Ellipsis & substitution',
            desc: 'Natural omissions in speech',
            type: 'production',
          },
          {
            id: 'g-c1-05',
            title: 'Error-free production',
            desc: 'Eliminar errores fossilizados',
            type: 'review',
          },
          {
            id: 'g-c1-06',
            title: 'Evaluacion final C1',
            desc: 'Produccion libre compleja',
            type: 'review',
          },
          {
            id: 'g-c1-07',
            title: 'Emphasis structures',
            desc: 'do/does + verb, clefts, fronting avanzado',
            type: 'production',
          },
          {
            id: 'g-c1-08',
            title: 'Coherencia textual',
            desc: 'Reference, substitution, ellipsis, theme/rheme',
            type: 'production',
          },
        ],
      },
      c2: {
        totalUnits: 8,
        units: [
          {
            id: 'g-c2-01',
            title: 'Registro y tono',
            desc: 'Formal, informal, academico, coloquial — misma idea, distinto registro',
            type: 'production',
          },
          {
            id: 'g-c2-02',
            title: 'Appropriacy pragmatica',
            desc: 'Elegir la estructura segun contexto social',
            type: 'production',
          },
          {
            id: 'g-c2-03',
            title: 'Conectores avanzados',
            desc: 'notwithstanding, insofar as, hitherto, thereby',
            type: 'production',
          },
          {
            id: 'g-c2-04',
            title: 'Hedging y mitigacion',
            desc: 'Matizar afirmaciones: arguably, it could be said that',
            type: 'production',
          },
          {
            id: 'g-c2-05',
            title: 'Nominalizacion compleja',
            desc: 'Transformar verbos en sustantivos para estilo academico',
            type: 'production',
          },
          {
            id: 'g-c2-06',
            title: 'Dispositivos literarios',
            desc: 'Zeugma, litotes, chiasmus en prosa',
            type: 'production',
          },
          {
            id: 'g-c2-07',
            title: 'Produccion libre nativa',
            desc: 'Escribir en registros multiples sin errores',
            type: 'review',
          },
          {
            id: 'g-c2-08',
            title: 'Evaluacion final C2',
            desc: 'Dominio total de la gramatica inglesa',
            type: 'review',
          },
        ],
      },
    },
  },

  phrases: {
    name: 'Frases',
    icon: '\u{1F4AC}',
    weight: 0.15,
    color: 'var(--color-phrases)',
    levels: {
      a1: {
        totalUnits: 6,
        units: generatePhraseUnits('a1', [
          'Saludos y presentaciones',
          'En el restaurante',
          'De compras',
          'Direcciones',
          'En el hotel',
          'Repaso A1',
        ]),
      },
      a2: {
        totalUnits: 8,
        units: generatePhraseUnits('a2', [
          'Small talk',
          'En el trabajo (email)',
          'En el aeropuerto',
          'Al telefono',
          'Dar opiniones',
          'Pedir y ofrecer ayuda',
          'Quedar con amigos',
          'Repaso A2',
        ]),
      },
      b1: {
        totalUnits: 8,
        units: generatePhraseUnits('b1', [
          'Argumentar y debatir',
          'Expresar acuerdo/desacuerdo',
          'Idioms del dia a dia',
          'Reuniones de trabajo',
          'Phrasal verbs esenciales',
          'Expresar emociones',
          'Negociar',
          'Repaso B1',
        ]),
      },
      b2: {
        totalUnits: 6,
        units: generatePhraseUnits('b2', [
          'Humor y sarcasmo',
          'Expresiones de series',
          'Jerga profesional',
          'Debate formal',
          'Matices y sutilezas',
          'Repaso B2',
        ]),
      },
      c1: {
        totalUnits: 6,
        units: generatePhraseUnits('c1', [
          'Registro academico',
          'Expresiones nativas',
          'Retorica y persuasion',
          'Evaluacion final C1',
          'Humor sutil profesional',
          'Diplomacia y confrontacion indirecta',
        ]),
      },
      c2: {
        totalUnits: 6,
        units: generatePhraseUnits('c2', [
          'Lenguaje diplomatico avanzado',
          'Marcadores del discurso academico',
          'Expresiones culturalmente especificas',
          'Matices de cortesia y distancia',
          'Retorica y persuasion avanzada',
          'Repaso C2',
        ]),
      },
    },
  },

  pronunciation: {
    name: 'Pronunciacion',
    icon: '\u{1F3A4}',
    weight: 0.2,
    color: 'var(--color-pronunciation)',
    levels: {
      a1: {
        totalUnits: 10,
        units: generatePronUnits('a1', [
          '/θ/ vs /ð/ (th sounds)',
          '/v/ vs /b/',
          'Vocales cortas vs largas',
          '/ɪ/ vs /iː/ (ship vs sheep)',
          '/h/ aspirada',
          'Repaso A1',
          'Terminaciones -ed: /t/, /d/, /ɪd/',
          'Letras mudas',
          '/dʒ/ vs /j/ (judge vs yes)',
          '/s/ vs /z/ (bus vs buzz)',
        ]),
      },
      a2: {
        totalUnits: 10,
        units: generatePronUnits('a2', [
          '/ʃ/ vs /tʃ/ (she vs cheese)',
          '/r/ americana vs britanica',
          'Diptongos',
          '/æ/ vs /ʌ/ (cat vs cut)',
          'Stress de palabras',
          'Repaso A2',
          '/l/ clara vs oscura',
          'Diptongos: /ɪə/, /eə/, /ʊə/',
          'Clusters consonanticos finales',
          'Pares minimos: consolidacion',
        ]),
      },
      b1: {
        totalUnits: 8,
        units: generatePronUnits('b1', [
          'Ritmo stress-timed',
          'Intonation patterns',
          'Linking sounds',
          'Flapping (better = /beɾər/)',
          'Schwas en frases completas',
          'Repaso B1',
          'Producir elision natural',
          'Producir asimilacion',
        ]),
      },
      b2: {
        totalUnits: 6,
        units: generatePronUnits('b2', [
          'Reduccion natural',
          'Entonacion emocional',
          'Acentos y adaptacion',
          'Repaso B2',
          'Aspiracion y voiced/voiceless',
          'Repaso B2 extendido: 44 fonemas',
        ]),
      },
      c1: {
        totalUnits: 7,
        units: generatePronUnits('c1', [
          'Comunicacion clara y natural',
          'Tono y registro vocal',
          'Fluidez sin acento marcado',
          'Evaluacion final C1',
          'Dominio completo: 44 fonemas',
          'Auto-correccion en tiempo real',
          'Presentaciones publicas',
        ]),
      },
      c2: {
        totalUnits: 7,
        units: generatePronUnits('c2', [
          'Prosodia para presentaciones publicas',
          'Enfasis para persuasion',
          'Neutralizacion de acento',
          'Entonacion para significado pragmatico',
          'Ritmo y tempo nativo',
          'Produccion fonetica perfecta',
          'Repaso C2: maestria total',
        ]),
      },
    },
  },
};

export function getModuleLabel(moduleName: ModuleName): string {
  return MODULES[moduleName].name;
}

export function getModuleConfig(moduleName: ModuleName, level: Level): ModuleLevelConfig | null {
  return MODULES[moduleName]?.levels[level] ?? null;
}
