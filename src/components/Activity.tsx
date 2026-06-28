// Activity — the live GitHub island (Preact, hydrated client:visible).
//
// Renders stats, heatmap, commits, AND languages — all live via the shared
// useGitHubData hook. Server-rendered by Astro for first paint, then polls
// /api/activity every ~5 min. See docs/features/github-data.md.
import type { GitHubData } from '../lib/github';
import { useGitHubData } from '../lib/useGitHubData';
import { useTranslations } from '../i18n/utils';
import './Activity.css';

type T = ReturnType<typeof useTranslations>;

// "…fetchedAt" → "live · synced 2m ago". Composed from dictionary parts because
// the relative-time number is only known at runtime.
function syncedLabel(d: GitHubData, t: T): string {
  const mins = Math.floor((Date.now() - new Date(d.fetchedAt).getTime()) / 60000);
  const ago =
    mins < 1 ? t('activity.ago.now')
    : mins < 60 ? `${mins}${t('activity.ago.m')}`
    : `${Math.floor(mins / 60)}${t('activity.ago.h')}`;
  const tag = d.live ? t('activity.tag.live') : t('activity.tag.mock');
  return `${tag} · ${t('activity.synced')} ${ago}`;
}

interface Props {
  initial: GitHubData; // build-time data: the first paint AND the starting state
  locale: string | undefined; // passed from the .astro shell (islands can't read Astro.currentLocale)
}

export default function Activity({ initial, locale }: Props) {
  // The shared hook seeds from `initial` (so hydration matches the server HTML)
  // and swaps in fresh data on each 5-min poll — languages included now.
  const data = useGitHubData(initial);
  const t = useTranslations(locale);

  const stats = [
    { value: data.totalContributions.toLocaleString(), label: t('activity.stat.contributions') },
    { value: `${data.currentStreak}d`, label: t('activity.stat.current') },
    { value: `${data.longestStreak}d`, label: t('activity.stat.longest') },
    { value: String(data.prsMerged), label: t('activity.stat.prs') },
  ];

  return (
    <div class="activity">
      <p class="gh__note">
        # {data.live ? t('activity.live') : t('activity.mock')}
        <span class="activity__synced">{syncedLabel(data, t)}</span>
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
          {data.totalContributions.toLocaleString()} {t('activity.heatmap.caption')}
        </figcaption>
        <div class="heatmap__scroll">
          <div class="heatmap__grid" role="img" aria-label={`${data.totalContributions} ${t('activity.heatmap.caption')}`}>
            {data.cells.map((c, i) => (
              <span class="heatmap__cell" data-level={c.level} key={i} />
            ))}
          </div>
        </div>
        <div class="heatmap__legend" aria-hidden="true">
          <span>{t('activity.heatmap.less')}</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span class="heatmap__cell" data-level={l} key={l} />
          ))}
          <span>{t('activity.heatmap.more')}</span>
        </div>
      </figure>

      <div class="gh__panels">
        <section class="panel" aria-label={t('activity.panel.commits')}>
          <p class="panel__cmd">{t('activity.cmd.commits')}</p>
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

        <section class="panel" aria-label={t('activity.panel.langs')}>
          <p class="panel__cmd">{t('activity.cmd.langs')}</p>
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
