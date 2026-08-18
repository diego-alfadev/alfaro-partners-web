# Análisis provisional de AlquilaBien y del trabajo de Propulsia

**Fecha:** 14 de agosto de 2026  
**Objeto:** determinar qué trabajo es demostrable, si resulta proporcionado a unos 6.000 € en 8–9 meses, qué explica la ausencia aparente de conversiones y qué debe pedir José María antes de reclamar a la agencia.

## Veredicto provisional

**No sería correcto afirmar que “no se hizo nada”.** Hay un rastro público consistente con un ciclo real de SEO y contenidos durante el periodo aproximado del contrato:

- 11 artículos nuevos entre el 23/12/2025 y el 05/08/2026.
- 14 artículos antiguos revisados.
- Reoptimización de la home y actualización coordinada de cinco páginas comerciales.
- Titles, metas, FAQs y contenido orientado a “gestión del alquiler”, Madrid y Alcorcón.

**Tampoco hay evidencia suficiente para afirmar que el gasto produjo valor comercial.** La medición de leads no es verificable desde fuera, la autoridad local sigue siendo débil, la identidad del negocio es incoherente entre la web y su nueva sede, y la web conserva fricción de conversión y fallos de control de calidad.

La lectura más justa es:

| Pregunta | Respuesta actual |
|---|---|
| ¿Hubo trabajo visible? | **Sí.** No parece mantenimiento casual. |
| ¿Puede atribuirse a Propulsia? | **No todavía.** Faltan WordPress, historiales y entregables. |
| ¿Es absurdo pagar 6.000 € por ese volumen? | **No.** Unos 660 €/mes es un retainer bajo y el volumen público es plausible para ese importe. |
| ¿Está demostrado que el trabajo funcionó? | **No.** Faltan tráfico, rankings, leads y ventas. |
| ¿Está demostrado que hubo cero conversiones? | **No.** Puede haber cero leads, cero ventas o cero medición; son problemas diferentes. |
| ¿La situación actual es satisfactoria? | **No.** Medición, SEO local, entidad, CRO y rendición de cuentas están incompletos. |

**Conclusión económica:** el coste puede ser compatible con las tareas visibles, pero **no es defendible todavía como inversión de captación**. Si el alcance contratado era solo contenido y optimización on-page, hay entrega parcial demostrable. Si incluía generación de negocio, conversión, SEO local o reporting con KPIs, el estado actual presenta carencias serias.

## Repositorio y tecnología revisados

No se encontró un repositorio local de AlquilaBien en `/Users/diego/projects/NM` ni en `/Users/diego/projects`, tampoco un remoto Git que contenga `alquilabien` en su configuración. Por tanto, esta auditoría **no ha revisado el historial de un repositorio de AlquilaBien**: ha inspeccionado el HTML, los assets, los sitemaps y el DOM público de producción.

La web que sirve actualmente `https://alquilabien.es` es WordPress, no Laravel. La evidencia pública incluye rutas `/wp-content/`, Yoast SEO 28.1, sitemap de Yoast, WordPress Site Kit y plugins WordPress. Podría existir un repositorio Laravel con otro nombre o para otro sistema, pero no es lo que está sirviendo la web pública auditada. Para revisarlo hace falta su ruta local o URL de GitHub/GitLab.

## Lo que se puede demostrar que cambió

### Cronología pública

- El snapshot de Wayback del 13/10/2025 conserva una home con título y descripción genéricos.
- El 19/02/2026 ya aparecen un title orientado a Madrid, nueva description, H1, contenido ampliado para Madrid/Alcorcón y FAQ schema. El HTML declara modificación el 29/12/2025.
- El 09/03/2026 se observa otra ampliación semántica, con modificación declarada el 04/03/2026.
- El sitemap actual muestra 11 contenidos nuevos durante el periodo, 14 revisiones de artículos previos y cinco páginas comerciales modificadas consecutivamente el 25/05/2026 entre las 07:47 y las 07:51 UTC.
- El sitio actual tiene unas 31 URLs indexables en sus sitemaps.

Esto demuestra actividad. Las fechas `lastmod` o `dateModified` no demuestran por sí solas la profundidad de cada cambio ni quién lo hizo.

### Los 11 contenidos nuevos detectados

La clasificación como “nuevo” se basa en el `datePublished` declarado en el JSON-LD de cada artículo, no en commits de un repositorio:

