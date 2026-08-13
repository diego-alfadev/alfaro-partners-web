# Checklist de configuración: Google Business Profile

El sitio ya declara un `RealEstateAgent` con datos estructurados (JSON-LD, `src/layouts/BaseLayout.astro`), pero no existe ficha de Google Business Profile (GBP) verificada. Sin GBP, José María Alfaro no aparece en el Local Pack ni en Google Maps para búsquedas del tipo "agente inmobiliario Madrid" o "representación inmobiliaria [barrio]".

## Ruta rápida

1. Resolver primero el bloqueo de dirección (ver "Bloqueo antes de crear la ficha").
2. Crear/reclamar la ficha en [business.google.com](https://business.google.com).
3. Igualar cada campo de NAP (Name, Address, Phone) con el JSON-LD del sitio — ver tabla de consistencia.
4. Verificar la ficha (postal, teléfono o vídeo, según lo que ofrezca Google en el momento).

## Estado de la dirección — desbloqueado el 13/08/2026

Resuelto: es un **despacho con dirección física**, no un negocio de área de servicio. José María publicó la dirección él mismo en LinkedIn al anunciar la apertura, así que es información pública.

El JSON-LD (`address` en `BaseLayout.astro`, alimentado desde `BUSINESS_INFO.address` en `src/lib/constants.ts`) declara ahora:

```json
{
  "streetAddress": "Calle de Narváez, 31",
  "addressLocality": "Madrid",
  "addressRegion": "Madrid",
  "addressCountry": "ES"
}
```

**Falta el código postal**, y se ha dejado fuera a propósito: un código postal equivocado es peor que ninguno, porque tiene que coincidir con el de la ficha de GBP y una discrepancia dispara una revisión de Google.

- [ ] Confirmar el código postal exacto del despacho y añadir `postalCode` a `BUSINESS_INFO.address`, a ser posible en el mismo cambio en que se cree la ficha.
- [ ] Decidir si la dirección debe además mostrarse **visible** en la web (pie de página). Google valora que el NAP sea legible para una persona, no solo para un robot; hoy la dirección existe únicamente en los datos estructurados.

## Consistencia NAP (Name, Address, Phone)

| Campo | Valor en el JSON-LD del sitio | Acción en GBP |
|---|---|---|
| Nombre (Name) | `Alfaro & Partners` (`BUSINESS_INFO.brandName`) | Usar exactamente `Alfaro & Partners` — no añadir palabras clave al nombre del negocio (viola las normas de Google y genera inconsistencia). |
| Dirección (Address) | `Calle de Narváez, 31 · Madrid, Madrid, ES` (`BUSINESS_INFO.address`) | Escribir la calle exactamente igual, incluida la coma antes del número. Añadir el código postal en ambos sitios a la vez cuando se confirme. |
| Teléfono (Phone) | `+34672504642` (`BUSINESS_INFO.phone`) | Mismo número, mismo formato internacional, en la ficha y en cualquier directorio adicional (páginas amarillas, colegios profesionales, etc.). |
| Sitio web | `https://alfaropartners.es` | Enlazar directo a la home, no a una landing de campaña. |
| Categoría principal | — | "Agencia inmobiliaria" o "Agente inmobiliario" (evaluar cuál captura mejor el modelo de representación del cliente, no de intermediación). |
| Categorías secundarias | — | Considerar "Servicios de tasación inmobiliaria" si aplica a la oferta real. |

## Contenido de la ficha

- [ ] Descripción del negocio (750 caracteres): reflejar el posicionamiento de "representación, no intermediación" que ya usa el sitio (`/herencias-inmobiliarias/`), sin keyword stuffing.
- [ ] Horario de atención real (o "solo con cita" si aplica).
- [ ] Fotos: al menos el logo y una foto de José María Alfaro — puede reutilizarse el material ya optimizado en `src/assets/despacho.png` (WebP tras el batch 1 de este cambio) si el encuadre es apto para GBP.
- [ ] Servicios listados: alinear con las páginas reales del sitio (representación en herencias, zonas cubiertas en `/zonas/`) para que la ficha no prometa algo que el sitio no cubre.
- [ ] Enlace de reserva de cita: usar la misma URL de `BUSINESS_INFO.booking.url` (`calendar.app.google/...`) que ya se usa en el sitio — no crear un segundo canal de reservas.

## Reputación y actividad continua

- [ ] Configurar solicitud de reseñas post-cierre de operación (proceso manual o vía el mismo enlace de reserva).
- [ ] Responder reseñas existentes si las hubiera de una ficha antigua/duplicada — buscar duplicados con el nombre "Alfaro" + "inmobiliari*" en Google Maps antes de crear una ficha nueva, para evitar fichas duplicadas (penalización de confianza).
- [ ] Publicar al menos una GBP Post por trimestre enlazando a contenido real del sitio (por ejemplo, la guía de herencias inmobiliarias).
- [ ] Habilitar la sección de Preguntas y Respuestas y sembrar 2-3 preguntas frecuentes reales (coordinar con el contenido bloqueado de FAQ en `/herencias-inmobiliarias/`, fase 6b de este mismo cambio, cuando se escriba).

## Checklist de verificación final

- [ ] Ficha creada y verificada por Google
- [ ] NAP idéntico entre GBP, JSON-LD del sitio y cualquier directorio externo donde aparezca el negocio
- [ ] Sin fichas duplicadas activas
- [ ] Enlace de reserva y sitio web apuntando a las URLs de producción reales

## Siguiente paso

La dirección ya no bloquea: se puede crear la ficha. Al hacerlo, confirmar el código postal y añadirlo a `BUSINESS_INFO.address` en el mismo momento, para que la web y la ficha no lleguen a divergir nunca.
