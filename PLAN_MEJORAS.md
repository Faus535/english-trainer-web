# Plan de Mejoras — Frontend (english-trainer-web)

## Estado Actual (problemas detectados)

| Area          | Problema                                   | Detalle                                                                                                                        |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Listening     | Dictado sin contexto previo                | Se lanza directo al dictado sin explicar los sonidos que aparecen en las frases                                                |
| Pronunciation | Etiqueta sin explicacion profunda          | Aparece "Pronunciation" con ejemplos sueltos, sin flujo que explique QUE es el sonido, DONDE aparece, POR QUE se pronuncia asi |
| Vocabulary    | Solo 6 palabras por sesion (de 10 totales) | Dice "Top 100-300 — Bloque 1" pero el pool real es 10 palabras y solo muestra 6 aleatorias                                     |

### Infraestructura existente que se reutiliza

| Recurso                        | Estado | Uso en mejoras                                              |
| ------------------------------ | ------ | ----------------------------------------------------------- |
| `ReviewApiService`             | Existe | SRS — `addToReviewQueue`, `getDueReviews`, `completeReview` |
| `ProgressApiService`           | Existe | Tracking de unidades completadas por modulo/nivel           |
| `VocabApiService`              | Existe | `GET /vocab/level/{level}` ya trae palabras del backend     |
| `TtsService`                   | Existe | Audio de palabras/frases con Web Speech API                 |
| `exercise-content.data.ts`     | Existe | Datos locales de ejercicios (se ampliara o migrara a API)   |
| `SpacedRepetitionItemResponse` | Existe | Modelo SRS ya definido en `api.model.ts`                    |

---

## FASE 1 — Listening: Contexto Fonetico Previo al Dictado

### Objetivo

Antes de cada dictado, introducir una mini-leccion del sonido clave que aparece en las frases.

### Componente: `sound-intro-step.component.ts` (NUEVO)

Se inserta como primer paso dentro de `listening-exercise.ts`, antes de la fase de dictado.

### Flujo

```
┌─────────────────────────────────────┐
│  1. INTRO DEL SONIDO (nuevo)        │
│  - Nombre + simbolo IPA             │
│  - Que es (explicacion simple)      │
│  - Donde aparece (palabras comunes) │
│  - Por que suena asi (articulacion) │
│  - Error tipico del hispanohablante │
│  - Audio de ejemplo (TtsService)    │
├─────────────────────────────────────┤
│  2. RECONOCIMIENTO (nuevo)          │
│  - Pares minimos: "think vs sink"   │
│  - Escucha y marca el sonido        │
├─────────────────────────────────────┤
│  3. DICTADO (actual, mejorado)      │
│  - Frases contienen el sonido       │
│  - Feedback: si falla palabra con   │
│    sonido clave → re-explicar       │
└─────────────────────────────────────┘
```

### Datos: de donde viene el contenido

**Opcion A (MVP)**: Datos estaticos en `phonetic-content.data.ts` (nuevo archivo .data.ts).
**Opcion B (futuro)**: Migrar a API — `GET /api/phonetics/sounds/{level}`.

El contenido fonetico es relativamente estatico (los sonidos del ingles no cambian), asi que el MVP con datos locales es viable. Cuando se quiera personalizar por errores del usuario, se conecta con el backend.

### Modelo TypeScript

```typescript
// shared/models/phonetics.model.ts
export interface SoundLesson {
  id: string; // 'schwa', 'th-sounds', 'v-b'
  ipa: string[]; // ['/θ/', '/ð/']
  level: Level;
  unitIndex: number;
  title: string; // 'Los sonidos TH'
  explanation: {
    what: string; // Que es el sonido
    where: string; // Donde aparece
    why: string; // Por que suena asi (articulacion)
    commonMistake: string; // Error del hispanohablante
    selfTest: string; // Truco para verificar
  };
  examples: SoundExample[]; // Palabras con audio
  minimalPairs: MinimalPair[]; // Pares minimos
  dictationSentences: DictationItem[]; // Frases que contienen este sonido
}

export interface SoundExample {
  word: string;
  ipa: string;
  note: string; // "Voiceless — lengua entre dientes"
  highlightPosition: string; // 'initial' | 'middle' | 'final'
}

export interface MinimalPair {
  correct: { word: string; ipa: string };
  incorrect: { word: string; ipa: string };
}
```

