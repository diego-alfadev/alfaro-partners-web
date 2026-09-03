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
      .enum(['interno', 'juridico', 'fiscal', 'financiero', 'tecnico', 'reforma', 'otros'])
      .default('otros'),
    published: z.boolean().default(true),
    order: z.number().int().nonnegative().default(0),
    name: z.string(),
    title: z.string(),
    relationship: z.string(),
    summary: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    quote: z.string().optional(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    initials: z.string().min(1).max(4),
    expertise: z.array(z.string()).default([]),
    responsibilities: z.array(z.string()).default([]),
    languages: z.array(z.string()).default([]),
    contact: z.object({
      phone: z.string().optional(),
      phoneDisplay: z.string().optional(),
      whatsapp: z.string().url().optional(),
      email: z.string().email().optional(),
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
