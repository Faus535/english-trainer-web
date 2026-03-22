# English Trainer Web - Roadmap

## Estado Actual

La web cuenta con las siguientes funcionalidades implementadas:

- Auth (login, registro, Google Sign-In, JWT con refresh)
- Level Test (5 tipos: grammar, vocabulary, listening, pronunciation, resultados)
- Dashboard (modulos, stats, sound of day, phrase roulette, gamificacion)
- Speak (practica de pronunciacion con Web Speech API)
- AI Tutor (conversaciones por voz, feedback en tiempo real, historial) - Fases 1-4
- Sessions (generacion y ejecucion de sesiones de aprendizaje)
- Achievements (logros desbloqueados)
- Settings (tema, TTS, export, reset)
- PWA con soporte offline
- Responsive (mobile bottom nav + desktop sidebar)

---

## Fase 1 - Gestion de Cuenta

**Objetivo**: Dar al usuario control sobre su cuenta desde la web.

- [x] Pagina de perfil (`/profile`) con datos del usuario
- [x] Cambio de contrasena (formulario: contrasena actual + nueva + confirmar)
- [x] Editar nombre/avatar
- [x] Eliminar cuenta (con confirmacion y consecuencias claras)
- [x] Indicador de tipo de cuenta (local vs Google) - deshabilitar cambio de contrasena si es Google

---

## Fase 2 - Recuperacion de Contrasena

**Objetivo**: Flujo "olvide mi contrasena" desde login. (Requiere Fase 2 del API)

- [x] Enlace "He olvidado mi contrasena" en pagina de login
- [x] Pagina `/auth/forgot-password` - formulario con email
- [x] Pagina `/auth/reset-password` - formulario con nueva contrasena (recibe token por URL)
- [x] Mensajes de confirmacion y error claros
- [x] Redireccion a login tras reset exitoso

---

## Fase 3 - Tutor IA: Fase 5 (Avanzado)

**Objetivo**: Completar las funcionalidades pendientes del tutor.

- [x] Streaming de respuestas (SSE) - mostrar texto progresivamente mientras la IA responde
- [x] Estadisticas de conversacion (errores frecuentes, vocabulario aprendido, progreso)
- [x] Sugerencia de temas basada en historial y debilidades
- [x] Visualizacion de metricas por conversacion (precision, vocabulario, etc.)
- [x] Compartir conversacion (exportar como texto/imagen)

---

## Fase 4 - Modulos de Reading y Writing

**Objetivo**: Nuevas secciones de aprendizaje. (Requiere Fase 4 del API)

### Reading (`/reading`)

- [x] Lista de textos por nivel con filtros
- [x] Vista de lectura con vocabulario interactivo (tap para ver definicion)
- [x] Preguntas de comprension tras leer
- [x] Resultados y feedback
- [x] Boton "anadir a repaso" para vocabulario nuevo

### Writing (`/writing`)

- [x] Lista de ejercicios/prompts por nivel
- [x] Editor de texto con contador de palabras
- [x] Envio para evaluacion por IA
- [x] Vista de feedback detallado (correcciones inline, sugerencias)
- [x] Historial de ejercicios con puntuaciones

---

## Fase 5 - Analytics y Progreso Visual

**Objetivo**: Dashboard de progreso detallado. (Requiere Fase 5 del API)

- [x] Pagina `/analytics` con graficas de progreso
- [x] Grafica de evolucion de nivel por modulo (linea temporal)
- [x] Mapa de calor de actividad (estilo GitHub contributions)
- [x] Resumen semanal/mensual (sesiones, tiempo, XP, precision)
- [x] Areas debiles destacadas con sugerencias de practica
- [x] Comparativa con semanas anteriores

---

## Fase 6 - Notificaciones Push

**Objetivo**: Recordatorios para mantener la constancia. (Requiere Fase 6 del API)

- [x] Pedir permiso de notificaciones push (Web Push API)
- [x] Recordatorio diario si no ha practicado
- [x] Alerta de racha en peligro
- [x] Notificacion de items pendientes en repaso espaciado
- [x] Configuracion de notificaciones en Settings (activar/desactivar, horario)

---

## Fase 7 - Mejoras de UX

**Objetivo**: Pulir la experiencia de usuario.

- [x] Onboarding guiado para nuevos usuarios (tour interactivo)
- [x] Animaciones y transiciones (logros desbloqueados, subida de nivel, racha)
- [x] Skeleton loaders en vez de spinners
- [x] Accesibilidad: ARIA labels completos, navegacion por teclado, contraste
- [x] Internacionalizacion (i18n) - interfaz en espanol e ingles
- [x] Modo focus/zen para sesiones de estudio sin distracciones

---

## Fase 8 - Testing y Calidad

**Objetivo**: Cobertura de tests robusta.

- [x] E2E tests con Playwright (config ya existe, tests pendientes)
  - [x] Flujo de registro + level test + dashboard
  - [x] Flujo de sesion completa
  - [x] Flujo de conversacion con tutor
  - [x] Flujo de speak
- [x] Aumentar cobertura de unit tests (objetivo: >80%)
- [x] Tests de accesibilidad automatizados (axe-core)
- [x] Visual regression tests (Chromatic o similar)
- [x] CI pipeline con tests obligatorios antes de merge

---

## Fase 9 - Admin Panel

**Objetivo**: Interfaz web para gestionar contenido. (Requiere Fase 7 del API)

- [x] Ruta `/admin` protegida por rol
- [x] CRUD de vocabulario
- [x] CRUD de frases
- [x] CRUD de textos de reading
- [x] CRUD de ejercicios de writing
- [x] Dashboard con metricas de uso (usuarios activos, sesiones, etc.)
