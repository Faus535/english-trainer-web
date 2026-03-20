# Migración: Dashboard (Panel Principal)

## Análisis del feature original

### Qué hace
Panel principal de la app. El usuario ve:
1. Barra de gamificación (XP, nivel, racha, logros)
2. Quick Start (iniciar sesión de estudio o retomar una pendiente)
3. Tarjetas de los 5 módulos con progreso por nivel CEFR (A1-C1)
4. Widgets (Sonido del Día, Frase Roulette)
5. Estadísticas (sesiones totales, esta semana, racha, nivel global)
6. Objetivo semanal (3-4 sesiones/semana)
7. Frase motivacional diaria

### Archivos origen (vanilla JS)
| Archivo | Responsabilidad |
|---------|----------------|
| `views.js` | Renderizado del dashboard: `renderDashboard()`, `renderQuickStart()`, `renderModuleCard()`, `updateProgressBar()`, charts |
| `state.js` | Persistencia localStorage: profile, progress, sessions, streaks, spaced repetition |
| `modules.js` | Configuración de 5 módulos (Listening, Vocabulary, Grammar, Phrases, Pronunciation) con unidades por nivel |
| `gamification.js` | XP, niveles (8), achievements (23), Sound of the Day, Phrase Roulette, toasts |
| `session.js` | Generación de sesiones (short/full/extended), bloques, warm-up |
| `app.js` | Navegación entre vistas, theme toggle, settings panel, event delegation |

### Modelo de datos

```typescript
// Niveles CEFR
type Level = 'a1' | 'a2' | 'b1' | 'b2' | 'c1';

// Módulos de aprendizaje
type ModuleName = 'listening' | 'vocabulary' | 'grammar' | 'phrases' | 'pronunciation';

// Unidad de un módulo
interface ModuleUnit {
  id: string;        // e.g. 'l-a1-01'
  title: string;
  desc: string;
  type: string;      // 'reduced-forms', 'dictation', 'activation', etc.
}

// Configuración de nivel de un módulo
interface ModuleLevelConfig {
  totalUnits: number;
  units: ModuleUnit[];
}

// Definición de un módulo
interface ModuleConfig {
  name: string;
  icon: string;
  weight: number;    // % del tiempo de sesión
  color: string;     // CSS variable
  levels: Record<Level, ModuleLevelConfig>;
}

// Progreso por módulo/nivel
interface ModuleProgress {
  currentUnit: number;
  completedUnits: number[];
  scores: Record<number, number>;
  reviewQueue?: ReviewItem[];
}

// Item de repaso espaciado
interface ReviewItem {
  unitId: string;
  nextReview: string;   // 'YYYY-MM-DD'
  interval: number;     // días
  reviews: number;      // veces repasado (gradúa a 5)
}

// Perfil del usuario
interface UserProfile {
  testCompleted: boolean;
  levels: Record<ModuleName, Level>;
  moduleProgress: Record<string, ModuleProgress>; // key: "module-level"
  sessionCount: number;
  sessionsThisWeek: number;
  weekStart: string | null;
}

// Sesión de estudio
interface StudySession {
  id: string;
  number: number;
  mode: 'short' | 'full' | 'extended';
  listening: UnitReference | null;
  pronunciation: UnitReference | null;
  secondary: UnitReference | null;
  secondaryModule: ModuleName;
  warmup: WarmupItem[];
  duration: number;       // minutos
  blocks: SessionBlock[];
}

interface UnitReference {
  module: ModuleName;
  level: Level;
  unitIndex: number;
  unit: ModuleUnit;
}

interface SessionBlock {
  type: 'warmup' | 'listening' | 'pronunciation' | 'secondary' | 'practice' | 'bonus';
  duration: number;
  label: string;
  unit?: UnitReference;
}

// Gamificación
interface GamificationLevel {
  name: string;     // 'Beginner' → 'Master'
  minXP: number;
}

interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

// Sonido del Día
interface SoundOfTheDay {
  sound: string;    // IPA: '/ə/'
  name: string;
  words: string[];
  tip: string;
}

// Frase Roulette
interface PhraseRoulette {
  en: string;
  es: string;
  hint: string;
}
```

