# Estado del SEO de Alfaro & Partners

> Documento de traspaso. Pegar en una conversación nueva para retomar sin
> arrastrar el histórico. Actualizado el 19 de agosto de 2026.

## Qué es esto

Diego es el técnico del proyecto, no una consultora de marketing. El encargo
fue auditar el SEO y, sobre todo, **transferir a Alfaro & Partners la
propiedad de la estrategia** para que deje de ser una caja negra. El cliente
viene escaldado de una agencia en otro proyecto (ver
`brief-analisis-alquilabien.md`), así que **todo lo que se afirme debe llevar
la forma de comprobarlo**.

## Entregable principal

- **Informe**: https://claude.ai/code/artifact/49dc598c-3717-4593-b2fc-91219daad0d1
- **Fuente**: `docs/seo/informe/informe-seo.html` en este repo.
- Para actualizarlo desde otra conversación: publicar ese fichero pasando la
  URL de arriba como parámetro `url`, o se creará un artifact distinto.
- **Ojo con el anclaje**: los que abren el enlace compartido pueden estar
  viendo una versión antigua. Tras cada publicación hay que reanclar la
  versión desde el menú de compartir.
- Ya está entregado al cliente y sus respuestas están procesadas más abajo.

## Tablero · el documento que manda

- **URL**: https://claude.ai/code/artifact/9b332751-f0b2-448f-8581-16a6d2db3a77
- **Fuente**: `docs/seo/tablero.html`
- Una línea por tarea, agrupadas por **quién la desbloquea** (ellos / nosotros /
  juntos). La columna «desbloquea» dice qué se queda parado, que es lo que hace
  que la gente actúe.
- **Regla, corregida el 21/08**: ningún documento nuevo deja tareas fuera del
  tablero, **pero solo se hacen visibles las de las tandas ya abiertas**. La
  versión sin esa condición metió las tareas del plan de zona en el tablero que
  vio el cliente antes de haber abierto esa conversación: 21 filas, y José
  contestó «se me ha quedado la mente en blanco» y pidió reunión de los cuatro.
- **Encuadre obligatorio**: el tablero abre diciendo cuántas cosas dependen de
  ellos, no cuántas hay en total. Aunque mandemos trabajo, la sensación tiene
  que ser que allanamos el camino.
- Versión actual: 4 filas suyas + 1 en curso, con el detalle plegado en
  `<details>`, y lo mío en un único bloque colapsado. Cabe en una pantalla.
- La versión larga con todo está guardada en `docs/seo/.tablero-completo.html.bak`
  — de ahí se recuperan las filas del plan cuando se abra la tanda 3.
- La URL no cambia nunca: se republica el mismo fichero.

## Entregable secundario · campaña de LinkedIn

- **Mini informe**: https://claude.ai/code/artifact/630fe47e-f83b-4158-9f0e-b13e7b2f3933
- **Fuente**: `docs/seo/informe/campana-linkedin-agosto.html`
- Qué es: el resultado de la campaña `agosto-26` con el paso a paso para que ellos
  mismos lo reproduzcan en GA4. Los números van con el rango 11–18 ago fijado
  explícitamente para que abran Analytics, pongan ese rango y vean lo mismo.
- Pasos de GA4 **verificados en pantalla el 19 de agosto**, con dos
  reproducciones de la interfaz en SVG (no capturas: imprimen nítido, que el
  cliente lo va a exportar a PDF).

## Cuentas y accesos

| Qué | Dónde |
|---|---|
| Google (Analytics, Search Console) | `hola@alfaropartners.es` — en el Chrome de Diego es **`authuser=5`** |
| GA4 | cuenta `396986347`, propiedad `540440298`, stream `15012974079`, medición `G-08PP9575QV` |
| Search Console | propiedad de prefijo `https://alfaropartners.es/`, verificada por DNS |
| Repo | `github.com/diego-alfadev/alfaro-partners-web`, despliegue automático a IONOS al hacer push a `main` |

## Datos 11–18 ago, cerrados y leídos el 19 (55 sesiones)

| Fuente | Sesiones | Interacción | Tiempo |
|---|---|---|---|
| Directo | 22 | 54,6 % | 4 s |
| **linkedin / social** | **20** | **60 %** | **30 s** |
| google / organic | 9 | 55,6 % | 17 s |
| ig / social | 3 | 33,3 % | 2 s |
| facebook.com / referral | 1 | 0 % | 0 s |

Por campaña: `(direct)` 22 · **`agosto-26` 16 · 62,5 % · 36 s** · `(organic)` 9 ·
`(referral)` 4 · `perfil` 3 · `perfil\`` 1 (el del backtick, ya corregido en
origen pero sus visitas quedan contadas aparte).

**Cuidado con cómo se lee esto.** `agosto-26` era una campaña de **lanzamiento**:
el público es sobre todo red profesional de José María, colegas y conocidos
entrando a curiosear — no demanda de mercado. Demuestra que la web aguanta la
primera impresión; no demuestra nada sobre captación. Encuadre fijado por Diego
el 19 de agosto y ya aplicado al anexo.

