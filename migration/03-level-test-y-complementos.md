# Migración: Test de Nivel + Complementos del Dashboard

## Análisis del feature original

### 1. Test de Nivel (level-test.js)

#### Qué hace
Test obligatorio en el primer uso. Clasifica al usuario en niveles CEFR (A1-C1) por módulo para crear un plan personalizado. Opción de saltar el test seleccionando nivel manualmente.

#### Flujo UI
1. **Intro**: Bienvenida + preview de las 4 secciones + opción "Ya sé mi nivel" (skip)
2. **Vocabulario**: 20 preguntas — traducir palabra español → inglés (input libre)
3. **Gramática**: 15 preguntas — elegir opción correcta (multiple choice)
4. **Listening**: 10 preguntas — escuchar frase TTS y escribir lo que se oye (dictado)
5. **Pronunciación**: 8 preguntas — escuchar y elegir opción correcta (multiple choice con audio)
6. **Resultados**: Perfil tipo, niveles por módulo, plan personalizado, estimación de sesiones

#### Banco de preguntas

```typescript
// Vocabulario: 20 palabras (4 por nivel A1-C1)
interface VocabQuestion {
  es: string;           // Palabra en español
  answer: string;       // Respuesta correcta en inglés
  alts?: string[];      // Alternativas aceptadas
  level: Level;
}

// Gramática: 15 frases (3 por nivel, 2 en C1)
interface GrammarQuestion {
  sentence: string;     // Frase con hueco ___
  options: string[];    // 4 opciones
  answer: number;       // Índice correcto (0-3)
  level: Level;
}

// Listening: 10 frases (2 por nivel)
interface ListeningQuestion {
  text: string;         // Frase que se reproduce por TTS
  level: Level;
  speed: number;        // Velocidad TTS (0.8 A1 → 1.2 C1)
}

// Pronunciación: 8 preguntas (2 por nivel hasta B2)
interface PronunciationQuestion {
  word: string;         // Palabra o frase a reproducir
  options: string[];    // 3 opciones
  answer: number;       // Índice correcto
  level: Level;
  special?: 'syllables' | 'words' | 'stress'; // Tipo especial de pregunta
}
```

#### Algoritmo de scoring
- Agrupar respuestas por nivel
- Nivel asignado = el más alto donde ≥50% acierto
- Si falla <50% en un nivel, se detiene ahí
- **Frases** = `min(vocabulary, grammar)` (no tiene test directo)

#### Tipos de perfil
| Condición | ID | Label |
|-----------|-----|-------|
| ReadAvg ≥ B1 y Listen ≤ A2 | `avanzado_pasivo` | Avanzado Pasivo |
| ReadAvg ≥ A2 y Listen ≤ A2 | `reactivador` | Reactivador |
| ReadAvg ≥ A2+ | `intermedio` | Intermedio |
| Resto | `basico` | Básico+ |

#### Estimación de sesiones
`remaining_levels × 16 ± 8` (basado en nivel de listening como bottleneck)

#### Skip test
Todos los módulos se ponen al nivel seleccionado manualmente. Se marca `testSkipped: true`.

---

### 2. Elementos faltantes del Dashboard

#### 2a. Gamification Bar en el dashboard
- **Estado actual**: Se eliminó del dashboard y se integró como chips en QuickStart (racha + XP)
- **Faltante**: La barra de progreso de XP al siguiente nivel NO está visible. El count de achievements tampoco.
- **Acción**: Valorar si añadir una sección de nivel/XP más visible o dejarlo en QuickStart.

#### 2b. Test Results Summary (niveles actuales del usuario)
- **Original**: Muestra los 5 módulos con su nivel actual en una grid
- **Angular**: NO existe. El usuario no puede ver sus niveles excepto en las module cards.
- **Acción**: Añadir sección "Tu nivel" al dashboard que muestre los 5 niveles.

#### 2c. Mini-test prompt
- **Original**: Cuando se han completado ~8 unidades de listening, aparece un aviso de mini-test disponible
- **Angular**: NO existe. El mini-test completo se migrará en otro `.md`.
- **Acción**: Preparar la lógica de "shouldTriggerMiniTest" para cuando se implemente.

