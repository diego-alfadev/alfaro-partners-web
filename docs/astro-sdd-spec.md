# Especificación del Sitio Web (Astro) - Alfaro & Partners

## 1. Visión General y Objetivo
El objetivo de este proyecto es evolucionar el prototipo de landing page hacia una plataforma web completa y de alta conversión, utilizando **Astro (SSG)**. La web funcionará como la principal tarjeta de presentación digital para la marca personal de José María Alfaro, orientada a un público premium (High-Net-Worth individuals) y enfocada en transmitir autoridad, confianza y captar citas de representación.

Se evitará la complejidad y el mantenimiento de un CMS tradicional (como WordPress) en favor de un sistema estático extremadamente rápido, seguro y perfecto para SEO.

## 2. Arquitectura de Información
A diferencia del prototipo de una sola página, el sitio final en Astro será **Multi-página**. Tendrá la profundidad necesaria para establecer autoridad sin perder el foco en la conversión. La estructura será la siguiente:

1. **Inicio (Home):**
   - Hero Section (Propuesta de valor clara + Foto de perfil).
   - Bloque de Confianza (Mención a >20 años de experiencia, Presidencia FAI).
   - Resumen de Servicios (Qué se hace y qué NO se hace).
   - CTA Principal flotante/persistente.
2. **La Firma / Filosofía (Sobre Mí):**
   - Profundización en el modelo de "Representar personas, no propiedades".
   - Trayectoria y ética profesional.
3. **Servicios:**
   - Detalle del acompañamiento inmobiliario y prevención de riesgos.
   - Textos enfocados por tipo de cliente: Vendedores, Arrendadores, Compradores, Inquilinos e Inversores.
   - *Requisito de Diseño:* Incluir un espacio o bloque específico que se dirija directamente a cada tipo de cliente con un texto que lleve, de forma fácil e intuitiva, a agendar la cita.
4. **Visión (Artículos):**
   - Índice minimalista con 4-5 artículos atemporales ("Evergreen") que demuestren autoridad técnica y de mercado.
5. **Artículos (Páginas de Detalle):**
   - Lectura limpia y sin distracciones (formato *Private Banking*).
6. **Contacto:**
   - Integración nativa de Calendly para agendar sin fricción.
   - Botón flotante persistente de WhatsApp.

## 3. Estrategia y Optimización SEO (Personal Brand Focus)
Aunque no se plantea un plan de marketing de contenidos exhaustivo desde el día 1, la base técnica será impecable para posicionar búsquedas de marca personal y nicho corporativo.

- **Rendimiento Máximo (Technical SEO):** Al ser generado estáticamente con Astro (cero JavaScript innecesario por defecto), las puntuaciones de Core Web Vitals estarán cercanas a 100/100, un factor clave para el posicionamiento actual.
- **Etiquetas Semánticas:** Uso estricto de HTML5 (`<main>`, `<article>`, `<section>`, `<nav>`) y correcta jerarquía de encabezados (`<h1>` único por página, seguido de `<h2>` y `<h3>`).
- **Schema.org (JSON-LD):**
  - Implementación de Schema `Person` y `RealEstateAgent` para potenciar el Knowledge Graph de José María Alfaro en Google.
  - Implementación de Schema `Article` para las publicaciones.
- **Metadatos y Redes Sociales:**
  - Componente `<SEO />` reutilizable para inyectar automáticamente etiquetas `title`, `description`, `canonical` y meta-tags de OpenGraph / Twitter Cards (para que los enlaces compartidos por WhatsApp o LinkedIn tengan previsualizaciones premium).
- **Rutas Limpias y Autogeneración:**
  - URLs descriptivas e indexables (`/vision/el-futuro-inmobiliario`).
  - Generación automática de `sitemap.xml` y archivo `robots.txt`.
- *Nota a futuro: Esta arquitectura deja el sitio 100% optimizado a nivel técnico y "On-Page". Para escalar el tráfico de búsqueda no relacionada con el nombre propio, se requerirá a futuro un plan de contenidos (SEO Off-Page / Keywords).*

## 4. Diseño y Estética ("Digital Obsidian")
El sitio debe sentirse como una sucursal de banca privada, huyendo del "slop" de IA o plantillas genéricas.

