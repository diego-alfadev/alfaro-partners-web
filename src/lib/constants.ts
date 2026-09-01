const SITE_ORIGIN = import.meta.env.PUBLIC_SITE_URL ?? "https://diego-alfadev.github.io";
const SITE_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const BUSINESS_INFO = {
  name: "José María Alfaro",
  brandName: "Alfaro & Partners",
  phone: "34672504642",
  email: "hola@alfaropartners.es",
  // Physical office. Values taken verbatim from the live Google Maps listing
  // so the site and the listing never disagree -- Google cross-checks them,
  // and a mismatch weakens the local result or triggers a re-review.
  address: {
    street: "Calle de Narváez, 31",
    district: "Retiro",
    locality: "Madrid",
    region: "Madrid",
    postalCode: "28009",
    country: "ES",
  },
  // Weekday hours are identical, so they collapse into one specification.
  // Saturday is listed separately because it closes at midday.
  //
  // Saturdays are closed on public holidays and throughout August. Neither
  // exception is expressible in openingHoursSpecification -- it has no
  // recurring-exclusion syntax. Both belong in the Google Business Profile as
  // special hours, which is also the surface where they actually change what
  // a visitor is told. Tracked as a listing task, not a markup one.
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:30", closes: "19:00" },
    { days: ["Saturday"], opens: "10:30", closes: "13:30" },
  ],
  site: {
    origin: SITE_ORIGIN,
    basePath: SITE_BASE_PATH,
    defaultImage: "/images/og-alfaro-partners.png",
  },
  booking: {
    label: "Reservar cita",
    url: "https://calendar.app.google/XVToXQ879KGeQ9qg6",
    status: "appointment-schedule",
  },
  analytics: {
    googleTagId: import.meta.env.PUBLIC_GTAG_ID ?? import.meta.env.GTAG_ID ?? "G-08PP9575QV",
  },
  social: {
    whatsapp: "https://wa.me/34672504642",
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
