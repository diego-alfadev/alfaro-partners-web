import type { TourScript } from '../../lib/guided-tour';

// Copy stays within what the listing and photographs show: no light, views or
// orientation claims, which are unconfirmed for this property.
export const ibizaRetiroTour: TourScript = {
  publicId: 'ap-l8v3',
  title: 'Visita guiada · Ibiza, Retiro',
  description: 'Una visita fotográfica, estancia por estancia, a una vivienda de dos dormitorios en Ibiza, Retiro.',
  acts: [
    {
      template: 'cover', id: 'inicio', label: 'Inicio',
      eyebrow: 'Visita guiada',
      title: 'La cocina, en el centro de la casa.',
      lede: 'Una visita estancia por estancia, del portal a los baños.',
      shot: { mediaId: 'img-b4r9', focus: '50% 60%' },
    },
    {
      template: 'arrival', id: 'llegada', label: 'Llegada',
      eyebrow: 'El recorrido',
      title: 'Del portal a cada estancia.',
      text: 'Un edificio con ascensor y portero. Desde el vestíbulo, la visita sigue este orden.',
      shot: { mediaId: 'img-p1c5', focus: '50% 45%' },
    },
    {
      template: 'reveal', id: 'pasillo', label: 'Pasillo', entry: 'side',
      title: 'Un pasillo ordena la casa.',
      text: 'Una consola y la vegetación acompañan la entrada. Desde aquí se reparten la zona de día y las estancias privadas.',
      shot: { mediaId: 'img-e9p3', focus: '40% 50%', travel: { to: '80% 52%', scale: 1.3, caption: 'Al fondo, la zona de día.' } },
    },
    {
      template: 'pair', id: 'salon', label: 'Salón',
      relation: 'detail',
      clip: 'salon-cocina',
      title: 'El salón abre la zona de día.',
      text: 'El sofá y el mueble de televisión definen el estar, con el paso abierto hacia el fondo.',
      shots: [
        { mediaId: 'img-a7x2', focus: '45% 55%' },
        { mediaId: 'img-b4r9', focus: '50% 60%', caption: 'Más allá del salón, el comedor y la cocina.' },
      ],
    },
    {
      template: 'pair', id: 'cocina', label: 'Cocina y comedor',
      relation: 'detail',
      clip: 'cocina',
      title: 'Madera y piedra clara.',
      text: 'La isla reúne la cocina y la mesa del comedor en un mismo gesto.',
      shots: [
        { mediaId: 'img-c8n6', focus: '50% 55%' },
        { mediaId: 'img-d2v5', focus: '50% 50%', caption: 'La mesa, junto a la isla.' },
      ],
    },
    {
      template: 'pair', id: 'dormitorio-1', label: 'Dormitorio 1',
      relation: 'perspective',
      // Pilot: AI-generated arc between the two real photographs (pilots/dormitorio-1).
      clip: 'dormitorio-1',
      title: 'Un mural vegetal tras el cabecero.',
      text: 'El cabecero tapizado y el mural componen el frente de la cama.',
      shots: [
        { mediaId: 'img-f6t8', focus: '50% 50%' },
        { mediaId: 'img-s9d8', focus: '50% 50%', caption: 'De frente: la cama y el armario integrado.' },
      ],
    },
    {
      template: 'pair', id: 'dormitorio-2', label: 'Dormitorio 2',
      relation: 'detail',
      clip: 'dormitorio-2',
      enter: 'dissolve',
      title: 'Un segundo dormitorio, sereno.',
      text: 'Un cabecero claro y el armario integrado. Dos ángulos para leer la estancia completa.',
      shots: [
        { mediaId: 'img-t3f7', focus: '50% 50%' },
        { mediaId: 'img-h5z1', focus: '55% 50%', caption: 'En diagonal, junto a la cortina.' },
      ],
    },
    {
      template: 'pair', id: 'bano-1', label: 'Baño 1',
      relation: 'perspective',
      clip: 'bano-1',
      title: 'Dos baños completos.',
      text: 'El primero reúne lavabo doble y ducha acristalada.',
      shots: [
        { mediaId: 'img-k2y6', focus: '50% 50%' },
        { mediaId: 'img-n7q2', focus: '50% 50%', caption: 'La ducha acristalada, junto al lavabo doble.' },
      ],
    },
    {
      template: 'reveal', id: 'bano-2', label: 'Baño 2', entry: 'side',
      title: 'El segundo baño.',
      text: 'Lavabo y espejo ovalado.',
      shot: { mediaId: 'img-m4u9', focus: '50% 50%' },
    },
    {
      template: 'close', id: 'visita', label: 'Visitarla',
      title: 'La próxima mirada, en persona.',
      text: 'Se presenta amueblada y equipada, con aire acondicionado y calefacción individual de gas.',
      action: 'Solicitar una visita',
    },
  ],
};
