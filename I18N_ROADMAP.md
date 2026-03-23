# Internacionalizacion (i18n) - Roadmap

## Estado Actual

La app tiene un `I18nService` basico con ~20 claves traducidas (nav + common), pero **toda la interfaz esta hardcodeada en espanol**. Se estiman **+400 strings** que necesitan externalizarse.

---

## Fase 1 - Infraestructura i18n

**Objetivo**: Preparar el sistema de traducciones para escalar.

- [ ] Mover traducciones de `I18nService` a archivos JSON separados (`assets/i18n/es.json`, `assets/i18n/en.json`)
- [ ] Crear pipe `TranslatePipe` (`{{ 'key' | t }}`) para usar en templates
- [ ] Crear directiva o helper para interpolacion con variables (`{{ 'greeting' | t:{name: 'Juan'} }}`)
- [ ] Persistir idioma seleccionado en `localStorage` (ya existe)
- [ ] Detectar idioma del navegador como fallback si no hay preferencia guardada
- [ ] Actualizar `I18nService` para cargar JSON bajo demanda (lazy-load por idioma)

---

## Fase 2 - Layout y Navegacion

**Objetivo**: Traducir la shell, nav y componentes globales.

- [ ] `shell.html` - aria-labels: "Navegacion principal", "English Trainer - Ir al dashboard", "Detener audio"
- [ ] `shell.ts` - labels de tabs: "Sesiones", "Hablar", "Tutor", "Mejorar", "Perfil"
- [ ] `app.routes.ts` - titles de todas las rutas (20+)
- [ ] `connection-status` - mensajes de online/offline
- [ ] `toast` - textos de notificaciones del sistema

---

## Fase 3 - Autenticacion

**Objetivo**: Login, registro, recuperacion de contrasena.

### Templates (~40 strings)

- [ ] `login.html` - titulos, subtitulos, labels, errores, botones, divider, links
- [ ] `register.html` - titulos, labels, errores, botones, links
- [ ] `forgot-password.html` - titulos, mensaje de exito, errores, botones
- [ ] `reset-password.html` - titulos, labels, errores, botones

### TypeScript (~10 strings)

- [ ] `login.ts` - mensajes de error de Google auth
- [ ] `register.ts` - mensajes de error
- [ ] `forgot-password.ts` - mensaje de error
- [ ] `reset-password.ts` - mensajes de error

---

## Fase 4 - Dashboard

**Objetivo**: Pagina principal con todos sus componentes.

### Templates (~50 strings)

- [ ] `dashboard.html` - banner de test de nivel
- [ ] `quick-start.html` - "Sesion en curso", "Tu sesion de hoy", modos (Completa/Corta/Larga), botones
- [ ] `stats-summary.html` - "Sesiones", "Esta semana", "Racha", "Objetivo"
- [ ] `current-levels.html` - "Tu nivel"
- [ ] `weekly-target.html` - mensajes de objetivo semanal
- [ ] `sound-of-day.html` - "Sonido del Dia"
- [ ] `phrase-roulette.html` - "Frase Roulette", "Ver significado", "Otra frase"
- [ ] `module-card.html` - "Completado"
- [ ] `gamification-bar.html` - "racha", "XP para"
- [ ] `motivation.html` - frases motivacionales

### Data files (~200+ strings) - MAYOR ESFUERZO

- [ ] `modules.data.ts` - nombres de modulos, titulos y descripciones de todas las unidades (5 modulos x 5 niveles x ~20 unidades)
- [ ] `achievements.data.ts` - nombres y descripciones de ~22 logros
- [ ] `gamification.data.ts` - sonidos del dia (~20 tips), frase roulette (~20 frases+traducciones), motivaciones (~15 frases)

---

## Fase 5 - Perfil y Ajustes

**Objetivo**: Pagina de perfil hub y configuracion.

### Templates (~40 strings)

- [ ] `profile.html` - header, menu items (Logros, Progreso, Notificaciones, Ajustes), seccion cuenta (labels, botones, errores), zona peligrosa, logout
- [ ] `settings.html` - titulos de seccion (Apariencia, Audio, Idioma, Modo de estudio, Zona peligrosa), labels, botones

### TypeScript (~10 strings)

- [ ] `profile.ts` - notificaciones de exito/error, labels del menu
- [ ] `settings.ts` - mensajes de confirmacion

---

## Fase 6 - Test de Nivel

**Objetivo**: Flujo completo del test inicial.

### Templates (~30 strings)

- [ ] `test-intro.html` - bienvenida, descripcion de los 4 tests, boton empezar, seccion "Ya se mi nivel"
- [ ] `test-grammar.html` - instrucciones, progreso
- [ ] `test-vocab.html` - instrucciones, progreso
- [ ] `test-listening.html` - instrucciones, progreso
- [ ] `test-pronunciation.html` - instrucciones, progreso
- [ ] `test-results.html` - resultados, niveles, botones

### TypeScript + Data (~30 strings)

- [ ] `test-intro.ts` - steps (Vocabulario, Gramatica, Listening, Pronunciacion) con descripciones
- [ ] `level-test.service.ts` - labels de progreso
- [ ] `profile-types.data.ts` - tipos de perfil y mensajes detallados

---

## Fase 7 - Tutor IA

**Objetivo**: Conversacion con IA y componentes relacionados.