### Sonidos por nivel

**A1** (10 unidades)

| #   | Sonido       | Que es                                                                            | Donde aparece                                                                | Error hispanohablante                                                                    |
| --- | ------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Schwa /ə/    | Vocal mas comun del ingles. Corta, relajada, "perezosa". No existe en espanol.    | Silabas NO acentuadas: **a**bout, **o**f, th**e**, fam**i**ly, ban**a**na    | Pronunciar todas las vocales "claras". En ingles las silabas sin acento se relajan a /ə/ |
| 2   | /θ/ vs /ð/   | Dos sonidos "th". Sordo (sin voz) y sonoro (con vibracion). Lengua entre dientes. | /θ/: **th**ink, **th**ree, bir**th**day. /ð/: **th**is, **th**e, wea**th**er | Sustituir por /t/, /d/ o /s/. "Tink" por "think", "de" por "the"                         |
| 3   | /v/ vs /b/   | /v/: dientes sobre labio inferior + vibracion. /b/: dos labios juntos.            | /v/: **v**ery, ha**v**e, lo**v**e. /b/: **b**ig, **b**ut, jo**b**            | En espanol /v/ = /b/. En ingles "very" ≠ "berry"                                         |
| 4   | /ɪ/ vs /iː/  | Vocal corta vs larga. Cambian significado.                                        | /ɪ/: sh**i**p, s**i**t. /iː/: sh**ee**p, s**ea**t                            | Pronunciar siempre la misma "i" espanola                                                 |
| 5   | /h/ aspirada | Soplo de aire desde la garganta. NO es la "j" espanola.                           | **H**ello, **h**ouse, **h**appy, be**h**ind                                  | Omitir ("ello") o pronunciar como "j" ("jello")                                          |
| 6   | Repaso 1-5   | Ejercicios mixtos de todos los sonidos anteriores                                 |                                                                              |                                                                                          |
| 7   | -ed endings  | Tres pronunciaciones: /t/ (walked), /d/ (played), /ɪd/ (wanted)                   | Todos los verbos regulares en pasado                                         | Pronunciar siempre "-ed" como silaba extra                                               |
| 8   | Letras mudas | Letras que se escriben pero NO se pronuncian                                      | **k**now, **w**rite, lis**t**en, **w**ednesday                               | Pronunciar todas las letras como en espanol                                              |
| 9   | /dʒ/ vs /j/  | /dʒ/: "ch" sonora (judge). /j/: "y" de "yo" (yes).                                | /dʒ/: **j**ust, **g**ym. /j/: **y**es, **y**ou                               | "yes" no suena como "jes"                                                                |
| 10  | /s/ vs /z/   | /s/: sordo. /z/: sonoro (vibra garganta).                                         | /s/: bu**s**, pri**c**e. /z/: bu**zz**, pri**z**e                            | En espanol no existe /z/                                                                 |

**A2** (10 unidades): /æ/ vs /ʌ/, /ɜːr/, /ŋ/ nasal, /w/ vs /v/, consonant clusters, repaso, vocales + /r/, /ʃ/ vs /tʃ/, weak forms, linking sounds.

**B1+** (8 unidades): Word stress, sentence stress, intonation, elision, assimilation, contracciones avanzadas, rhythm, minimal pairs avanzados.

### Ejemplo de pantalla: Intro del Schwa /ə/