## Lección aprendida, importante

**GA4 tarda 2–4 días en consolidar.** Dos conclusiones se sacaron demasiado
pronto y ambas resultaron falsas: primero «LinkedIn no trajo ni una visita»
(eran 18) y luego «casi nadie se queda a leer» (es la fuente que mejor se
comporta). No sacar conclusiones de datos con menos de 3–4 días.

## Pendientes

### Respondido por José María el 18–19 de agosto

| | Respuesta | Qué desbloquea |
|---|---|---|
| **D1** | Personal shopper **y** herencias | Dos focos, el máximo que permitía la pregunta. Herencias ya tiene página; personal shopper no — hay que crearla. |
| **D2** | Valida las de ejemplo y añade seis (ver abajo) | Material de contenido para las páginas flojas. |
| **D3** | Recomendación · cita reservada · llamada | **Pone recomendación primero, y la recomendación no pasa por la web.** Ver nota. |
| **D4** | Diza Consultores · Gilmar Retiro · Lucas Fox | Competencia a analizar. |
| **R1** | `hola@alfaropartners.es` | Accionable ya: páginas legales + JSON-LD. |
| **R2** | Sábados no festivos y **excepto agosto**, 10:30–13:30 | Accionable ya: web + ficha de Google (el «excepto agosto» va como horario especial, GBP no lo modela). |
| **R3** | «pues dime cómo» | Hay que pasarle el procedimiento — ya está escrito en `gbp-checklist.md`. |
| **R4** | 2–3 fotos; Augusto revisa qué planos sirven | Sin bloqueo, a la espera. |
| **R5** | **Malentendido** — propone enlazar desde FAI o desde la web de NM | Ver nota. |
| **D5** | Sin respuesta todavía | Panel sigue sin diseñar. |

Frases añadidas en D2, con su lectura:

1. «Necesito una inmobiliaria que se encargue del alquiler, del inquilino y me asegure el cobro» — alquiler garantizado. Intención comercial alta.
2. «Quiero comprar piso / ático en Retiro o Barrio Salamanca» — encaja con el foco de personal shopper de D1.
3. «Qué tengo que pagar de impuestos si vendo mi casa» — plusvalía e IRPF. Mucho volumen, convierte regular, buena puerta de entrada.
4. «Necesito un programa de valoración de viviendas fiable» — **ojo, esta no es del cliente final**: quien busca eso es un profesional buscando software. Confirmar con él a quién tenía en la cabeza.
5. «Necesito tasar mi casa» — valoración. La búsqueda más directa de las seis.
6. «Hipoteca fijo o variable» — muy competida y no lleva a un encargo. Sirve como artículo, no como página de servicio.

**Nota sobre D3.** Poner la recomendación como mejor contacto es coherente con el negocio, pero
la recomendación **no se puede medir en la web**: llega por teléfono o en persona. Consecuencia
para el SEO: el trabajo pesa más en reputación y ficha de Google (lo que ve alguien a quien ya
le han hablado de ellos) que en captar tráfico frío. Hay que decírselo explícitamente.

**Nota sobre R5, importante — no se ha entendido la petición.** R5 no era «poned un enlace en
vuestras webs». Era pedir a **Europa Press, idealista y Canal Europa**, que ya han publicado
sobre José María, que el artículo enlace a alfaropartners.es. Un enlace desde FAI o desde NM
es un enlace propio: cuenta poco. Uno de Europa Press cuenta, y cuenta para siempre. Hay que
reexplicarlo y ofrecerle los correos ya redactados, que es lo que él estaba pidiendo con
«no sé bien cómo».

### Bloqueado todavía en el cliente
- **R3** reclamar la ficha de Google — **existe, no hay que crearla**
- **R4** fotos del despacho
- **R5** los tres enlaces de prensa, tras reexplicar la petición
- **D5** ya no está bloqueado: Diego decidió Looker Studio. Falta que validen
  los seis números propuestos en el tablero

### Técnico pendiente
- ~~`generate_lead` sin marcar~~ → **hecho el 19/08**. `contact_click` se queda
  sin marcar a propósito: solo dispara en `mailto:`, y todos están en páginas
  legales. Las dimensiones `Lead method` y `CTA location` ya estaban desde el
  13/08. Falta una semana limpia para tener cifra.
- Redirect HTTP→HTTPS: bloqueado tras una sonda que hay que desplegar y leer.
  Bloque comentado en `public/.htaccess`. Riesgo de bucle si se hace a ciegas.
- `postalCode` ya puesto (28009). Falta decidir si el NAP visible del pie
  necesita algo más.
- Panel: **Looker Studio decidido**. Da URL fija y además envío mensual por
  correo, que resuelve las dos opciones que planteaba D5. Bloqueado hasta que
  validen métricas y haya semana limpia de contactos.
