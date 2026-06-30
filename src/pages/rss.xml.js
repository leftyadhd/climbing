import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const logs = (await getCollection('logs'))
    .filter(l => l.data.type !== 'misc')
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 20);

  return rss({
    title: 'Summit Log',
    description: '암벽등반 세션 기록 — 로그, 암장, 루트',
    site: context.site,
    items: logs.map(log => {
      const routes = log.data.routes ?? [];
      const sends = routes.filter(r => ['onsight','flash','redpoint','send'].includes(r.status));
      const d = log.data.date;
      const dateStr = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
      const routeSummary = routes.length > 0
        ? `루트 ${routes.length}개 시도, 완등 ${sends.length}개.`
        : '';
      return {
        title: log.data.title,
        pubDate: log.data.date,
        description: [dateStr, log.data.crag, routeSummary].filter(Boolean).join(' · '),
        link: `/logs/${log.slug}/`,
      };
    }),
    customData: `<language>ko</language>`,
  });
}