```
┌──────────────────────────────────────────┐
│  Sonido del dia: Schwa /ə/              │
│                                          │
│  ¿Que es?                                │
│  El sonido mas comun del ingles. Vocal   │
│  corta, relajada, casi "perezosa".       │
│  Suena como un "uh" muy breve.           │
│                                          │
│  ¿Donde aparece?                         │
│  En TODAS las silabas sin acento:        │
│  [▶ about]  → /ə'baʊt/                  │
│  [▶ family] → /'fæm.ə.li/              │
│  [▶ banana] → /bə'næn.ə/ (2 schwas!)   │
│                                          │
│  ¿Por que suena asi?                     │
│  Solo las silabas acentuadas se dicen    │
│  "fuerte". Las demas se relajan a /ə/.   │
│                                          │
│  ⚠ Error tipico                          │
│  Pronunciar TODAS las vocales claras     │
│  como en espanol. "a-BOUT" con "a"       │
│  clara suena raro. Debe ser "uh-BOUT".   │
│                                          │
│  Truco: di "banana" rapido. Las "a"      │
│  que no acentuas → esas son schwas.      │
│                                          │
│              [ Siguiente → ]             │
└──────────────────────────────────────────┘
```

### Implementacion en Angular

```
src/app/features/dashboard/pages/session/exercises/
├── listening-exercise.ts          # Modificar: agregar fase "intro"
├── components/
│   ├── sound-intro-step.ts        # NUEVO: explicacion del sonido
│   └── sound-recognition-step.ts  # NUEVO: pares minimos
└── data/
    └── phonetic-content.data.ts   # NUEVO: contenido fonetico
```

**Cambios en `listening-exercise.ts`**:

- Signal `phase`: `'intro' | 'recognition' | 'dictation' | 'results'` (antes solo dictation/results)
- Renderiza `<app-sound-intro-step>` si `phase() === 'intro'`
- Al terminar intro → recognition → dictation

---

## FASE 2 — Pronunciation: Flujo Pedagogico de 4 Pasos

### Objetivo

Transformar la pantalla de "lista de ejemplos + quiz" a un flujo progresivo.

### Componente: refactor de `pronunciation-exercise.ts`

### Flujo (4 pasos)

```
PASO 1: EXPLICACION              PASO 2: DEMOSTRACION
┌────────────────────┐          ┌────────────────────┐
│ ¿Que es?           │          │ Pares minimos:     │
│ ¿Como se produce?  │          │ [▶ think] vs       │
│ Diagrama boca      │          │ [▶ sink]           │
│ Error hispano      │          │ ¿Notas diferencia? │
└────────┬───────────┘          └────────┬───────────┘
         ▼                               ▼
PASO 3: PRACTICA GUIADA         PASO 4: QUIZ
┌────────────────────┐          ┌────────────────────┐
│ Clasifica sonidos  │          │ Preguntas mixtas   │
│ Completa la frase  │          │ Score + refuerzo   │
│ Escucha y elige    │          │                    │
└────────┬───────────┘          └────────┬───────────┘
         ▼                               ▼
              RESULTADO + TIP REFUERZO
```

### Signal de estado

```typescript
phase = signal<'explanation' | 'demonstration' | 'practice' | 'quiz' | 'results'>('explanation');
```

### Subcomponentes nuevos

```
src/app/features/dashboard/pages/session/exercises/
├── pronunciation-exercise.ts       # Refactor: orquestar 4 fases
├── components/
│   ├── sound-explanation.ts        # Paso 1: teoria + articulacion
│   ├── sound-demonstration.ts      # Paso 2: pares minimos
│   ├── sound-guided-practice.ts    # Paso 3: clasificar + completar
│   └── sound-quiz.ts              # Paso 4: quiz final
```

### Tipos de ejercicio en practica guiada

