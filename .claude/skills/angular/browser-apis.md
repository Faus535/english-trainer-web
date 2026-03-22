# Angular Browser APIs — Best Practices

## Wrapping Browser APIs in Services

Always wrap browser APIs (Web Speech, Geolocation, etc.) in Angular services with signal-based state.

```typescript
@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  private readonly zone = inject(NgZone);

  private readonly _supported = signal(!!getSpeechRecognitionAPI());
  private readonly _state = signal<RecognitionState>('idle');

  readonly supported = this._supported.asReadonly();
  readonly state = this._state.asReadonly();
}
```

### Rules

- One service per browser API.
- `providedIn: 'root'` — browser APIs are global singletons.
- Check support in constructor or field initializer: `signal(!!window.SpeechRecognition)`.
- Expose state as readonly signals.
- Never access browser APIs directly from components.

## Feature Detection

Always check API availability before use. Handle vendor prefixes.

```typescript
function getSpeechRecognitionAPI(): SpeechRecognitionConstructor | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// In service
private readonly API = getSpeechRecognitionAPI();
private readonly _supported = signal(!!this.API);
```

```typescript
// TTS support check
constructor() {
  this._supported = typeof speechSynthesis !== 'undefined';
  if (!this._supported) return;
  // ... init
}
```

### Rules

- Use a standalone function for API detection — keeps the service clean.
- Define TypeScript interfaces for untyped browser APIs (SpeechRecognition, etc.).
- Store the API reference once — never re-query `window` on each call.
- Signal `supported` so the UI can show/hide features accordingly.
- Guard all API calls with `if (!this.API) return;`.

## NgZone Integration

Browser API callbacks fire outside Angular's zone. Use `NgZone.run()` to re-enter.

```typescript
this.recognition.onend = () => {
  this.zone.run(() => {
    this._state.set('idle');
    this._result.set(computedResult);
  });
};

this.recognition.onerror = (event) => {
  this.zone.run(() => {
    this._state.set('idle');
    this._error.set(event.error);
  });
};
```

### Rules

- Inject `NgZone` in services that use browser API callbacks.
- Wrap all signal writes from callbacks in `this.zone.run(() => { ... })`.
- Without `zone.run()`, signals update but change detection does not run.
- Only use `zone.run()` for the final state update — not for intermediate computation.
- Never use `NgZone.runOutsideAngular()` unless profiling shows a bottleneck.

## Timeout and Interval Management

Track timing IDs for cleanup.

```typescript
private timeoutId: number | null = null;

startRecording(): void {
  // Auto-stop after 30 seconds
  this.timeoutId = window.setTimeout(() => {
    this.stopRecording();
  }, 30000);
}

stopRecording(): void {
  this.clearTimeout();
  // ... stop logic
}

private clearTimeout(): void {
  if (this.timeoutId !== null) {
    window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
}
```

### Rules

- Store timeout/interval IDs as nullable `number` fields.
- Always clear timeouts in stop/reset/destroy methods.
- Use `window.setTimeout` (not bare `setTimeout`) for explicit typing.
- For iOS workarounds (speech resume), track interval IDs in an array and clear all on stop.
- Never use `setInterval` without a cleanup path.

## External Script Loading

Load third-party scripts lazily.

```typescript
@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly _scriptLoaded = signal(false);

  private loadScript(): Promise<void> {
    if (this._scriptLoaded()) return Promise.resolve();
    if (document.querySelector('script[src*="accounts.google.com"]')) {
      this._scriptLoaded.set(true);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        this._scriptLoaded.set(true);
        resolve();
      };
      script.onerror = () => reject(new Error('Script load failed'));
      document.head.appendChild(script);
    });
  }
}
```

### Rules

- Check if the script is already loaded before appending.
- Use a signal to track load state.
- Return `Promise<void>` for async initialization.
- Handle load errors.
- Never load scripts eagerly at app boot — load on first use.

## Promise-Based vs Signal-Based Modes

For one-shot operations (e.g., free recording), return a `Promise`. For continuous state, use signals.

```typescript
// Promise mode — one-shot, caller awaits
startFreeRecording(): Promise<FreeRecognitionResult> {
  return new Promise((resolve) => {
    // ... setup, resolve on end
  });
}

// Signal mode — continuous, component reads signals
startRecording(expected: string): void {
  // ... updates this._state, this._result signals
}
```

### Rules

- Use `Promise` when the caller needs a single result and wants to `await`.
- Use signals when the component must react to ongoing state changes.
- Never mix: don't resolve a promise AND update a signal for the same operation.
- Clean up the promise resolver on error/abort.

## TypeScript Interfaces for Untyped APIs

Define local interfaces for browser APIs not in standard TS libs.

```typescript
interface WebSpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: WebSpeechRecognitionEvent) => void) | null;
  onerror: ((event: WebSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
```

### Rules

- Define interfaces at the top of the service file (not in a shared model).
- Use `readonly` for properties that shouldn't be set.
- Type event handlers with explicit event interfaces.
- Use `type` alias for the constructor: `type Ctor = new () => WebSpeechRecognition;`.

## What NOT To Do

- Do not access `window.SpeechRecognition` directly in components.
- Do not forget `NgZone.run()` when updating signals from browser callbacks.
- Do not leave `setTimeout`/`setInterval` without cleanup.
- Do not load external scripts synchronously or at app boot.
- Do not use `any` for browser API types — define TypeScript interfaces.
- Do not assume browser API availability — always feature-detect.
