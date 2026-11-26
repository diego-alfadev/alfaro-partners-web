import type { Listing, ListingReleaseReadiness } from '../../lib/listings';

/** Public-safe drafts; private provenance remains outside this repository. */
export const intakeDrafts: { listing: Listing; readiness: ListingReleaseReadiness; draftNotice: string; previewEligible: boolean }[] = [
  {
    "listing": {
      "publicId": "ap-1744a0",
      "routeKey": "ibiza-retiro-madrid-ap-1744a0",
      "propertyType": "apartment",
      "transaction": "sale",
      "availability": "unconfirmed",
      "location": {
        "displayName": "Ibiza, Retiro, Madrid",
        "neighborhood": "Ibiza",
        "district": "Retiro",
        "city": "Madrid",
        "precision": "neighborhood"
      },
      "price": {
        "amount": 569000,
        "currency": "EUR"
      },
      "area": {
        "squareMeters": 35,
        "measurement": "unspecified"
      },
      "rooms": {
        "bedrooms": 2,
        "bathrooms": 1
      },
      "energy": {
        "rating": null
      },
      "editorial": {
        "title": "Cocina y comedor abiertos en Ibiza, Retiro",
        "summary": "Una zona de día compartida, dos dormitorios y un baño. Un recorrido fotográfico por el estar, la cocina y las estancias privadas.",
        "highlights": [
          "2 dormitorios",
          "1 baño declarado",
          "35 m², medición pendiente de precisar"
        ],
        "introduction": {
          "title": "El espacio de día, desde dos perspectivas.",
          "body": "El salón, el comedor y la cocina se presentan juntos. Las imágenes permiten leer la zona de día desde varios ángulos antes de detenerse en los dos dormitorios y el baño."
        }
      },
      "features": [
        {
          "label": "Climatización",
          "value": "Sí"
        },
        {
          "label": "Calefacción",
          "value": "Sí"
        },
        {
          "label": "Ascensor",
          "value": "Sí"
        },
        {
          "label": "Equipamiento",
          "value": "Cocina completamente equipada y amueblado."
        }
      ],
      "media": {
        "hero": {
          "id": "img-living-wide",
          "alt": "Salón y comedor, vista general",
          "scene": "living",
          "large": {
            "url": "/inmuebles/media/ap-1744a0/living-wide-large.webp",
            "width": 2880,
            "height": 1920
          },
          "compact": {
            "url": "/inmuebles/media/ap-1744a0/living-wide-compact.webp",
            "width": 800,
            "height": 533
          }
        },
        "gallery": [
          {
            "id": "img-living-wide",
            "alt": "Salón y comedor, vista general",
            "scene": "living",
            "large": {
              "url": "/inmuebles/media/ap-1744a0/living-wide-large.webp",
              "width": 2880,
              "height": 1920
            },
            "compact": {
              "url": "/inmuebles/media/ap-1744a0/living-wide-compact.webp",
              "width": 800,
              "height": 533
            }
          },
          {
            "id": "img-living-reverse",
            "alt": "Segunda perspectiva del salón y comedor",
            "scene": "living",
            "large": {
              "url": "/inmuebles/media/ap-1744a0/living-reverse-large.webp",
              "width": 2880,
              "height": 1920
            },
            "compact": {
              "url": "/inmuebles/media/ap-1744a0/living-reverse-compact.webp",
              "width": 800,
              "height": 533
            }
          },
          {
            "id": "img-kitchen-wide",
            "alt": "Cocina integrada, vista general",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-1744a0/kitchen-wide-large.webp",
              "width": 2880,
              "height": 1920
            },
            "compact": {
              "url": "/inmuebles/media/ap-1744a0/kitchen-wide-compact.webp",
              "width": 800,
              "height": 533
            }
          },
          {
            "id": "img-kitchen-detail",
            "alt": "Detalle del frente y fregadero de la cocina",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-1744a0/kitchen-detail-large.webp",
              "width": 2880,
              "height": 1920
            },
            "compact": {
              "url": "/inmuebles/media/ap-1744a0/kitchen-detail-compact.webp",
              "width": 800,
              "height": 533
            }
          },
          {
            "id": "img-bedroom-one",
            "alt": "Primer dormitorio con dos láminas junto al cabecero",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-1744a0/bedroom-one-large.webp",
              "width": 2880,
              "height": 1920
            },
            "compact": {
              "url": "/inmuebles/media/ap-1744a0/bedroom-one-compact.webp",
              "width": 800,
              "height": 533
            }
          },
          {
            "id": "img-bedroom-two",
            "alt": "Segundo dormitorio con una lámina sobre el cabecero",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-1744a0/bedroom-two-large.webp",
              "width": 2880,
              "height": 1920
            },
            "compact": {
              "url": "/inmuebles/media/ap-1744a0/bedroom-two-compact.webp",
              "width": 800,
              "height": 533
            }
          },
          {
            "id": "img-bathroom-wide",
            "alt": "Baño, vista hacia el lavabo",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-1744a0/bathroom-wide-large.webp",
              "width": 2880,
              "height": 1920
            },
            "compact": {
              "url": "/inmuebles/media/ap-1744a0/bathroom-wide-compact.webp",
              "width": 800,
              "height": 533
            }
          },
          {
            "id": "img-bathroom-reverse",
            "alt": "Otra perspectiva del baño",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-1744a0/bathroom-reverse-large.webp",
              "width": 2880,
              "height": 1920
            },
            "compact": {
              "url": "/inmuebles/media/ap-1744a0/bathroom-reverse-compact.webp",
              "width": 800,
              "height": 533
            }
          }
        ],
        "film": null,
        "virtualTour": null,
        "slides": null,
        "dossier": null,
        "floorPlan": null
      },
      "contact": {
        "kind": "team",
        "name": "Alfaro & Partners",
        "role": "Representación inmobiliaria",
        "portrait": null,
        "profileUrl": null,
        "email": "hola@alfaropartners.es",
        "phone": "+34672504642"
      }
    },
    "readiness": {
      "ready": false,
      "blockers": [
        "Energy evidence not supplied.",
        "Current availability not confirmed.",
        "Derivative and photographic tour acceptance pending."
      ]
    },
    "draftNotice": "Vista previa · pendiente: eficiencia energética, confirmación de disponibilidad y revisión final.",
    "previewEligible": true
  },
  {
    "listing": {
      "publicId": "ap-ae0279",
      "routeKey": "ibiza-retiro-madrid-ap-ae0279",
      "propertyType": "apartment",
      "transaction": "sale",
      "availability": "unconfirmed",
      "location": {
        "displayName": "Ibiza, Retiro, Madrid",
        "neighborhood": "Ibiza",
        "district": "Retiro",
        "city": "Madrid",
        "precision": "neighborhood"
      },
      "price": {
        "amount": 1169000,
        "currency": "EUR"
      },
      "area": {
        "squareMeters": 101,
        "measurement": "unspecified"
      },
      "rooms": {
        "bedrooms": 3,
        "bathrooms": 2
      },
      "energy": {
        "rating": null
      },
      "editorial": {
        "title": "Tres dormitorios en Ibiza, Retiro",
        "summary": "Salón, cocina y comedor, tres dormitorios y dos baños. Una visita fotográfica que recorre las distintas estancias sin dar por hecho su distribución.",
        "highlights": [
          "3 dormitorios",
          "2 baños declarados",
          "101 m², medición pendiente de precisar"
        ],
        "introduction": {
          "title": "Una casa con tres espacios para descansar.",
          "body": "La visita comienza en la cocina y el comedor y se detiene después en el salón. Tres dormitorios, un pasillo interior y dos baños completan la selección. El orden de las fotografías es editorial; no sustituye a un plano."
        }
      },
      "features": [
        {
          "label": "Climatización",
          "value": "Sí"
        },
        {
          "label": "Calefacción",
          "value": "Sí"
        },
        {
          "label": "Ascensor",
          "value": "Sí"
        },
        {
          "label": "Equipamiento",
          "value": "Cocina completamente equipada y amueblada."
        }
      ],
      "media": {
        "hero": {
          "id": "img-kitchen-dining-wide",
          "alt": "Cocina y comedor, vista general",
          "scene": "kitchen",
          "large": {
            "url": "/inmuebles/media/ap-ae0279/kitchen-dining-wide-large.webp",
            "width": 2880,
            "height": 1922
          },
          "compact": {
            "url": "/inmuebles/media/ap-ae0279/kitchen-dining-wide-compact.webp",
            "width": 800,
            "height": 534
          }
        },
        "gallery": [
          {
            "id": "img-kitchen-dining-wide",
            "alt": "Cocina y comedor, vista general",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/kitchen-dining-wide-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/kitchen-dining-wide-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-living-wide",
            "alt": "Zona de estar con sofá",
            "scene": "living",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/living-wide-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/living-wide-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-kitchen-reverse",
            "alt": "Cocina y comedor desde otra perspectiva",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/kitchen-reverse-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/kitchen-reverse-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-kitchen-detail",
            "alt": "Detalle de la zona de cocina",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/kitchen-detail-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/kitchen-detail-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-hallway",
            "alt": "Pasillo interior de la vivienda",
            "scene": "circulation",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/hallway-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/hallway-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-one",
            "alt": "Primer dormitorio con textiles anaranjados",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/bedroom-one-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/bedroom-one-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-two",
            "alt": "Segundo dormitorio con textiles azules",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/bedroom-two-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/bedroom-two-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-three",
            "alt": "Tercer dormitorio, vista de la cama",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/bedroom-three-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/bedroom-three-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-one",
            "alt": "Primer baño con revestimiento veteado",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/bathroom-one-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/bathroom-one-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-two",
            "alt": "Segundo baño con hornacinas iluminadas",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-ae0279/bathroom-two-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-ae0279/bathroom-two-compact.webp",
              "width": 800,
              "height": 534
            }
          }
        ],
        "film": null,
        "virtualTour": null,
        "slides": null,
        "dossier": null,
        "floorPlan": null
      },
      "contact": {
        "kind": "team",
        "name": "Alfaro & Partners",
        "role": "Representación inmobiliaria",
        "portrait": null,
        "profileUrl": null,
        "email": "hola@alfaropartners.es",
        "phone": "+34672504642"
      }
    },
    "readiness": {
      "ready": false,
      "blockers": [
        "Energy evidence not supplied.",
        "Current availability not confirmed.",
        "Derivative and photographic tour acceptance pending."
      ]
    },
    "draftNotice": "Vista previa · pendiente: eficiencia energética, confirmación de disponibilidad y revisión final.",
    "previewEligible": true
  },
  {
    "listing": {
      "publicId": "ap-a6ddef",
      "routeKey": "ibiza-retiro-madrid-ap-a6ddef",
      "propertyType": "apartment",
      "transaction": "sale",
      "availability": "unconfirmed",
      "location": {
        "displayName": "Ibiza, Retiro, Madrid",
        "neighborhood": "Ibiza",
        "district": "Retiro",
        "city": "Madrid",
        "precision": "neighborhood"
      },
      "price": {
        "amount": 1769000,
        "currency": "EUR"
      },
      "area": {
        "squareMeters": 142,
        "measurement": "unspecified"
      },
      "rooms": {
        "bedrooms": 3,
        "bathrooms": 3
      },
      "energy": {
        "rating": null
      },
      "editorial": {
        "title": "Tres dormitorios y zona de día en Ibiza, Retiro",
        "summary": "Una selección fotográfica del salón, la cocina y los tres dormitorios. El material de los baños está pendiente de completar y contrastar.",
        "highlights": [
          "3 dormitorios",
          "3 baños declarados",
          "142 m², medición pendiente de precisar"
        ],
        "introduction": {
          "title": "Una primera lectura de la vivienda.",
          "body": "El salón y la cocina abren este borrador fotográfico. La selección continúa por los tres dormitorios. Las imágenes disponibles de baños aún requieren identificar a qué estancia corresponde cada toma."
        }
      },
      "features": [
        {
          "label": "Climatización",
          "value": "Sí"
        },
        {
          "label": "Calefacción",
          "value": "Sí"
        },
        {
          "label": "Ascensor",
          "value": "Sí"
        },
        {
          "label": "Equipamiento",
          "value": "Cocina equipada y totalmente amueblado."
        }
      ],
      "media": {
        "hero": {
          "id": "img-living-wide",
          "alt": "Zona de estar, vista general",
          "scene": "living",
          "large": {
            "url": "/inmuebles/media/ap-a6ddef/living-wide-large.webp",
            "width": 2880,
            "height": 1922
          },
          "compact": {
            "url": "/inmuebles/media/ap-a6ddef/living-wide-compact.webp",
            "width": 800,
            "height": 534
          }
        },
        "gallery": [
          {
            "id": "img-living-wide",
            "alt": "Zona de estar, vista general",
            "scene": "living",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/living-wide-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/living-wide-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-living-reverse",
            "alt": "Segunda perspectiva del salón",
            "scene": "living",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/living-reverse-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/living-reverse-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-kitchen-dining-wide",
            "alt": "Cocina y comedor, vista general",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/kitchen-dining-wide-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/kitchen-dining-wide-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-kitchen-detail",
            "alt": "Detalle de la cocina",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/kitchen-detail-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/kitchen-detail-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-one",
            "alt": "Primer dormitorio con textiles ocres",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/bedroom-one-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/bedroom-one-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-two",
            "alt": "Segundo dormitorio con textiles verdes",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/bedroom-two-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/bedroom-two-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-three",
            "alt": "Tercer dormitorio con dos camas",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/bedroom-three-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/bedroom-three-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-light",
            "alt": "Baño con lavabo integrado y panelado claro",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/bathroom-light-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/bathroom-light-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-dark",
            "alt": "Baño con lavabo sobre encimera y revestimiento oscuro",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/bathroom-dark-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/bathroom-dark-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-shower",
            "alt": "Zona de ducha con revestimiento veteado",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-a6ddef/bathroom-shower-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-a6ddef/bathroom-shower-compact.webp",
              "width": 800,
              "height": 534
            }
          }
        ],
        "film": null,
        "virtualTour": null,
        "slides": null,
        "dossier": null,
        "floorPlan": null
      },
      "contact": {
        "kind": "team",
        "name": "Alfaro & Partners",
        "role": "Representación inmobiliaria",
        "portrait": null,
        "profileUrl": null,
        "email": "hola@alfaropartners.es",
        "phone": "+34672504642"
      }
    },
    "readiness": {
      "ready": false,
      "blockers": [
        "Energy evidence not supplied.",
        "Current availability not confirmed.",
        "Derivative and photographic tour acceptance pending.",
        "Bathroom photo coverage incomplete or uncertain; excluded from PRE."
      ]
    },
    "draftNotice": "Borrador interno · pendiente: completar o confirmar las fotografías de los baños, eficiencia energética y revisión final.",
    "previewEligible": false
  },
  {
    "listing": {
      "publicId": "ap-97df49",
      "routeKey": "ibiza-retiro-madrid-ap-97df49",
      "propertyType": "apartment",
      "transaction": "sale",
      "availability": "unconfirmed",
      "location": {
        "displayName": "Ibiza, Retiro, Madrid",
        "neighborhood": "Ibiza",
        "district": "Retiro",
        "city": "Madrid",
        "precision": "neighborhood"
      },
      "price": {
        "amount": 1899000,
        "currency": "EUR"
      },
      "area": {
        "squareMeters": 114,
        "measurement": "unspecified"
      },
      "rooms": {
        "bedrooms": 3,
        "bathrooms": 2
      },
      "energy": {
        "rating": null
      },
      "editorial": {
        "title": "Tres dormitorios y terraza en Ibiza, Retiro",
        "summary": "Un salón con distintas perspectivas, cocina y comedor, tres dormitorios y dos baños. La terraza aparece en el recorrido fotográfico como parte del material disponible.",
        "highlights": [
          "3 dormitorios",
          "2 baños declarados",
          "114 m², medición pendiente de precisar"
        ],
        "introduction": {
          "title": "Del salón a la terraza, y después al descanso.",
          "body": "La selección permite comparar el salón y la cocina antes de detenerse en una vista de la terraza. Después presenta tres dormitorios y dos baños. No se atribuyen medidas, orientación ni conexiones entre estancias que las imágenes por sí solas no acreditan."
        }
      },
      "features": [
        {
          "label": "Climatización",
          "value": "Sí"
        },
        {
          "label": "Calefacción",
          "value": "Sí"
        },
        {
          "label": "Ascensor",
          "value": "Sí"
        },
        {
          "label": "Equipamiento",
          "value": "Cocina equipada y totalmente amueblado."
        }
      ],
      "media": {
        "hero": {
          "id": "img-living-wide",
          "alt": "Salón, vista general",
          "scene": "living",
          "large": {
            "url": "/inmuebles/media/ap-97df49/living-wide-large.webp",
            "width": 2880,
            "height": 1922
          },
          "compact": {
            "url": "/inmuebles/media/ap-97df49/living-wide-compact.webp",
            "width": 800,
            "height": 534
          }
        },
        "gallery": [
          {
            "id": "img-living-wide",
            "alt": "Salón, vista general",
            "scene": "living",
            "large": {
              "url": "/inmuebles/media/ap-97df49/living-wide-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/living-wide-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-kitchen-dining-wide",
            "alt": "Cocina y comedor, vista general",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-97df49/kitchen-dining-wide-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/kitchen-dining-wide-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-kitchen-detail",
            "alt": "Detalle del frente de cocina",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-97df49/kitchen-detail-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/kitchen-detail-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-terrace",
            "alt": "Vista de la terraza de la vivienda",
            "scene": "detail",
            "large": {
              "url": "/inmuebles/media/ap-97df49/terrace-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/terrace-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-one",
            "alt": "Primer dormitorio con textiles azules",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-97df49/bedroom-one-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/bedroom-one-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-two",
            "alt": "Segundo dormitorio con luminarias oscuras",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-97df49/bedroom-two-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/bedroom-two-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-three",
            "alt": "Tercer dormitorio con luminarias doradas",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-97df49/bedroom-three-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/bedroom-three-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-one",
            "alt": "Primer baño con doble lavabo",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-97df49/bathroom-one-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/bathroom-one-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-two",
            "alt": "Segundo baño con lavabo individual",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-97df49/bathroom-two-large.webp",
              "width": 2880,
              "height": 4315
            },
            "compact": {
              "url": "/inmuebles/media/ap-97df49/bathroom-two-compact.webp",
              "width": 800,
              "height": 1199
            }
          }
        ],
        "film": null,
        "virtualTour": null,
        "slides": null,
        "dossier": null,
        "floorPlan": null
      },
      "contact": {
        "kind": "team",
        "name": "Alfaro & Partners",
        "role": "Representación inmobiliaria",
        "portrait": null,
        "profileUrl": null,
        "email": "hola@alfaropartners.es",
        "phone": "+34672504642"
      }
    },
    "readiness": {
      "ready": false,
      "blockers": [
        "Energy evidence not supplied.",
        "Current availability not confirmed.",
        "Derivative and photographic tour acceptance pending."
      ]
    },
    "draftNotice": "Vista previa · pendiente: eficiencia energética, confirmación de disponibilidad y revisión final.",
    "previewEligible": true
  },
  {
    "listing": {
      "publicId": "ap-3a9c6b",
      "routeKey": "ibiza-retiro-madrid-ap-3a9c6b",
      "propertyType": "apartment",
      "transaction": "sale",
      "availability": "unconfirmed",
      "location": {
        "displayName": "Ibiza, Retiro, Madrid",
        "neighborhood": "Ibiza",
        "district": "Retiro",
        "city": "Madrid",
        "precision": "neighborhood"
      },
      "price": {
        "amount": 1379000,
        "currency": "EUR"
      },
      "area": {
        "squareMeters": 121,
        "measurement": "unspecified"
      },
      "rooms": {
        "bedrooms": 4,
        "bathrooms": 3
      },
      "energy": {
        "rating": null
      },
      "editorial": {
        "title": "Cuatro dormitorios en Ibiza, Retiro",
        "summary": "Salón, cocina y cuatro dormitorios. Las fotografías disponibles muestran dos baños; falta completar la cobertura del tercero declarado.",
        "highlights": [
          "4 dormitorios",
          "3 baños declarados",
          "121 m², medición pendiente de precisar"
        ],
        "introduction": {
          "title": "Cuatro dormitorios, uno a uno.",
          "body": "Este borrador recoge la zona de día y cuatro dormitorios diferenciados. La visita muestra dos baños; falta material del tercer baño declarado antes de considerar completa la cobertura fotográfica."
        }
      },
      "features": [
        {
          "label": "Climatización",
          "value": "Sí"
        },
        {
          "label": "Calefacción",
          "value": "Sí"
        },
        {
          "label": "Ascensor",
          "value": "Sí"
        },
        {
          "label": "Equipamiento",
          "value": "Cocina equipada, totalmente amueblado"
        }
      ],
      "media": {
        "hero": {
          "id": "img-living-wide",
          "alt": "Salón, vista general",
          "scene": "living",
          "large": {
            "url": "/inmuebles/media/ap-3a9c6b/living-wide-large.webp",
            "width": 2880,
            "height": 1922
          },
          "compact": {
            "url": "/inmuebles/media/ap-3a9c6b/living-wide-compact.webp",
            "width": 800,
            "height": 534
          }
        },
        "gallery": [
          {
            "id": "img-living-wide",
            "alt": "Salón, vista general",
            "scene": "living",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/living-wide-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/living-wide-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-living-reverse",
            "alt": "Salón desde una segunda perspectiva",
            "scene": "living",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/living-reverse-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/living-reverse-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-kitchen-wide",
            "alt": "Cocina y comedor, vista general",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/kitchen-wide-large.webp",
              "width": 2880,
              "height": 2074
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/kitchen-wide-compact.webp",
              "width": 800,
              "height": 576
            }
          },
          {
            "id": "img-kitchen-detail",
            "alt": "Detalle del frente de cocina",
            "scene": "kitchen",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/kitchen-detail-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/kitchen-detail-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-one",
            "alt": "Primer dormitorio con textiles marrones",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/bedroom-one-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/bedroom-one-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-two",
            "alt": "Segundo dormitorio con textiles ocres",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/bedroom-two-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/bedroom-two-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-three",
            "alt": "Tercer dormitorio con textiles azules",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/bedroom-three-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/bedroom-three-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bedroom-four",
            "alt": "Cuarto dormitorio con textiles verdes",
            "scene": "bedroom",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/bedroom-four-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/bedroom-four-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-one",
            "alt": "Primer baño con lavabo individual",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/bathroom-one-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/bathroom-one-compact.webp",
              "width": 800,
              "height": 534
            }
          },
          {
            "id": "img-bathroom-two",
            "alt": "Segundo baño con doble lavabo",
            "scene": "bathroom",
            "large": {
              "url": "/inmuebles/media/ap-3a9c6b/bathroom-two-large.webp",
              "width": 2880,
              "height": 1922
            },
            "compact": {
              "url": "/inmuebles/media/ap-3a9c6b/bathroom-two-compact.webp",
              "width": 800,
              "height": 534
            }
          }
        ],
        "film": null,
        "virtualTour": null,
        "slides": null,
        "dossier": null,
        "floorPlan": null
      },
      "contact": {
        "kind": "team",
        "name": "Alfaro & Partners",
        "role": "Representación inmobiliaria",
        "portrait": null,
        "profileUrl": null,
        "email": "hola@alfaropartners.es",
        "phone": "+34672504642"
      }
    },
    "readiness": {
      "ready": false,
      "blockers": [
        "Energy evidence not supplied.",
        "Current availability not confirmed.",
        "Derivative and photographic tour acceptance pending.",
        "Bathroom photo coverage incomplete or uncertain; excluded from PRE."
      ]
    },
    "draftNotice": "Borrador interno · pendiente: completar o confirmar las fotografías de los baños, eficiencia energética y revisión final.",
    "previewEligible": false
  }
];

// Keep the hero in the same approved gallery inventory, including object identity.
for (const { listing } of intakeDrafts) {
  listing.media.hero = listing.media.gallery.find(({ id }) => id === listing.media.hero.id)!;
}

/** Incomplete source coverage never becomes PRE-eligible just because a draft exists. */
export const intakeListingEntries = intakeDrafts.filter(({ previewEligible }) => previewEligible);