```typescript
export interface ClassifyExercise {
  type: 'classify';
  word: string;
  options: string[]; // ['/θ/', '/ð/']
  answer: string;
}

export interface FillBlankExercise {
  type: 'fill_blank';
  sentence: string; // "I ___ it's going to rain."
  options: { text: string; ipa: string }[];
  answerIndex: number;
}

export interface ListenChooseExercise {
  type: 'listen_choose';
  word: string; // se reproduce con TTS
  options: string[]; // ['think', 'sink']
  answer: string;
}
```

### Contenido de ejemplo: /θ/ vs /ð/

```typescript
{
  id: 'th-sounds',
  ipa: ['/θ/', '/ð/'],
  level: 'a1',
  explanation: {
    what: 'Ingles tiene DOS sonidos de "th": /θ/ (sordo, solo aire) y /ð/ (sonoro, con vibracion).',
    howToProduce: 'Pon la punta de la lengua entre los dientes superiores e inferiores.',
    voiceless: 'Para /θ/: sopla aire. Mano en garganta → no vibra.',
    voiced: 'Para /ð/: misma posicion + activa la voz. Mano en garganta → vibra.',
    commonMistake: '/θ/ → /t/ o /s/: "think" suena "tink" o "sink". /ð/ → /d/: "this" suena "dis".',
    selfTest: 'Di "the" con mano en garganta. Si vibra → bien. Di "think" → no debe vibrar.'
  },
  minimalPairs: [
    { correct: { word: 'think', ipa: '/θɪŋk/' }, incorrect: { word: 'sink', ipa: '/sɪŋk/' } },
    { correct: { word: 'three', ipa: '/θriː/' }, incorrect: { word: 'tree', ipa: '/triː/' } },
    { correct: { word: 'then', ipa: '/ðen/' }, incorrect: { word: 'den', ipa: '/den/' } },
  ],
  practice: [
    { type: 'classify', word: 'think', options: ['/θ/ sordo', '/ð/ sonoro'], answer: '/θ/ sordo' },
    { type: 'classify', word: 'the', options: ['/θ/ sordo', '/ð/ sonoro'], answer: '/ð/ sonoro' },
    { type: 'classify', word: 'weather', options: ['/θ/ sordo', '/ð/ sonoro'], answer: '/ð/ sonoro' },
    { type: 'classify', word: 'birthday', options: ['/θ/ sordo', '/ð/ sonoro'], answer: '/θ/ sordo' },
    { type: 'fill_blank', sentence: 'I ___ it\'s going to rain.', options: [{ text: 'think', ipa: '/θ/' }, { text: 'sink', ipa: '/s/' }], answerIndex: 0 },
    { type: 'fill_blank', sentence: 'Is ___ your pen?', options: [{ text: 'this', ipa: '/ð/' }, { text: 'dis', ipa: '/d/' }], answerIndex: 0 },
  ],
  quiz: [
    { question: '¿Que sonido "th" tiene "weather"?', options: ['/θ/ (sordo)', '/ð/ (sonoro)'], answer: 1, explanation: '"weather" vibra → /ð/' },
    { question: '¿Que palabra has oido? [▶]', audio: 'think', options: ['think', 'sink'], answer: 0 },
    { question: '"There are three people." ¿Cuantos sonidos "th" distintos hay?', options: ['1', '2'], answer: 1, explanation: '"There" = /ð/, "three" = /θ/' },
  ]
}
```

---

## FASE 3 — Vocabulary: Pool Ampliado + Bloques Tematicos

### Problema actual

- `exercise-content.data.ts` tiene 10 palabras hardcoded por nivel, muestra 6
- Backend tiene tabla `vocab_entries` con campos: en, ipa, es, type, example, level
- Falta: campo `category`, campo `block`, mas contenido

### Solucion

**Backend**: Ampliar `vocab_entries` con `category` y `block` (ver `PLAN_MEJORAS_BACKEND.md`).
**Frontend**: Consumir `GET /api/vocab/level/{level}?block={n}` en vez de datos locales.