#### 2d. Settings panel
- **Original**: Panel deslizante con velocidad TTS, selección de voz, export, retake test, reset
- **Angular**: NO existe.
- **Acción**: Implementar como página `/settings` accesible desde el header.

---

## Fases de implementación en Angular

### Fase 1: Modelos y datos del test
**Objetivo**: Definir tipos e importar el banco de preguntas.

- [x] Crear `src/app/features/level-test/models/level-test.model.ts` con interfaces `VocabQuestion`, `GrammarQuestion`, `ListeningQuestion`, `PronunciationQuestion`, `TestPhase`, `TestState`, `ProfileType`
- [x] Crear `src/app/features/level-test/data/test-questions.data.ts` con las 53 preguntas (20 vocab + 15 grammar + 10 listening + 8 pronunciation)
- [x] Crear `src/app/features/level-test/data/profile-types.data.ts` con mensajes por perfil y lógica de estimación

### Fase 2: Servicio del test
**Objetivo**: Lógica de estado, scoring y persistencia.

- [x] Crear `src/app/features/level-test/services/level-test.service.ts`
- [x] Signal `phase` con tipo `TestPhase` ('intro' | 'vocabulary' | 'grammar' | 'listening' | 'pronunciation' | 'results')
- [x] Signal `currentQuestion` (número)
- [x] Signals `vocabAnswers`, `grammarAnswers`, `listeningAnswers`, `pronunciationAnswers` (arrays)
- [x] Implementar `startTest()` que resetea estado
- [x] Implementar `submitVocabAnswer(input: string)` con matching case-insensitive + alternativas
- [x] Implementar `submitGrammarAnswer(optionIndex: number)`
- [x] Implementar `submitListeningAnswer(input: string)` con word-matching ≥60%
- [x] Implementar `submitPronunciationAnswer(optionIndex: number)`
- [x] Implementar `skipQuestion()` para cada fase
- [x] Implementar `calculateResults()` que asigna niveles al perfil via StateService
- [x] Implementar `skipTestWithLevel(level: Level)` que pone todos los módulos al nivel elegido
- [x] Implementar `calculateLevel(answers)` — highest level ≥50% correct
- [x] Implementar `getProfileType(levels)` — clasificación del perfil
- [x] Implementar `estimateSessions(levels)` — estimación hasta C1
- [x] Computed signals: `progress`, `totalQuestions`, `currentPhaseLabel`

### Fase 3: Componente Intro
**Objetivo**: Pantalla de bienvenida con preview y opción de skip.

- [x] Crear `src/app/features/level-test/pages/test-intro/test-intro.ts` (standalone, OnPush)
- [x] Preview de las 4 secciones con números 1-4
- [x] Botón "Empezar Test"
- [x] Separador "o"
- [x] Sección "Ya sé mi nivel" con 5 botones A1-C1 (con descripción: Principiante, Básico, Intermedio, etc.)

### Fase 4: Componente Vocabulario
**Objetivo**: 20 preguntas de traducción ES → EN.

- [x] Crear `src/app/features/level-test/pages/test-vocab/test-vocab.ts`
- [x] Badge de fase + progreso (X/20)
- [x] Barra de progreso animada
- [x] Mostrar palabra en español
- [x] Input de texto (autocomplete off, spellcheck off)
- [x] Botón "Siguiente" + "No lo sé" (skip)
- [x] Submit on Enter key

### Fase 5: Componente Gramática
**Objetivo**: 15 preguntas multiple choice.

- [x] Crear `src/app/features/level-test/pages/test-grammar/test-grammar.ts`
- [x] Badge + progreso (X/15)
- [x] Mostrar frase con hueco `___`
- [x] 4 botones de opción
- [x] Click en opción → submits automáticamente y avanza

### Fase 6: Componente Listening
**Objetivo**: 10 preguntas de dictado con TTS.

- [x] Crear `src/app/features/level-test/pages/test-listening/test-listening.ts`
- [x] Badge + progreso (X/10)
- [x] Botón "Reproducir audio" que usa TtsService con la velocidad de la pregunta
- [x] Botón "Repetir"
- [x] Input de texto para escribir lo escuchado
- [x] Botones "Siguiente" + "No lo entiendo" (skip)

