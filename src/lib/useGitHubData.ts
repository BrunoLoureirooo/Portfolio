// Shared island logic. Both the Activity and Projects islands need the exact
// same "seed from server data, then poll every 5 min" behaviour, so it lives
// here once as a custom Preact hook instead of being duplicated in each.
import { useState, useEffect } from 'preact/hooks';
import type { GitHubData } from './github';

/**
 * Seed state with the server-rendered `initial`, then poll /api/activity every
 * 5 min and swap in fresh data. Returns the current GitHubData to render.
 *
 * If the endpoint is absent (e.g. `astro dev`) or the network blips, the fetch
 * guard returns early and we keep showing the last good value.
 */
export function useGitHubData(initial: GitHubData): GitHubData {
  const [data, setData] = useState<GitHubData>(initial);

  useEffect(() => {
    let alive = true; // guard against setState after unmount

    const refresh = async () => {
      try {
        const res = await fetch('/api/activity');
        if (!res.ok) return; // no endpoint / error → keep current data
        const next = (await res.json()) as GitHubData;
        if (alive) setData(next);
      } catch {
        /* network blip → keep last good data */
      }
    };

    refresh(); // once on mount
    const id = setInterval(refresh, 5 * 60 * 1000); // then every 5 min

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return data;
}