- Contenido: las páginas de zonas tienen ~240 palabras frente a las 830 de la
  portada. Es el trabajo de fondo.

## Cómo consultar GA4 sin gastar contexto

Mientras no haya API, la vía barata verificada: abrir en Chrome esta URL
cambiando fechas y dimensión, y leer la tabla. Dos llamadas, sin capturas.

```
https://analytics.google.com/analytics/web/?authuser=5#/a396986347p540440298/reports/explorer?params=_u..nav%3Dmaui%26_u.date00%3D20260811%26_u.date01%3D20260818%26_r.explorerCard..seldim%3D%5B%22sessionSourceMedium%22%5D&r=lifecycle-traffic-acquisition-v2
```

`seldim` acepta `sessionSourceMedium` y `sessionCampaignName`. Ese parámetro sí
funciona; `r=all-events` y `seldim=eventName` no. En el menú, el informe está en
**Objetivos de negocio → Generar oportunidades de venta → Adquisición de
tráfico**, no en «Informes → Adquisición».

**Montar la Google Analytics Data API** sigue siendo mejor y convierte cada
consulta en un script de segundos:

1. Crear proyecto en Google Cloud con `hola@alfaropartners.es`
2. Habilitar *Google Analytics Data API*
3. Crear una cuenta de servicio y descargar su clave JSON
4. En GA4 → Administrar → Gestión de accesos a la propiedad, añadir el correo
   de esa cuenta de servicio como **Lector**
5. Guardar la ruta del JSON en `~/.secrets.agents` (nunca en el repo)

Con eso, un script devuelve sesiones, campañas y eventos en JSON.

## Respuesta al plan de 90 días · entregable

- **URL**: https://claude.ai/code/artifact/40eed714-43b2-46f3-be37-4701d17e0e67
- **Fuente**: `docs/seo/respuesta-plan-90-dias.html`
- Tesis: el objetivo declarado del plan —ser un punto **reconocible**— tiene una
  mitad digital que el documento no contempla. No añade objetivos, señala que
  el suyo está a medias.
- **Lo urgente**: el QR de las tarjetas (§13, materiales del mes 1). Si se
  imprime sin etiquetar, nunca se sabrá cuántas visitas trajo el trabajo de
  calle. No tiene arreglo después.
- Va a la reunión de la semana del 24. Sus cuatro decisiones ya están en el
  tablero.

## El plan de 90 días de José María (19 ago)

Documento suyo: `alfaro&partners/docs/Plan_90_dias_Alfaro_Partners_Narvaez_31.docx`. Es un plan
de farming de proximidad para Narváez 31 — trabajo de calle, censo de edificios, prescriptores
y microeventos en Ibiza y Niño Jesús. Se analiza los tres juntos la semana del 24.

Dónde se toca con el SEO, que es lo que aporta este lado:

- **El plan ya produce el contenido que falta.** «Informe trimestral de microzona» y «guía del
  propietario» son exactamente el material que necesitan las páginas de zonas, que hoy tienen
  ~240 palabras frente a las 830 de la portada. Se escriben una vez y sirven en papel y en web.
- **Los prescriptores del plan son los enlaces de R5.** Farming referencial y link building son
  la misma acción con dos nombres: administradores, comercios y FAI son webs que pueden enlazar.
- **Los títulos de los microeventos son títulos de página.** «Errores al vender una vivienda
  heredada» o «Comprar en Retiro con representación» son, literalmente, búsquedas.
- **La web no aparece en el plan.** El embudo del CRM registra el origen como «paso por oficina,
  recomendación, comercio, evento, edificio o contacto personal» — no hay «web». Si la web no
  entra en ese campo, nunca se va a saber si sirve para algo. Es la corrección más barata del
  documento y hay que plantearla en la reunión.
- **D4 y el plan no dicen lo mismo.** Como competencia nombra a Gilmar y Lucas Fox, que son
  cadenas grandes; el plan, en cambio, se construye sobre proximidad y representación. Diza
  Consultores sí es comparable. Merece la pena aclarar contra quién se compite de verdad.

## Otros documentos

- `reference-funnel-benchmark.md` — comparación con el embudo de una web de
  referencia del sector. Conclusión: A&P está mejor posicionada en marca y
  peor en convertir visitas en contactos.
- `gbp-checklist.md` y `outreach-checklist.md` — accionables para el cliente.

**AlquilaBien y Propulsia son otro proyecto distinto**, no tienen relación con
Alfaro & Partners. Su material vive en `NM/alquilabien/propulsia/`. No mezclar.

## Convenciones del proyecto

- Commits convencionales, **sin atribución de IA**
- Código, comentarios e identificadores en inglés; textos de la web en español
- Nada de `git push` sin pedirlo
- El despliegue corre solo al hacer push a `main`; el gate de auditoría
  (`bun audit`) bloquea el deploy si aparece una vulnerabilidad alta
