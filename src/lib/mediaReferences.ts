export const mediaReferenceTypes = ['press', 'video', 'linkedin', 'article'] as const;

export type MediaReferenceType = (typeof mediaReferenceTypes)[number];

export type MediaReference = {
  slug: string;
  title: string;
  source: string;
  type: MediaReferenceType;
  href: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  status?: 'active' | 'archived';
};

export const mediaHubTags = [
  'arrendadores',
  'inquilinos',
  'compradores',
  'vendedores',
  'alquiler',
  'compraventa',
  'inversión',
  'legislación',
  'mercado',
  'no residentes',
  'herencias',
] as const;

const references: MediaReference[] = [
  {
    slug: 'plan-marshall-crisis-vivienda',
    title: 'FAI pide un “Plan Marshall” nacional ante la mayor crisis de vivienda de los últimos 40 años',
    source: 'Europa Press',
    type: 'press',
    href: 'https://www.europapress.es/economia/construccion-y-vivienda-00342/noticia-fai-pide-plan-marshall-nacional-mayor-crisis-vivienda-ultimos-40-anos-20250212142726.html',
    publishedAt: '2025-02-12',
    excerpt: 'Intervención de José María Alfaro reclamando un pacto de Estado y medidas estructurales para desbloquear la crisis habitacional.',
    tags: ['mercado', 'alquiler', 'legislación'],
    featured: true,
  },
  {
    slug: 'reelegido-presidente-fai',
    title: 'José María Alfaro, reelegido presidente de la Federación Nacional de Asociaciones Inmobiliarias',
    source: 'idealista/news',
    type: 'press',
    href: 'https://www.idealista.com/news/inmobiliario/vivienda/2025/02/12/831989-jose-maria-alfaro-reelegido-presidente-de-la-federacion-nacional-de-asociaciones',
    publishedAt: '2025-02-12',
    excerpt: 'Cobertura sectorial sobre su reelección y el papel institucional de FAI en el nuevo ciclo regulatorio.',
    tags: ['mercado', 'legislación', 'vendedores'],
    featured: true,
  },
  {
    slug: 'entrevista-canal-europa-alquiler',
    title: 'Entrevista sobre el precio de la vivienda y el alquiler en España',
    source: 'Canal Europa',
    type: 'video',
    href: 'https://canaleuropa.es/title/entrevista-jose-maria-alfaro-presidente-de-la-federacion-de-asociaciones-inmobilirarias-sobre-el-precio-de-la-vivienda-y-el-alquiler-de-vivienda-en-espana/',
    publishedAt: '2025-01-01',
    excerpt: 'Aparición audiovisual en la que José María Alfaro analiza cómo la normativa del alquiler afecta a propietarios e inquilinos.',
    tags: ['alquiler', 'arrendadores', 'inquilinos', 'legislación'],
    featured: true,
  },
  {
    slug: 'sol-radio-madrid-problemas-alquilar',
    title: 'El mercado del alquiler y los problemas reales de alquilar hoy',
    source: 'Sol Radio Madrid',
    type: 'video',
    href: 'https://solradiomadrid.com/problemas-de-alquilar/',
    publishedAt: '2025-12-01',
    excerpt: 'Conversación en formato entrevista sobre escasez de oferta, precios récord y gestión profesional del alquiler.',
    tags: ['alquiler', 'arrendadores', 'inquilinos', 'mercado'],
    featured: true,
  },
  {
    slug: 'seguridad-juridica-300000-viviendas',
    title: 'Seguridad jurídica para devolver 300.000 viviendas al alquiler',
    source: 'Intereconomía / EFE',
    type: 'press',
    href: 'https://intereconomia.com/noticia/finanzas/las-inmobiliarias-piden-seguridad-juridica-para-poner-en-alquiler-300-000-viviendas-en-espana-20240510-0949/',
    publishedAt: '2024-05-10',
    excerpt: 'Defensa de medidas que incentiven la oferta estable y den certidumbre a los propietarios.',
    tags: ['alquiler', 'arrendadores', 'legislación', 'mercado'],
    featured: false,
  },
  {
    slug: 'medidas-200000-viviendas-larga-estancia',
    title: 'Medidas para que 200.000 viviendas regresen al alquiler de larga estancia',
    source: 'Europa Press',
    type: 'press',
    href: 'https://www.europapress.es/economia/construccion-y-vivienda-00342/noticia-inmobiliarias-piden-medidas-200000-viviendas-pasen-parque-alquiler-larga-estancia-20241113111228.html',
    publishedAt: '2024-11-13',
    excerpt: 'Declaraciones centradas en recuperar oferta residencial útil y ordenar el mercado del alquiler habitual.',
    tags: ['alquiler', 'arrendadores', 'mercado'],
    featured: false,
  },
  {
    slug: 'plan-estatal-vivienda-limitaciones',
    title: 'El nuevo Plan Estatal de Vivienda nace con limitaciones que comprometen su impacto',
    source: 'Forbes España',
    type: 'press',
    href: 'https://forbes.es/economia/910839/las-inmobiliarias-creen-que-el-nuevo-plan-de-vivienda-nace-con-limitaciones-que-comprometen-su-impacto/',
    publishedAt: '2026-05-01',
    excerpt: 'Posicionamiento sobre política pública, déficit de oferta y necesidad de medidas más ejecutables.',
    tags: ['legislación', 'mercado', 'inversión'],
    featured: false,
  },
  {
    slug: 'profesionales-necesarios-entrevista-dn-inmo',
    title: 'El papel del agente inmobiliario profesional es cada vez más necesario',
    source: 'DN INMO',
    type: 'article',
    href: 'https://www.diariodenavarra.es/noticias/negocios/dn-inmo/2026/02/17/jose-maria-alfaro-presidente-fai-papel-agente-inmobiliario-profesional-vez-necesario-810472-101.html',
    publishedAt: '2026-02-17',
    excerpt: 'Entrevista editorial sobre representación profesional, desequilibrios de oferta y demanda y visión de mercado.',
    tags: ['mercado', 'compraventa', 'vendedores', 'compradores'],
    featured: false,
  },
  {
    slug: 'ninguneados-administraciones',
    title: 'Los agentes inmobiliarios podrían ayudar a contener el precio de la vivienda, pero son ninguneados por las administraciones',
    source: 'Diario de Navarra',
    type: 'article',
    href: 'https://www.diariodenavarra.es/noticias/negocios/dn-inmo/2025/01/14/agentes-inmobiliarios-ayudar-contencion-precios-son-ninguneados-administraciones-634321-3379.html',
    publishedAt: '2025-01-14',
    excerpt: 'Entrevista sobre el rol profesional del agente como parte de la solución en un mercado tensionado.',
    tags: ['mercado', 'legislación', 'compradores', 'vendedores'],
    featured: false,
  },
  {
    slug: 'fai-ministerio-propio-vivienda',
    title: 'FAI ve un acierto que Vivienda tenga rango de Ministerio propio',
    source: 'FAI',
    type: 'article',
    href: 'https://fainmo.es/fai-ve-un-acierto-que-vivienda-tenga-rango-de-ministerio-propio-con-el-nuevo-gobierno/',
    publishedAt: '2023-11-22',
    excerpt: 'Posición institucional sobre política de vivienda, acceso residencial y urgencia de medidas técnicas.',
    tags: ['legislación', 'mercado', 'alquiler'],
    featured: false,
  },
  {
    slug: 'linkedin-criterio-patrimonial',
    title: 'Reflexión profesional: representar personas antes que operaciones',
    source: 'LinkedIn',
    type: 'linkedin',
    href: 'https://www.linkedin.com/in/jose-mar%C3%ADa-alfaro-agente-inmobiliario/',
    publishedAt: '2026-01-10',
    excerpt: 'Pieza seleccionada como ejemplo del criterio editorial para mostrar visión profesional y posicionamiento de marca.',
    tags: ['mercado', 'vendedores', 'compradores'],
    featured: false,
  },
  {
    slug: 'linkedin-no-residentes',
    title: 'Publicación orientada a no residentes y decisiones patrimoniales en España',
    source: 'LinkedIn',
    type: 'linkedin',
    href: 'https://www.linkedin.com/in/jose-mar%C3%ADa-alfaro-agente-inmobiliario/',
    publishedAt: '2025-09-18',
    excerpt: 'Referencia editorial para contemplar contenido social susceptible de formar parte del hub cuando aporte autoridad.',
    tags: ['no residentes', 'inversión', 'compraventa'],
    featured: false,
  },
  {
    slug: 'registro-obligatorio-profesionales',
    title: 'Un registro obligatorio de profesionales para mejorar el sector inmobiliario',
    source: 'El Faradio',
    type: 'article',
    href: 'https://www.elfaradio.com/2021/12/10/un-registro-obligatorio-de-profesionales-para-mejorar-el-sector-inmobiliario/',
    publishedAt: '2021-12-10',
    excerpt: 'Intervención sobre transparencia del sector y protección del consumidor frente a la improvisación profesional.',
    tags: ['legislación', 'mercado', 'compradores', 'vendedores'],
    featured: false,
  },
  {
    slug: 'entrevista-covid-comprar-vender',
    title: '¿Interesa comprar o vender vivienda? Entrevista sobre decisiones en entornos complejos',
    source: 'Vivir Ediciones',
    type: 'article',
    href: 'https://vivirediciones.es/leganes/jose-maria-alfaro-entrevista-junio-2020/',
    publishedAt: '2020-06-01',
    excerpt: 'Entrevista extensa sobre compraventa, contexto de mercado y lectura táctica del momento inmobiliario.',
    tags: ['compraventa', 'compradores', 'vendedores', 'mercado'],
    featured: false,
  },
  {
    slug: 'herencias-decisiones-inmobiliarias',
    title: 'Herencias y decisiones inmobiliarias: criterio, tiempos y protección patrimonial',
    source: 'LinkedIn',
    type: 'linkedin',
    href: 'https://www.linkedin.com/in/jose-mar%C3%ADa-alfaro-agente-inmobiliario/',
    publishedAt: '2025-06-03',
    excerpt: 'Entrada de ejemplo para cubrir una categoría editorial prioritaria en la taxonomía acordada.',
    tags: ['herencias', 'vendedores', 'compraventa'],
    featured: false,
  },
];

export function getMediaReferences() {
  return references.filter((reference) => reference.status !== 'archived');
}
