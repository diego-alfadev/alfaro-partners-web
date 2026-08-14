# Brief: análisis de alquilabien.es y del trabajo de Propulsia

> Documento de traspaso para abrir una conversación nueva. Contiene todo el
> contexto necesario; no hace falta leer la sesión anterior.

## Qué se pide

Analizar el estado SEO y de marketing digital de **alquilabien.es** y, en la
medida de lo posible, reconstruir **qué trabajo hizo la agencia Propulsia**
durante los ~8-9 meses de contrato. Después, comparar con lo que se ha hecho
en alfaropartners.es para tener una referencia de contraste.

## Contexto

José María Alfaro es presidente de la Federación Nacional de Asociaciones
Inmobiliarias (FAI) y CEO de tres proyectos: **Alfaro & Partners** (nuevo,
lanzado en junio de 2026), **Nuevo Milenio** y **AlquilaBien**.

Para AlquilaBien contrató a **Propulsia**, una agencia de marketing digital y
SEO. Cifras que ha dado él mismo: **unos 6.000 €** a lo largo de **8-9 meses**.
Su valoración: **cero conversiones** y ninguna visibilidad sobre qué se hizo
realmente. Textualmente, que podría no haberse hecho nada y él no lo sabría.

Quiere "cantarles las cuarenta". El encargo es darle base objetiva para esa
conversación.

## Advertencia importante sobre el encargo

**No se trata de construir un caso a medida.** El valor de este análisis
depende por completo de que sea justo:

- Es perfectamente posible que Propulsia hiciera un trabajo técnico correcto
  y el problema fuera de estrategia, de producto, de mercado o de expectativas
  mal fijadas desde el principio.
- 6.000 € en 9 meses son ~660 €/mes. Es una tarifa baja para SEO. Conviene
  establecer qué era razonable esperar por ese importe antes de juzgar el
  resultado.
- "Cero conversiones" puede significar que no hubo conversiones, o que nunca
  se midieron. Son cosas muy distintas y hay que distinguirlas — en
  alfaropartners.es el seguimiento estaba instalado y roto sin que nadie lo
  supiera, así que este escenario es real y frecuente.
- Si el análisis concluye que el trabajo fue razonable, hay que decirlo. Un
  informe que solo confirma lo que el cliente ya quiere oír no le sirve para
  negociar nada.

## Qué mirar

### 1. Estado técnico actual de alquilabien.es
Mismo tipo de auditoría que se hizo en alfaropartners.es:

- Canonicalización: ¿responden http/https y www/no-www a la vez sin redirigir?
- Compresión por tipo de contenido — pedir con `Accept-Encoding: br,gzip` y
  comprobar el `content-encoding` de **la hoja de estilos**, no solo del HTML.
  Este fallo concreto apareció en A&P y las herramientas automáticas no lo
  detectan porque solo miran el documento principal.
- Peso del elemento LCP (normalmente la imagen principal).
- `robots.txt`, sitemap, `lastmod`, páginas en `noindex` que no deberían estarlo.
- Datos estructurados: ¿hay JSON-LD? ¿es válido? ¿tiene `LocalBusiness` con
  dirección y horarios?
- Comprobar que el 404 devuelve 404 de verdad.

### 2. Rastro del trabajo de la agencia
- **Wayback Machine** (`web.archive.org`): comparar el sitio antes y después
  del periodo de contrato. Es la fuente más objetiva de qué cambió.
- ¿Hay contenido publicado con periodicidad? ¿Blog, landings, páginas nuevas?
- ¿Se nota trabajo de keywords: títulos y descripciones orientados a búsqueda,
  o solo de marca?
- Perfil de enlaces: ¿aparecieron backlinks nuevos? ¿de qué calidad? Cuidado
  con detectar enlaces comprados de baja calidad, que serían un problema, no
  un logro.
- ¿Hay rastro de campañas de pago (parámetros UTM, restos de píxeles, Tag
  Manager con contenedores de Ads)?

### 3. Medición
La pregunta clave: **¿estaba bien medido?**

- ¿Hay Analytics instalado? ¿Qué versión, qué propiedad?
- ¿Hay eventos de conversión configurados, o solo pageviews?
- ¿Search Console vinculado?
- Si Diego consigue acceso a la propiedad de Analytics de AlquilaBien, mirar
  el historial de cambios (Admin → Historial de cambios de la propiedad, hasta
  2 años) — dice literalmente quién tocó qué y cuándo. Es la prueba más
  directa que existe de si alguien trabajó ahí.
- Revisar también **quién tiene acceso** a la propiedad. Si la agencia creó
  las propiedades en su propia cuenta, eso es lock-in y es relevante.

### 4. Comparación con Alfaro & Partners
Lo hecho en A&P entre el 10 y el 13 de agosto de 2026 está documentado en
detalle en engram bajo los topic keys `alfaro/*` y en `docs/seo/` de este
mismo repositorio. Sirve como vara de medir de qué constituye un trabajo
técnico completo.

## Accesos y herramientas disponibles

- `curl`, `rg`, `python3` para la auditoría técnica en vivo.
- Cuenta de Google del cliente: `hola@alfaropartners.es` (Analytics y Search
  Console de A&P). **No se sabe** si da acceso a AlquilaBien — hay que
  comprobarlo, y probablemente haga falta pedírselo a José María.
- Chrome con sesión iniciada, vía las herramientas de navegador.
- Wayback Machine, sin credenciales.

## Entregable sugerido

Un documento que responda a estas preguntas en este orden:

1. ¿En qué estado está alquilabien.es hoy, objetivamente?
2. ¿Qué se puede demostrar que se hizo durante el contrato?
3. ¿Qué era razonable esperar por 6.000 € en 9 meses?
4. ¿Dónde está la diferencia entre lo esperable y lo entregado, si la hay?
5. ¿Qué preguntas concretas debería hacerle José María a la agencia? Con
   nombres de métricas y de entregables, para que no le puedan responder con
   vaguedades.

El punto 5 es el que de verdad le sirve: no un veredicto, sino munición
específica y verificable para una conversación que va a tener él.
