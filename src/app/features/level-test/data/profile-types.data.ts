import { ProfileType } from '../models/level-test.model';
import { Level, CEFR_LEVELS, ModuleName } from '../../../shared/models/learning.model';

export const PROFILE_MESSAGES: Record<ProfileType['id'], string> = {
  avanzado_pasivo:
    'Lees ingles casi como un nativo pero tu oido no esta entrenado. Es un problema muy comun y tiene solucion rapida. En 4 semanas vas a notar un salto brutal.',
  reactivador:
    'Tu ingles escrito es A2-B1. Tienes mucho ingles dormido — no necesitas aprenderlo de nuevo, necesitas activarlo. En 2 semanas notaras la diferencia.',
  intermedio:
    'Tu nivel es mejor de lo que crees. Lo que te falta es practica activa. Vamos a pasar del "lo entiendo leyendo" al "lo puedo usar".',
  basico:
    'Tienes bases de ingles. Vamos a construir sobre ellas, no desde cero. Empezamos por lo mas util para el dia a dia.',
};

export function getProfileType(levels: Partial<Record<ModuleName, Level>>): ProfileType {
  const lisIdx = CEFR_LEVELS.indexOf(levels.listening || 'a1');
  const vocIdx = CEFR_LEVELS.indexOf(levels.vocabulary || 'a1');
  const gramIdx = CEFR_LEVELS.indexOf(levels.grammar || 'a1');
  const readAvg = (vocIdx + gramIdx) / 2;

  // B1+ reading but low listening = passive advanced
  if (readAvg >= 2 && lisIdx <= 1) {
    return { id: 'avanzado_pasivo', label: 'Avanzado Pasivo' };
  }
  // A2+ reading but low listening = reactivator
  if (readAvg >= 1 && lisIdx <= 1) {
    return { id: 'reactivador', label: 'Reactivador' };
  }
  // B1+ overall reading
  if (readAvg >= 1.5) {
    return { id: 'intermedio', label: 'Intermedio' };
  }
  return { id: 'basico', label: 'Basico+' };
}

export function estimateSessions(levels: Partial<Record<ModuleName, Level>>): string {
  const lisIdx = CEFR_LEVELS.indexOf(levels.listening || 'a1');
  const remaining = CEFR_LEVELS.length - 1 - lisIdx;
  const estimate = remaining * 16;
  return `${estimate - 8}\u2013${estimate + 8}`;
}
