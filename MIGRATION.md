# Plan de Migración: english-trainer-web

Estado actual: Migración parcial desde vanilla JS (`untitled/english-app/`) a Angular 21.

## Resumen de Estado

### Ya Migrado
- Dashboard (module cards, stats, quick-start, sound of day, phrase roulette, motivation, current levels, gamification bar, weekly target)
- Level Test (intro, vocab, grammar, listening, pronunciation, results)
- Sessions (generación, bloques, modos short/full/extended, warmup, navegación)
- Speak Quiz (pronunciación con Web Speech API, level selector, feedback por palabra)
- Settings (tema, TTS rate, voice selection, export, reset, retake test)
- Gamification (XP, niveles, achievements, streaks)
- State Management (signals, localStorage, perfil, progreso por módulo, spaced repetition)
- Routing con guards (testCompleted/testNotCompleted)
- Shell/Layout con navegación inferior
- Modelos compartidos (learning.model.ts)
- Datos: modules, achievements, gamification, test-questions, phrase-bank, profile-types

### Pendiente de Migrar
- Flashcards (feature completa)
- Translator (feature completa)
- Mini-tests (evaluación bi-semanal)
- Vocab Data (1,209 entradas de vocabulario)
- Files Data (contenido de archivos markdown)
- Plan Data (plan de 16 semanas)
- Markdown Renderer (renderizado de contenido MD con audio)
- Integrator Sessions (sesiones cross-module cada 5 sesiones)
- PWA (Service Worker, manifest.json, iconos, offline)
- Keyboard Shortcuts (atajos de teclado globales)

---

## Fase 1: Datos Base

**Objetivo:** Migrar los datos que son dependencia de múltiples features.

### 1.1 Vocab Data
- **Origen:** `english-app/js/vocab-data.js` (8,469 líneas, 1,209 entradas)
- **Destino:** `src/app/shared/data/vocab.data.ts`
- **Tareas:**
  - Crear interfaz `VocabEntry` en `shared/models/learning.model.ts`: `{ en, ipa, es, type, ex }`
  - Migrar las 1,209 entradas tipadas como `VocabEntry[]`
  - Exportar como constante `VOCAB_DATA`

### 1.2 Files Data
- **Origen:** `english-app/js/files-data.js` (162 líneas)
- **Destino:** `src/app/shared/data/files.data.ts`
- **Tareas:**
  - Tipar el contenido y exportar como constante

### 1.3 Plan Data
- **Origen:** `english-app/js/plan-data.js` (600 líneas)
- **Destino:** `src/app/shared/data/plan.data.ts`
- **Tareas:**
  - Crear interfaces: `WeekPlan`, `DayPlan`, `PlanBlock`
  - Migrar las 16 semanas de plan con sus recursos (dictation videos, shadowing, milestones)
  - Exportar como constante `PLAN_DATA`

---

## Fase 2: Flashcards

**Objetivo:** Feature de tarjetas de vocabulario con pronunciación.

- **Origen:** `english-app/js/flashcards.js` (140 líneas)
- **Destino:** `src/app/features/flashcards/`

### 2.1 Estructura
```
features/flashcards/
├── flashcards.ts
├── flashcards.html
├── flashcards.scss
├── flashcards.spec.ts
├── flashcards.routes.ts
├── models/
│   └── flashcard.model.ts
└── services/
    ├── flashcard.service.ts
    └── flashcard.service.spec.ts
```

### 2.2 Tareas
- Crear modelo `Flashcard` (basado en `VocabEntry` + estado de la tarjeta)
- Crear `FlashcardService`: selección aleatoria, historial, navegación prev/next, tracking en StateService
- Crear componente `Flashcards`: tarjeta con flip, botón TTS, traducción oculta/visible
- Integrar con `TtsService` para pronunciación
- Integrar con `StateService.trackFlashcard()` para XP
- Añadir ruta lazy-loaded `/flashcards` con guard `testCompletedGuard`
- Añadir tab en Shell de navegación
- Soporte de teclado: flechas izq/der para navegar, espacio para mostrar traducción

---

## Fase 3: Translator

**Objetivo:** Traductor bidireccional ES/EN con TTS.

- **Origen:** `english-app/js/translator.js` (161 líneas)
- **Destino:** `src/app/features/translator/`

### 3.1 Estructura
```
features/translator/
├── translator.ts
├── translator.html
├── translator.scss
├── translator.spec.ts
└── translator.routes.ts
```

### 3.2 Tareas
- Crear componente `Translator`: textarea de entrada, toggle dirección (ES→EN / EN→ES), resultado, botón TTS
- Implementar lógica de traducción (decidir: API externa o búsqueda local en vocab-data)
- Integrar con `TtsService` para reproducir resultado
- Añadir ruta lazy-loaded `/translator` con guard
- Añadir tab en Shell o como acceso desde dashboard
- Atajo Ctrl+Enter para traducir

