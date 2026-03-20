# Migración: Speak (Hablar)

## Análisis del feature original

### Qué hace
Módulo de práctica de pronunciación en inglés. El usuario:
1. Selecciona nivel (A1-C1)
2. Escucha una frase en inglés (Text-to-Speech)
3. La repite en voz alta (Speech Recognition)
4. Recibe feedback con puntuación (%) y análisis palabra por palabra
5. Puede ver la traducción al español
6. Practica las palabras fallidas individualmente
7. Navega entre frases (anterior/siguiente con historial)

### Archivos origen (vanilla JS)
| Archivo | Responsabilidad |
|---------|----------------|
| `speak-quiz.js` | Banco de frases por nivel, navegación, renderizado UI |
| `speech-recognition.js` | Web Speech Recognition API, comparación de textos, scoring |
| `tts.js` | Web Speech Synthesis API, selección de voz, velocidad |
| `utils.js` | `cleanForSpeech()`, `escapeHtml()` |
| `state.js` | Perfil del usuario, nivel guardado |
| `styles.css` | Clases `.speak-quiz-*` y `.pron-*` (~480 líneas) |

### APIs del navegador utilizadas
- **Web Speech Synthesis** (TTS) — soporte universal
- **Web Speech Recognition** — Chrome, Edge, Safari (iOS 14.5+). NO Firefox

### Modelo de datos

```typescript
// Frase
interface Phrase {
  en: string;  // Frase en inglés
  es: string;  // Traducción al español
}

// Resultado de reconocimiento
interface PronunciationResult {
  transcript: string;       // Lo que dijo el usuario
  confidence: number;       // 0-1
  expected: string;         // Frase esperada
  score: number;            // 0-100 porcentaje de acierto
  words: WordResult[];      // Análisis por palabra
  error?: string;           // Error si falló
}

interface WordResult {
  word: string;
  correct: boolean;
}
```

### Banco de frases
- A1: 15 frases (saludos, necesidades básicas)
- A2: 15 frases (preguntas, pasado)
- B1: 15 frases (condicionales, expresiones)
- B2: 10 frases (estructuras complejas, modismos)
- C1: 8 frases (lenguaje formal, retórica)

### Algoritmo de matching
1. Normalizar texto (lowercase, quitar puntuación excepto apóstrofes)
2. Dividir en palabras
3. Comparar palabra por palabra con tolerancia de ±1 carácter (solo para palabras >3 chars)
4. Calcular porcentaje de coincidencia

### Feedback según score
| Score | Mensaje | Color |
|-------|---------|-------|
| ≥90% | Excelente | Verde |
| ≥70% | Muy bien | Verde |
| ≥50% | Casi | Amarillo |
| <50% | Inténtalo de nuevo | Rojo |

---

## Fases de implementación en Angular

### Fase 1: Modelos e infraestructura
**Objetivo**: Definir tipos, interfaces y datos estáticos.

- [x] Crear estructura de carpetas del feature `src/app/features/speak/`
- [x] Crear modelo `speak.model.ts` con interfaces `Phrase`, `PronunciationResult`, `WordResult`
- [x] Crear tipo `Level` como union type `'a1' | 'a2' | 'b1' | 'b2' | 'c1'`
- [x] Crear archivo de datos `phrase-bank.data.ts` con todas las frases por nivel
- [x] Crear `pronunciation-feedback.util.ts` con la función de feedback según score

### Fase 2: Servicio de Text-to-Speech
**Objetivo**: Encapsular Web Speech Synthesis API en un servicio Angular.

- [x] Crear `tts.service.ts` como servicio inyectable
- [x] Implementar `speak(text: string): void` usando `SpeechSynthesisUtterance`
- [x] Implementar `stop(): void`
- [x] Implementar selección de voz inglesa (priorizar voces "natural/premium")
- [x] Exponer `rate` como signal configurable (default 0.8)
- [x] Exponer `speaking` como signal de estado
- [x] Implementar workaround de iOS Safari (resume cada 10s)

### Fase 3: Servicio de Speech Recognition
**Objetivo**: Encapsular Web Speech Recognition API en un servicio Angular.