### Templates (~25 strings)

- [ ] `tutor-page.html` - resumen, stats, skeleton labels, mensaje vacio, error
- [ ] `start-screen.html` - titulo, subtitulo, labels de selectores, boton
- [ ] `conversation-stats.html` - labels de metricas
- [ ] `conversation-header.html` - labels
- [ ] `topic-suggestions.html` - titulo, aria-labels
- [ ] `chat-bubble.html` - labels de feedback

### TypeScript (~15 strings)

- [ ] `tutor.model.ts` - TUTOR_TOPICS labels (6 temas)
- [ ] `conversation-state.service.ts` - mensajes de error (3)
- [ ] `tutor-page.ts` - mensajes de error/exito (6)

---

## Fase 8 - Speak (Pronunciacion)

**Objetivo**: Practica de pronunciacion con Web Speech API.

### Templates (~15 strings)

- [ ] `speak.html` - pasos (1. Escucha, 2. Repite, 3. Comprueba), botones, mensajes de soporte

### Data (~100+ strings) - ESFUERZO MEDIO

- [ ] `phrase-bank.data.ts` - traducciones al espanol de todas las frases de practica (solo se necesita mover las traducciones, las frases en ingles se mantienen)

---

## Fase 9 - Reading y Writing

**Objetivo**: Modulos de lectura y escritura.

### Templates (~35 strings)

- [ ] `reading-list.html` - titulo, filtros, loading, empty state, meta labels
- [ ] `reading-detail.html` - loading, links, boton quiz
- [ ] `reading-quiz.html` - loading, resultado, botones navegacion
- [ ] `writing-list.html` - titulo, filtros, loading, empty state, historial link
- [ ] `writing-exercise.html` - loading, feedback, correcciones, sugerencias, editor placeholder
- [ ] `writing-history.html` - titulo, loading, empty state

### TypeScript (~6 strings)

- [ ] Mensajes de error en servicios de reading y writing

---

## Fase 10 - Analytics y Notificaciones

**Objetivo**: Progreso visual y alertas push.

### Templates (~30 strings)

- [ ] `analytics.html` - titulo, stats (Sesiones, Tiempo, XP, Precision, Racha), secciones
- [ ] `level-chart.html` - labels de ejes
- [ ] `activity-heatmap.html` - "dias activos", "Menos"/"Mas"
- [ ] `weak-areas.html` - labels
- [ ] `notification-settings.html` - titulo, notices, labels de toggles, hints, time picker

---

## Fase 11 - Admin Panel

**Objetivo**: Panel de administracion completo.

### Templates (~50 strings)

- [ ] `admin-dashboard.html` - titulo, stats, labels de contenido
- [ ] `admin-vocab.html` - titulo, formulario (7 labels), tabla (headers), botones CRUD
- [ ] `admin-phrases.html` - titulo, formulario (3 labels), tabla, botones
- [ ] `admin-reading.html` - titulo, formulario (5 labels), tabla, botones
- [ ] `admin-writing.html` - titulo, formulario (5 labels), tabla, botones

### TypeScript (~6 strings)

- [ ] Notificaciones CRUD: "Actualizado", "Creado", "Eliminado", "Error", "Eliminar?"

---

## Fase 12 - UX Components

**Objetivo**: Componentes compartidos reutilizables.

- [ ] `onboarding.html` - 6 pasos (titulo + descripcion cada uno), botones (Anterior, Siguiente, Empezar, Saltar tour)
- [ ] `achievement-popup.html` - textos dinamicos (ya usan inputs, solo aria-labels)
- [ ] `form-error` - mensajes genericos

---

## Resumen de Esfuerzo

| Fase                 | Strings estimados | Esfuerzo     | Dependencias                      |
| -------------------- | ----------------- | ------------ | --------------------------------- |
| 1. Infraestructura   | 0 (setup)         | Alto         | Ninguna                           |
| 2. Layout/Nav        | ~15               | Bajo         | Fase 1                            |
| 3. Auth              | ~50               | Medio        | Fase 1                            |
| 4. Dashboard         | ~250+             | **Muy alto** | Fase 1 (data files son el grueso) |
| 5. Perfil/Ajustes    | ~50               | Medio        | Fase 1                            |
| 6. Test de Nivel     | ~60               | Medio        | Fase 1                            |
| 7. Tutor IA          | ~40               | Medio        | Fase 1                            |
| 8. Speak             | ~115+             | Alto         | Fase 1 (phrase bank)              |
| 9. Reading/Writing   | ~40               | Medio        | Fase 1                            |
| 10. Analytics/Notifs | ~30               | Bajo         | Fase 1                            |
| 11. Admin            | ~55               | Medio        | Fase 1                            |
| 12. UX Components    | ~20               | Bajo         | Fase 1                            |

**Total estimado: ~725 strings**

### Prioridad sugerida

1. **Fase 1** (infraestructura) - sin esto nada funciona
2. **Fase 2-3** (nav + auth) - primera impresion del usuario
3. **Fase 5** (perfil/ajustes) - donde se cambia el idioma
4. **Fases 6-10** (features) - en cualquier orden
5. **Fase 4** (dashboard data) - mayor volumen, puede hacerse incremental
6. **Fase 11-12** (admin + UX) - menor prioridad
