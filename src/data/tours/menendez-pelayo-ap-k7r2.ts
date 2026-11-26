import type { TourScript } from '../../lib/guided-tour';

// Copy stays within what the listing and photographs show: no light, views,
// orientation or air-conditioning claims, which are unconfirmed for this property.
export const menendezPelayoTour: TourScript = {
  publicId: 'ap-k7r2',
  title: 'Visita guiada · Ibiza, Retiro',
  description: 'Una visita fotográfica, estancia por estancia, a una vivienda de dos dormitorios y dos baños en Ibiza, Retiro.',
  acts: [
    {
      template: 'cover', id: 'inicio', label: 'Inicio',
      eyebrow: 'Visita guiada',
      title: 'Salón, comedor y cocina en un solo espacio.',
      lede: 'Una visita estancia por estancia, de la zona de día a los baños.',
      shot: { mediaId: 'img-q3v8', focus: '45% 60%' },
    },
    {
      template: 'reveal', id: 'pasillo', label: 'Pasillo', entry: 'side',
      title: 'Un pasillo distribuye la vivienda.',
      text: 'Desde el pasillo se llega a la zona de día, los dormitorios y los baños.',
      shot: { mediaId: 'img-c4w2', focus: '50% 55%' },
    },
    {
      template: 'pair', id: 'salon', label: 'Salón y comedor',
      relation: 'perspective',
      clip: 'salon',
      title: 'La zona de día, de un extremo a otro.',
      text: 'El estar, la mesa del comedor y la cocina comparten una misma estancia.',
      shots: [
        { mediaId: 'img-r6m2', focus: '50% 55%' },
        { mediaId: 'img-h2n6', focus: '50% 55%', caption: 'Más cerca, la mesa frente a la cocina.' },
      ],
    },
    {
      template: 'pair', id: 'cocina', label: 'Cocina',
      relation: 'detail',
      title: 'Una cocina integrada.',
      text: 'Armarios hasta el techo y un frente veteado, abiertos al comedor.',
      shots: [
        { mediaId: 'img-z7p1', focus: '45% 55%' },
        { mediaId: 'img-w4k9', focus: '50% 55%', caption: 'De frente: horno, microondas y armarios integrados.' },
      ],
    },
    {
      template: 'reveal', id: 'dormitorio-1', label: 'Dormitorio 1', entry: 'side',
      title: 'El primer dormitorio.',
      text: 'Cama de matrimonio, molduras en la pared y una ventana junto al cabecero.',
      shot: { mediaId: 'img-u8c3', focus: '55% 60%' },
    },
    {
      template: 'pair', id: 'dormitorio-2', label: 'Dormitorio 2',
      relation: 'perspective',
      clip: 'dormitorio-2',
      title: 'Un segundo dormitorio.',
      text: 'Textiles azules y un armario con baldas junto a la cama.',
      shots: [
        { mediaId: 'img-y5t7', focus: '55% 60%' },
        { mediaId: 'img-g9d4', focus: '50% 60%', caption: 'Desde la entrada, la cama de frente.' },
      ],
    },
    {
      template: 'pair', id: 'banos', label: 'Baños',
      relation: 'rooms',
      title: 'Dos baños completos.',
      text: 'Los dos con lavabo y ducha.',
      shots: [
        { mediaId: 'img-x1f5', focus: '50% 50%' },
        { mediaId: 'img-v3j8', focus: '50% 50%', caption: 'El segundo baño.' },
      ],
    },
    {
      template: 'close', id: 'visita', label: 'Visitarla',
      title: 'La próxima mirada, en persona.',
      text: 'Augusto, responsable de esta vivienda, organiza las visitas.',
      action: 'Solicitar una visita',
    },
  ],
};
