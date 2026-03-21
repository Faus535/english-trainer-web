# Google Sign-In — Plan de implementación Frontend

> La parte backend está detallada en `english-trainer-api/GOOGLE_AUTH_PLAN.md`

## Prerequisitos

- Client ID de Google obtenido (ver Fase 0 del plan backend)
- Endpoint `POST /api/auth/google` disponible y funcionando (ver plan backend)

---

## Fase 1: Environments — Configuración del Client ID

- [ ] Añadir `googleClientId` a `src/environments/environment.ts`:
  ```ts
  googleClientId: 'xxxx.apps.googleusercontent.com';
  ```
- [ ] Añadir `googleClientId` a `src/environments/environment.prod.ts` con el valor de producción

---

## Fase 2: Modelos y AuthService

### 2.1 Modelo

- [ ] Añadir interface en `shared/models/api.model.ts`:
  ```ts
  export interface GoogleAuthRequest {
    idToken: string;
  }
  ```

### 2.2 AuthService

- [ ] Añadir método `loginWithGoogle()` en `core/services/auth.service.ts`:
  ```ts
  loginWithGoogle(request: GoogleAuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/google`, request).pipe(
      tap(response => this.storeAuth(response))
    );
  }
  ```
  Reutiliza `storeAuth()` — el flujo post-login es idéntico al email+password.

---

## Fase 3: GoogleAuthService — Integración con Google Identity Services

- [ ] Crear servicio `core/services/google-auth.service.ts`:
  - Cargar el script `https://accounts.google.com/gsi/client` de forma lazy (solo cuando se necesite)
  - Método `initialize()`: configura el cliente GIS con el Client ID del environment
  - Método `signIn()`: lanza popup de Google y devuelve `Promise<string>` con el ID token
  - Manejo de errores:
    - Popup cerrado por el usuario → error controlado (no mostrar error al usuario)
    - Cuenta no seleccionada → error controlado
    - Script no cargado → reintentar carga

- [ ] Tipado: crear fichero de tipos `src/types/google.d.ts` para `google.accounts.id.*` (o usar `@types/google.accounts` si existe como paquete)

### Ejemplo de estructura del servicio

```ts
@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly clientId = inject(ENVIRONMENT).googleClientId;
  private initialized = false;

  async loadScript(): Promise<void> {
    /* carga lazy del script GIS */
  }

  async signIn(): Promise<string> {
    if (!this.initialized) await this.loadScript();
    return new Promise((resolve, reject) => {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => resolve(response.credential),
        auto_select: false,
      });
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: usar botón renderizado o popup OAuth
          reject(new Error('Google prompt not available'));
        }
      });
    });
  }
}
```

---

## Fase 4: Componente botón de Google

- [ ] Crear `shared/components/google-sign-in-button/google-sign-in-button.ts`:
  - Standalone component, `ChangeDetectionStrategy.OnPush`
  - Input: `label` (signal input, default: `'Continuar con Google'`)
  - Output: `authenticated` (emite el ID token como string)
  - Signal interna: `loading` para estado de carga
  - Al hacer click: llama a `GoogleAuthService.signIn()`, emite token o muestra error
  - Estilo: seguir branding guidelines de Google (fondo blanco, logo G, texto oscuro)

- [ ] Crear estilos en `google-sign-in-button.scss`:
  - Botón con borde gris, fondo blanco, logo de Google a la izquierda
  - Estado hover, focus y disabled
  - Tamaño consistente con los botones del formulario de login/register
  - Unidades en `rem`

---

## Fase 5: Integración en Login y Register

### 5.1 LoginComponent

- [ ] Añadir `<app-google-sign-in-button>` en `login.html`:
  - Separador visual entre formulario y botón: línea con texto "o"
  - Colocar debajo del botón de submit
- [ ] En `login.ts`:
  - Método `onGoogleAuth(idToken: string)`:
    1. Llama a `authService.loginWithGoogle({ idToken })`
    2. En success: carga estado del backend y navega a `/dashboard` (mismo flujo que login normal)
    3. En error: muestra mensaje apropiado (401 → "Error al autenticar con Google")

### 5.2 RegisterComponent

- [ ] Añadir `<app-google-sign-in-button>` en `register.html`:
  - Mismo separador visual "o"
  - Label: `'Registrarse con Google'`
- [ ] En `register.ts`:
  - Método `onGoogleAuth(idToken: string)`: mismo flujo que en login
  - El backend decide si crea cuenta nueva o usa existente

### 5.3 Separador visual

- [ ] Crear estilos para el separador "o" (línea horizontal con texto centrado):

  ```scss
  .auth-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-top: 1px solid var(--color-border);
    }
  }
  ```

---

## Fase 6: Gestión de cuentas vinculadas en UI

- [ ] Si el backend devuelve error indicando "Esta cuenta usa Google Sign-In" al hacer login con email+password:
  - Mostrar mensaje: "Esta cuenta está vinculada a Google. Usa el botón de Google para iniciar sesión."
- [ ] En la pantalla de Settings:
  - Mostrar el método de autenticación del usuario (Local / Google)
  - Si es Google, ocultar opción de cambiar contraseña

---

## Fase 7: Testing

- [ ] Tests unitarios `GoogleAuthService`:
  - Mock del script de Google
  - `signIn()` resuelve con token cuando usuario completa flujo
  - `signIn()` rechaza cuando usuario cierra popup
- [ ] Tests unitarios `GoogleSignInButtonComponent`:
  - Renderiza botón con label correcto
  - Muestra loading al pulsar
  - Emite token al completar
  - Muestra error cuando falla
- [ ] Tests de integración en `LoginComponent`:
  - Click en botón Google → llama a `authService.loginWithGoogle()` → navega a dashboard
  - Error de Google → muestra mensaje
- [ ] Tests de integración en `RegisterComponent`:
  - Mismo flujo que login

---

## Fase 8: Seguridad y producción

- [ ] Configurar Content Security Policy para permitir:
  - `script-src: https://accounts.google.com`
  - `frame-src: https://accounts.google.com`
  - `connect-src: https://accounts.google.com`
- [ ] Verificar que `googleClientId` en environment.prod apunta al Client ID correcto
- [ ] No almacenar el ID token de Google en sessionStorage (solo enviar al backend y descartar)
- [ ] Desplegar y probar flujo completo en producción

---

## Resumen de archivos a crear/modificar

| Acción    | Archivo                                             |
| --------- | --------------------------------------------------- |
| Modificar | `src/environments/environment.ts`                   |
| Modificar | `src/environments/environment.prod.ts`              |
| Modificar | `src/app/shared/models/api.model.ts`                |
| Modificar | `src/app/core/services/auth.service.ts`             |
| Crear     | `src/app/core/services/google-auth.service.ts`      |
| Crear     | `src/types/google.d.ts`                             |
| Crear     | `src/app/shared/components/google-sign-in-button/*` |
| Modificar | `src/app/features/auth/login/login.ts`              |
| Modificar | `src/app/features/auth/login/login.html`            |
| Modificar | `src/app/features/auth/login/login.scss`            |
| Modificar | `src/app/features/auth/register/register.ts`        |
| Modificar | `src/app/features/auth/register/register.html`      |
| Modificar | `src/app/features/auth/register/register.scss`      |
