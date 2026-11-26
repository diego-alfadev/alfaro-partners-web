/** Public-safe review notes, not readiness flags or a replacement for private source evidence. */
import type { ReviewIssue } from '../../lib/review-issues';

export type PropertyPreviewNotice = {
  confirmed?: readonly string[];
  pending: readonly string[];
  issues?: readonly ReviewIssue[];
};

const approval = 'Confirmar disponibilidad actual y aprobar esta versión antes de su publicación definitiva.';
const acceptance = 'Terminar la revisión de las fotografías y del recorrido de la visita guiada.';

export const propertyPreviewNotices: Record<string, PropertyPreviewNotice> = {
  'ap-k7r2': {
    pending: [
      'Completar el contraste de la información energética de esta vivienda.',
      approval,
      'Cerrar la revisión específica de la visita guiada.',
    ],
  },
  'ap-l8v3': {
    confirmed: ['Información energética anunciada ya recogida: E · 211 kWh/m² año · 44 kg CO₂/m² año.'],
    pending: [
      approval,
      'Cerrar la revisión específica de la visita guiada y la comprobación técnica para su salida definitiva.',
    ],
  },
  'ap-1744a0': {
    pending: [
      'La información energética localizada requiere confirmar que corresponde a la misma vivienda y validar sus valores.',
      approval,
      acceptance,
    ],
  },
  'ap-ae0279': {
    pending: [
      'Completar el contraste de la información energética de esta vivienda.',
      approval,
      acceptance,
    ],
  },
  'ap-97df49': {
    pending: [
      'Completar el contraste de la información energética de esta vivienda.',
      approval,
      'Revisar las fotografías y el recorrido de la visita guiada, incluida la terraza.',
    ],
  },
};