### Nuevo servicio: `VocabBlockService`

```typescript
// features/dashboard/services/vocab-block.service.ts
@Injectable({ providedIn: 'root' })
export class VocabBlockService {
  private readonly vocabApi = inject(VocabApiService);

  getBlockWords(level: Level, block: number): Observable<VocabEntryResponse[]> {
    return this.vocabApi.getByLevelAndBlock(level, block);
  }
}
```

### Nuevo endpoint necesario en frontend `VocabApiService`

```typescript
// Agregar a vocab-api.service.ts
getByLevelAndBlock(level: string, block: number): Observable<VocabEntryResponse[]> {
  return this.http.get<VocabEntryResponse[]>(
    `${this.baseUrl}/vocab/level/${level}`, { params: { block: block.toString() } }
  );
}
```

### Modelo de respuesta ampliado

```typescript
// Agregar a api.model.ts
export interface VocabEntryResponse {
  id: string;
  en: string;
  ipa: string;
  es: string;
  type: string;
  example: string;
  level: Level;
  category: string; // NUEVO: 'people', 'body', 'emotions', 'food'...
  block: number; // NUEVO: 1-10 (bloque tematico)
  blockTitle: string; // NUEVO: 'Yo y mi mundo', 'Mi casa'...
}
```

### Estructura de bloques A1 (200 palabras, 10 bloques de 20)

| Bloque | Tema               | Categorias                         |
| ------ | ------------------ | ---------------------------------- |
| 1      | Yo y mi mundo      | people, body, emotions, adjectives |
| 2      | Mi casa            | rooms, furniture, household        |
| 3      | Comida y bebida    | food, drinks, meals                |
| 4      | Rutina diaria      | time, actions, frequency           |
| 5      | La ciudad          | places, transport, directions      |
| 6      | Compras y dinero   | shops, prices, clothes             |
| 7      | Tiempo libre       | hobbies, sports, weekend           |
| 8      | Trabajo y escuela  | jobs, classroom, office            |
| 9      | Clima y naturaleza | weather, seasons, animals          |
| 10     | Comunicacion       | phone, internet, social            |

### Progresion por nivel

| Nivel | Palabras | Bloques | Palabras/bloque | Palabras/sesion |
| ----- | -------- | ------- | --------------- | --------------- |
| A1    | 200      | 10      | 20              | 10              |
| A2    | 300      | 15      | 20              | 10              |
| B1    | 400      | 16      | 25              | 12              |
| B2    | 300      | 12      | 25              | 12              |
| C1    | 200      | 10      | 20              | 10              |

### Sesion de vocabulario mejorada

```
ANTES:                          DESPUES:
6 palabras aleatorias           10 palabras del bloque actual
Sin contexto tematico           Titulo: "Bloque 3 — Comida y bebida"
1 ejemplo por palabra           Palabra agrupada por categoria
Quiz: solo escribir traduccion  Quiz variado: traduccion + completar + clasificar
```

### Cambios en `vocabulary-exercise.ts`

1. Obtener palabras del backend en vez de `VOCABULARY_WORDS` local
2. Signal `block` con el numero de bloque actual (viene de `ModuleProgress.currentUnit`)
3. Mostrar 10 palabras por sesion en vez de 6
4. Agrupar visualmente por categoria
5. Al completar → `POST /api/profiles/{id}/reviews` para cada palabra nueva (SRS)

---

## FASE 4 — SRS: Conectar con Backend Existente

### Estado actual del backend

El backend YA tiene el modulo `spacedrepetition` completo:

- `POST /api/profiles/{userId}/reviews` — Anadir item a cola de repaso
- `GET /api/profiles/{userId}/reviews/due` — Items pendientes hoy
- `PUT /api/profiles/{userId}/reviews/{itemId}/complete` — Marcar repaso completado
- `GET /api/profiles/{userId}/reviews/stats` — Estadisticas

