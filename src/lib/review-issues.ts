import type { Listing } from './listings';

export type ReviewField = 'price' | 'area' | 'bedrooms' | 'bathrooms' | 'energy_rating'
  | 'energy_consumption' | 'energy_emissions' | 'area_measurement' | 'availability';
export type ReviewValue = number | string | null;
export type ReviewIssue = {
  code: 'source_discrepancy' | 'missing_data' | 'pending_check';
  field: ReviewField;
  severity: 'warning' | 'blocking';
  status: 'pending' | 'resolved';
  officeValue: ReviewValue;
  appliedValue: ReviewValue;
  sources: { source: 'arctempus' | 'idealista' | 'office_confirmation'; value: ReviewValue }[];
  resolution: string;
};
const labels: Record<ReviewField, string> = {
  price: 'Precio', area: 'Superficie', bedrooms: 'Dormitorios', bathrooms: 'Baños',
  energy_rating: 'Clase energética', energy_consumption: 'Consumo energético',
  energy_emissions: 'Emisiones', area_measurement: 'Tipo de superficie', availability: 'Disponibilidad',
};
const privatePattern = /https?:\/\/|[/\\](?:Users|home|private|tmp)[/\\]|[\w.+-]+@[\w.-]+|[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/i;
const keys = ['code', 'field', 'severity', 'status', 'officeValue', 'appliedValue', 'sources', 'resolution'].sort();
function requireIssue(condition: unknown): asserts condition {
  if (!condition) throw new Error('Invalid public review issue.');
}
function scalar(value: ReviewValue, field: ReviewField) {
  if (value === null) return;
  const enums: Partial<Record<ReviewField, string[]>> = {
    energy_rating: [...'ABCDEFG'], availability: ['available', 'reserved', 'sold', 'unconfirmed'],
    area_measurement: ['built', 'usable', 'unspecified'],
  };
  const values = enums[field];
  if (values) requireIssue(typeof value === 'string' && values.includes(value));
  else requireIssue(typeof value === 'number' && Number.isFinite(value) && value >= 0
    && (!['bedrooms', 'bathrooms'].includes(field) || Number.isInteger(value)));
}
function applied(listing: Listing, field: ReviewField): ReviewValue {
  const values: Record<ReviewField, ReviewValue> = {
    price: listing.price.amount, area: listing.area.squareMeters,
    bedrooms: listing.rooms.bedrooms, bathrooms: listing.rooms.bathrooms,
    energy_rating: listing.energy.rating, energy_consumption: listing.energy.consumptionKwhPerSquareMeterYear ?? null,
    energy_emissions: listing.energy.emissionsKgPerSquareMeterYear ?? null,
    area_measurement: listing.area.measurement, availability: listing.availability,
  };
  return values[field];
}
export function validateReviewIssues(issues: readonly ReviewIssue[] = [], listing?: Listing) {
  requireIssue(Array.isArray(issues) && issues.length <= 24);
  const seen = new Set<string>();
  for (const issue of issues) {
    requireIssue(issue && Object.keys(issue).sort().join() === keys.join()
      && Object.hasOwn(labels, issue.field) && ['source_discrepancy', 'missing_data', 'pending_check'].includes(issue.code)
      && ['warning', 'blocking'].includes(issue.severity) && ['pending', 'resolved'].includes(issue.status));
    const key = `${issue.code}:${issue.field}`;
    requireIssue(!seen.has(key)); seen.add(key);
    scalar(issue.officeValue, issue.field); scalar(issue.appliedValue, issue.field);
    requireIssue(issue.officeValue === null || issue.officeValue === issue.appliedValue);
    if (listing) requireIssue(applied(listing, issue.field) === issue.appliedValue);
    requireIssue(Array.isArray(issue.sources) && issue.sources.length <= 3);
    const sources = new Set<string>();
    for (const source of issue.sources) {
      requireIssue(source && Object.keys(source).sort().join() === 'source,value'
        && ['arctempus', 'idealista', 'office_confirmation'].includes(source.source) && !sources.has(source.source));
      sources.add(source.source); scalar(source.value, issue.field);
    }
    if (issue.code === 'source_discrepancy') requireIssue(issue.sources.some((s) => s.value !== issue.officeValue));
    requireIssue(typeof issue.resolution === 'string' && issue.resolution.trim().length > 0
      && issue.resolution.length <= 320 && !privatePattern.test(issue.resolution) && !/[\x00-\x1f]/.test(issue.resolution));
  }
  return issues;
}
function format(value: ReviewValue, field: ReviewField): string {
  if (value === null) return 'Sin dato';
  if (typeof value === 'number') {
    const shown = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(value);
    return `${shown}${({ price: ' €', area: ' m²', energy_consumption: ' kWh/m² año', energy_emissions: ' kg CO₂/m² año' } as Partial<Record<ReviewField, string>>)[field] ?? ''}`;
  }
  return ({ available: 'Disponible', reserved: 'Reservada', sold: 'Vendida', unconfirmed: 'Por confirmar',
    built: 'Construida', usable: 'Útil', unspecified: 'Por confirmar' } as Record<string, string>)[value] ?? value;
}
export function reviewIssueViews(issues?: readonly ReviewIssue[]) {
  return validateReviewIssues(issues).map((issue) => ({ ...issue, fieldLabel: labels[issue.field],
    severityLabel: issue.severity === 'blocking' ? 'Bloquea publicación' : 'Aviso',
    statusLabel: issue.status === 'resolved' ? 'Revisado' : 'Pendiente de revisar',
    office: format(issue.officeValue, issue.field), applied: format(issue.appliedValue, issue.field),
    sources: issue.sources.map((s) => ({ label: ({ arctempus: 'Arctempus', idealista: 'Idealista', office_confirmation: 'Confirmación comercial' })[s.source], value: format(s.value, issue.field) })),
  }));
}
export function hasBlockingReviewIssues(issues: readonly ReviewIssue[] = []) {
  return validateReviewIssues(issues).some((issue) => issue.severity === 'blocking' && issue.status === 'pending');
}
