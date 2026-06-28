// ProjectsCarousel — the live Projects island (Preact, hydrated client:visible).
// Same carousel markup as before, but driven by live data via the shared
// useGitHubData hook, so a new repo appears within ~5 min without a redeploy.
import type { GitHubData } from '../lib/github';
import { useGitHubData } from '../lib/useGitHubData';
import './ProjectsCarousel.css';

interface Props {
  initial: GitHubData; // build-time data: first paint + the hook's starting state
}

export default function ProjectsCarousel({ initial }: Props) {
  // Read just the projects slice off the shared live data.
  const { projects } = useGitHubData(initial);

  return (
    <ul
      class="projects"
      role="region"
      aria-label="Projects — scroll horizontally for more"
      tabindex={0}
    >
      {projects.map((p) => (
        <li class="card" key={p.name}>
          <div class="card__head">
            <span class="card__name">▸ {p.name}</span>
            <span class={`card__status card__status--${p.status}`}>
              <span class="card__status-mark" aria-hidden="true">
                {p.status === 'active' ? '●' : '○'}
              </span>
              {p.status}
            </span>
          </div>

          <p class="card__desc">{p.description}</p>

          <ul class="card__tags">
            {p.tags.map((t) => (
              <li class="chip" key={t}>
                {t}
              </li>
            ))}
          </ul>

          <div class="card__foot">
            <a class="card__link" href={p.repo}>
              git:repo →
            </a>
            {p.live && (
              <a class="card__link" href={p.live}>
                ↗ live
              </a>
            )}
            <span class="card__stars">★ {p.stars}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
