# Checklist de configuración: Google Business Profile

El sitio ya declara un `RealEstateAgent` con datos estructurados (JSON-LD, `src/layouts/BaseLayout.astro`), pero no existe ficha de Google Business Profile (GBP) verificada. Sin GBP, José María Alfaro no aparece en el Local Pack ni en Google Maps para búsquedas del tipo "agente inmobiliario Madrid" o "representación inmobiliaria [barrio]".

## Ruta rápida

1. Resolver primero el bloqueo de dirección (ver "Bloqueo antes de crear la ficha").
2. Crear/reclamar la ficha en [business.google.com](https://business.google.com).
3. Igualar cada campo de NAP (Name, Address, Phone) con el JSON-LD del sitio — ver tabla de consistencia.
4. Verificar la ficha (postal, teléfono o vídeo, según lo que ofrezca Google en el momento).

## Bloqueo antes de crear la ficha

El JSON-LD actual (`address` en `BaseLayout.astro`) solo declara:

```json
{ "addressLocality": "Madrid", "addressCountry": "ES" }
```

**No hay calle ni código postal.** Google Business Profile exige una dirección física completa (o, si no se atiende al público en una dirección fija, configurar el perfil como "service-area business" ocultando la dirección exacta pero declarando el área de servicio). Decidir cuál de las dos rutas aplica **antes** de crear la ficha, porque cambiarlo después dispara una nueva revisión de Google:

- [ ] Decidir: ¿despacho con dirección física visible, o negocio de área de servicio sin dirección pública?
- [ ] Si es dirección física: obtener calle + número + código postal exactos y añadirlos al JSON-LD (`PostalAddress.streetAddress`, `PostalAddress.postalCode`) en el mismo commit que se cree la ficha, para que ambas fuentes nazcan consistentes.

## Consistencia NAP (Name, Address, Phone)

| Campo | Valor en el JSON-LD del sitio | Acción en GBP |
|---|---|---|
| Nombre (Name) | `Alfaro & Partners` (`BUSINESS_INFO.brandName`) | Usar exactamente `Alfaro & Partners` — no añadir palabras clave al nombre del negocio (viola las normas de Google y genera inconsistencia). |
| Dirección (Address) | Solo `Madrid, ES` — **incompleta**, ver bloqueo arriba | Completar antes de publicar la ficha. |
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

Una vez resuelta la dirección física (o decidido el modelo de área de servicio), actualizar `PostalAddress` en el JSON-LD de `BaseLayout.astro` en el mismo cambio en que se publique la ficha de GBP, para que ambas fuentes de NAP nazcan sincronizadas.
