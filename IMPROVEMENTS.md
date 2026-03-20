# Plan de Mejoras: english-trainer-web

Analisis realizado: 2026-03-20

---

## Fase 1: Calidad de Codigo y Tooling

**Prioridad:** Alta
**Impacto:** Previene deuda tecnica y bugs futuros

### 1.1 Configurar ESLint

- No hay linter configurado, solo Prettier (formato)
- Instalar `angular-eslint` para reglas especificas de Angular
- Reglas recomendadas: no-unused-vars, prefer-readonly, no-any, standalone components
- Integrar en script `npm run lint`

### 1.2 Entornos de Build (environment)

- Solo existe un `environment.ts` con `localhost:8081` hardcodeado
- Crear `environment.ts` (dev) y `environment.prod.ts` (produccion)
- Configurar `fileReplacements` en `angular.json` para el build de produccion
- Esto es **bloqueante** para cualquier despliegue real

### 1.3 Cobertura de Tests

- Tests existentes: ~8 archivos de ~30+ componentes/servicios
- **Sin tests:**
  - `AuthService` (critico: login, registro, refresh token)
  - `OfflineQueueService` (critico: persistencia offline)
  - Interceptors (`auth.interceptor`, `error.interceptor`)
  - Componentes de dashboard (10 componentes sin tests individuales)
  - `LevelTestService`
  - `SpeechRecognitionService`, `TtsService`
- Objetivo minimo: cubrir core services y guards al 80%

---

## Fase 2: Seguridad

**Prioridad:** Alta
**Impacto:** Protege datos del usuario

### 2.1 Almacenamiento de Tokens

- El token JWT se guarda en `localStorage` en texto plano
- `localStorage` es vulnerable a XSS (cualquier script inyectado puede leer el token)
- **Solucion:** Migrar a `httpOnly cookies` gestionadas por el backend, o al menos usar `sessionStorage` + cifrado basico
- Revisar que el `refreshToken` no se exponga innecesariamente

### 2.2 Sanitizacion de Datos

- Verificar que las respuestas de la API no se inyectan directamente en el DOM
- Especialmente relevante para el futuro Markdown Renderer (Fase 5 de MIGRATION.md)
- Angular sanitiza por defecto, pero confirmar que no se usa `bypassSecurityTrust*` sin necesidad

---

## Fase 3: Manejo de Errores y UX

**Prioridad:** Media-Alta
**Impacto:** Mejora la experiencia del usuario

### 3.1 Notificacion de Errores al Usuario

- El `errorInterceptor` solo hace `console.error` - el usuario no ve nada
- Crear un `NotificationService` con signals:
  ```
  shared/services/notification.service.ts
  shared/components/toast/toast.ts
  ```
- Mostrar toasts para: errores de red, errores de API, acciones exitosas
- Tipos: success, error, warning, info

### 3.2 Estado de Carga Global

- Los componentes manejan `loading` individualmente con `signal(false)`
- Considerar un `LoadingService` centralizado o al menos un patron consistente
- Mostrar skeleton loaders en vez de spinners genericos

### 3.3 Manejo de Errores en Formularios

- Login y Register manejan errores localmente, pero de forma inconsistente
- Estandarizar mensajes de error de validacion
- Crear componente reutilizable `FormError` para mensajes de campo

### 3.4 Retry Strategy en OfflineQueueService

- Cuando falla el flush de la cola offline, se ignora silenciosamente
- Implementar retry con backoff exponencial
- Limitar numero maximo de reintentos por request
- Notificar al usuario cuando hay requests fallidos permanentemente

---

## Fase 4: Rendimiento

**Prioridad:** Media
**Impacto:** Mejora tiempos de carga y fluidez

### 4.1 Preloading Strategy

- No hay estrategia de precarga de rutas configurada
- Implementar `PreloadAllModules` o una estrategia custom que precargue rutas probables
- Dashboard es la ruta principal; precargar `speak` y `session` que son las mas usadas

### 4.2 Optimizacion de Imagenes y Assets

- Los iconos PWA (72x72 a 512x512) estan como PNG
- Considerar formato WebP para reducir tamano
- Verificar que los iconos tienen `purpose: "any maskable"` (actualmente solo `maskable`)

### 4.3 Bundle Size

- El budget actual es 500kB warning / 1MB error (inicial)
- Revisar periodicamente con `ng build --stats-json` + `webpack-bundle-analyzer` (o equivalente esbuild)
- Verificar que no se importan modulos completos cuando solo se usa una parte (tree-shaking)

### 4.4 Virtual Scrolling

