# Features de Alto Valor - Roadmap Web

## Feature 1 - Repaso Espaciado (Pantalla dedicada)

**Impacto**: La feature que mas retiene usuarios. La API ya tiene el algoritmo completo.

**Objetivo**: Pantalla `/review` donde el usuario practica sus flashcards pendientes con el sistema de repaso espaciado.

### Fase 1.1 - Pantalla de repaso

- [ ] Pagina `/review` con contador de items pendientes
- [ ] Tarjeta de flashcard con flip animation (front: ingles, back: traduccion + ejemplo)
- [ ] Botones de calidad de respuesta (Facil / Bien / Dificil / No lo se)
- [ ] Barra de progreso (X de Y items hoy)
- [ ] Mensaje de "todo repasado" cuando no quedan items

### Fase 1.2 - Integracion con dashboard

- [ ] Badge en el dashboard mostrando items pendientes de repaso
- [ ] Widget "Repaso del dia" en dashboard con acceso directo
- [ ] Agregar al nav de "Mejorar" como tercera opcion junto a Reading y Writing

### Fase 1.3 - Anadir items desde cualquier sitio

- [ ] Boton "Anadir a repaso" en resultados del tutor (ya parcial)
- [ ] Boton "Anadir a repaso" en vocabulario de reading
- [ ] Boton "Anadir a repaso" en correcciones de writing
- [ ] Toast de confirmacion al anadir

**API necesaria**: Ya existe (`GET /reviews/due`, `PUT /reviews/{id}/complete`, `POST /reviews/queue`). Solo falta conectar.

---

## Feature 2 - Feedback Visual de Pronunciacion

**Impacto**: El usuario ve exactamente donde falla al pronunciar.

**Objetivo**: Mostrar comparacion visual entre la frase objetivo y lo que el usuario dijo, con palabras correctas/incorrectas resaltadas.

### Fase 2.1 - Comparacion palabra a palabra

- [ ] Algoritmo de diff entre frase objetivo y transcripcion del usuario
- [ ] Resaltado de palabras: verde (correcto), rojo (incorrecto), amarillo (parcial)
- [ ] Puntuacion de precision por frase (% de palabras correctas)
- [ ] Mostrar la palabra esperada debajo de cada error

### Fase 2.2 - Metricas de pronunciacion

- [ ] Score acumulado por sesion de speak
- [ ] Palabras mas falladas (persistir en localStorage)
- [ ] Sugerencia de repetir las palabras dificiles al final

### Fase 2.3 - Practica de palabras dificiles

- [ ] Lista de "mis palabras dificiles" basada en errores frecuentes
- [ ] Modo drill: repetir solo las palabras falladas
- [ ] Boton "Escuchar pronunciacion correcta" por palabra

**API necesaria**: Fase 2.1-2.2 solo frontend. Fase 2.3 necesita API para persistir errores.

---

## Feature 3 - Sesiones Adaptativas

**Impacto**: Las sesiones se personalizan segun debilidades reales.

**Objetivo**: La generacion de sesiones prioriza los modulos donde el usuario tiene menor rendimiento.

### Fase 3.1 - Calculo de debilidades (web)

- [ ] Calcular puntuacion por modulo basada en: nivel actual, errores en tutor, score en sesiones previas
- [ ] Enviar pesos de modulos al generar sesion
- [ ] Mostrar al usuario por que se eligieron esos bloques ("Priorizamos grammar porque...")

### Fase 3.2 - Generacion ponderada (API)

- [ ] Endpoint acepta pesos por modulo en la request de generar sesion
- [ ] Algoritmo de generacion usa pesos para distribuir bloques
- [ ] Mantener variedad minima (nunca eliminar un modulo completamente)

### Fase 3.3 - Feedback post-sesion

- [ ] Pantalla de resumen al completar sesion con metricas por bloque
- [ ] "Areas que mejoraste" vs "Areas a seguir practicando"
- [ ] Sugerencia de siguiente sesion

**API necesaria**: Fase 3.2 requiere modificar `GenerateSessionUseCase`.

---

## Feature 4 - Gamificacion Activa (Rachas + Recompensas)

**Impacto**: Aumenta la retencion diaria con urgencia y recompensas.

**Objetivo**: Sistema de rachas con alertas, animaciones de nivel, y desbloqueo de contenido.

