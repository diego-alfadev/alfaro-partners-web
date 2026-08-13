# Checklist de configuración: Google Business Profile

El sitio declara un `RealEstateAgent` con datos estructurados completos (JSON-LD, `src/layouts/BaseLayout.astro`): dirección, teléfono y horarios. **La ficha de Google Maps ya existe**, pero está sin reclamar ni completar. Mientras siga así, Alfaro & Partners aparece en Maps con lo mínimo, sin control sobre descripción, fotos, servicios ni reseñas — y esas búsquedas del tipo "agente inmobiliario Retiro" se resuelven en el Local Pack, no en los resultados normales.

## Ruta rápida

1. Reclamar la ficha existente en [business.google.com](https://business.google.com).
2. Verificarla (postal, teléfono o vídeo, según lo que ofrezca Google en el momento).
3. Comprobar que el NAP de la ficha coincide con el del sitio — ver tabla de consistencia. Ya deberían coincidir: los datos del sitio se copiaron de la ficha.
4. Completar descripción, fotos y servicios (ver "Contenido de la ficha").

## Estado de la dirección — cerrado el 13/08/2026

Resuelto: es un **despacho con dirección física**, no un negocio de área de servicio.

**La ficha de Google Maps ya existe.** No hay que crearla: hay que reclamarla y completarla. Los datos de abajo están copiados literalmente de esa ficha, de modo que la web y Google ya dicen exactamente lo mismo.

El JSON-LD (`address` en `BaseLayout.astro`, alimentado desde `BUSINESS_INFO.address` en `src/lib/constants.ts`) declara ahora:

```json
{
  "streetAddress": "Calle de Narváez, 31",
  "addressLocality": "Madrid",
  "addressRegion": "Madrid",
  "postalCode": "28009",
  "addressCountry": "ES"
}
```

Además se declaran los horarios (`openingHoursSpecification`) idénticos a los de la ficha: lunes a viernes 10:30–19:00, sábados 10:30–13:30, domingos cerrado. El domingo no se declara: en schema.org la ausencia de un día ya significa cerrado.

- [x] Código postal confirmado (28009) y añadido a `BUSINESS_INFO.address`.
- [x] Dirección **visible** en el pie de página, no solo en los datos estructurados. Google valora el NAP que puede leer una persona.
- [ ] Confirmar el horario del **sábado**: Google lo mostraba como festivo (Asunción) el día de la consulta, así que 10:30–13:30 podría ser el horario especial de ese día y no el habitual.

## Consistencia NAP (Name, Address, Phone)

| Campo | Valor en el JSON-LD del sitio | Acción en GBP |
|---|---|---|
| Nombre (Name) | `Alfaro & Partners` (`BUSINESS_INFO.brandName`) | Usar exactamente `Alfaro & Partners` — no añadir palabras clave al nombre del negocio (viola las normas de Google y genera inconsistencia). |
| Dirección (Address) | `Calle de Narváez, 31 · 28009 Madrid, Madrid, ES` (`BUSINESS_INFO.address`) | Ya coincide con la ficha. Si alguna vez cambia, cambiarlo en los dos sitios en el mismo momento. |
| Teléfono (Phone) | `+34672504642` (`BUSINESS_INFO.phone`) | Mismo número, mismo formato internacional, en la ficha y en cualquier directorio adicional (páginas amarillas, colegios profesionales, etc.). |
| Sitio web | `https://alfaropartners.es` | Enlazar directo a la home, no a una landing de campaña. |
| Categoría principal | — | "Agencia inmobiliaria" o "Agente inmobiliario" (evaluar cuál captura mejor el modelo de representación del cliente, no de intermediación). |
| Categorías secundarias | — | Considerar "Servicios de tasación inmobiliaria" si aplica a la oferta real. |

## Contenido de la ficha

- [ ] Descripción del negocio (750 caracteres): reflejar el posicionamiento de "representación, no intermediación" que ya usa el sitio (`/herencias-inmobiliarias/`), sin keyword stuffing.
- [x] Horario de atención: ya declarado en el sitio (L-V 10:30–19:00, S 10:30–13:30), copiado de la ficha. Pendiente solo confirmar el sábado.
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

Nada bloquea ya: reclamar la ficha. El NAP del sitio y el de Google están alineados, así que el trabajo restante es de contenido (descripción, fotos, servicios, reseñas), no técnico.

Si en algún momento cambia la dirección, el teléfono o el horario, cambiarlos en `src/lib/constants.ts` y en la ficha **a la vez**: Google contrasta ambas fuentes y una discrepancia debilita el resultado local.