Intervalos: `[1, 3, 7, 14, 30]` dias. Graduacion tras 5 repasos correctos.

El frontend YA tiene `ReviewApiService` con estos metodos.

### Lo que falta: conectar ejercicios con SRS

**1. Al completar vocabulario** → registrar cada palabra nueva en SRS

```typescript
// En vocabulary-exercise.ts, al terminar la sesion:
for (const word of newWords) {
  this.reviewApi.addToReviewQueue(profileId, 'vocabulary-word', word.en).subscribe();
}
```

**Nota**: El backend `AddToReviewQueueController` recibe `{ moduleName, level, unitIndex }`, no `{ itemType, itemId }`. Hay un **desalineamiento** entre frontend y backend:

|              | Frontend (ReviewApiService) | Backend (AddToReviewQueueController) |
| ------------ | --------------------------- | ------------------------------------ |
| Request body | `{ itemType, itemId }`      | `{ moduleName, level, unitIndex }`   |

**Accion requerida**: Alinear. El backend ya tiene `createForVocabulary(userId, word, level)` que usa `unitReference = "vocab-{word}"`. Se necesita un nuevo endpoint o adaptar el existente para aceptar tambien items de tipo vocabulario-palabra.

**2. Warmup con repasos pendientes**

```typescript
// En session.service.ts, al generar warmup:
const dueItems = await firstValueFrom(this.reviewApi.getDueReviews(profileId));
// Convertir dueItems en ejercicios de repaso (flashcard/quiz)
```

**3. Al completar pronunciacion** → registrar errores en SRS para refuerzo

```typescript
// Si el usuario falla en identificar /θ/ vs /ð/:
this.reviewApi.addToReviewQueue(profileId, 'pronunciation', 'th-sounds').subscribe();
```

### Nuevo componente: `review-exercise.ts`

Para el warmup con items del SRS:

```typescript
// features/dashboard/pages/session/exercises/review-exercise.ts
// Muestra flashcards/quiz rapido con items pendientes de repaso
// Al acertar → completeReview(quality: 5)
// Al fallar → completeReview(quality: 1) → se reprograma a intervalo 1
```

---

## FASE 5 — UX: Feedback Contextual + Dashboard de Progreso

### 5.1 Feedback contextual en dictado

Cuando el usuario falla una palabra que contiene el sonido de la leccion:

```
✗ I tink its a good idea
  Esperado: I think it's a good idea

  "tink" → "think"
  Recuerda: /θ/ se pronuncia con la lengua entre
  los dientes, no como /t/.
  [▶ Escuchar "think"]
```

**Implementacion**: En `listening-exercise.ts`, al comparar palabras, detectar si la palabra erronea contiene el sonido de la unidad actual. Si si → mostrar tip contextual + registrar `PronunciationError` en backend.

```typescript
// POST /api/profiles/{userId}/pronunciation/errors
{ word: 'think', expectedPhoneme: '/θ/', spokenPhoneme: '/t/' }
```

### 5.2 Dashboard de progreso

Nuevo componente en el dashboard que consume endpoints existentes:

```typescript
// Datos necesarios (endpoints YA existen):
const progress = await this.progressApi.getAllProgress(profileId); // ModuleProgressResponse[]
const reviewStats = await this.reviewApi.getReviewStats(profileId); // { totalItems, dueToday }
const streak = await this.activityApi.getStreak(profileId); // { currentStreak, bestStreak }
const xpLevel = await this.gamificationApi.getXpLevel(profileId); // XpLevelResponse
```

```
┌─ Mi progreso A1 ──────────────────┐
│                                    │
│ Listening     ████████░░ 8/10      │
│ Pronunciation ████░░░░░░ 4/10      │
│ Vocabulary    ██░░░░░░░░ 2/10      │
│ Grammar       ███░░░░░░░ 3/10      │
│ Phrases       █░░░░░░░░░ 1/8       │
│                                    │
│ Palabras en SRS: 34 (8 hoy)       │
│ Racha: 5 dias                      │
│ XP: 1,250 (Nivel 4)              │
└────────────────────────────────────┘
```

