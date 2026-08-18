# Aprendizajes SEO y de captación de la web de referencia

Este documento resume los aprendizajes obtenidos al comparar Alfaro & Partners con la landing y el embudo comercial de Montse Cespedosa. Su objetivo es aportar contexto al trabajo de estrategia SEO, separando oportunidades nuevas de decisiones que ya están contempladas.

## Conclusión

Alfaro & Partners tiene un posicionamiento más diferenciado y premium. La referencia está más avanzada en convertir visibilidad y contenido en contactos comerciales:

```text
Redes y colaboraciones → landing específica → guía → consulta → servicio
```

El aprendizaje no consiste en copiar su marca o sus promesas, sino en conectar mejor contenido, páginas de intención, captación y seguimiento comercial.

## Elementos aprovechables

- Una página enfocada en cada problema o intención concreta.
- Una propuesta sencilla y fácil de entender.
- Prueba de autoridad mediante trayectoria, medios, cifras, testimonios y casos.
- Un recurso útil para captar al usuario que todavía no está preparado para reservar.
- Continuidad entre contenido, campañas, web y seguimiento comercial.
- Medición del origen de los contactos mediante enlaces de campaña.

## Qué ya existe o está contemplado en Alfaro & Partners

- La landing de herencias ya representa el modelo de página vertical por problema.
- La protección de las guías mediante formulario está prevista en la arquitectura AdonisJS/Mobilia.
- Astro seguirá siendo la superficie pública y SEO.
- Mobilia será el sistema de registro para clientes, leads, campañas y seguimiento comercial.
- GA4 ya mide como `generate_lead` los clics hacia reserva y WhatsApp.

Por tanto, no hace falta inventar otra estrategia. El siguiente paso es completar el circuito de la guía de herencias y reutilizar ese patrón cuando se validen nuevas verticales.

## Contenido que depende del cliente

Los casos de éxito y testimonios requieren participación de José y Augusto:

1. Identificar operaciones representativas.
2. Explicar el contexto y el valor aportado.
3. Obtener autorización del cliente.

Con esa materia prima se pueden entrevistar, redactar, anonimizar y publicar los casos. Debe distinguirse claramente entre la trayectoria anterior de José y los casos propios de Alfaro & Partners.

## Campañas y UTM

La publicación de lanzamiento de José en LinkedIn funciona como notoriedad y petición de referencias, pero no contiene ningún enlace hacia Alfaro & Partners.

Los parámetros presentes en el enlace utilizado para compartir la publicación:

```text
utm_source=share
utm_medium=member_android
```

los añade LinkedIn para identificar cómo se compartió su propio contenido. No permiten atribuir visitas o contactos a Alfaro & Partners.

Para medir una campaña se necesita incluir un enlace propio etiquetado, por ejemplo:

```text
https://alfaropartners.es/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=launch_referrals_2026&utm_content=jm_ya_estamos_en_marcha
```

Una explicación adecuada para el cliente sería:

> Una UTM es una etiqueta distinta en cada folleto digital. Permite saber qué publicación generó visitas, conversaciones y citas, no solamente reacciones.

## Modelo de medición recomendado

| Capa | Qué debería medir |
|---|---|
| LinkedIn | Alcance e interacción |
| GA4 | Visitas y acciones realizadas en la web |
| Mobilia | Persona, origen, seguimiento y resultado comercial |

Los cuatro indicadores útiles para José y Augusto serían:

1. Personas alcanzadas.
2. Visitas recibidas.
3. Consultas o reservas generadas.
4. Operaciones finalmente conseguidas.

## Implicaciones para la estrategia SEO

- SEO, distribución y conversión deben diseñarse como un único recorrido.
- La landing de herencias proporciona el patrón para futuras verticales.
- Las nuevas páginas deben responder a problemas reales previamente validados, no crearse solo para ampliar el sitio.
- La autoridad debe apoyarse en evidencia verificable y casos autorizados.
- Las campañas sociales complementan al SEO, pero necesitan enlaces propios para poder atribuir resultados.
- Conviene adoptar la estructura del embudo de referencia sin imitar promesas agresivas que puedan crear expectativas superiores a la capacidad operativa real.

## Referencias

- [Alfaro & Partners](https://alfaropartners.es/)
- [Landing de herencias inmobiliarias](https://alfaropartners.es/herencias-inmobiliarias/)
- [Landing hipotecaria de Montse Cespedosa](https://montsecespedosa.com/asesoria-hipotecaria/)
- [Publicación de lanzamiento de José en LinkedIn](https://www.linkedin.com/posts/jose-mar%C3%ADa-alfaro-agente-inmobiliario_alfaropartners-representaciaejninmobiliaria-activity-7493694171535409152-ZCHf)
