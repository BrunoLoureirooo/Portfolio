// Cloudflare Pages Function → GET /api/activity.
// Runs on the Workers edge (not Node, not the browser). Any file under the
// top-level functions/ folder becomes an endpoint by its path. Its jobs:
//   1. hold GITHUB_TOKEN server-side (never exposed to the browser),
//   2. return the live ActivityData JSON the Preact island polls,
//   3. (next unit) cache the result ~5 min.
// See docs/features/github-data.md.
import { fetchLiveActivity } from '../../src/lib/github';

// Cloudflare injects secrets/vars on `context.env`. Declare what we read.
interface Env {
  GITHUB_TOKEN?: string;
  GITHUB_USERNAME?: string;
}

// The slice of Cloudflare's EventContext we use. (The full PagesFunction type
// comes from @cloudflare/workers-types; a local shape keeps this dependency-free.)
interface Ctx {
  env: Env;
  request: Request;
  waitUntil: (p: Promise<unknown>) => void;
}

const CACHE_SECONDS = 300; // ~5 min — matches the island's poll interval

// `onRequestGet` is Cloudflare's naming convention: handle GET for this route.
export const onRequestGet = async (context: Ctx): Promise<Response> => {
  // The Workers Cache API. `caches.default` is a shared edge cache keyed by a
  // Request. We look up THIS url first; a hit means we skip GitHub entirely.
  const cache = caches.default;
  const cacheKey = new Request(new URL(context.request.url).toString(), context.request);

  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const data = await fetchLiveActivity(
    context.env.GITHUB_TOKEN ?? '', // no token on Cloudflare → fetchLiveActivity returns mock
    context.env.GITHUB_USERNAME,
  );

  const res = new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
      // Cache-Control is what the Cache API obeys; s-maxage targets shared caches.
      'cache-control': `public, s-maxage=${CACHE_SECONDS}`,
    },
  });

  // Store a CLONE (a Response body can only be read once; we still return res).
  // waitUntil lets the write finish after we've responded — no added latency.
  context.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
};
