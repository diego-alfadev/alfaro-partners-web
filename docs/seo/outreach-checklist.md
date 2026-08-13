# Checklist de outreach: menciones sin enlace (backlinks)

Alfaro & Partners tiene un solo dominio que enlaza hacia `alfaropartners.es` (auditoría SDD `alfaro-seo-hardening`, 2026-08-10). Al mismo tiempo, existen varias menciones editoriales reales de José María Alfaro que **no** enlazan de vuelta al sitio. Convertir esas menciones en enlaces es la palanca de autoridad más barata disponible: el contenido y la relación ya existen, solo falta pedir el enlace.

## Ruta rápida

1. Escribir a cada medio de la lista con el texto de contacto sugerido (sección "Cómo pedirlo").
2. Priorizar `fainmo.es` primero — es la organización que él preside, la relación es directa y no depende de un tercero editorial.
3. Marcar cada fila cuando el enlace esté confirmado en producción (no solo prometido).

## Objetivos de outreach

| Medio | URL de la mención | Estado actual | Texto ancla sugerido | Prioridad |
|---|---|---|---|---|
| Europa Press | [`europapress.es/.../noticia-fai-pide-plan-marshall-nacional-mayor-crisis-vivienda...html`](https://www.europapress.es/economia/construccion-y-vivienda-00342/noticia-fai-pide-plan-marshall-nacional-mayor-crisis-vivienda-ultimos-40-anos-20250212142726.html) | Mención sin enlace | "José María Alfaro, Alfaro & Partners" | Alta |
| idealista/news | [`idealista.com/news/.../jose-maria-alfaro-reelegido-presidente-de-la-federacion-nacional-de-asociaciones`](https://www.idealista.com/news/inmobiliario/vivienda/2025/02/12/831989-jose-maria-alfaro-reelegido-presidente-de-la-federacion-nacional-de-asociaciones) | Mención sin enlace | "Alfaro & Partners, representación inmobiliaria en Madrid" | Alta |
| Canal Europa | [`canaleuropa.es/.../entrevista-jose-maria-alfaro-presidente-de-la-federacion-de-asociaciones-inmobilirarias...`](https://canaleuropa.es/title/entrevista-jose-maria-alfaro-presidente-de-la-federacion-de-asociaciones-inmobilirarias-sobre-el-precio-de-la-vivienda-y-el-alquiler-de-vivienda-en-espana/) | Mención sin enlace (vídeo con ficha de texto) | "José María Alfaro — Alfaro & Partners" | Media |
| fainmo.es (FAI) | Página institucional / ficha de directiva de la Federación Nacional de Asociaciones Inmobiliarias | Sin enlace de vuelta pese a que él es el presidente | "José María Alfaro, presidente de FAI y fundador de Alfaro & Partners" | **Máxima** — relación directa, sin intermediario editorial |

> Las cuatro URLs de origen están verificadas contra `src/lib/mediaReferences.ts` (el hub de prensa ya construido en el sitio) y contra la auditoría SDD (`sdd/alfaro-seo-hardening/explore`). No se ha verificado en vivo si alguna ya añadió el enlace desde la fecha de la auditoría — revisar antes de escribir a cada medio.

## Cómo pedirlo

Plantilla corta, en español, para el primer contacto (adaptar el nombre del interlocutor si se conoce):

> Hola [nombre], gracias por la cobertura de [título de la pieza]. ¿Sería posible añadir un enlace a `alfaropartners.es` la próxima vez que citéis a José María Alfaro? Ayuda a que los lectores encuentren la fuente directa. Quedo atento por si necesitáis algo del despacho para una futura pieza.

Para `fainmo.es`, al ser una relación institucional directa, es preferible pedirlo por el canal interno de la federación (no por formulario público de prensa).

## Checklist de verificación

- [ ] Europa Press: enlace confirmado en producción
- [ ] idealista/news: enlace confirmado en producción
- [ ] Canal Europa: enlace confirmado en producción
- [ ] fainmo.es: enlace confirmado en producción (ficha de presidencia)
- [ ] Revisar `src/lib/mediaReferences.ts` cada vez que se sume una pieza nueva de prensa, para no perder el registro de qué medios ya citan a José María

## Siguiente paso

Una vez confirmado un enlace, no requiere ningún cambio de código — es un backlink externo. Si el medio pide un logo, foto o bio corta, usar los datos de `src/lib/constants.ts` (`BUSINESS_INFO`) como fuente única de verdad para nombre, marca y redes.
