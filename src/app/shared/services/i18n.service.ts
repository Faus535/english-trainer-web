import { Injectable, signal, computed } from '@angular/core';

export type Locale = 'es' | 'en';
const STORAGE_KEY = 'et_locale';

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  es: {
    'nav.sessions': 'Sesiones',
    'nav.speak': 'Hablar',
    'nav.tutor': 'Tutor',
    'nav.achievements': 'Logros',
    'nav.settings': 'Ajustes',
    'nav.reading': 'Leer',
    'nav.writing': 'Escribir',
    'nav.analytics': 'Progreso',
    'nav.profile': 'Perfil',
    'nav.notifications': 'Alertas',
    'settings.language': 'Idioma de la interfaz',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.back': 'Volver',
  },
  en: {
    'nav.sessions': 'Sessions',
    'nav.speak': 'Speak',
    'nav.tutor': 'Tutor',
    'nav.achievements': 'Achievements',
    'nav.settings': 'Settings',
    'nav.reading': 'Read',
    'nav.writing': 'Write',
    'nav.analytics': 'Progress',
    'nav.profile': 'Profile',
    'nav.notifications': 'Alerts',
    'settings.language': 'Interface language',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.back': 'Back',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly _locale = signal<Locale>(this.loadLocale());
  readonly locale = this._locale.asReadonly();
  readonly isSpanish = computed(() => this._locale() === 'es');

  t(key: string): string {
    return TRANSLATIONS[this._locale()][key] ?? key;
  }
  setLocale(locale: Locale): void {
    this._locale.set(locale);
    localStorage.setItem(STORAGE_KEY, locale);
  }
  private loadLocale(): Locale {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === 'en' || s === 'es' ? s : 'es';
  }
}
