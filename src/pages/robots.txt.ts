// robots.txt as an endpoint (not a static file) so the Sitemap line is built
// from `site` and always matches the deploy host — Cloudflare Pages, GitHub
// Pages, or the domain. In a static build this prerenders to /robots.txt.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  // `site` comes from astro.config (or the SITE env var). Guard for safety.
  const sitemap = new URL('sitemap-index.xml', site ?? 'https://brunoloureiro.dev');
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap.href}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