---

## Fase 4: Mini-Tests

**Objetivo:** Evaluación de progreso cada ~2 semanas (cada 8 unidades de listening).

- **Origen:** `english-app/js/mini-test.js` (684 líneas)
- **Destino:** `src/app/features/mini-test/`

### 4.1 Estructura
```
features/mini-test/
├── mini-test.ts
├── mini-test.html
├── mini-test.scss
├── mini-test.spec.ts
├── pages/
│   ├── mini-test-intro/
│   ├── mini-test-questions/
│   └── mini-test-results/
├── models/
│   └── mini-test.model.ts
├── services/
│   ├── mini-test.service.ts
│   └── mini-test.service.spec.ts
└── data/
    └── mini-test-questions.data.ts
```

### 4.2 Tareas
- Crear modelos: `MiniTestQuestion`, `MiniTestResult`, `SkillScore`
- Crear pools de preguntas adaptativas por nivel (A1-C1): 5 vocab + 5 grammar + 3 listening + 2 pronunciation
- Crear `MiniTestService`: control de flujo, cálculo de resultados, historial de scores
- Crear componentes de UI (intro, preguntas, resultados con gráfico de evolución)
- Integrar trigger en `SessionService` (cada 8 unidades de listening)
- Almacenar historial de mini-tests en `StateService` (para gráfico de evolución en dashboard)
- Ajustar velocidad TTS según resultados
- Añadir ruta `/mini-test`

---

## Fase 5: Integrator Sessions y Markdown

**Objetivo:** Sesiones temáticas cross-module y renderizado de contenido markdown.

### 5.1 Integrator Sessions
- **Origen:** `english-app/js/integrator-sessions.js` (76 líneas)
- **Tareas:**
  - Añadir lógica de sesiones integradoras en `SessionService` (cada 5ta sesión)
  - Crear datos de sesiones integradoras temáticas
  - Actualizar modelo `StudySession` si es necesario
  - Tracking de integradoras completadas en `StateService`

### 5.2 Markdown Renderer
- **Origen:** `english-app/js/markdown.js` (174 líneas)
- **Destino:** `src/app/shared/components/markdown-renderer/` o pipe

### Tareas
- Crear componente/pipe que convierta MD a HTML seguro
- Soportar: headers, tablas, bold, italics, code, links, blockquotes, listas
- Integrar botones de audio en tablas (play celda/fila/tabla)
- Conectar con `TtsService` para reproducción
- Conectar con `FILES_DATA` para lookup de contenido

---

## Fase 6: PWA y Polish

**Objetivo:** Soporte offline, instalación y atajos de teclado.

### 6.1 PWA
- **Tareas:**
  - Instalar `@angular/pwa` o configurar manualmente
  - Crear `manifest.webmanifest` (nombre, iconos, colores, display: standalone)
  - Migrar iconos (`icon-192.png`, `icon-512.png`) a `src/assets/icons/`
  - Configurar Service Worker con estrategia cache-first
  - Cachear: index, CSS, JS bundles, fuentes, datos estáticos
  - Verificar funcionamiento offline completo

### 6.2 Keyboard Shortcuts
- **Tareas:**
  - Crear directiva o servicio `KeyboardShortcutService`
  - Flashcards: ← → navegar, Espacio mostrar traducción
  - Translator: Ctrl+Enter traducir
  - Global: Escape para volver al dashboard

### 6.3 Polish General
- Verificar que todas las features están conectadas en la navegación (Shell)
- Revisar responsive en todos los componentes nuevos
- Añadir animaciones/transiciones donde existían en el original
- Verificar accesibilidad (ARIA, focus management, touch targets)

---

## Orden de Ejecución Recomendado

```
Fase 1 (Datos Base)          → Dependencia de Fases 2, 4, 5
  ├── 1.1 Vocab Data
  ├── 1.2 Files Data
  └── 1.3 Plan Data

Fase 2 (Flashcards)          → Depende de Fase 1.1 (vocab data)

Fase 3 (Translator)          → Independiente (o depende de 1.1 si usa búsqueda local)

Fase 4 (Mini-Tests)          → Depende de Fase 1.1

Fase 5 (Integrators + MD)    → Depende de Fases 1.2, 1.3

Fase 6 (PWA + Polish)        → Final, después de todas las features
```

## Estimación de Complejidad

| Fase | Archivos nuevos | Complejidad |
|------|----------------|-------------|
| 1. Datos Base | 3-5 | Baja (copiar + tipar) |
| 2. Flashcards | 6-8 | Media |
| 3. Translator | 4-5 | Media-Baja |
| 4. Mini-Tests | 8-10 | Alta |
| 5. Integrators + MD | 4-6 | Media |
| 6. PWA + Polish | 5-8 | Media |
