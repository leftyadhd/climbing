import { defineCollection, z } from 'astro:content';

const wiki = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['guide', 'technique', 'gear', 'term']),
    tags: z.array(z.string()).default([]),
    updated: z.date().optional(),
    summary: z.string().optional(),

    // technique
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    related_techniques: z.array(z.string()).default([]),
    common_on: z.array(z.string()).default([]),

    // gear
    gear_category: z.string().optional(),
    brand: z.string().optional(),
    price_krw: z.number().optional(),
    use_cases: z.array(z.string()).default([]),
  }),
});

const routeSchema = z.object({
  id: z.string(),
  number: z.number().nullish(),
  name: z.string().nullish(),
  sector: z.string().nullish(),
  grade: z.string().nullish(),
  length_m: z.number().nullish(),
  style: z.enum(['sport', 'trad', 'boulder', 'top-rope']).nullish(),
  bolts: z.number().nullish(),
  pitches_count: z.number().nullish(),
  pitches: z.array(z.object({
    number: z.number(),
    grade: z.string().nullish(),
    length_m: z.number().nullish(),
    length: z.string().nullish(),
    type: z.string().nullish(),
    description: z.string().nullish(),
  })).default([]),
  notes: z.string().nullish(),
});

const crags = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    location: z.object({
      region: z.string(),
      city: z.string().optional(),
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    rock_type: z.string().optional(),
    disciplines: z.array(z.string()).default([]),
    approach_minutes: z.number().optional(),
    season_best: z.array(z.string()).default([]),
    mountain: z.string().optional(),
    crag_type: z.array(z.enum(['multi-pitch', 'hard-free', 'gym', 'outdoor-wall'])).default([]),
    sectors: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullish(),
    })).default([]),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    updated: z.date().optional(),
    routes: z.array(routeSchema).default([]),
  }),
});

const logs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.enum(['log', 'misc']).default('log'),
    crag: z.string().nullish(),
    sector: z.string().nullish(),
    crew: z.array(z.string()).default([]),
    partners: z.array(z.string()).default([]),
    weather: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    photos: z.array(z.string()).default([]),
    routes: z.array(z.object({
      name: z.string().nullish(),
      grade: z.string().nullish(),
      grade_feel: z.enum(['soft', 'on', 'hard']).nullish(),
      style: z.string().nullish(),
      status: z.enum(['onsight', 'flash', 'redpoint', 'send', 'projecting', 'attempt', 'failed']),
      attempts: z.number().optional(),
      techniques_used: z.array(z.string()).default([]),
      notes: z.string().nullish(),
      route_ref: z.string().nullish(),
      pitches: z.array(z.object({
        number: z.number(),
        grade: z.string().nullish(),
        length_m: z.number().nullish(),
        status: z.enum(['onsight', 'clean', 'fell', 'aided', 'skipped']).nullish(),
        notes: z.string().nullish(),
      })).default([]),
    })).default([]),
  }),
});


const devices = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    brand: z.string().nullish(),
    model: z.string().nullish(),
    purchased: z.date().nullish(),
    price_krw: z.number().nullish(),
    condition: z.enum(['new', 'good', 'fair', 'retired']).default('good'),
    active: z.boolean().default(true),
    wiki_ref: z.string().nullish(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { wiki, crags, logs, devices };
