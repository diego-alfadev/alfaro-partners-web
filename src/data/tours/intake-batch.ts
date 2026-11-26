import type { TourScript } from '../../lib/guided-tour';

/** Photographic scripts; genuine images, honest pair relations, no generated clips. */
export const intakeTours: TourScript[] = [
  {
    "publicId": "ap-1744a0",
    "title": "Visita guiada · Ibiza, Retiro",
    "description": "Una zona de día compartida, dos dormitorios y un baño. Un recorrido fotográfico por el estar, la cocina y las estancias privadas.",
    "acts": [
      {
        "template": "cover",
        "id": "inicio",
        "label": "Inicio",
        "eyebrow": "Visita fotográfica",
        "title": "El espacio de día, desde dos perspectivas.",
        "lede": "Una zona de día compartida, dos dormitorios y un baño. Un recorrido fotográfico por el estar, la cocina y las estancias privadas.",
        "shot": {
          "mediaId": "img-living-wide",
          "focus": "50% 50%"
        }
      },
      {
        "template": "pair",
        "id": "salon",
        "label": "Salón",
        "title": "Dos miradas sobre la zona de día.",
        "text": "La mesa de comedor y el estar se leen desde dos puntos de vista. Son dos fotografías de la misma zona, no dos estancias distintas.",
        "shots": [
          {
            "mediaId": "img-living-wide",
            "focus": "50% 50%"
          },
          {
            "mediaId": "img-living-reverse",
            "focus": "50% 50%"
          }
        ],
        "relation": "perspective"
      },
      {
        "template": "pair",
        "id": "cocina",
        "label": "Cocina",
        "title": "La cocina, de cerca.",
        "text": "La vista general sitúa el frente de cocina. El detalle permite detenerse en la encimera y el fregadero.",
        "shots": [
          {
            "mediaId": "img-kitchen-wide",
            "focus": "50% 50%"
          },
          {
            "mediaId": "img-kitchen-detail",
            "focus": "50% 50%"
          }
        ],
        "relation": "detail"
      },
      {
        "template": "pair",
        "id": "dormitorios",
        "label": "Dormitorios",
        "title": "Dos dormitorios, dos frentes.",
        "text": "Dos láminas acompañan el cabecero del primero. Una lámina centra la pared del segundo. Se presentan como habitaciones diferentes.",
        "shots": [
          {
            "mediaId": "img-bedroom-one",
            "focus": "50% 50%"
          },
          {
            "mediaId": "img-bedroom-two",
            "focus": "50% 50%"
          }
        ],
        "relation": "rooms"
      },
      {
        "template": "pair",
        "id": "bano",
        "label": "Baño",
        "title": "El baño, desde dos ángulos.",
        "text": "El lavabo abre esta parte del recorrido. La segunda imagen completa la lectura del baño sin añadir otra estancia.",
        "shots": [
          {
            "mediaId": "img-bathroom-wide",
            "focus": "50% 50%"
          },
          {
            "mediaId": "img-bathroom-reverse",
            "focus": "50% 50%"
          }
        ],
        "relation": "perspective"
      },
      {
        "template": "close",
        "id": "visita",
        "label": "Consultar",
        "title": "La siguiente mirada, en persona.",
        "text": "Antes de publicar, falta completar la documentación y validar el material de esta vivienda.",
        "action": "Consultar con el equipo"
      }
    ]
  },
  {
    "publicId": "ap-ae0279",
    "title": "Visita guiada · Ibiza, Retiro",
    "description": "Salón, cocina y comedor, tres dormitorios y dos baños. Una visita fotográfica que recorre las distintas estancias sin dar por hecho su distribución.",
    "acts": [
      {
        "template": "cover",
        "id": "inicio",
        "label": "Inicio",
        "eyebrow": "Visita fotográfica",
        "title": "Una casa con tres espacios para descansar.",
        "lede": "Salón, cocina y comedor, tres dormitorios y dos baños. Una visita fotográfica que recorre las distintas estancias sin dar por hecho su distribución.",
        "shot": {
          "mediaId": "img-kitchen-dining-wide",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "salon",
        "label": "Salón",
        "title": "Un momento en el estar.",
        "text": "El sofá centra esta vista del salón. El recorrido se detiene aquí antes de volver a la cocina y el comedor.",
        "shot": {
          "mediaId": "img-living-wide",
          "focus": "50% 50%"
        }
      },
      {
        "template": "pair",
        "id": "cocina",
        "label": "Cocina y comedor",
        "title": "La cocina junto al comedor.",
        "text": "Dos tomas complementarias muestran el frente de cocina y su relación visual con el comedor.",
        "shots": [
          {
            "mediaId": "img-kitchen-reverse",
            "focus": "50% 50%"
          },
          {
            "mediaId": "img-kitchen-detail",
            "focus": "50% 50%"
          }
        ],
        "relation": "detail"
      },
      {
        "template": "reveal",
        "id": "pasillo",
        "label": "Pasillo",
        "title": "Una pausa entre estancias.",
        "text": "El pasillo forma parte de las fotografías disponibles. El orden de esta visita es editorial y no acredita por sí solo la distribución.",
        "shot": {
          "mediaId": "img-hallway",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "dormitorio-uno",
        "label": "Dormitorio 1",
        "title": "El primer dormitorio.",
        "text": "Los textiles anaranjados distinguen esta habitación dentro del recorrido.",
        "shot": {
          "mediaId": "img-bedroom-one",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "dormitorio-dos",
        "label": "Dormitorio 2",
        "title": "Un segundo dormitorio.",
        "text": "La cama con textiles azules centra la fotografía de esta estancia.",
        "shot": {
          "mediaId": "img-bedroom-two",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "dormitorio-tres",
        "label": "Dormitorio 3",
        "title": "El tercer dormitorio.",
        "text": "Una vista dedicada a la cama y su entorno inmediato.",
        "shot": {
          "mediaId": "img-bedroom-three",
          "focus": "50% 50%"
        }
      },
      {
        "template": "pair",
        "id": "banos",
        "label": "Baños",
        "title": "Dos baños diferenciados.",
        "text": "El revestimiento veteado del primero y las hornacinas iluminadas del segundo permiten reconocer dos espacios distintos.",
        "shots": [
          {
            "mediaId": "img-bathroom-one",
            "focus": "50% 50%"
          },
          {
            "mediaId": "img-bathroom-two",
            "focus": "50% 50%"
          }
        ],
        "relation": "rooms"
      },
      {
        "template": "close",
        "id": "visita",
        "label": "Consultar",
        "title": "La siguiente mirada, en persona.",
        "text": "Antes de publicar, falta completar la documentación y validar el material de esta vivienda.",
        "action": "Consultar con el equipo"
      }
    ]
  },
  {
    "publicId": "ap-a6ddef",
    "title": "Visita guiada · Ibiza, Retiro",
    "description": "Una selección fotográfica del salón, la cocina y los tres dormitorios. El material de los baños está pendiente de completar y contrastar.",
    "acts": [
      {
        "template": "cover",
        "id": "inicio",
        "label": "Inicio",
        "eyebrow": "Visita fotográfica",
        "title": "Una primera lectura de la vivienda.",
        "lede": "Una selección fotográfica del salón, la cocina y los tres dormitorios. El material de los baños está pendiente de completar y contrastar.",
        "shot": {
          "mediaId": "img-living-wide",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "living-reverse",
        "label": "Zona de día",
        "title": "Segunda perspectiva del salón.",
        "text": "Segunda perspectiva del salón.",
        "shot": {
          "mediaId": "img-living-reverse",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "kitchen-dining-wide",
        "label": "Zona de día",
        "title": "Cocina y comedor, vista general.",
        "text": "Cocina y comedor, vista general.",
        "shot": {
          "mediaId": "img-kitchen-dining-wide",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "kitchen-detail",
        "label": "Zona de día",
        "title": "Detalle de la cocina.",
        "text": "Detalle de la cocina.",
        "shot": {
          "mediaId": "img-kitchen-detail",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bedroom-one",
        "label": "Dormitorio 1",
        "title": "Primer dormitorio con textiles ocres.",
        "text": "Primer dormitorio con textiles ocres.",
        "shot": {
          "mediaId": "img-bedroom-one",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bedroom-two",
        "label": "Dormitorio 2",
        "title": "Segundo dormitorio con textiles verdes.",
        "text": "Segundo dormitorio con textiles verdes.",
        "shot": {
          "mediaId": "img-bedroom-two",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bedroom-three",
        "label": "Dormitorio 3",
        "title": "Tercer dormitorio con dos camas.",
        "text": "Tercer dormitorio con dos camas.",
        "shot": {
          "mediaId": "img-bedroom-three",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bathroom-light",
        "label": "Baños",
        "title": "Baño con lavabo integrado y panelado claro.",
        "text": "La identificación de cada baño está pendiente de confirmar.",
        "shot": {
          "mediaId": "img-bathroom-light",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bathroom-dark",
        "label": "Baños",
        "title": "Baño con lavabo sobre encimera y revestimiento oscuro.",
        "text": "La identificación de cada baño está pendiente de confirmar.",
        "shot": {
          "mediaId": "img-bathroom-dark",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bathroom-shower",
        "label": "Baños",
        "title": "Zona de ducha con revestimiento veteado.",
        "text": "La identificación de cada baño está pendiente de confirmar.",
        "shot": {
          "mediaId": "img-bathroom-shower",
          "focus": "50% 50%"
        }
      },
      {
        "template": "close",
        "id": "visita",
        "label": "Consultar",
        "title": "La siguiente mirada, en persona.",
        "text": "Este recorrido está incompleto. Falta aclarar o completar las fotografías de los baños.",
        "action": "Consultar con el equipo"
      }
    ]
  },
  {
    "publicId": "ap-97df49",
    "title": "Visita guiada · Ibiza, Retiro",
    "description": "Un salón con distintas perspectivas, cocina y comedor, tres dormitorios y dos baños. La terraza aparece en el recorrido fotográfico como parte del material disponible.",
    "acts": [
      {
        "template": "cover",
        "id": "inicio",
        "label": "Inicio",
        "eyebrow": "Visita fotográfica",
        "title": "Del salón a la terraza, y después al descanso.",
        "lede": "Un salón con distintas perspectivas, cocina y comedor, tres dormitorios y dos baños. La terraza aparece en el recorrido fotográfico como parte del material disponible.",
        "shot": {
          "mediaId": "img-living-wide",
          "focus": "50% 50%"
        }
      },
      {
        "template": "pair",
        "id": "cocina",
        "label": "Cocina y comedor",
        "title": "La zona de cocina, en dos escalas.",
        "text": "Primero, cocina y comedor en conjunto. Después, una toma más próxima del frente de cocina.",
        "shots": [
          {
            "mediaId": "img-kitchen-dining-wide",
            "focus": "50% 50%"
          },
          {
            "mediaId": "img-kitchen-detail",
            "focus": "50% 50%"
          }
        ],
        "relation": "detail"
      },
      {
        "template": "reveal",
        "id": "terraza",
        "label": "Terraza",
        "title": "Una mirada a la terraza.",
        "text": "La terraza aparece en el material facilitado. La fotografía no acredita su superficie ni su orientación.",
        "shot": {
          "mediaId": "img-terrace",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "dormitorio-uno",
        "label": "Dormitorio 1",
        "title": "Un primer dormitorio en azul.",
        "text": "Los textiles azules y el frente de la cama distinguen esta habitación.",
        "shot": {
          "mediaId": "img-bedroom-one",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "dormitorio-dos",
        "label": "Dormitorio 2",
        "title": "La segunda habitación.",
        "text": "Las luminarias oscuras acompañan la cama en esta segunda estancia.",
        "shot": {
          "mediaId": "img-bedroom-two",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "dormitorio-tres",
        "label": "Dormitorio 3",
        "title": "Una tercera estancia para descansar.",
        "text": "Las luminarias doradas permiten reconocer este tercer dormitorio frente a los anteriores.",
        "shot": {
          "mediaId": "img-bedroom-three",
          "focus": "50% 50%"
        }
      },
      {
        "template": "pair",
        "id": "banos",
        "label": "Baños",
        "title": "Dos formas de resolver el lavabo.",
        "text": "El primer baño cuenta con lavabo doble. El segundo se muestra con lavabo individual; son dos habitaciones diferentes.",
        "shots": [
          {
            "mediaId": "img-bathroom-one",
            "focus": "50% 50%"
          },
          {
            "mediaId": "img-bathroom-two",
            "focus": "50% 50%"
          }
        ],
        "relation": "rooms"
      },
      {
        "template": "close",
        "id": "visita",
        "label": "Consultar",
        "title": "La siguiente mirada, en persona.",
        "text": "Antes de publicar, falta completar la documentación y validar el material de esta vivienda.",
        "action": "Consultar con el equipo"
      }
    ]
  },
  {
    "publicId": "ap-3a9c6b",
    "title": "Visita guiada · Ibiza, Retiro",
    "description": "Salón, cocina y cuatro dormitorios. Las fotografías disponibles muestran dos baños; falta completar la cobertura del tercero declarado.",
    "acts": [
      {
        "template": "cover",
        "id": "inicio",
        "label": "Inicio",
        "eyebrow": "Visita fotográfica",
        "title": "Cuatro dormitorios, uno a uno.",
        "lede": "Salón, cocina y cuatro dormitorios. Las fotografías disponibles muestran dos baños; falta completar la cobertura del tercero declarado.",
        "shot": {
          "mediaId": "img-living-wide",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "living-reverse",
        "label": "Zona de día",
        "title": "Salón desde una segunda perspectiva.",
        "text": "Salón desde una segunda perspectiva.",
        "shot": {
          "mediaId": "img-living-reverse",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "kitchen-wide",
        "label": "Zona de día",
        "title": "Cocina y comedor, vista general.",
        "text": "Cocina y comedor, vista general.",
        "shot": {
          "mediaId": "img-kitchen-wide",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "kitchen-detail",
        "label": "Zona de día",
        "title": "Detalle del frente de cocina.",
        "text": "Detalle del frente de cocina.",
        "shot": {
          "mediaId": "img-kitchen-detail",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bedroom-one",
        "label": "Dormitorio 1",
        "title": "Primer dormitorio con textiles marrones.",
        "text": "Primer dormitorio con textiles marrones.",
        "shot": {
          "mediaId": "img-bedroom-one",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bedroom-two",
        "label": "Dormitorio 2",
        "title": "Segundo dormitorio con textiles ocres.",
        "text": "Segundo dormitorio con textiles ocres.",
        "shot": {
          "mediaId": "img-bedroom-two",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bedroom-three",
        "label": "Dormitorio 3",
        "title": "Tercer dormitorio con textiles azules.",
        "text": "Tercer dormitorio con textiles azules.",
        "shot": {
          "mediaId": "img-bedroom-three",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bedroom-four",
        "label": "Dormitorio 4",
        "title": "Cuarto dormitorio con textiles verdes.",
        "text": "Cuarto dormitorio con textiles verdes.",
        "shot": {
          "mediaId": "img-bedroom-four",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bathroom-one",
        "label": "Baños",
        "title": "Primer baño con lavabo individual.",
        "text": "La identificación de cada baño está pendiente de confirmar.",
        "shot": {
          "mediaId": "img-bathroom-one",
          "focus": "50% 50%"
        }
      },
      {
        "template": "reveal",
        "id": "bathroom-two",
        "label": "Baños",
        "title": "Segundo baño con doble lavabo.",
        "text": "La identificación de cada baño está pendiente de confirmar.",
        "shot": {
          "mediaId": "img-bathroom-two",
          "focus": "50% 50%"
        }
      },
      {
        "template": "close",
        "id": "visita",
        "label": "Consultar",
        "title": "La siguiente mirada, en persona.",
        "text": "Este recorrido está incompleto. Falta aclarar o completar las fotografías de los baños.",
        "action": "Consultar con el equipo"
      }
    ]
  }
];