- **Paleta de Colores:**
  - Base/Fondo: *Navy Blue* (`#0e192a`) del logo.
  - Texto: *Off-White* (`#eeeceb`) para reducir la fatiga visual del blanco puro sobre negro.
  - Acentos: Tonos dorados (heredados de la marca) usados con extrema moderación para interacciones o CTAs.
- **Tipografía:**
  - *Times New Roman* para titulares (herencia directa del logo). *Nota técnica: Se requerirá un tratamiento cuidadoso de espaciado y peso para web. Si el resultado no transmite el nivel premium deseado frente a la textura obsidiana, se deberá presentar un contraste visual comparativo con una Serif alternativa (ej. Playfair Display) para facilitar la decisión técnica al cliente.*
  - *Satoshi Variable* (o fuente sans-serif geométrica similar) para cuerpo de texto y UI, aportando legibilidad moderna.
- **Estética Visual:**
  - Textura "obsidiana azul oscuro / mármol" en los fondos. Se priorizará recrear un efecto de vetas y roturas doradas mediante **CSS/SVG procedimental** en lugar del asset original `marble.png` de baja calidad. El objetivo es simular una pared de mármol integrada y elegante sin penalizar el rendimiento ni la estética.
  - Uso abundante de espacio en blanco (espaciado negativo) para transmitir lujo y tranquilidad en Desktop. *Restricción Mobile:* Reducir significativamente los espacios libres (paddings/margins) entre secciones en la versión móvil para mantener un flujo de lectura compacto y evitar sensación de vacío.
- **Estilos Técnicos:** Vanilla CSS mediante bloques `<style>` encapsulados en Astro, garantizando la máxima flexibilidad y ausencia de sobrecargas de frameworks.

## 5. Decisiones Técnicas y Flujo de Datos
- **Framework:** Astro (Modo `output: 'static'`).
- **Gestión de Contenido (Artículos):** *Astro Content Collections*. Los 4-5 artículos fijos se gestionarán mediante archivos MDX locales (`src/content/vision/*.mdx`). Esto elimina la necesidad de un CMS complejo, reduce los puntos de falla a cero y permite formato enriquecido.
- **Analítica:** Plausible Analytics auto-alojado en Coolify. Respetuoso con la privacidad (cookieless), evitando banners molestos que ensucien el diseño premium.
- **Despliegue:** Construcción estática desplegada en el servidor (Coolify o CDN), con integración continua.

---

## 6. Estado del Contenido y Reglas Editoriales
Gran parte del copy central ha sido definido por el cliente (JA). Faltan únicamente los 4-5 artículos de Visión.

**Regla Editorial Estricta:**
- Siempre que se mencione a *Nuevo Milenio, Alquilabien, BPI* o *FAI*, se debe insertar un hipervínculo enlazando a sus respectivas webs institucionales.

**Copy Base de Servicios:**
- *Vendedores:* Te represento para que vendas con seguridad, estrategia, tranquilidad y al máximo precio de mercado.
- *Arrendadores:* Alquilar no debería convertirse en una preocupación constante. Tu propiedad merece una gestión seria y personas de confianza.
- *Compradores:* No buscamos casas. Te ayudamos a tomar la decisión de compra correcta, con criterio y sin presión. Sin ruido inmobiliario, con claridad para decidir.
- *Inquilinos:* Encontrar hogar debería ser más humano y menos frustrante. Te ayudo a encontrar un lugar donde quieras vivir.
- *Inversores:* Invertir bien en inmobiliario es entender a las personas antes que a los metros cuadrados. Analizo el activo, el contexto y el potencial real de rentabilidad.

**Frases Transversales (Claims para Hero y Bloques de Conexión):**
- "Te representamos para que tomes la mejor decisión inmobiliaria."
- "Personas antes que operaciones."
- "La confianza no se promete. Se demuestra."
- "Un modelo inmobiliario basado en representación, estrategia y cercanía."
- "Decisiones inmobiliarias con criterio, calma y acompañamiento real."
- "Tu situación es única. Tu estrategia inmobiliaria también debería serlo."