### Fase 4.1 - Racha con urgencia

- [ ] Banner en dashboard: "Racha de X dias! Practica hoy para no perderla"
- [ ] Contador regresivo visual (horas restantes para mantener racha)
- [ ] Animacion de celebracion al extender la racha
- [ ] Usar el `AchievementPopup` existente al desbloquear logros

### Fase 4.2 - Subida de nivel

- [ ] Animacion fullscreen al subir de nivel XP (usar `AchievementPopup` con type="levelup")
- [ ] Animacion al subir de nivel CEFR en un modulo (ej: "Grammar: A1 -> A2!")
- [ ] Sonido opcional de celebracion

### Fase 4.3 - Desbloqueo de contenido

- [ ] Temas del tutor bloqueados por nivel (ej: "Entrevista de trabajo" requiere B1+)
- [ ] Badge visual en temas bloqueados con nivel requerido
- [ ] Animacion de desbloqueo cuando subes de nivel

### Fase 4.4 - Retos diarios (API)

- [ ] Reto diario aleatorio (ej: "Completa 3 flashcards", "Habla 2 minutos con el tutor")
- [ ] Progreso del reto visible en dashboard
- [ ] XP bonus al completar reto diario

**API necesaria**: Fase 4.4 requiere nuevo modulo de retos diarios.

---

## Feature 5 - Historial de Errores del Tutor

**Impacto**: Convierte conversaciones pasadas en aprendizaje medible y repetible.

**Objetivo**: Vista "Mis errores" que agrupa errores de grammar, vocabulario y pronunciacion del tutor.

### Fase 5.1 - Vista de errores agrupados

- [ ] Pagina `/tutor/errors` accesible desde perfil del tutor
- [ ] Tabs: Grammar | Vocabulario | Pronunciacion
- [ ] Lista de errores con: frase original, correccion, regla/explicacion, fecha
- [ ] Contador de veces que se ha cometido cada error

### Fase 5.2 - Ejercicios de refuerzo

- [ ] Boton "Practicar este error" que genera un mini-ejercicio
- [ ] Grammar: fill-the-gap con la regla correcta
- [ ] Vocabulario: flashcard con la palabra y contexto
- [ ] Pronunciacion: repetir la palabra/frase con feedback

### Fase 5.3 - Metricas de mejora

- [ ] Grafica de errores por semana (deberian ir bajando)
- [ ] "Errores corregidos" vs "Errores recurrentes"
- [ ] Integracion con analytics

**API necesaria**: Fase 5.1 necesita endpoint de errores agregados. Fase 5.2-5.3 tambien.

---

## Feature 6 - Mini-juegos Rapidos (2 minutos)

**Impacto**: Baja la barrera de entrada. "No tengo tiempo" ya no es excusa.

**Objetivo**: Juegos de 2 minutos accesibles desde dashboard para practica rapida.

### Fase 6.1 - Word Match

- [ ] Juego de emparejar palabra en ingles con traduccion (drag or tap)
- [ ] 10 palabras, timer de 60 segundos
- [ ] Puntuacion y XP al completar
- [ ] Palabras adaptadas al nivel del usuario

### Fase 6.2 - Fill the Gap

- [ ] Frase con hueco, elegir la palabra correcta de 4 opciones
- [ ] 8 frases, feedback inmediato (verde/rojo)
- [ ] Mezcla de grammar y vocabulario
- [ ] Nivel adaptativo

### Fase 6.3 - Unscramble

- [ ] Palabras desordenadas, ordenar letras o palabras de una frase
- [ ] Timer visual
- [ ] Progresion de dificultad dentro del juego

### Fase 6.4 - Hub de mini-juegos

- [ ] Seccion "Practica rapida" en dashboard con los 3 juegos
- [ ] Estadisticas por juego (mejor puntuacion, veces jugado)
- [ ] XP por juego completado

**API necesaria**: Fase 6.1-6.3 necesitan endpoints para obtener palabras/frases por nivel. Fase 6.4 necesita persistir puntuaciones.

---

## Feature 7 - Pares Minimos de Pronunciacion

**Impacto**: Ataca el problema #1 de pronunciacion para hispanohablantes.

**Objetivo**: Ejercicios dedicados a distinguir y pronunciar sonidos que no existen en espanol.

### Fase 7.1 - Ejercicio de escucha