- Si la lista de vocabulario crece (1,209+ entries), considerar `@angular/cdk/scrolling` para listas largas
- Aplica tambien a la futura feature de Flashcards

---

## Fase 5: Accesibilidad (a11y)

**Prioridad:** Media
**Impacto:** Inclusividad, cumplimiento de estandares

### 5.1 Auditoria ARIA

- Verificar que todos los botones interactivos tienen `aria-label` descriptivo
- Los iconos de lucide-angular necesitan `aria-hidden="true"` si son decorativos
- La navegacion inferior (Shell) necesita `role="navigation"` y `aria-current="page"`

### 5.2 Gestion de Focus

- Al navegar entre rutas, el focus deberia moverse al contenido principal
- En los modales/dialogos del Level Test, gestionar focus trap
- En sesiones de estudio, los bloques deberian ser navegables con teclado

### 5.3 Contraste de Colores

- El tema oscuro usa colores sobre fondo zinc; verificar ratio de contraste WCAG AA (4.5:1)
- Especialmente los textos secundarios (`--text-muted`) y los estados disabled

---

## Fase 6: Arquitectura y Mantenibilidad

**Prioridad:** Media-Baja
**Impacto:** Facilita el desarrollo futuro

### 6.1 StateService es demasiado grande

- `state.service.ts` tiene ~484 lineas y maneja: perfil, progreso, modulos, streaks, actividad, spaced repetition, sincronizacion
- Considerar dividir en servicios mas enfocados:
  - `ProfileStateService` (perfil, niveles)
  - `ProgressStateService` (progreso por modulo, unidades)
  - `ActivityStateService` (streaks, actividad diaria)
  - `ReviewStateService` (spaced repetition)
- Mantener una fachada `StateService` si se necesita acceso unificado

### 6.2 Tipado Estricto de API Responses

- Los modelos en `api.model.ts` son interfaces (no validadas en runtime)
- Considerar usar Zod o validacion manual para respuestas criticas del backend
- Al menos validar que los campos requeridos existen antes de usarlos

### 6.3 Patron de Feature Services

- `SessionService` (243 lineas) y `LevelTestService` mezclan logica de negocio con gestion de estado
- Separar la generacion de contenido (puro) de la gestion de estado (signals)
- Esto facilita los tests unitarios (funciones puras son mas faciles de testear)

---

## Fase 7: Infraestructura y CI/CD

**Prioridad:** Baja (pero necesaria antes de produccion)
**Impacto:** Automatizacion y confianza en despliegues

### 7.1 Pipeline CI/CD

- No hay configuracion de CI/CD (ni GitHub Actions, ni GitLab CI, ni similar)
- Configurar pipeline basico:
  1. `npm ci`
  2. `npm run lint` (tras instalar ESLint)
  3. `npm test`
  4. `npm run build`
- Bloquear merge si falla alguno

### 7.2 Pre-commit Hooks

- No hay hooks de pre-commit configurados
- Instalar `husky` + `lint-staged` para:
  - Ejecutar Prettier en archivos modificados
  - Ejecutar ESLint en archivos modificados
  - Prevenir commits con errores de tipo

### 7.3 Dependabot o Renovate

- Configurar actualizacion automatica de dependencias
- Angular 21 es reciente; mantener al dia las minor/patch versions

---

## Resumen por Prioridad

| Fase | Nombre            | Prioridad  | Esfuerzo |
| ---- | ----------------- | ---------- | -------- |
| 1    | Calidad de Codigo | Alta       | Medio    |
| 2    | Seguridad         | Alta       | Bajo     |
| 3    | Manejo de Errores | Media-Alta | Medio    |
| 4    | Rendimiento       | Media      | Bajo     |
| 5    | Accesibilidad     | Media      | Medio    |
| 6    | Arquitectura      | Media-Baja | Alto     |
| 7    | CI/CD             | Baja\*     | Bajo     |

\*Baja en prioridad inmediata, pero bloqueante antes de ir a produccion.

---

## Lo que esta bien hecho

- Standalone components en todos lados
- `ChangeDetectionStrategy.OnPush` consistente
- `inject()` en vez de constructor injection
- Signals para estado reactivo (`signal`, `computed`)
- New control flow (`@if`, `@for`) sin directivas estructurales
- Reactive Forms exclusivamente
- Lazy loading en todas las rutas
- Vitest correctamente configurado
- SCSS con CSS custom properties y tema oscuro/claro
- PWA con estrategias de cache diferenciadas
- Soporte offline con cola de requests
- Guards de autenticacion y test completion