- [x] Crear `speech-recognition.service.ts` como servicio inyectable
- [x] Exponer `supported` como signal (`boolean`) — detección de compatibilidad
- [x] Exponer `state` como signal (`'idle' | 'recording' | 'processing' | 'result'`)
- [x] Implementar `startRecording(expected: string): void`
- [x] Implementar `stopRecording(): void`
- [x] Exponer `result` como signal (`PronunciationResult | null`)
- [x] Implementar `compareTexts()` y `wordsMatch()` como funciones puras
- [x] Implementar auto-timeout de 15 segundos
- [x] Manejar errores: `no-speech`, `not-allowed`, `aborted`

### Fase 4: Componente de nivel selector
**Objetivo**: Componente reutilizable para seleccionar nivel A1-C1.

- [x] Crear `level-selector.ts` (standalone, OnPush)
- [x] Input: `level` (signal input con el nivel actual)
- [x] Output: `levelChange` (emite nuevo nivel)
- [x] Template: 5 botones con estilo activo/inactivo
- [x] Estilos SCSS con variables CSS del tema

### Fase 5: Componente de botón de grabación + resultado
**Objetivo**: Componente que maneja grabar, comprobar y mostrar resultado.

- [x] Crear `pronunciation-check.ts` (standalone, OnPush)
- [x] Input: `phrase` (la frase esperada)
- [x] Inyectar `SpeechRecognitionService`
- [x] Botón grabar con animación de pulso cuando está grabando
- [x] Mostrar resultado: score, palabras correctas/incorrectas, transcripción
- [x] Sección de práctica de palabras fallidas (escuchar + repetir cada una)
- [x] Estilos: colores verde/rojo para palabras, animación de grabación

### Fase 6: Componente principal SpeakPage
**Objetivo**: Página completa que orquesta todo el flujo.

- [x] Crear `speak.ts` (standalone, OnPush) — página principal
- [x] Signal interno `currentPhrase` con la frase actual
- [x] Signal interno `history` con el historial de frases navegadas
- [x] Signal interno `historyIndex` para navegación anterior/siguiente
- [x] Signal interno `translationRevealed` para mostrar/ocultar traducción
- [x] Signal interno `currentLevel` con el nivel seleccionado
- [x] Computed `canGoPrev`
- [x] Método `nextPhrase()`: seleccionar frase aleatoria del banco
- [x] Método `prevPhrase()`: navegar historial
- [x] Método `revealTranslation()`: mostrar traducción
- [x] Sección "Escucha": botón play que usa TtsService
- [x] Sección "Repite": integrar `PronunciationCheckComponent`
- [x] Sección "Comprueba": mostrar palabras clicables (cada una reproduce TTS al clic)
- [x] Sección "Traducción": mostrar/ocultar con botón
- [x] Navegación anterior/siguiente
- [x] Estilos: card layout, max-width 500px, responsive

### Fase 7: Ruta y navegación
**Objetivo**: Integrar la página en el routing de la app.

- [x] Crear `speak.routes.ts` con ruta lazy-loaded
- [x] Registrar en `app.routes.ts` como `{ path: 'speak', loadChildren: ... }`
- [x] Redirigir ruta raíz a `/speak`

### Fase 8: Tests
**Objetivo**: Cubrir lógica crítica con tests.

- [x] Test unitario de `compareTexts()` y `wordsMatch()` (funciones puras)
- [x] Test unitario de `getPronunciationFeedback()`
- [x] Test de `SpeakComponent`: renderizado inicial, navegación, unsupported state
- [x] Test de `LevelSelectorComponent`: selección de nivel, botones activos

---

## Dependencias externas
Ninguna librería externa necesaria. Solo APIs nativas del navegador.

## Notas técnicas
- Firefox no soporta Web Speech Recognition — mostrar mensaje informativo
- iOS Safari necesita workaround de `speechSynthesis.resume()` cada 10s
- Las funciones de matching (`compareTexts`, `wordsMatch`) son puras y fácilmente testeables
- El banco de frases es estático, se puede extraer a un JSON si en el futuro viene de API