- [ ] Pantalla con par minimo (ej: "ship" vs "sheep")
- [ ] Reproducir uno de los dos, el usuario elige cual escucho
- [ ] 10 pares por sesion, feedback inmediato
- [ ] Audio TTS con velocidad reducida para cada opcion

### Fase 7.2 - Ejercicio de produccion

- [ ] Mostrar palabra objetivo (ej: "ship")
- [ ] El usuario la pronuncia con Web Speech API
- [ ] Comparar si dijo "ship" o "sheep" (reconocimiento)
- [ ] Feedback visual de acierto/fallo

### Fase 7.3 - Banco de pares minimos

- [ ] Pares organizados por sonido: /ɪ/ vs /iː/, /v/ vs /b/, /θ/ vs /t/, /ð/ vs /d/, /æ/ vs /ʌ/, /ʃ/ vs /tʃ/
- [ ] Progresion: empezar por los mas problematicos para hispanohablantes
- [ ] Tracking de precision por par

### Fase 7.4 - Integracion

- [ ] Accesible desde "Mejorar" y desde el modulo Speak
- [ ] Resultados se reflejan en analytics de pronunciacion
- [ ] XP al completar sesiones

**API necesaria**: Necesita endpoint para obtener pares minimos por nivel/sonido y persistir resultados.

---

## Feature 8 - Vocabulario en Contexto

**Impacto**: Aprender palabras en frases reales es 3x mas efectivo que traduccion directa.

**Objetivo**: Cada palabra viene con 2-3 frases de ejemplo reales, audio, y la palabra resaltada en contexto.

### Fase 8.1 - Vista enriquecida de vocabulario

- [ ] Al tocar una palabra (en reading, tutor, o repaso), mostrar popup con:
  - Traduccion
  - IPA + boton de audio
  - 2-3 frases de ejemplo con la palabra resaltada
  - Nivel de la palabra
- [ ] Boton "Anadir a repaso" en el popup

### Fase 8.2 - Ejercicios contextuales

- [ ] En flashcards de repaso, mostrar frase con hueco en vez de solo la palabra
- [ ] El usuario debe recordar la palabra que falta del contexto
- [ ] Modo "solo traduccion" vs "en contexto" seleccionable

### Fase 8.3 - Frases de ejemplo por IA

- [ ] Al anadir palabra a repaso, generar automaticamente 2 frases de ejemplo con IA
- [ ] Frases adaptadas al nivel del usuario
- [ ] Cachear frases para no regenerar

**API necesaria**: Fase 8.1 puede usar datos existentes. Fase 8.3 necesita endpoint de generacion de ejemplos con IA.

---

## Resumen de Dependencias API

| Feature                   | Solo Web       | Necesita API nueva | Necesita modificar API |
| ------------------------- | -------------- | ------------------ | ---------------------- |
| 1. Repaso espaciado       | Fases 1.1-1.3  | -                  | - (ya existe)          |
| 2. Feedback pronunciacion | Fases 2.1-2.2  | Fase 2.3           | -                      |
| 3. Sesiones adaptativas   | Fases 3.1, 3.3 | -                  | Fase 3.2               |
| 4. Gamificacion activa    | Fases 4.1-4.3  | Fase 4.4           | -                      |
| 5. Errores del tutor      | -              | Fases 5.1-5.3      | -                      |
| 6. Mini-juegos            | -              | Fases 6.1-6.4      | -                      |
| 7. Pares minimos          | Fases 7.1-7.2  | Fases 7.3-7.4      | -                      |
| 8. Vocabulario contexto   | Fase 8.1       | Fase 8.3           | Fase 8.2               |

## Orden de Implementacion Sugerido

1. **Feature 1** (Repaso espaciado) - API ya lista, solo web
2. **Feature 4** (Gamificacion activa) - mayormente web, alto impacto en retencion
3. **Feature 2** (Feedback pronunciacion) - solo web, mejora feature existente
4. **Feature 5** (Errores tutor) - necesita API, convierte datos existentes en valor
5. **Feature 6** (Mini-juegos) - necesita API, engancha usuarios casuales
6. **Feature 7** (Pares minimos) - complementa speak, nicho hispanohablante
7. **Feature 3** (Sesiones adaptativas) - modifica API existente, requiere datos previos
8. **Feature 8** (Vocabulario contexto) - IA para ejemplos, mejora incremental
