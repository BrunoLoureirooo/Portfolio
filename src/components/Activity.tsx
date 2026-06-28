// Activity — the live GitHub island (Preact, hydrated client:visible).
//
// Renders stats, heatmap, commits, AND languages — all live via the shared
// useGitHubData hook. Server-rendered by Astro for first paint, then polls
// /api/activity every ~5 min. See docs/features/github-data.md.
import type { GitHubData } from '../lib/github';
import { useGitHubData } from '../lib/useGitHubData';
import './Activity.css';

// "…fetchedAt" → "live · synced 2m ago" / "mock · synced now". Pure helper.
function syncedLabel(d: GitHubData): string {
  const mins = Math.floor((Date.now() - new Date(d.fetchedAt).getTime()) / 60000);
  const ago = mins < 1 ? 'just now' : mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
  return `${d.live ? 'live' : 'mock'} · synced ${ago}`;
}

interface Props {
  initial: GitHubData; // build-time data: the first paint AND the starting state
}

export default function Activity({ initial }: Props) {
  // The shared hook seeds from `initial` (so hydration matches the server HTML)
  // and swaps in fresh data on each 5-min poll — languages included now.
  const data = useGitHubData(initial);

  const stats = [
    { value: data.totalContributions.toLocaleString(), label: 'contributions · 12mo' },
    { value: `${data.currentStreak}d`, label: 'current streak' },
    { value: `${data.longestStreak}d`, label: 'longest streak' },
    { value: String(data.prsMerged), label: 'PRs merged' },
  ];

  return (
    <div class="activity">
      <p class="gh__note">
        # {data.live ? 'streaming from the GitHub API' : 'mock data — set GITHUB_TOKEN to go live'}
        <span class="activity__synced">{syncedLabel(data)}</span>
      </p>

      <ul class="gh__stats">
        {stats.map((s) => (
          <li class="stat" key={s.label}>
            <span class="stat__value">{s.value}</span>
            <span class="stat__label">{s.label}</span>
          </li>
        ))}
      </ul>

      <figure class="heatmap">
        <figcaption class="heatmap__caption">
          {data.totalContributions.toLocaleString()} contributions in the last year
        </figcaption>
        <div class="heatmap__scroll">
          <div class="heatmap__grid" role="img" aria-label={`${data.totalContributions} contributions in the last year`}>
            {data.cells.map((c, i) => (
              <span class="heatmap__cell" data-level={c.level} key={i} />
            ))}
          </div>
        </div>
        <div class="heatmap__legend" aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span class="heatmap__cell" data-level={l} key={l} />
          ))}
          <span>More</span>
        </div>
      </figure>

      <div class="gh__panels">
        <section class="panel" aria-label="Recent commits">
          <p class="panel__cmd">$ git log --oneline -6</p>
          <ul class="commits">
            {data.commits.map((c) => (
              <li class="commit" key={c.hash}>
                <span class="commit__hash">{c.hash}</span>
                <span class="commit__repo">{c.repo}</span>
                <span class="commit__meta">{c.meta}</span>
                <span class="commit__msg">{c.msg}</span>
              </li>
            ))}
          </ul>
        </section>

        <section class="panel" aria-label="Top languages">
          <p class="panel__cmd">$ gh api /langs</p>
          <ul class="langs">
            {data.langs.map((l) => (
              <li class="lang" key={l.name}>
                <span class="lang__name">{l.name}</span>
                <span class="lang__pct">{l.pct}%</span>
                <span class="lang__track">
                  <span class="lang__fill" style={{ width: `${l.pct}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
