import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const partners = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/partners' }),
  schema: z.object({
    kind: z.enum(['person', 'organization']),
    // Vocabulario cerrado a proposito. `relationship` es texto libre y sirve
    // para la ficha, pero como dimension de analitica fragmentaria el informe:
    // "Partner Juridico", "Juridico" y "Abogado" contarian por separado.
    category: z
      .enum(['interno', 'juridico', 'fiscal', 'financiero', 'tecnico', 'reforma', 'gestion', 'otros'])
      .default('otros'),
    published: z.boolean().default(true),
    order: z.number().int().nonnegative().default(0),
    name: z.string(),
    title: z.string(),
    relationship: z.string(),
    summary: z.string(),
    // Version breve para la tarjeta del listado. El alto de la tarjeta lo
    // marca este texto y el alto del retrato depende del alto de la tarjeta,
    // asi que un summary largo aqui encoge la foto. Si falta, se usa summary.
    cardSummary: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    quote: z.string().optional(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    // Fotos de contexto para la ficha. `photo` es el recorte a fondo
    // transparente que usan la tarjeta y el hero; estas son fotografias
    // completas y no deben mezclarse con aquel.
    gallery: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      // Obligatorias: sin ellas la imagen no reserva sitio y la ficha salta al
      // cargar. No se pueden deducir porque la galeria admite cualquier
      // proporcion.
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      caption: z.string().optional(),
    })).default([]),
    initials: z.string().min(1).max(4),
    expertise: z.array(z.string()).default([]),
    responsibilities: z.array(z.string()).default([]),
    languages: z.array(z.string()).default([]),
    contact: z.object({
      phone: z.string().optional(),
      phoneDisplay: z.string().optional(),
      whatsapp: z.string().url().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
      maps: z.string().url().optional(),
    }).optional(),
    socials: z.array(z.object({
      platform: z.enum(['linkedin', 'instagram', 'tiktok']),
      url: z.string().url(),
    })).default([]),
    credentials: z.array(z.object({
      name: z.string(),
      logo: z.string(),
      url: z.string().url(),
      surface: z.enum(['light', 'dark']).default('light'),
    })).default([]),
    video: z.object({
      url: z.string().url(),
      title: z.string(),
    }).optional(),
  }),
});

export const collections = { partners };