### 5.3 Pronunciacion por grabacion (futuro — requiere Web Speech Recognition)

```typescript
// Usar SpeechRecognition API del navegador
const recognition = new (window as any).SpeechRecognition();
recognition.lang = 'en-US';
recognition.onresult = (event) => {
  const spoken = event.results[0][0].transcript;
  // Si el usuario dijo "tink" en vez de "think" → feedback
};
```

**Nota**: Solo funciona en Chrome/Edge. Requiere feature detection.

---

## Resumen: Que se toca en cada fase

### Archivos a CREAR

| Fase | Archivo                                          | Descripcion                         |
| ---- | ------------------------------------------------ | ----------------------------------- |
| 1    | `exercises/data/phonetic-content.data.ts`        | Contenido fonetico por sonido/nivel |
| 1    | `exercises/components/sound-intro-step.ts`       | Componente intro sonido             |
| 1    | `exercises/components/sound-recognition-step.ts` | Componente pares minimos            |
| 1    | `shared/models/phonetics.model.ts`               | Interfaces TypeScript               |
| 2    | `exercises/components/sound-explanation.ts`      | Paso 1 pronunciacion                |
| 2    | `exercises/components/sound-demonstration.ts`    | Paso 2 pares minimos                |
| 2    | `exercises/components/sound-guided-practice.ts`  | Paso 3 practica                     |
| 2    | `exercises/components/sound-quiz.ts`             | Paso 4 quiz                         |
| 4    | `exercises/review-exercise.ts`                   | Ejercicio de repaso SRS             |
| 5    | `dashboard/components/progress-dashboard.ts`     | Dashboard progreso                  |

### Archivos a MODIFICAR

| Fase | Archivo                     | Cambio                                          |
| ---- | --------------------------- | ----------------------------------------------- |
| 1    | `listening-exercise.ts`     | Agregar fase intro antes de dictado             |
| 2    | `pronunciation-exercise.ts` | Refactor: 4 pasos en vez de learn/quiz          |
| 3    | `vocabulary-exercise.ts`    | Consumir API, 10 palabras, bloques              |
| 3    | `vocab-api.service.ts`      | Nuevo metodo `getByLevelAndBlock()`             |
| 3    | `api.model.ts`              | Ampliar `VocabEntryResponse` con category/block |
| 4    | `session.service.ts`        | Warmup con items SRS                            |
| 4    | `review-api.service.ts`     | Alinear request body con backend                |
| 5    | `listening-exercise.ts`     | Feedback contextual fonetico                    |

### Dependencias entre fases

```
FASE 1 (Listening intro) ─────────── sin dependencias backend
FASE 2 (Pronunciation 4 pasos) ──── sin dependencias backend
FASE 3 (Vocabulary ampliado) ─────── REQUIERE: backend migre vocab_entries (category, block)
FASE 4 (SRS conectado) ──────────── REQUIERE: alinear API front/back + backend vocab SRS
FASE 5 (Dashboard + feedback) ────── REQUIERE: fase 4 para stats SRS
```

### Prioridad y orden

| Orden | Fase                           | Dependencia backend          | Esfuerzo   |
| ----- | ------------------------------ | ---------------------------- | ---------- |
| 1     | Fase 1 — Intro fonetica        | No                           | Medio      |
| 2     | Fase 2 — Pronunciation 4 pasos | No                           | Alto       |
| 3     | Fase 3 — Vocabulario           | Si — migracion BD + endpoint | Medio-Alto |
| 4     | Fase 4 — SRS conectado         | Si — alinear API             | Alto       |
| 5     | Fase 5 — Dashboard + feedback  | Si — fase 4                  | Medio      |
