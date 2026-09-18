import { conn } from '$/lib/server/variables';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const origin = url.origin;

  let articles: { id: string; updated_at: Date; created_at: Date }[] = [];
  try {
    articles = await conn
      .selectFrom('article')
      .select(['id', 'updated_at', 'created_at'])
      .orderBy('created_at', 'desc')
      .execute();
  } catch {
    articles = [];
  }

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/gallery', priority: '0.9', changefreq: 'daily' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/live-photo', priority: '0.6', changefreq: 'hourly' },
    { path: '/movies', priority: '0.7', changefreq: 'weekly' }
  ];

  const languages = ['cs', 'en'] as const;

  const urls: string[] = [];

  for (const page of staticPages) {
    for (const lang of languages) {
      const pageUrl = `${origin}/${lang}${page.path}`;
      const csUrl = `${origin}/cs${page.path}`;
      const enUrl = `${origin}/en${page.path}`;
      urls.push(`
    <url>
      <loc>${pageUrl}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      <xhtml:link rel="alternate" hreflang="cs" href="${csUrl}" />
      <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
      <xhtml:link rel="alternate" hreflang="x-default" href="${csUrl}" />
    </url>`);
    }
  }

  for (const article of articles) {
    const lastmodDate = article.updated_at || article.created_at;
    const lastmod =
      lastmodDate instanceof Date
        ? lastmodDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    for (const lang of languages) {
      const pageUrl = `${origin}/${lang}/gallery/${article.id}`;
      const csUrl = `${origin}/cs/gallery/${article.id}`;
      const enUrl = `${origin}/en/gallery/${article.id}`;
      urls.push(`
    <url>
      <loc>${pageUrl}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
      <xhtml:link rel="alternate" hreflang="cs" href="${csUrl}" />
      <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
      <xhtml:link rel="alternate" hreflang="x-default" href="${csUrl}" />
    </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