### Datos estáticos
- **5 módulos** con ~56 unidades de Listening, ~46 de Vocabulary, ~42 de Grammar, ~34 de Phrases, ~41 de Pronunciation
- **8 niveles de gamificación**: Beginner → Master (0-7000 XP)
- **23 achievements**: sesiones, rachas, flashcards, niveles de módulos, globales
- **20 sonidos IPA** para Sound of the Day
- **18+ frases** para Phrase Roulette
- **10 frases motivacionales**

### Algoritmos clave
- **XP**: `(sessions × 50) + (flashcards × 5) + (levelUps × 200) + streakBonus`
- **Nivel global**: el MENOR nivel entre todos los módulos
- **Progreso de módulo**: % basado en unidades completadas vs totales (sumando niveles inferiores)
- **Repaso espaciado**: intervalos 1 → 3 → 7 → 14 → 30 días, gradúa a 5 repasos
- **Rotación secundaria**: vocab → grammar → phrases (basado en `sessionCount % 3`)
- **Racha**: días consecutivos con actividad registrada

---

## Fases de implementación en Angular

### Fase 1: Modelos y tipos
**Objetivo**: Definir todas las interfaces y types.

- [x] Crear `src/app/shared/models/learning.model.ts` con tipos compartidos (`Level`, `ModuleName`)
- [x] Crear `src/app/features/dashboard/models/gamification.model.ts` con tipos de XP, achievements
- [x] Crear `src/app/features/dashboard/models/session.model.ts` con tipos de sesión

### Fase 2: Datos estáticos
**Objetivo**: Migrar los bancos de datos (módulos, achievements, sounds, phrases, motivaciones).

- [x] Crear `src/app/features/dashboard/data/modules.data.ts` con la configuración de los 5 módulos y todas sus unidades
- [x] Crear `src/app/features/dashboard/data/gamification.data.ts` con niveles XP, sounds of the day, phrase roulette, motivaciones
- [x] Crear `src/app/features/dashboard/data/achievements.data.ts` con las definiciones de los 23 achievements

### Fase 3: Servicio de estado (StateService)
**Objetivo**: Servicio central de persistencia con localStorage, reemplazando `state.js`.

- [x] Crear `src/app/shared/services/state.service.ts` como servicio inyectable root
- [x] Implementar `loadState<T>(key, fallback): T` y `saveState(key, value): void` con prefix
- [x] Exponer signals: `profile`, `sessionsThisWeek`, `totalSessions`, `streak`, `bestStreak`
- [x] Implementar `getModuleLevel()`, `setModuleLevel()`, `getModuleProgress()`, `saveModuleProgress()`
- [x] Implementar `completeUnit()` con actualización de progreso + repaso espaciado
- [x] Implementar `checkLevelUp()` con auto-promoción
- [x] Implementar `recordSession()` con conteo semanal
- [x] Implementar `recordActivity()`, `getStreak()`, `getBestStreak()`
- [x] Implementar `getUnitsForReview()`, `completeReview()` (repaso espaciado)
- [x] Implementar `getOverallLevel()`, `getModuleCompletionPercent()`
- [x] Implementar `exportProgress()`, `resetProgress()`

### Fase 4: Servicio de gamificación
**Objetivo**: Encapsular XP, niveles y achievements.

- [x] Crear `src/app/features/dashboard/services/gamification.service.ts`
- [x] Implementar `xp` como computed signal
- [x] Implementar `level` como computed signal (nombre, progreso al siguiente)
- [x] Implementar `unlockedAchievements` como computed signal
- [x] Implementar `checkNewAchievements()` que detecta logros nuevos
- [x] Implementar `getSoundOfTheDay()` y `getRandomPhrase()`

### Fase 5: Servicio de sesiones
**Objetivo**: Generación y gestión de sesiones de estudio.

- [x] Crear `src/app/features/dashboard/services/session.service.ts`
- [x] Implementar `generateSession(mode)` con composición de bloques
- [x] Implementar `buildWarmup()` con repaso espaciado
- [x] Exponer `currentSession` como signal
- [x] Exponer `currentBlockIndex` como signal
- [x] Implementar `startSession()`, `resumeSession()`, `advanceBlock()`, `goBackBlock()`
- [x] Implementar `completeSession()` con marcaje de unidades + achievements
- [x] Persistir sesión activa en localStorage

### Fase 6: Layout principal (Shell)
**Objetivo**: Header, bottom navigation, settings panel, theme toggle.