1. 23/12/2025 — [¿Qué es el alquiler seguro?](https://alquilabien.es/que-es-alquiler-seguro/)
2. 26/01/2026 — [Cómo calcular la rentabilidad de una vivienda de alquiler](https://alquilabien.es/como-se-calcula-la-rentabilidad-de-una-vivienda-de-alquiler/)
3. 16/02/2026 — [IVA en el alquiler de una vivienda](https://alquilabien.es/alquiler-con-iva/)
4. 16/03/2026 — [Vivir en Alcorcón](https://alquilabien.es/vivir-en-alcorcon/)
5. 16/04/2026 — [Administración de propiedades](https://alquilabien.es/administracion-propiedades/)
6. 05/05/2026 — [Retamar de la Huerta: ¿habrá alquiler en el nuevo barrio?](https://alquilabien.es/retamar-de-la-huerta-en-alcorcon-habra-viviendas-en-alquiler-en-el-nuevo-barrio/)
7. 16/05/2026 — [¿Qué hacer si mi inquilino no paga el alquiler?](https://alquilabien.es/inquilino-no-paga-alquiler/)
8. 28/05/2026 — [Empadronamiento y domicilio fiscal](https://alquilabien.es/empadronamiento-y-domicilio-fiscal/)
9. 15/06/2026 — [Alquiler sin contrato](https://alquilabien.es/alquiler-sin-contrato/)
10. 15/07/2026 — [Contrato de alquiler para estudiantes](https://alquilabien.es/contrato-alquiler-estudiantes/)
11. 05/08/2026 — [Renovación del contrato de alquiler](https://alquilabien.es/renovacion-contrato-alquiler-como-hacerlo/)

Estos contenidos existen y están publicados. La evidencia pública no permite afirmar quién los redactó ni si Propulsia los creó, revisó o simplemente publicó.

### Qué no puede demostrarse públicamente

- Qué cambios hizo Propulsia y cuáles hicieron Neo Estudio, Cocuna Marketing u otra persona.
- Cuántas horas se dedicaron.
- Si existió keyword research, estrategia de enlaces, optimización del Perfil de Empresa o campañas.
- El tráfico, las consultas, los rankings iniciales/finales, los leads o los contratos logrados.
- Si las etiquetas de analítica registraron correctamente los contactos.

El footer sigue acreditando el diseño y desarrollo a **Neo Estudio y Cocuna Marketing**, no a Propulsia.

## Estado técnico actual

### Bien resuelto

- La variante canónica es `https://alquilabien.es/`; las demás redirigen.
- `robots.txt` permite rastreo y referencia el sitemap de Yoast.
- Sitemap accesible y URLs declaradas con respuesta 200.
- Canonicals presentes.
- Las URLs inexistentes devuelven 404 real.
- Brotli funciona para HTML y CSS.
- HSTS, `nosniff`, `SAMEORIGIN` y política de referrer presentes.
- Hay `WebPage`, `WebSite`, `Organization`, `BreadcrumbList` y `FAQPage` en JSON-LD.

### Debilidades de mayor impacto

| Hallazgo | Impacto | Por qué importa |
|---|---:|---|
| No es verificable la medición de formularios, teléfono y WhatsApp | Crítico | No permite distinguir falta de leads de analítica rota. |
| Web: C/ Oslo 5; nueva oficina/ficha: Parque Bujaruelo 17 | Alto | Fragmenta la entidad local y puede perjudicar Maps, confianza y recomendaciones IA. |
| Falta `LocalBusiness`/`RealEstateAgent` con NAP, horario y relación con Nuevo Milenio | Alto | Google recibe una marca, una sede y una trayectoria poco conectadas. |
| Formulario principal muy abajo y propuesta inicial genérica | Alto | El usuario ve promesas, pero poca prueba social, proceso, cifras o motivo para contactar ya. |
| Home de ~297 KB de HTML, 30 CSS y 44 scripts | Alto/medio | Añade complejidad, riesgo de LCP tardío y superficie de fallos. |
| Hero descubierto desde CSS, sin preload visible | Medio | Puede retrasar el elemento LCP. |
| 7 páginas sin meta description y 2 sin H1 | Medio | Señal de QA incompleto tras una optimización masiva. |
| Titles largos, descripciones repetidas y errores editoriales visibles | Medio | Reduce calidad percibida y puede perjudicar CTR. |
| `http://www` necesita dos redirecciones | Bajo | Ineficiencia técnica menor. |
| Exposición de PHP/Plesk y `/readme.html` | Bajo | Información técnica innecesaria. |

### Medición visible desde el código público

- Google Tag: `GT-T9HCFDRB`.
- Google Tag Manager: `GTM-WNL5QTLK`.
- El WhatsApp flotante declara un evento GTM llamado `Click to Chat`.
- No se observa en el HTML un ID `G-*`, `AW-*`, Meta Pixel ni una prueba pública de que los eventos lleguen a GA4 y estén marcados como eventos clave.

Esto **no demuestra ausencia de configuración dentro de GTM**. Demuestra que hay que abrir el contenedor, usar Preview/DebugView y probar el embudo de extremo a extremo.

## Por qué puede no haber conversiones

La explicación no debe elegirse por intuición. Hay que localizar en qué tramo se rompe el embudo:

```text
Demanda → impresión → clic/visita → acción → lead válido → cita → contrato
```

| Hipótesis | Cómo se prueba |
|---|---|
| No hay visibilidad suficiente | GSC: impresiones, consultas, páginas, posición y CTR. GBP: consultas de descubrimiento y vistas. |
| Hay tráfico, pero de intención informativa o de inquilino | GA4 + GSC por landing/consulta; separar propietario, inquilino y tráfico de blog. |
| El mensaje no convence | CTR de CTA, scroll, formularios iniciados/completados, sesiones grabadas si hay consentimiento y herramienta válida. |
| Los contactos no se miden | GTM Preview, GA4 DebugView, envío de prueba, clics de teléfono/WhatsApp y revisión del inbox. |
| Hay leads, pero no llegan o no se responden | Logs del formulario, correo/spam, WhatsApp, registro de llamadas y tiempos de respuesta. |
| Hay leads, pero no se cierran | CRM: lead válido → contacto → cita → propuesta → contrato, con motivo de pérdida. |
| SEO generó contenido sin autoridad local | GBP, reseñas, backlinks/citaciones locales, consistencia NAP y enlaces entre AlquilaBien/Nuevo Milenio/A&P. |

El blog mezcla contenidos con buena intención de propietario —impago, rentabilidad, alquiler seguro— con otros de intención más informativa o de inquilino. Publicar artículos puede aumentar impresiones sin aumentar propietarios captados si la estrategia no conecta cada consulta con una landing, una oferta y un seguimiento comercial.

## Por qué Google IA menciona antes a Nuevo Milenio

Las dos capturas **no comparan el mismo sistema**:

- Escritorio: Google Search en **Modo IA**.
- Móvil: aplicación Gemini con **Gemini Flash**.

Aunque la frase hubiese sido idéntica, cambian producto, modelo, cuenta, historial, ubicación y fuentes. Google confirma que los resultados pueden variar por tiempo, centro de datos, ubicación, idioma, dispositivo, búsquedas recientes y personalización. AI Mode además divide la pregunta en subconsultas y puede usar técnicas distintas a otros productos.

La ausencia en una respuesta es una alerta cualitativa, no un KPI contractual. La presencia en la captura móvil también prueba que **AlquilaBien no es invisible para la IA**.

El motivo competitivo más probable es de entidad y corroboración:

- Nuevo Milenio declara más de 500 reseñas, 4,8 de valoración y trayectoria desde 2004.
- Sus páginas y testimonios hablan de alquiler y mencionan agentes concretos como Elena.
- AlquilaBien tiene muchas menos reseñas propias y señales externas.
- La web dice Oslo 5 mientras la oficina nueva y la ficha apuntan a Parque Bujaruelo 17.
- El schema no conecta la ubicación, la ficha, el teléfono, la organización matriz y la trayectoria.
- Alfaro & Partners menciona AlquilaBien, pero actualmente no enlaza su web pese a tener la URL en constantes.

No hace falta perseguir “trucos GEO”. La guía oficial de Google mantiene que para AI Mode sirven las mismas bases: indexación, contenido útil, datos estructurados coherentes, buena experiencia y Perfil de Empresa actualizado.

### Cómo medir visibilidad IA de forma seria

1. Definir 10–20 prompts comerciales reales.
2. Registrar producto, modelo, texto exacto, fecha/hora, ubicación, idioma, cuenta, personalización y dispositivo.
3. Repetir con sesión personal y sesión no personalizada.
4. Guardar marcas citadas, posición, fuentes y URLs.
5. Repetir semanalmente; no reaccionar a una captura aislada.
6. Revisar en Search Console el nuevo informe de funciones generativas si está disponible para la propiedad.
7. Revisar en GA4 el canal **AI Assistant**, introducido por Google en mayo de 2026, y sus eventos clave.

Fuentes oficiales: [variación de resultados](https://support.google.com/websearch/answer/12412910), [cómo funciona AI Mode](https://support.google.com/websearch/answer/16011537), [funciones de IA y sitios web](https://developers.google.com/search/docs/appearance/ai-features), [informes generativos de Search Console](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) y [canal AI Assistant de GA4](https://support.google.com/analytics/answer/9164320).

## Qué era razonable esperar por 6.000 €

Con unos 660 €/mes no sería razonable exigir resultados garantizados, un gran programa de enlaces, producción masiva ni dominio inmediato de resultados IA. Sí sería razonable esperar como mínimo:

1. Baseline, objetivos y definición de conversión.
2. GA4/GTM/GSC/GBP propiedad del cliente y probados.
3. Auditoría técnica y resolución de los bloqueos principales.
4. Keyword map y priorización por intención comercial.
5. Optimización de páginas comerciales y una cadencia modesta de contenido.
6. Trabajo local: NAP, Perfil de Empresa, reseñas y citaciones.
7. Informe mensual que diga qué se hizo, qué cambió y qué KPI debía mover.
8. Registro de leads y conexión con la venta real.

La producción visible cumple parte de los puntos 4 y 5. Lo que hoy no está demostrado son los puntos 1, 2, 6, 7 y 8, precisamente los que permiten valorar el retorno.

### Cálculo correcto del retorno

No basta con “conversiones”. José debe facilitar:

- margen de contribución por nuevo propietario;
- cuota inicial y cuota mensual;
- permanencia media;
- tasa de cierre desde lead válido;
- tiempo comercial dedicado.

Después:

```text
LTV de contribución = margen inicial + (margen mensual × meses de permanencia)
Contratos para recuperar inversión = 6.000 € / LTV de contribución
Leads necesarios = contratos necesarios / tasa de cierre
```

Sin esos datos no existe una evaluación económica seria.

## Accesos que debe pedir José

### Prioridad 1: imprescindibles para explicar las conversiones

- **GA4, rol Administrador:** propiedad, usuarios, Historial de cambios, streams, eventos, eventos clave, atribución y vínculo con GSC.
- **GTM `GTM-WNL5QTLK`, acceso de publicación/administración:** versiones, autores, fechas, triggers, variables y etiquetas. Confirmar quién controla `GT-T9HCFDRB`.
- **Search Console, rol Propietario:** 16 meses de consultas, páginas, países, dispositivos, indexación, sitemaps, Core Web Vitals, enlaces e informe generativo si aparece.
- **Google Business Profile de AlquilaBien y Nuevo Milenio, rol propietario:** consultas, llamadas, clics web, mensajes, rutas, reseñas, cambios de ubicación/categoría y usuarios.
- **WordPress, administrador:** usuarios, roles, revisiones, autores, plugins SEO, formularios, redirecciones y fechas.
- **Leads reales:** inbox del formulario, WhatsApp Business, registro de llamadas, CRM/calendario y contratos.

### Prioridad 2: atribuir el trabajo y juzgar el coste

- Contrato, propuesta, fechas exactas, facturas y alcance mensual.
- Objetivos, KPI y baseline aceptados al inicio.
- Informes mensuales originales.
- Keyword map inicial/final y rankings.
- Calendario editorial, briefs y URLs creadas/modificadas.
- Listado de backlinks/citaciones con fecha, URL, coste y criterio de calidad.
- Exportaciones de Google Ads/Meta: gasto, campañas, búsquedas, públicos, creatividades, conversiones y UTMs.
- Backups del hosting y logs de cambios/subidas.
- Usuarios y permisos actuales e históricos de la agencia en todas las plataformas.

### Dudas concretas para José

1. ¿Cuáles fueron exactamente las fechas de inicio y fin?
2. ¿Los 6.000 € incluyen inversión publicitaria o solo honorarios?
3. ¿Qué se contrató: SEO, contenidos, web, local/GBP, Ads, redes o captación?
4. ¿Qué se definió como conversión: formulario, llamada, WhatsApp, cita, propietario válido o contrato?
5. ¿Cuál era el objetivo mensual y el baseline?
6. ¿Quién construyó/modificó la web: Propulsia, Neo Estudio, Cocuna u otro proveedor?
7. ¿Cuál es la dirección canónica actual: Oslo 5, Parque Bujaruelo 17 o ambas con funciones diferentes?
8. ¿AlquilaBien tiene una ficha propia, duplicada o vinculada de algún modo a Nuevo Milenio?
9. ¿A qué correo llegan los formularios y quién responde? ¿Hay spam o pérdidas conocidas?
10. ¿Existe un registro mensual de llamadas, WhatsApps, citas y contratos?
11. ¿Cuánto vale un nuevo contrato de gestión en margen y permanencia?

## Preguntas que Propulsia debe responder con evidencia

1. **¿Qué cambio concreto hicisteis cada mes, quién lo hizo y dónde está?**
2. **¿Qué métrica debía mover cada cambio y cuál fue el antes/después?**
3. **¿Qué propiedad GA4, GSC, GTM y GBP utilizasteis y quién es su propietario?**
4. **¿Qué eventos de formulario, teléfono y WhatsApp probasteis? Mostrad DebugView o evidencia equivalente.**
5. **¿Cuántos leads registrasteis por canal, cuántos eran propietarios válidos y cómo se reconciliaron con el CRM?**
6. **¿Qué consultas y páginas crecieron en impresiones, clics, CTR y posición?**
7. **¿Qué trabajo se hizo en el Perfil de Empresa, reseñas y citaciones locales?**
8. **¿Por qué la web y la oficina/ficha muestran direcciones distintas?**
9. **¿Qué backlinks se obtuvieron y cuáles siguen activos?**
10. **¿Qué parte del trabajo visible es atribuible a Propulsia y qué parte a Neo Estudio/Cocuna?**
11. **¿Qué no funcionó, cuándo se detectó y qué se cambió como consecuencia?**
12. **Entregad un cierre exportable y acceso propiedad del cliente, no capturas ni un PDF agregado.**

## Respuesta breve para José

> He encontrado trabajo real; no sostendría que no hicieron nada. Hay once artículos nuevos, revisiones de contenido y una reoptimización clara de las páginas comerciales. El problema es que eso no demuestra retorno: ahora mismo no podemos verificar bien las conversiones, el SEO local está fragmentado entre Oslo y Parque Bujaruelo y la autoridad propia de AlquilaBien es muy inferior a la de Nuevo Milenio. Las dos capturas tampoco comparan lo mismo: una es Google Modo IA y la otra Gemini Flash. Antes de discutir, pediría contrato, informes y acceso de administrador a GA4, GSC, GTM, WordPress y la ficha de Google. Con eso podremos decir qué hizo Propulsia, qué funcionó y si los 6.000 € estuvieron justificados. Sin esos datos, la crítica correcta no es “no hicisteis nada”, sino “no habéis demostrado impacto ni dejado una medición auditable”.

## Próximo paso recomendado

1. José concede o recupera los accesos de prioridad 1.
2. Se prueba el embudo completo con un lead de prueba y se reconcilia con correo/CRM.
3. Se exportan 16 meses de GA4, GSC, GBP y GTM.
4. Se cruza cada mes facturado con entregable, cambio demostrado, KPI y resultado.
5. Solo entonces se emite un veredicto económico final y se prepara la conversación de cierre con Propulsia.

## Limitaciones

- No existe código, backup ni repositorio local de AlquilaBien en el workspace NM.
- La auditoría técnica se hizo sobre la web pública; no se accedió al WordPress, hosting ni contenedores autenticados.
- No se envió el formulario real para no generar un lead comercial.
- Wayback conserva snapshots útiles principalmente hasta marzo de 2026; para cambios posteriores se usaron sitemap y metadatos actuales.
- No se realizó una auditoría profesional de backlinks; las búsquedas públicas no sustituyen Search Console, Semrush o Ahrefs.
- La coincidencia temporal no atribuye los cambios a Propulsia.
