# Enlaces entrantes: diagnóstico y qué pedir

> Verificado en vivo el 20 de agosto de 2026. Sustituye a la versión del 10 de
> agosto, cuyo planteamiento («pedid que el artículo enlace») no era ejecutable.

## El diagnóstico, que cambia el encargo

Se comprobaron una a una las piezas publicadas sobre José María Alfaro. El
resultado es consistente y no es el que suponíamos:

| Medio | Menciona a JM Alfaro | Menciona **Alfaro & Partners** | Enlaza a la web |
|---|---|---|---|
| Europa Press | Sí, 3 veces | **No** | No |
| idealista/news | Sí, es el sujeto | **No** | No |
| Inmodiario | Sí, es el sujeto | **No** | No |
| fainmo.es (ficha propia) | Sí, ficha dedicada | **No** | No |

**En las cuatro se le presenta solo como «presidente de FAI».** Ninguna nombra
la empresa.

Consecuencia: *pedir que el artículo enlace* es un encargo imposible. No se
puede enlazar una empresa que el texto no nombra — eso no es añadir un enlace,
es reescribir la pieza, y ningún medio edita una noticia de hace un año para
meter la web de una empresa.

## El hallazgo que sí sirve

La ficha que **FAI** tiene sobre él —`fainmo.es/air/jose-maria-alfaro/`— ya
enlaza a cuatro webs de negocio:

- `nuevomilenio-inmo.com`
- `personal-shopper-inmobiliario.es`
- `viveku.es`
- `gdinmofai.es`

Alfaro & Partners no está entre ellas. **El precedente ya existe, la página es
de su propia federación y él la preside.** Añadir la quinta es un cambio de una
línea que no depende de ningún criterio editorial ajeno.

## Qué pedir, por orden de facilidad

### 1. La ficha de FAI · trivial, hoy mismo
Añadir `alfaropartners.es` a la lista de webs de su ficha, junto a las otras
cuatro. Por el canal interno de la federación, no por formulario de prensa.

### 2. La firma en futuras declaraciones · el que más rinde a medio plazo
El cambio no es retroactivo, es de aquí en adelante: que cuando le citen, la
descripción sea **«José María Alfaro, presidente de FAI y fundador de Alfaro &
Partners»** en vez de solo el cargo federativo. Lo controla él y su gabinete, y
aplica a todo lo que se publique desde ahora. Cada pieza nueva nace ya con la
mención, y sobre una mención sí se puede pedir enlace.

### 3. Actualización retroactiva · difícil, solo donde compensa
Pedir a un medio que actualice una pieza publicada. La probabilidad es baja y
requiere una relación previa. Vale la pena intentarlo **solo en Europa Press**,
por autoridad de dominio. En idealista e Inmodiario el coste/beneficio no sale.

### 4. Piezas nuevas · lo que abre puertas nuevas
Una nota de prensa, una entrevista o una tribuna firmada como fundador de
Alfaro & Partners. Aquí es donde José María puede mover hilos que nosotros no
tenemos: contactos directos, no departamentos de comunicación.

## Por qué le viene bien, para explicárselo

Google decide a quién enseña según quién responde por ti. Un enlace desde una
web con reputación funciona como un voto, y hoy **una sola web en todo internet**
enlaza a `alfaropartners.es`.

Pero hay un argumento más directo que el técnico: **quien lee la noticia de
Europa Press y quiere contratarle, no puede.** No hay ninguna forma de llegar a
la web desde ahí. La pieza es un callejón sin salida. Se pierde el lector y se
pierde el voto, las dos cosas a la vez.

## URLs verificadas

- Europa Press — [FAI pide un 'Plan Marshall' nacional](https://www.europapress.es/economia/construccion-y-vivienda-00342/noticia-fai-pide-plan-marshall-nacional-mayor-crisis-vivienda-ultimos-40-anos-20250212142726.html) · 12 feb 2025
- idealista/news — [José María Alfaro, reelegido presidente de la Federación Nacional de Asociaciones Inmobiliarias](https://www.idealista.com/news/inmobiliario/vivienda/2025/02/12/831989-jose-maria-alfaro-reelegido-presidente-de-la-federacion-nacional-de-asociaciones) · 12 feb 2025
- Inmodiario — [José María Alfaro, reelegido presidente…](https://inmodiario.com/142/74907/jose-maria-alfaro-reelegido-presidente-de-la-federacion-nacional-de-asociaciones-inmobiliarias/) · 12 feb 2025
- FAI — [Ficha de José María Alfaro](https://fainmo.es/air/jose-maria-alfaro/) · **prioridad máxima**

Pendientes de comprobar (devolvieron 403 a la verificación automática):

- EjePrime — [José María Alfaro, nuevo presidente de la FAI](https://www.ejeprime.com/empresa/jose-maria-alfaro-nuevo-presidente-de-la-federacion-nacional-de-asociaciones-inmobiliarias)
- Canal Europa — [Entrevista sobre precio de la vivienda y alquiler](https://canaleuropa.es/title/entrevista-jose-maria-alfaro-presidente-de-la-federacion-de-asociaciones-inmobilirarias-sobre-el-precio-de-la-vivienda-y-el-alquiler-de-vivienda-en-espana/)

## Verificación

- [ ] fainmo.es: enlace confirmado en producción en la ficha
- [ ] Acordado el nuevo pie de firma para declaraciones
- [ ] Europa Press: intento de actualización retroactiva
- [ ] Revisar `src/lib/mediaReferences.ts` al sumar cada pieza nueva

Cuando un enlace esté confirmado no hace falta tocar código — es un backlink
externo. Si un medio pide logo, foto o bio, la fuente única es
`src/lib/constants.ts` (`BUSINESS_INFO`).