- [x] Crear `src/app/layout/shell/shell.ts` (standalone, OnPush) — layout wrapper
- [x] Header con título, botón stop audio, theme toggle, settings
- [x] Bottom navigation con 5 tabs: Sesiones, Flashcards, Hablar, Traductor, Logros
- [x] Integrar router-outlet dentro del shell
- [x] Implementar theme toggle (dark/light) con CSS custom properties
- [x] Settings panel slide-out (velocidad TTS, selección de voz, export/reset)
- [x] Barra de progreso global (nivel + %)
- [x] SCSS responsive, mobile-first

### Fase 7: Componentes del Dashboard
**Objetivo**: Componentes individuales que componen el dashboard.

- [x] Crear `src/app/features/dashboard/components/gamification-bar/gamification-bar.ts` — XP, nivel, racha, logros count
- [x] Crear `src/app/features/dashboard/components/quick-start/quick-start.ts` — botones de sesión o retomar
- [x] Crear `src/app/features/dashboard/components/module-card/module-card.ts` — tarjeta de módulo con progreso
- [x] Crear `src/app/features/dashboard/components/stats-summary/stats-summary.ts` — sesiones, semana, racha, nivel
- [x] Crear `src/app/features/dashboard/components/weekly-target/weekly-target.ts` — objetivo semanal
- [x] Crear `src/app/features/dashboard/components/sound-of-day/sound-of-day.ts` — widget de sonido IPA
- [x] Crear `src/app/features/dashboard/components/phrase-roulette/phrase-roulette.ts` — widget de frases
- [x] Crear `src/app/features/dashboard/components/motivation/motivation.ts` — frase motivacional

### Fase 8: Página Dashboard
**Objetivo**: Página principal que orquesta todos los componentes.

- [x] Crear `src/app/features/dashboard/dashboard.ts` (standalone, OnPush) — página principal
- [x] Componer todos los componentes de la Fase 7
- [x] Conectar signals del StateService y GamificationService
- [x] Crear `src/app/features/dashboard/dashboard.routes.ts` con ruta lazy-loaded
- [x] Actualizar `app.routes.ts`: redirect raíz a `/dashboard`, mantener `/speak`

### Fase 9: Vista de Sesión
**Objetivo**: Pantalla de sesión de estudio con bloques navegables.

- [x] Crear `src/app/features/dashboard/pages/session/session.ts` — vista de sesión activa
- [x] Renderizar bloque actual con tipo específico (warmup, listening, pronunciation, etc.)
- [x] Barra de progreso de sesión (bloques completados)
- [x] Navegación entre bloques (siguiente, anterior, click en completados)
- [x] Botón completar bloque / completar sesión
- [x] Integrar TtsService para reproducción de contenido
- [x] Toast de XP al completar sesión

### Fase 10: Vista de Achievements
**Objetivo**: Página de logros y estadísticas.

- [x] Crear `src/app/features/dashboard/pages/achievements/achievements.ts` — página de logros
- [x] Grid de achievement cards (locked/unlocked)
- [x] Stats summary: XP, nivel, racha, mejor racha, sesiones, flashcards
- [x] Barra de progreso del nivel actual
- [x] Ruta en dashboard.routes.ts

### Fase 11: Tests
**Objetivo**: Cubrir lógica crítica con tests unitarios.

- [x] Tests de `StateService`: load/save, profile, module progress, streaks, spaced repetition
- [x] Tests de `GamificationService`: XP calculation, level determination, achievements
- [x] Tests de `SessionService`: session generation, block composition, secondary rotation
- [x] Tests de `DashboardComponent`: renderizado, componentes hijos presentes
- [x] Tests de `ModuleCardComponent`: progreso, nivel, next unit
- [x] Tests de `QuickStartComponent`: con/sin sesión pendiente, modos de sesión

---

## Dependencias
- Reutiliza `TtsService` de la migración 01-speak
- Reutiliza `Level` type (mover a shared si no está ya)
- No requiere librerías externas

## Notas técnicas
- El `StateService` es compartido (root) — otros features lo usarán
- Los módulos de datos son muy grandes (~300 unidades en total) — separar en archivos por módulo si es necesario
- El theme toggle requiere CSS custom properties en `:root` y `.light-theme`
- El layout (shell) envuelve toda la app, no solo el dashboard
- Las sesiones son auto-contenidas: cada bloque tiene su tipo y contenido
- Los achievements usan funciones `check()` que dependen del estado actual — en Angular serán computed signals
