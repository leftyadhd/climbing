import { defineCollection, z } from 'astro:content';

// 위키 컬렉션 - 모든 위키 문서 타입을 하나로 통합
// type 필드로 구분 (guide / technique / gear / crag / route / term 등)
const wiki = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum([
      'guide',      // 일반 설명/가이드 문서
      'technique',  // 기술·무브
      'gear',       // 장비
      'crag',       // 암장
      'route',      // 개별 루트
      'term',       // 용어 사전 항목
    ]),
    // 모든 문서 공통 - 교차 검색·필터의 기반
    tags: z.array(z.string()).default([]),
    updated: z.date().optional(),
    summary: z.string().optional(),

    // technique 전용
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    related_techniques: z.array(z.string()).default([]),
    common_on: z.array(z.string()).default([]), // overhang, slab, crack 등

    // gear 전용
    gear_category: z.string().optional(),
    brand: z.string().optional(),
    price_krw: z.number().optional(),
    use_cases: z.array(z.string()).default([]),

    // crag 전용
    location: z.object({
      region: z.string(),
      city: z.string().optional(),
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    rock_type: z.string().optional(),
    disciplines: z.array(z.string()).default([]), // sport/trad/boulder/multi-pitch
    approach_minutes: z.number().optional(),
    routes_count: z.number().optional(),
    season_best: z.array(z.string()).default([]),

    // route 전용
    crag: z.string().optional(),       // 소속 암장 slug
    grade: z.string().optional(),       // 5.11a, V5 등
    style: z.string().optional(),       // sport/trad/boulder
    length_m: z.number().optional(),
    bolts: z.number().optional(),
  }),
});

// 등반로그 컬렉션 - 세션 단위 기록
const logs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.literal('log').default('log'),
    crag: z.string().nullish(),           // 위키 crag 문서 slug 참조
    partners: z.array(z.string()).default([]),
    weather: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    photos: z.array(z.string()).default([]),
    // 이 세션에서 시도한 루트들
    routes: z.array(z.object({
      name: z.string(),
      grade: z.string().nullish(),
      style: z.string().nullish(),
      status: z.enum(['onsight', 'flash', 'redpoint', 'send', 'projecting', 'attempt', 'failed']),
      attempts: z.number().optional(),
      techniques_used: z.array(z.string()).default([]), // 위키 technique slug 참조
      notes: z.string().nullish(),
    })).default([]),
  }),
});

export const collections = { wiki, logs };
