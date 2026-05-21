const SITE_ORIGIN = import.meta.env.PUBLIC_SITE_URL ?? "https://diego-alfadev.github.io";
const SITE_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const BUSINESS_INFO = {
  name: "José María Alfaro",
  phone: "34666749676",
  email: "jmaj07@gmail.com",
  site: {
    origin: SITE_ORIGIN,
    basePath: SITE_BASE_PATH,
    defaultImage: "/images/og-alfaro-partners.png",
  },
  booking: {
    label: "Reservar cita",
    url: "https://calendar.app.google/GNnp9k79GQzsUsiv7",
    status: "appointment-schedule",
  },
  social: {
    whatsapp: "https://wa.me/34666749676",
    instagram: "https://www.instagram.com/alfaropartners/",
    linkedin: "https://www.linkedin.com/in/jose-mar%C3%ADa-alfaro-agente-inmobiliario/",
  },
  legal: {
    notice: "/aviso-legal/",
    privacy: "/privacidad/",
    cookies: "/cookies/",
  },
  sites: {
    fai: "https://fainmo.es",
    nuevoMilenio: "https://nuevomilenio.es",
    alquilabien: "https://alquilabien.es",
    bpi: "https://bpimadrid.es"
  },
  zones: [
    {
      name: "Retiro",
      href: "/zonas/retiro/",
      title: "Vivir en Retiro",
      description: "Representación inmobiliaria en Retiro para decidir con criterio entre calidad de vida, patrimonio y estrategia.",
    },
    {
      name: "Ibiza",
      href: "/zonas/ibiza/",
      title: "Vivir en Ibiza, Madrid",
      description: "Acompañamiento inmobiliario en el barrio de Ibiza, Madrid: vida de barrio, proximidad al Retiro y decisiones patrimoniales.",
    },
    {
      name: "Barrio de Salamanca",
      href: "/zonas/barrio-de-salamanca/",
      title: "Vivir en Barrio de Salamanca",
      description: "Representación inmobiliaria en Barrio de Salamanca para propietarios, compradores, arrendadores e inversores.",
    },
  ],
};