### Fase 7: Componente Pronunciación
**Objetivo**: 8 preguntas de discriminación auditiva.

- [x] Crear `src/app/features/level-test/pages/test-pronunciation/test-pronunciation.ts`
- [x] Badge + progreso (X/8)
- [x] Botón "Reproducir" que reproduce la palabra/frase
- [x] Instrucción dinámica según `special` (syllables/words/stress)
- [x] 3 botones de opción
- [x] Click en opción → submits y avanza

### Fase 8: Componente Resultados
**Objetivo**: Mostrar perfil, niveles, plan personalizado.

- [x] Crear `src/app/features/level-test/pages/test-results/test-results.ts`
- [x] Tipo de perfil (label + mensaje personalizado)
- [x] Grid de 5 módulos con su nivel asignado
- [x] Preview del plan: enfoque en listening, sesiones estimadas, frecuencia recomendada
- [x] Botón "Empezar a aprender" que navega al dashboard

### Fase 9: Página orquestadora y routing
**Objetivo**: Página principal que renderiza la fase actual del test.

- [x] Crear `src/app/features/level-test/level-test.ts` — página principal con `@switch` por fase
- [x] Crear `src/app/features/level-test/level-test.routes.ts`
- [x] Añadir ruta `/level-test` en `app.routes.ts`
- [x] Crear guard `testCompletedGuard` que redirige a `/level-test` si `profile.testCompleted === false`
- [x] Aplicar guard a rutas `/dashboard`, `/speak`, `/achievements`, `/session`
- [x] En la ruta `/level-test`, guard inverso: si `testCompleted === true`, redirige a `/dashboard`

### Fase 10: Settings (Ajustes)
**Objetivo**: Página de configuración accesible desde el header.

- [x] Crear `src/app/features/settings/settings.ts` (standalone, OnPush)
- [x] Slider de velocidad TTS (0.3x - 1.5x) conectado a `TtsService.setRate()`
- [x] Selector de voz (dropdown con voces inglesas disponibles) conectado a `TtsService`
- [x] Botón "Exportar progreso" que descarga JSON
- [x] Botón "Repetir test de nivel" que resetea `testCompleted` y navega a `/level-test`
- [x] Botón "Resetear todo" con confirmación
- [x] Crear ruta `/settings` en `app.routes.ts`
- [x] Añadir icono de settings en el shell header

### Fase 11: Dashboard — niveles actuales
**Objetivo**: Mostrar los niveles del usuario en el dashboard.

- [x] Crear `src/app/features/dashboard/components/current-levels/current-levels.ts`
- [x] Grid de 5 módulos con nivel y color del módulo
- [x] Solo se muestra si `testCompleted === true`
- [x] Integrar en `dashboard.html` después de los stats

### Fase 12: Tests unitarios
**Objetivo**: Cubrir lógica del test de nivel y settings.

- [x] Tests de `LevelTestService`: scoring por nivel, profile type, skip, word-matching listening
- [x] Tests de `calculateLevel()`: ≥50% threshold, stop on failure
- [x] Tests de `getProfileType()`: los 4 perfiles
- [x] Tests de `estimateSessions()`: cálculo correcto
- [x] Tests del componente `LevelTest`: renderizado por fase, navegación
- [x] Tests del guard: redirección según `testCompleted`

---

## Dependencias
- Reutiliza `TtsService` para listening y pronunciación
- Reutiliza `StateService` para guardar perfil con niveles
- Reutiliza `Level`, `ModuleName`, `CEFR_LEVELS` del shared model
- No requiere librerías externas

## Notas técnicas
- El guard de test completado es **crítico** — sin él, el usuario llega al dashboard sin niveles y las sesiones no se generan correctamente
- El test de listening necesita TTS, que no funciona en todos los navegadores (mostrar fallback)
- El word-matching del listening usa threshold de 60% — es la misma lógica que `compareTexts` del speak pero simplificada
- La velocidad TTS del test varía por nivel (0.8 para A1, 1.2 para C1) — se restaura al valor original después
- El skip del test pone TODOS los módulos al mismo nivel — es menos preciso pero respeta la elección del usuario
