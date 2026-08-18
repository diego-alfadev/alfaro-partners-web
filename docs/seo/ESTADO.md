# Estado del SEO de Alfaro & Partners

> Documento de traspaso. Pegar en una conversación nueva para retomar sin
> arrastrar el histórico. Actualizado el 18 de agosto de 2026.

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
- Ya está entregado al cliente y hay respuestas pendientes de procesar.

## Cuentas y accesos

| Qué | Dónde |
|---|---|
| Google (Analytics, Search Console) | `hola@alfaropartners.es` — ojo con el selector de cuenta de Chrome |
| GA4 | cuenta `396986347`, propiedad `540440298`, stream `15012974079`, medición `G-08PP9575QV` |
| Search Console | propiedad de prefijo `https://alfaropartners.es/`, verificada por DNS |
| Repo | `github.com/diego-alfadev/alfaro-partners-web`, despliegue automático a IONOS al hacer push a `main` |

## Datos al 18 de agosto (11–18 ago, 54 sesiones)

| Fuente | Sesiones | Interacción | Tiempo |
|---|---|---|---|
| Directo | 22 | 55 % | 4 s |
| **linkedin / social** | **18** | **61 %** | **32 s** |
| google / organic | 9 | 44 % | 15 s |
| ig / social | 3 | 33 % | 2 s |
| facebook.com / referral | 1 | 0 % | 0 s |

Campañas: `agosto-26` 16 · `perfil` 1 · `perfil\`` 1 (el del backtick, ya
corregido en origen pero sus visitas quedan contadas aparte).

**LinkedIn es la mejor fuente del sitio.** Casi todas las visitas aterrizan en
la portada.

## Lección aprendida, importante

**GA4 tarda 2–4 días en consolidar.** Dos conclusiones se sacaron demasiado
pronto y ambas resultaron falsas: primero «LinkedIn no trajo ni una visita»
(eran 18) y luego «casi nadie se queda a leer» (es la fuente que mejor se
comporta). No sacar conclusiones de datos con menos de 3–4 días.

## Pendientes

### Bloqueado en el cliente
- **R1** correo corporativo que sustituya a `jmaj07@gmail.com` (sigue en las
  páginas legales y fuera del JSON-LD)
- **R2** confirmar horario de sábados (Google mostraba festivo al consultarlo)
- **R3** reclamar la ficha de Google Business — **existe, no hay que crearla**
- **R4** fotos del despacho
- **R5** pedir enlaces a Europa Press, idealista, Canal Europa y fainmo.es —
  la acción de mayor retorno de todo el proyecto: solo **una** web enlaza a
  alfaropartners.es
- **D1–D5** decisiones de estrategia y diseño del panel

### Técnico pendiente
- `generate_lead` **sin marcar como evento clave** en GA4. Hay ~6 eventos
  registrados pero varios son pruebas del 13/08 (hay una anotación en GA4).
  Hasta marcarlo y dejar pasar una semana limpia **no hay cifra fiable de
  contactos**.
- Redirect HTTP→HTTPS: bloqueado tras una sonda que hay que desplegar y leer.
  Bloque comentado en `public/.htaccess`. Riesgo de bucle si se hace a ciegas.
- `postalCode` ya puesto (28009). Falta decidir si el NAP visible del pie
  necesita algo más.
- Panel tipo Looker Studio: sin montar, pendiente de D5.
- Contenido: las páginas de zonas tienen ~240 palabras frente a las 830 de la
  portada. Es el trabajo de fondo.

## Cómo consultar GA4 sin gastar contexto

Hoy se consulta abriendo el navegador, lo que cuesta muchísimo. **Montar la
Google Analytics Data API** convierte cada consulta en un script de segundos:

1. Crear proyecto en Google Cloud con `hola@alfaropartners.es`
2. Habilitar *Google Analytics Data API*
3. Crear una cuenta de servicio y descargar su clave JSON
4. En GA4 → Administrar → Gestión de accesos a la propiedad, añadir el correo
   de esa cuenta de servicio como **Lector**
5. Guardar la ruta del JSON en `~/.secrets.agents` (nunca en el repo)

Con eso, un script devuelve sesiones, campañas y eventos en JSON.

## Convenciones del proyecto

- Commits convencionales, **sin atribución de IA**
- Código, comentarios e identificadores en inglés; textos de la web en español
- Nada de `git push` sin pedirlo
- El despliegue corre solo al hacer push a `main`; el gate de auditoría
  (`bun audit`) bloquea el deploy si aparece una vulnerabilidad alta
