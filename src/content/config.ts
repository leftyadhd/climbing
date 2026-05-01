import { defineCollection, z } from 'astro:content';

const wiki = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['guide', 'technique', 'gear', 'crag', 'route', 'term']),
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

    // crag
    location: z.object({
      region: z.string(),
      city: z.string().optional(),
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    rock_type: z.string().optional(),
    disciplines: z.array(z.string()).default([]),
    approach_minutes: z.number().optional(),
    routes_count: z.number().optional(),
    season_best: z.array(z.string()).default([]),

    // route (wiki text doc — beta, history, description)
    crag: z.string().optional(),
    grade: z.string().optional(),
    style: z.string().optional(),
    length_m: z.number().optional(),
    bolts: z.number().optional(),
    pitches_count: z.number().nullish(),
    pitches: z.array(z.object({
      number: z.number(),
      grade: z.string().nullish(),
      length_m: z.number().nullish(),
      description: z.string().nullish(),
    })).default([]),
  }),
});

const logs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.literal('log').default('log'),
    crag: z.string().nullish(),
    partners: z.array(z.string()).default([]),
    weather: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    photos: z.array(z.string()).default([]),
    routes: z.array(z.object({
      name: z.string(),
      grade: z.string().nullish(),
      style: z.string().nullish(),
      status: z.enum(['onsight', 'flash', 'redpoint', 'send', 'projecting', 'attempt', 'failed']),
      attempts: z.number().optional(),
      techniques_used: z.array(z.string()).default([]),
      notes: z.string().nullish(),
      route_ref: z.string().nullish(),   // id in crag-routes collection
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

// 암장별 루트 데이터 — 정형화된 구조
const cragRoutes = defineCollection({
  type: 'data',
  schema: z.object({
    crag: z.string(),   // wiki crag slug suffix (예: 수락산-내원암)
    routes: z.array(z.object({
      id: z.string(),              // route_ref에서 참조하는 키
      number: z.number().nullish(),
      name: z.string().nullish(),
      sector: z.string().nullish(),
      grade: z.string().nullish(),
      length_m: z.number().nullish(),
      style: z.enum(['sport', 'trad', 'boulder', 'multi-pitch']).nullish(),
      bolts: z.number().nullish(),
      pitches_count: z.number().nullish(),
      pitches: z.array(z.object({
        number: z.number(),
        grade: z.string().nullish(),
        length_m: z.number().nullish(),
        description: z.string().nullish(),
      })).default([]),
      notes: z.string().nullish(),
    })),
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

export const collections = { wiki, logs, 'crag-routes': cragRoutes, devices };
